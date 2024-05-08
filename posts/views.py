from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, filters
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Post
from .serializers import PostSerializer


class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Post.objects.annotate(
        like_count=Count('like', distinct=True),
        comment_count=Count('comment', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    ordering_fields = [
        'like_count',
        'comment_count',
        'like__created_at',
        'comment__created_at',
    ]
    search_fields = [
        'owner__username',
        'title',
        'content',
    ]
    filterset_fields =[
        'owner',
        'owner__friend__owner',
        'owner__friend__owner__profile',
        'like__owner__profile',
        'comment__owner__profile',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a post instance. 
    """
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.annotate(
        like_count=Count('like', distinct=True),
        comment_count=Count('comment', distinct=True)
    ).order_by('-created_at')
