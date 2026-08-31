from .views import InventoryItemViewSet, InventoryStockAnalyticsView,LowStockItemsView

import rest_framework.routers as routers
from django.urls import path

router = routers.DefaultRouter()

router.register(
    r"",
    InventoryItemViewSet,
    basename="inventory-item"
)

urlpatterns = [
    path(
        "stockanalytic/",
        InventoryStockAnalyticsView.as_view(),
        name="stock-analytic"
    ),
    path(
            "lowstock/",
            LowStockItemsView.as_view(),
            name="lowstock-analytic"
        ),
]

urlpatterns += router.urls