import random
import string
import os
from django.db import models
from .storage import OverwriteStorage
from django.contrib.auth.models import User
from PIL import Image
from io import BytesIO
from django.core.files import File


class NFTMetadata(models.Model):
    """
    Using data format as referenced here: https://docs.opensea.io/docs/metadata-standards
    Not all data attributes implemented

    To be considered if just the NFT Metadata should be stored or if a representation should
    be stored off the blockchain to make data access easier
    """

    def pk_generator():
        """
        Return random string length 32
        """
        return "".join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for i in range(10))

    def photo_path(instance, filename):
        basefilename, file_extension = os.path.splitext(filename)
        return_path = "uri/v1/{userid}{ext}".format(userid=instance.id, ext=file_extension)
        return return_path

    def increment_count():
        # starting at index 0 so we can just count existing and return that value
        return len(NFTMetadata.objects.all())

    # id = models.AutoField('Unique RitzyReso ID, used to reference the reso',
    #                      primary_key=True, editable=True)
    id = models.IntegerField(
        "Unique RitzyReso ID, used to reference the reso", primary_key=True, editable=True, default=increment_count
    )

    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, null=True, blank=True)
    # image = models.URLField(max_length=200, null=True, blank=True)
    external_url = models.URLField(max_length=200, null=True, blank=True, default="http://localhost")

    # Attributes
    event_datetime = models.DateTimeField(null=True, unique=False, blank=False)
    diners = models.IntegerField(null=True, blank=False)

    # Additional variables
    opensea_url = models.URLField(max_length=200, unique=False, blank=True)

    # Internal variables
    nft_metadata_version = models.CharField(max_length=100, default=".1")
    image_file = models.ImageField(upload_to=photo_path, blank=True, null=True, storage=OverwriteStorage())
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    # nft_network could also store int, or some sort of limited choices
    nft_network = models.CharField(max_length=100, default="goerli")

    # before saving the instance we’re reducing the image
    def save(self, *args, **kwargs):
        if self.image_file:
            new_image = self.reduce_image_size(self.image_file)
            self.image_file = new_image
        super().save(*args, **kwargs)

    # for use ignoring the image optimizations
    def quick_save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def reduce_image_size(self, image_file):
        """
        Reduce image until it reaches the target size
        This probably isn't the most efficient way to do this
        Only admin users can add images so there should not be an issue where
        multiple of these procesesses are running at once

        This is super ugly, should be an equation to calculate the quality_multiplier
        """
        target_size = 200000
        quality_multiplier = 100
        image_size = 1000000000

        # Loop through until image is below target size
        count = 1
        while image_size > target_size:
            count = count + 1
            img = Image.open(image_file)
            thumb_io = BytesIO()

            img.save(thumb_io, "jpeg", quality=quality_multiplier)
            new_image = File(thumb_io, name=image_file.name)
            image_size = thumb_io.tell()
            quality_multiplier = quality_multiplier - 15 + count
            # force quit
            if quality_multiplier <= 5 or count >= 15:
                image_size = 0

        return new_image
