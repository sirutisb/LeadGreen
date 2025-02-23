from django.contrib import admin
from .models import Post
from qrcodes.models import QRCode  # Import QRCode to access category reward points

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'created_at', 'approved')
    list_filter = ('approved',)
    actions = ['approve_posts', 'reject_posts']

    def approve_posts(self, request, queryset):
        for post in queryset:
            # Only update posts that haven't been reviewed yet (approved is None)
            if post.approved is None:
                # Look up the QRCode corresponding to the post's qr_code field
                qr = QRCode.objects.filter(code=post.qr_code).first()
                reward = qr.category.reward_points if qr else 0

                # Approve the post and set its points_received field
                post.approved = True
                post.points_received = reward
                post.save()

                # Now, update the user's game profile to add the reward points
                try:
                    # Assumes a one-to-one relationship with related_name='game_profile'
                    game_profile = post.user.game_profile
                    game_profile.points_balance += reward
                    game_profile.save()
                except Exception as e:
                    self.message_user(request, f"Error updating points for user {post.user.username}: {e}", level='error')

    approve_posts.short_description = "Approve selected posts ✅"

    def reject_posts(self, request, queryset):
        queryset.update(approved=False)
    reject_posts.short_description = "Reject selected posts ❌"

admin.site.register(Post, PostAdmin)
