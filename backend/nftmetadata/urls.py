from django.urls import path

from . import views

urlpatterns = [
    path('uri/v1/<int:id>', views.NFTMetadataDetail.as_view(), name='api-uri-detail'),
    path('uri/v1/', views.NFTMetadataList.as_view(), name='api-uri'),
    path('holders/v1/', views.OnlyHolders.as_view(), name='api-holders')
]
