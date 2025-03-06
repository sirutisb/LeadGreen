from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import QRCode

from rest_framework.views import APIView
from rest_framework.response import Response
    
class ValidateCodeView(APIView):
    def get(self, request, *args, **kwargs):
        qr_code = request.GET.get("qr_code")  # Extract from query parameters

        if not qr_code:
            return JsonResponse({
                'error': 'qr_code parameter is required',
                'exists': False
            }, status=400)

        try:
            # Check if the qr_code exists in the database
            exists = QRCode.objects.filter(code=qr_code).exists()
            return JsonResponse({'exists': exists}, status=200)

        except Exception as e:
            return JsonResponse({
                'error': str(e),
                'exists': False
            }, status=500)