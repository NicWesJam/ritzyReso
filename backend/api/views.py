import json
from web3.auto import w3
from eth_account.messages import encode_defunct
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from rest_framework.authentication import (
    SessionAuthentication,
    BasicAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


def get_crypto_token(request, username):
    formatted_username = username.lower()
    if not w3.isAddress(formatted_username):
        return JsonResponse({"status": "invalid ethereum address"}, status=400)

    # Pull the user, if it doesn't exist make a new one
    try:
        user = User.objects.get(username=formatted_username)
    except User.DoesNotExist:
        # create_user creates, saves and returns a user
        # in create_user the set_unusable_password = True if no password given
        # this is ideal as we use Web3 for login
        user = User.objects.create(username=formatted_username)

    # refresh the crypto token
    user.cryptotoken.refresh_crypto_token()
    user.save()
    response = JsonResponse({"crypto_token": user.cryptotoken.crypto_token})
    return response


def get_csrf(request):
    response = JsonResponse({"detail": "CSRF cookie set"})
    response["X-CSRFToken"] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username").lower()
    # password = data.get('password')
    signed_message = data.get("signed_message")

    if username is None or signed_message is None:
        return JsonResponse(
            {"detail": "Please provide ethereum account and signed message."},
            status=400,
        )

    # user = authenticate(username=username, password=password)
    user = User.objects.get(username=username)
    # user = None
    # Rewrite user authentication

    if user is None:
        return JsonResponse({"detail": "Invalid ethereum account"}, status=400)

    if not is_hex(signed_message):
        return JsonResponse({"detail": "signed_message must be a hex value"})

    crypto_token = user.cryptotoken.crypto_token

    try:
        message = encode_defunct(text=crypto_token)
        signing_account = w3.eth.account.recover_message(message, signature=signed_message)
    except:
        return JsonResponse({"detail": "decoding error"})

    if username == signing_account.lower():
        print(request.session.items())
        login(request, user)
        print(request.session.items())
        return JsonResponse({"detail": "Successfully logged in."})
    else:
        return JsonResponse({"detail": "Login failed"})


def is_hex(s):
    """
    Function to check if signed_message is a hex value
    """
    try:
        int(s, 16)
        return True
    except ValueError:
        return False


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You're not logged in."}, status=400)

    logout(request)
    return JsonResponse({"detail": "Successfully logged out."})


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({"isAuthenticated": True})


class UserDetail(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        user = User.objects.get(username=request.user.username)
        user_profile = user.userprofile

        json_response = JsonResponse(
            {
                "username": user.username,
                "email": user.email,
                "phone_number": user_profile.phone_number,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        )
        return json_response

    @staticmethod
    def post(request, format=None):
        user = User.objects.get(username=request.user.username)
        user_profile = user.userprofile

        # check what info the user wants to update
        if "email" in request.data:
            user.email = request.data["email"]
            user.save()

        if "first_name" in request.data:
            user.first_name = request.data["first_name"]
            user.save()

        if "last_name" in request.data:
            user.last_name = request.data["last_name"]
            user.save()

        if "phone_number" in request.data:
            user_profile.phone_number = request.data["phone_number"]
            user_profile.save()

        return JsonResponse({"status": "user profile updates accepted"})
