from django.urls import path
from . import views

urlpatterns = [
    path("csrf/", views.get_csrf, name="api-csrf"),
    path("login/", views.login_view, name="api-login"),
    path("logout/", views.logout_view, name="api-logout"),
    path("session/", views.SessionView.as_view(), name="api-session"),
    path(
        "crypto_token/<str:username>",
        views.get_crypto_token,
        name="api-crypto-token",
    ),
    path("user_detail/", views.UserDetail.as_view(), name="api-user-detail"),
]
