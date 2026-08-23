from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from authentication.views import CookieJWTAuthentication
from inventory.filter import InventoryItemFilter
from patients.views import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import InventoryItem
from .serializer import InventoryItemSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
class InventoryItemViewSet(viewsets.ModelViewSet):

    queryset = InventoryItem.objects.all().order_by("-created_at")
    # authentication_classes = [CookieJWTAuthentication]
    # permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    serializer_class = InventoryItemSerializer
    filterset_class = InventoryItemFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    search_fields = [
        "name",
        "item_code",
        "description",
        "batch_number",
        "storage_location",
        "supplier",
    ]
    def get_queryset(self):
            return InventoryItem.objects.all(
                # hospital=self.request.user
            ).order_by("-created_at")
    
    def perform_create(self, serializer):
        serializer.save(
            hospital=self.request.user
        )
    