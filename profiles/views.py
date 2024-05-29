from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    List all profiles.
    There is no create view as the profile is created when a user is
    created using django signals.
    """
    queryset = Profile.objects.annotate(
        post_count=Count('owner__post', distinct=True),
        post_interaction_count=Count(
            'owner__like', distinct=True
        ) + Count('owner__comment', distinct=True)
    ).order_by('-created_at')
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
    ]
    serializer_class = ProfileSerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    ordering_fields = [
        'post_count',
        'friend_count',
        'post_interaction_count',
    ]
    search_fields = [
        'owner__username',
        'name',
        'bio',
    ]
    filterset_fields = [
        'owner__owner__owner',
        'owner__friend__owner',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a profile instance if you are profile owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.annotate(
        post_count=Count('owner__post', distinct=True),
        friend_count=Count(
            'owner__friend', distinct=True),
        post_interaction_count=Count(
            'owner__like', distinct=True
        ) + Count('owner__comment', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer
