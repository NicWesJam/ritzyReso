from django.contrib import admin
from .models import UserProfile, CryptoToken

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(CryptoToken)
