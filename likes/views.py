from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Like
from .serializers import LikeSerializer


class LikeList(generics.ListCreateAPIView):
    """
    List all likes.
    Create a new like instance if authenticated.
    Current logged in user is associated with the like.
    """
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'post',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LikeDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a like.
    Update or delete a like instance if like owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()