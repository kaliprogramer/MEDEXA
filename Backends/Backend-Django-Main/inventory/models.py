from django.db import models

from core import settings



class InventoryItem(models.Model):

    ITEM_TYPE_CHOICES = [
        ("MEDICINE", "Medicine"),
        ("MEDICAL_SUPPLY", "Medical Supply"),
        ("EQUIPMENT", "Equipment"),
        ("OTHER", "Other"),
    ]

    UNIT_CHOICES = [
        ("PIECE", "Piece"),
        ("BOX", "Box"),
        ("PACK", "Pack"),
        ("BOTTLE", "Bottle"),
        ("STRIP", "Strip"),
        ("VIAL", "Vial"),
        ("TABLET", "Tablet"),
        ("LITER", "Liter"),
        ("KG", "Kilogram"),
    ]

    name = models.CharField(
        max_length=200
    )

    item_code = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True
    )

    item_type = models.CharField(
        max_length=30,
        choices=ITEM_TYPE_CHOICES
    )


    supplier = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True
    )

    unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
        default="PIECE"
    )

    quantity = models.PositiveIntegerField(
        default=0
    )

    minimum_stock = models.PositiveIntegerField(
        default=10
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    batch_number = models.CharField(
        max_length=100,
        blank=True
    )

    expiry_date = models.DateField(
        null=True,
        blank=True
    )

    storage_location = models.CharField(
        max_length=150,
        blank=True
    )
    hospital = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name="inventory_items",
            null=True,
            blank=True
        )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.name} ({self.item_code})"

    @property
    def is_low_stock(self):
        return self.quantity <= self.minimum_stock

    @property
    def total_value(self):
        return self.quantity * self.unit_price
    @property
    def is_expired(self):
        from datetime import date
        if self.expiry_date:
            return self.expiry_date < date.today()
        return False
    @property
    def is_expiring_soon(self, days=30):
        from datetime import date, timedelta
        if self.expiry_date:
            return date.today() <= self.expiry_date <= date.today() + timedelta(days=days)
        return False
    @property
    def expiry_days_remaining(self):
        from datetime import date
        if self.expiry_date:
            delta = self.expiry_date - date.today()
            return delta.days
        return None
    def save(self, *args, **kwargs):
            if not self.item_code:
                import uuid
                self.item_code = f"ITEM-{uuid.uuid4().hex[:8].upper()}"
    
            super().save(*args, **kwargs)
