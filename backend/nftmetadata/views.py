from web3.auto import w3
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import NFTMetadata
from datetime import datetime, timedelta
from .web3query import Web3Query
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

# setup web3 contract
web3query = Web3Query(settings.CONTRACT_ADDRESS, settings.INFURA_URL)
web3query.setup_contract()


class NFTMetadataDetail(APIView):
    """
    Read only endpoint for Detail NFT Metadata
    """

    @staticmethod
    def get(request, id, format=None):
        # this needs to be updated based on project url

        try:
            nft_metadata = NFTMetadata.objects.get(id=id)
        except NFTMetadata.DoesNotExist:
            return JsonResponse(
                {"status": "failed, invalid nft metadata identifier"},
                status=400,
            )

        if nft_metadata.image_file:
            image_url = settings.BASE_URL + nft_metadata.image_file.url
        else:
            image_url = ""

        json_response = JsonResponse(
            {
                "id": nft_metadata.id,
                "name": nft_metadata.name,
                "description": nft_metadata.description,
                "diners": nft_metadata.diners,
                "image": image_url,
                "external_url": nft_metadata.external_url,
                "event_date": nft_metadata.event_datetime.timestamp(),
                "opensea_url": nft_metadata.opensea_url,
                "nft_metadata_version": nft_metadata.nft_metadata_version,
                "nft_network": nft_metadata.nft_network,
            }
        )
        return json_response


class NFTMetadataList(APIView):
    """
    Read only endpoint for NFT Metadata List

    Returns a list of NFT objects

    timezone set to utc
    """

    def get(self, request, format=None):
        """
        Including refresh of NFT tokens and the database here before the
        response goes back to user this is way slow and is only okay with an
        extremely limited number of NFTs needs to be replaced quickly with
        a periodic database update
        """

        def check_float(potential_float):
            try:
                float(potential_float)
                return True
            except (ValueError, TypeError):
                return False

        def check_int(potential_int):
            try:
                float(potential_int)
                return True
            except (ValueError, TypeError):
                return False


        # Setup initial vars
        response_data = []
        objects = NFTMetadata.objects.all()
        db_length = len(objects)

        # Get parameters
        diners = self.request.query_params.get("diners")
        raw_date = self.request.query_params.get("date")
        raw_time = self.request.query_params.get("time")
        username = self.request.query_params.get("address")

        # check datetime parameters and filter
        # time is just check the hours before and after 3 hours
        if raw_date is not None and raw_time is not None:
            if not check_float(raw_date) and not check_float(raw_time):
                return JsonResponse({"status": "Failed, invalid date time input"}, status=400)

            # if raw_date is not None and raw_time is not None:
            date = datetime.fromtimestamp(int(float(raw_date))).date()
            time = datetime.fromtimestamp(int(float(raw_time)))

            upper_datetime_threshold = datetime(
                year=date.year, month=date.month, day=date.day, hour=time.hour, minute=time.minute
            ) + timedelta(hours=3)
            lower_datetime_threshold = datetime(
                year=date.year, month=date.month, day=date.day, hour=time.hour, minute=time.minute
            ) - timedelta(hours=3)
            objects = objects.filter(
                event_datetime__gte=lower_datetime_threshold,
                event_datetime__lte=upper_datetime_threshold,
            )

        """
        yeah this is getting ugly
        """
        if username is not None:
            if not isinstance(username, str):
                return JsonResponse({"status": "Failed, invalid address, non string value submitted"}, status=400)

            if not w3.isAddress(username.lower()):
                return JsonResponse({"status": "Failed, not a valid Ethereum address"}, status=400)
                # get token id/address pairs

            # Pull all NFT/owner pairs from Smart Contract
            ownership = web3query.get_token_and_owners()
            # Get DB Length
            for pair in ownership:
                # Insert this check if there is a db mismatch between smart contract and nft metadata
                if pair[0] < db_length:

                    NFTObject = NFTMetadata.objects.get(id=pair[0])
                    try:
                        UserObject = User.objects.get(username=str(pair[1]).lower())
                    except User.DoesNotExist:
                        UserObject = User.objects.create(username=str(pair[1]).lower())

                    NFTObject.user = UserObject
                    NFTObject.quick_save()

            # filter response by user
            objects = objects.filter(user__username=username.lower())
            print("filtered")

            # If parameters not none try to filter
        if check_int(diners):
            objects = objects.filter(diners__gte=diners)

        for object in objects:
            if object.image_file:
                image_url = settings.BASE_URL + object.image_file.url
            else:
                image_url = ""

            response_data.append(
                {
                    "id": object.id,
                    "name": object.name,
                    "description": object.description,
                    "diners": object.diners,
                    "image": image_url,
                    "external_url": object.external_url,
                    "event_date": object.event_datetime.timestamp(),
                    "opensea_url": object.opensea_url,
                    "nft_metadata_version": object.nft_metadata_version,
                    "nft_network": object.nft_network,
                }
            )
        return JsonResponse(response_data, safe=False)


class OnlyHolders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        # This could be adjusted to search for specific account instead of getting all token owners
        holders = web3query.get_owners()
        
        if str(request.user).upper() in holders:
            return JsonResponse({"status": "success", "message": "welcome to the secret area"}, status=200)
        else:
            return JsonResponse({"status": "fail", "message": "you don't own one of the very special NFTs"}, status=200)


