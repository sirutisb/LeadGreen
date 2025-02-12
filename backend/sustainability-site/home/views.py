from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("<h1>Welcome to LeadGreen</h1>")

def posts(request):
    return HttpResponse("Welcome to the posts, this is a collection of the public posts.") 