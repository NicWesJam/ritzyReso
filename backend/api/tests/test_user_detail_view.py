import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from ..views import UserDetail


# Create your tests here.
class UserDetailViewTest(TestCase):
    """Test module for user_detail view"""

    def setUp(self):
        User.objects.create_user(
            username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a",
            first_name="first first name",
            last_name="first last name",
            email="firsttest@test.com",
        )
        User.objects.create_user(
            username="0x13d6abfe44cfd25fa48b9410bb13e95bad54c4dc",
            first_name="second first name",
            last_name="second last name",
            email="secondtest@test.com",
        )

    def test_unauthenticated_get(self):
        view = UserDetail.as_view()
        factory = APIRequestFactory()
        request = factory.get("/api/user_detail/")
        # force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 403)

    def test_authenticated_get(self):
        user = User.objects.get(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        view = UserDetail.as_view()
        factory = APIRequestFactory()
        request = factory.get("/api/user_detail/")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

        # test POST unauthenticated

    def test_unauthenticated_post(self):
        user = User.objects.get(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        view = UserDetail.as_view()
        factory = APIRequestFactory()
        request = factory.post("/api/user_detail/", {"first_name": "my new first name"})
        # force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 403)

        # Now get data to check it that nothing has changed
        request = factory.get("/api/user_detail/")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(json.loads(response.content)["first_name"], "first first name")

    def test_authenticated_post(self):
        user = User.objects.get(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        view = UserDetail.as_view()
        factory = APIRequestFactory()
        request = factory.post("/api/user_detail/", {"first_name": "my new first name"})
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        request = factory.get("/api/user_detail/")
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(json.loads(response.content)["first_name"], "my new first name")

        # test POST authenticated
        # test POST authenticated change another user
        # test POST don't include current user
