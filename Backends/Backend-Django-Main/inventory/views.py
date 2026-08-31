from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from authentication.views import CookieJWTAuthentication
from inventory.filter import InventoryItemFilter
from patients.views import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import InventoryItem
from .serializer import InventoryItemSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count,Sum

class InventoryStockAnalyticsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        inventory = (
            InventoryItem.objects
            .filter(hospital=request.user)
            .values("item_type")
            .annotate(stock=Sum("quantity"))
        )

        stock_counts = {
            item["item_type"]: item["stock"] or 0
            for item in inventory
        }

        data = [
            {
                "name": "Medicines",
                "stock": stock_counts.get("MEDICINE", 0),
            },
            {
                "name": "Equipment",
                "stock": stock_counts.get("EQUIPMENT", 0),
            },
            {
                "name": "Medicine supply",
                "stock": stock_counts.get("MEDICAL_SUPPLY", 0),
            },
            {
                "name": "other",
                "stock": stock_counts.get("OTHER", 0),
            },
        ]

        return Response(data)
    
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
class InventoryItemViewSet(viewsets.ModelViewSet):

    queryset = InventoryItem.objects.all().order_by("-created_at")
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
            return InventoryItem.objects.filter(
                hospital=self.request.user
            ).order_by("-created_at")
    
    def perform_create(self, serializer):
        serializer.save(
            hospital=self.request.user
        )




class LowStockItemsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        low_stock_items = (
            InventoryItem.objects
            .filter(
                hospital=request.user,
                quantity__lt=10
            )
            .values(
                "id",
                "name",
                "quantity",
                "item_type"
            ).order_by("quantity")[:5]
        )

        data = [
            {
                "id": item["id"],
                "name": item["name"],
                "quantity": item["quantity"],
                "item_type": item["item_type"],
            }
            for item in low_stock_items
        ]

        return Response(data)