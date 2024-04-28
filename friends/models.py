from django.db import models
from django.contrib.auth.models import User


class Friend(models.Model):
    """
    Friend model related to the User('owner') and User('friend')
    instances.
    'unique_together' ensures that a user can only send a friend
    request to another user once.
    """
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='owner'
        )
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='friend'
    )
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'friend'], ['friend', 'owner']

    def __str__(self):
        return f'{self.owner} sent you {self.friend} a friend request.'
