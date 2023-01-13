from django.contrib import admin
from .models import NFTMetadata


class NFTMetadataAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


# Register your models here.
admin.site.register(NFTMetadata, NFTMetadataAdmin)
