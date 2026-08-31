from django.db import models
from django.conf import settings
# Create your models here.
class Report(models.Model):
    hospital = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='report',null=True, blank=True)
    subject = models.CharField()
    type = models.CharField()
    discription= models.TextField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject}"