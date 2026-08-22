from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None

        validated_token = self.get_validated_token(access_token)

        return self.get_user(validated_token), validated_token


# =========================================================
# LOGIN SERIALIZER
# =========================================================

class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"


# =========================================================
# LOGIN
# =========================================================

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        tokens = serializer.validated_data

        access_token = tokens["access"]
        refresh_token = tokens["refresh"]

        response = Response(
            {
                "message": "Login successful"
            },
            status=status.HTTP_200_OK,
        )

        # Access token
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,          # True in production with HTTPS
            samesite="Lax",
            max_age=15 * 60,       # 15 minutes
            path="/",
        )

        # Refresh token
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,          # True in production with HTTPS
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,  # 7 days
            path="/",
        )

        return response


# =========================================================
# REFRESH ACCESS TOKEN
# =========================================================

class CookieTokenRefreshView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        # No refresh token
        if not refresh_token:
            return Response(
                {
                    "detail": "Refresh token not found"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(
            data={
                "refresh": refresh_token
            }
        )

        try:
            serializer.is_valid(raise_exception=True)

        except Exception:
            return Response(
                {
                    "detail": "Refresh token is invalid or expired"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # New access token
        access_token = serializer.validated_data["access"]

        response = Response(
            {
                "message": "Token refreshed"
            },
            status=status.HTTP_200_OK,
        )

        # Replace old access token
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,          # True in production HTTPS
            samesite="Lax",
            max_age=15 * 60,
            path="/",
        )

        return response


# =========================================================
# REGISTER
# =========================================================

class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


# =========================================================
# CURRENT USER
# =========================================================

class MeView(APIView):

    authentication_classes = [
        CookieJWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(
            {
                "email": request.user.email,
                "username": request.user.username,
                "Organization_name": request.user.Organization_name,
                "Specialization": request.user.Specialization,
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# LOGOUT
# =========================================================

class LogoutView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        response = Response(
            {
                "message": "Logout successful"
            },
            status=status.HTTP_200_OK,
        )

        # Delete access token
        response.delete_cookie(
            key="access_token",
            path="/",
            samesite="Lax",
        )

        # Delete refresh token
        response.delete_cookie(
            key="refresh_token",
            path="/",
            samesite="Lax",
        )

        return response