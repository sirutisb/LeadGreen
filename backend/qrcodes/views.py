from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import QRCode

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
        # Check if the qr_code exists in your database
        # Replace 'qr_code_field' with your actual model field name
        exists = QRCode.objects.filter(qr_code=qr_code).exists()
        
        return JsonResponse({
            'exists': exists
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'exists': False
        }, status=500)