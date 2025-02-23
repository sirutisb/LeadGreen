from django.contrib import admin
from .models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'created_at', 'approved')
    list_filter = ('approved',)
    actions = ['approve_posts', 'reject_posts']

    def approve_posts(self, request, queryset):
        queryset.update(approved=True)
    approve_posts.short_description = "Approve selected posts ✅"

    def reject_posts(self, request, queryset):
        queryset.update(approved=False)
    reject_posts.short_description = "Reject selected posts ❌"

admin.site.register(Post, PostAdmin)