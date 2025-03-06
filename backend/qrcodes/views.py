from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import QRCode

from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

@require_GET
def check_qr_code(request):
    # Get the qr_code parameter from the GET request
    qr_code = request.GET.get('qr_code', None)
    
    # Check if qr_code parameter was provided
    if qr_code is None:
        return JsonResponse({
            'error': 'qr_code parameter is required',
            'exists': False
        }, status=400)
    
    try:
        exists = QRCode.objects.filter(qr_code=qr_code).exists()
        
        return JsonResponse({
            'exists': exists
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'exists': False
        }, status=500)
    
class ValidateCodeView(APIView):
    def get(self, request, *args, **kwargs):
        qr_code = request.data.get("qr_code")
        if qr_code is None:
            return JsonResponse({
                'error': 'qr_code parameter is required',
                'exists': False
            }, status=400)
        try:
            # Check if the qr_code exists in the database
            exists = QRCode.objects.filter(code=qr_code).exists()
            return JsonResponse({
                'exists': exists
            }, status=200)
    
        except Exception as e:
            return JsonResponse({
                'error': str(e),
                'exists': False
            }, status=500)