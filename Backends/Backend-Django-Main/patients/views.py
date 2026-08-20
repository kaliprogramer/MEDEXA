from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from authentication.views import CookieJWTAuthentication
from .models import Patient
from .serializer import PatientSerializer
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Patient.objects.filter(
            hospital=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            hospital=self.request.user
        )
