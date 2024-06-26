from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Comment
from .serializers import CommentSerializer, CommentDetailSerializer


class CommentList(generics.ListCreateAPIView):
    """
    List all comments.
    Create a new comment instance if authenticated.
    Current logged in user is asociated with the comment.
    """
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields =[
        'post'
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a comment.
    Update or delete a comment instance if comment owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()