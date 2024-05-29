from django.db import models
from django.db.utils import IntegrityError
from django.contrib.auth.models import User
from posts.models import Post


class Like(models.Model):
    """
    Like model related to the User('owner') and Post('post')
    instances.
    'unique_together' ensures that a user can only like a post once.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='like')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'post']

    def __str__(self):
        return f'{self.owner} liked {self.post}'

    def save(self, *args, **kwargs):
        if Like.objects.filter(owner=self.owner, post=self.post).exists():
            raise IntegrityError({
                'detail': 'You have already liked this post.'})
        super().save(*args, **kwargs)
