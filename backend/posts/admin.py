from django.contrib import admin
from .models import Post, PostLike
from qrcodes.models import QRCode  # Import QRCode to access category reward points

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'created_at', 'approved')
    list_filter = ('approved',)
    actions = ['approve_posts', 'reject_posts']

    def approve_posts(self, request, queryset):
        for post in queryset:
            # Only update posts that haven't been approved yet
            if post.approved:
                continue

            # Look up the QRCode corresponding to the post's qr_code field
            qr = post.qr_code
            reward = qr.category.reward_points

            # Approve the post and set its points_received field
            post.approved = True
            post.points_received = reward
            post.save()

            # Update the user's game profile to add the reward points
            try:
                game_profile = post.user.game_profile
                game_profile.add_points(reward)
                game_profile.spins += 1
                game_profile.save()
            except Exception as e:
                self.message_user(request, f"Error updating points for user {post.user.username}: {e}", level='error')

    approve_posts.short_description = "Approve selected posts ✅"

    def reject_posts(self, request, queryset):
        # Only reject the posts that have not been approved
        queryset.filter(approved=None).update(approved=False)

    reject_posts.short_description = "Reject selected posts ❌"

admin.site.register(Post, PostAdmin)

class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')

admin.site.register(PostLike, LikeAdmin)