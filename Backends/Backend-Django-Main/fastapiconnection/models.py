from django.conf import settings
from django.db import models

class Prediction(models.Model):
    hospital = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="predictions"
    )
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    type = models.CharField(max_length=100)
    prediction = models.CharField(max_length=100)
    probability_of_risk = models.FloatField()
    probability_of_healthy = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name} • {self.type}"

class LungsImagePrediction(models.Model):
    hospital = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="image_predictions"
    )
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="predictions/LungsDisease/",null=False, blank=False)
    gradcam_image = models.CharField(null=True, blank=True, max_length=255555555)
    prediction = models.CharField(max_length=100)
    probability_of_risk = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name} • {self.prediction}"

