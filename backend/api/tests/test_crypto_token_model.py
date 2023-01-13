from django.test import TestCase
from django.contrib.auth.models import User


class CryptoTokenModelTest(TestCase):
    """Test module for get_crypto_token view"""

    def setUp(self):
        User.objects.create(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        User.objects.create(username="0x13d6abfe44cfd25fa48b9410bb13e95bad54c4dc")

    def test_token_generation(self):
        user_one = User.objects.get(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        crypto_token = user_one.cryptotoken.crypto_token
        self.assertEqual(len(crypto_token), 32)

    def test_token_refresh(self):
        user_one = User.objects.get(username="0x9ccaeb178781bcc3567bc3f96d777e7021a2da1a")
        crypto_token = user_one.cryptotoken.crypto_token
        user_one.cryptotoken.refresh_crypto_token()
        self.assertEqual(crypto_token == user_one.cryptotoken.crypto_token, False)
