from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class CryptoTokenViewTest(TestCase):
    """Crypto Token View Test"""

    def setUp(self):
        self.client = APIClient()

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

    def test_crypto_token_user_exists(self):

        url = "/api/crypto_token/{}".format("0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        response = self.client.get(url)
        # json_response = response.json()
        self.assertEqual(response.status_code == 200, True)

    def test_crypto_token_user_not_exist(self):
        test_address = "0xD17294e9b86bcbCB9A52006C9bd334D2746612dd"
        url = "/api/crypto_token/{}".format(test_address)
        response = self.client.get(url)
        json_response = response.json()
        user = User.objects.filter(username=test_address.lower()).first()
        self.assertEqual(user is not None, True)
        self.assertEqual(json_response["crypto_token"] == user.cryptotoken.crypto_token, True)

        # Test case we know will fail
        fail_address = "0x54D56aCE34d5662B816a928B59Be6d88f5214711"
        fail_user = User.objects.filter(username=fail_address.lower()).first()
        print(fail_user)
        self.assertEqual(fail_user is not None, False)

    def test_crypto_token_invalid_address(self):

        # Put in invalid address
        url = "/api/crypto_token/{}".format("invalid address")
        response = self.client.get(url)
        # json_response = response.json()
        self.assertEqual(response.status_code == 400, True)
