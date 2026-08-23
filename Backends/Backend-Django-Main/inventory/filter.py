import django_filters
from django.db.models import F

from .models import InventoryItem


class InventoryItemFilter(django_filters.FilterSet):

    stock = django_filters.ChoiceFilter(
        method="filter_stock",
        choices=[
            ("in_stock", "In Stock"),
            ("low_stock", "Low Stock"),
            ("out_of_stock", "Out of Stock"),
        ],
        label="Stock",
    )

    item_type = django_filters.ChoiceFilter(
        choices=InventoryItem.ITEM_TYPE_CHOICES,
        label="Item Type",
    )

    def filter_stock(self, queryset, name, value):

        if value == "in_stock":
            return queryset.filter(
                quantity__gt=F("minimum_stock")
            )

        if value == "low_stock":
            return queryset.filter(
                quantity__gt=0,
                quantity__lte=F("minimum_stock")
            )

        if value == "out_of_stock":
            return queryset.filter(
                quantity=0
            )

        return queryset

    class Meta:
        model = InventoryItem
        fields = [
            "stock",
            "item_type",
        ]