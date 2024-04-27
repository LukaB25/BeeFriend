from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrFriendOtherwiseReadOnly
from .models import Friend
from .serializers import FriendSerializer, FriendDetailSerializer


class FriendList(generics.ListCreateAPIView):
    """
    List all friends or create a new friend request.
    """
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner',
        'owner__friend__owner',
        'accepted',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    
class FriendDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a friend instance.
    """
    queryset = Friend.objects.all()
    serializer_class = FriendDetailSerializer
    permission_classes = [IsOwnerOrFriendOtherwiseReadOnly]

    def perform_update(self, serializer):
        object_instance = self.get_object()
        if object_instance.accepted:
            serializer.save(accepted=False)
        else:
            serializer.save(accepted=True)
