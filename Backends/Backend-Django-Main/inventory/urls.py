from .views import InventoryItemViewSet
import rest_framework.routers as routers

router = routers.DefaultRouter()
router.register(r'', InventoryItemViewSet, basename='inventory-item')

urlpatterns = router.urls