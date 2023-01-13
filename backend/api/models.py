import random
import string
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.core.validators import RegexValidator


# Create your models here.
class CryptoToken(models.Model):
    def random_string():
        """
        Crypto Token generator
        """
        return "".join(
            random.SystemRandom().choice(
                string.ascii_uppercase + string.digits
            )
            for i in range(32)
        )

    def refresh_crypto_token(self):
        self.crypto_token = "".join(
            random.SystemRandom().choice(
                string.ascii_uppercase + string.digits
            )
            for i in range(32)
        )
        self.save()

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    crypto_token = models.CharField(max_length=50, default=random_string)


class UserProfile(models.Model):
    """
    This class is linked to a user profile and holds additional data
    Easier to link than to overwrite the existing User class
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone_number_regex = RegexValidator(regex=r"^\+?1?\d{8,15}$")
    phone_number = models.CharField(
        validators=[phone_number_regex],
        max_length=16,
        unique=False,
        null=True,
        blank=True,
    )


@receiver(post_save, sender=User)
def create_one_to_one(sender, instance, created, **kwargs):
    if created:
        CryptoToken.objects.create(user=instance)
        UserProfile.objects.create(user=instance)
