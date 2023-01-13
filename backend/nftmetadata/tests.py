import datetime
from django.test import TestCase
from .models import NFTMetadata
from rest_framework.test import APIClient


class NFTMetadataModelTest(TestCase):
    """Test module for NFTMetadata model"""

    def setUp(self):
        NFTMetadata.objects.create(
            id=0,
            name="Amazing experience",
            description="one in a life time dinner",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2015, 10, 9, 18, 30, 0),
            opensea_url="http://www.opensea.com",
        )

    def test_nft_creation(self):
        nft_one = NFTMetadata.objects.get(id=0)
        self.assertEqual(nft_one.name == "Amazing experience", True)


class NFTMetadataEndpointTest(TestCase):
    """Test module for NFTMetadata Endpoint"""

    def setUp(self):
        self.client = APIClient()

        NFTMetadata.objects.create(
            id=0,
            name="Amazing experience",
            description="one in a life time dinner",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2021, 10, 9, 18, 30, 0),
            opensea_url="http://www.opensea.com",
            diners=4,
        )
        NFTMetadata.objects.create(
            id=1,
            name="Amazing experience1",
            description="one in a life time dinner1",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2021, 10, 9, 19, 30, 0),
            opensea_url="http://www.opensea.com",
            diners=3,
        )
        NFTMetadata.objects.create(
            id=2,
            name="Amazing experience2",
            description="one in a life time dinner2",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2021, 10, 9, 19, 30, 0),
            opensea_url="http://www.opensea.com",
            diners=4,
        )
        NFTMetadata.objects.create(
            id=3,
            name="Amazing experience3",
            description="one in a life time dinner3",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2021, 10, 9, 23, 30, 0),
            opensea_url="http://www.opensea.com",
            diners=4,
        )
        NFTMetadata.objects.create(
            id=4,
            name="Amazing experience4",
            description="one in a life time dinner4",
            external_url="http://www.ritzyreso.com",
            event_datetime=datetime.datetime(2021, 10, 9, 00, 30, 0),
            opensea_url="http://www.opensea.com",
            diners=4,
        )

    def test_nft_get_one_unauth(self):
        """Get one nft with unathenticated user"""
        # self.client = APIClient()

        response = self.client.get("/api/uri/v1/0")
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is dict, True)

    def test_nft_get_list_unauth(self):
        """Get one nft with unathenticated user"""
        # self.client = APIClient()

        response = self.client.get("/api/uri/v1/")
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 5, True)

    def test_nft_search_diners(self):
        """Search for diners"""
        # self.client = APIClient()

        response = self.client.get("/api/uri/v1/?diners=3")
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 5, True)

        response = self.client.get("/api/uri/v1/?diners=4")
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 4, True)

        response = self.client.get("/api/uri/v1/?diners=10")
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 0, True)

    def test_nft_search_datetime_basic(self):
        """Search for diners"""

        # Get all resos
        date = datetime.datetime(2021, 10, 9)
        date_timestamp = date.replace(tzinfo=datetime.timezone.utc).timestamp()
        time = datetime.datetime(1970, 1, 1, 18, 00)
        time_timestamp = time.replace(tzinfo=datetime.timezone.utc).timestamp()
        url = "/api/uri/v1/?date={}&time={}".format(date_timestamp, time_timestamp)

        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 3, True)

        # Get one reso
        date = datetime.datetime(2021, 10, 9)
        date_timestamp = date.replace(tzinfo=datetime.timezone.utc).timestamp()
        time = datetime.datetime(1970, 1, 1, 15, 30)
        time_timestamp = time.replace(tzinfo=datetime.timezone.utc).timestamp()
        url = "/api/uri/v1/?date={}&time={}".format(date_timestamp, time_timestamp)

        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 1, True)

        # Get three resos
        date = datetime.datetime(2021, 10, 9)
        date_timestamp = date.replace(tzinfo=datetime.timezone.utc).timestamp()
        time = datetime.datetime(1970, 1, 1, 22, 15)
        time_timestamp = time.replace(tzinfo=datetime.timezone.utc).timestamp()
        url = "/api/uri/v1/?date={}&time={}".format(date_timestamp, time_timestamp)

        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 3, True)

    def test_nft_search_datetime_different_day(self):
        """Test is date/time works for next and previous day"""

        # add a additional resos

        # Get reso just before midnight with search time next day
        date = datetime.datetime(2021, 10, 10)
        date_timestamp = date.replace(tzinfo=datetime.timezone.utc).timestamp()
        time = datetime.datetime(1970, 1, 1, 00, 30)
        time_timestamp = time.replace(tzinfo=datetime.timezone.utc).timestamp()
        url = "/api/uri/v1/?date={}&time={}".format(date_timestamp, time_timestamp)
        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 1, True)

        # Get reso just after midnight with search time previous day
        date = datetime.datetime(2021, 10, 8)
        date_timestamp = date.replace(tzinfo=datetime.timezone.utc).timestamp()
        time = datetime.datetime(1970, 1, 1, 23, 30)
        time_timestamp = time.replace(tzinfo=datetime.timezone.utc).timestamp()
        url = "/api/uri/v1/?date={}&time={}".format(date_timestamp, time_timestamp)
        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 1, True)

    def test_nft_search_params_datetime(self):
        """Get PARAMS testing"""

        # Check for unexpected string input
        url = "/api/uri/v1/?date={}&time={}".format("blah blah", "kaboom")
        response = self.client.get(url)
        self.assertEqual(response.status_code == 400, True)

    def test_nft_search_params_diners(self):
        """Get PARAMS testing"""

        # Check invalid diner input
        url = "/api/uri/v1/?diners={}".format("blah blah")
        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 5, True)

    def test_nft_search_address(self):
        """
        Search based on submitted address
        This is going to be more tricky as it partially relies on live
        info from the Blockchain
        """

        # Put in invalid address
        url = "/api/uri/v1/?address={}".format("Awesome fun address")
        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 400, True)

        # At this point in time this address has all NFTs
        # This test will need to be updated in the future
        url = "/api/uri/v1/?address={}".format("0x97EC59751B138386B7eB98d2d8CE9BF6FfD053f9")
        response = self.client.get(url)
        json_response = response.json()
        self.assertEqual(response.status_code == 200, True)
        self.assertEqual(type(json_response) is list, True)
        self.assertEqual(len(json_response) == 4, True)
