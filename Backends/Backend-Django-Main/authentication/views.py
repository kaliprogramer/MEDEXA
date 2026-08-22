from rest_framework import generics
from .serializers import RegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        # First try normal Authorization: Bearer <token>
        header = self.get_header(request)

        if header is not None:
            return super().authenticate(request)

        # Otherwise get JWT from HttpOnly cookie
        raw_token = request.COOKIES.get("access_token")

        if not raw_token:
            return None

        validated_token = self.get_validated_token(raw_token)

        return (
            self.get_user(validated_token),
            validated_token,
        )

class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tokens = serializer.validated_data

        response = Response(
            {
                "message": "Login successful"
            },
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=tokens["access"],
            httponly=True,
            secure=False,       # True in production HTTPS
            samesite="Lax",
            max_age=1 * 24 *  60 * 60
        )

        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,       # True in production HTTPS
            samesite="Lax",
            max_age=7 * 24 * 60 * 60
        )

        return response

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print("REQUEST DATA:", request.data)

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("SERIALIZER ERRORS:", serializer.errors)
            return Response(
                serializer.errors,
                status=400
            )

        self.perform_create(serializer)

        return Response(
            serializer.data,
            status=201
        )

class MeView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "email": request.user.email,
            "username": request.user.username,
            "Organization_name": request.user.Organization_name,
            "Specialization": request.user.Specialization,
        })



class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response(
            {"message": "Logout successful"},
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            "access_token",
            samesite="Lax"
        )

        response.delete_cookie(
            "refresh_token",
            samesite="Lax"
        )

        return response