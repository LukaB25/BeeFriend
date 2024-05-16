from django.contrib.humanize.templatetags.humanize import naturaltime
from django.db import IntegrityError
from rest_framework import serializers
from .models import Friend


class FriendSerializer(serializers.ModelSerializer):
    """
    Friend model serializer.
    If the user sent the friend request, 'is_owner' will be True.
    Validates that the user can't send a friend request to themselves,
    can't send a friend request to the same user twice, and can't
    send a friend request to a user they are already friends with.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    owner_profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    owner_profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    friend_username = serializers.CharField(source='friend.username')
    friend_profile_id = serializers.ReadOnlyField(source='friend.profile.id')
    friend_profile_image = serializers.ReadOnlyField(source='friend.profile.image.url')
    created_at = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.owner == request.user
    
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)

    def create(self, validated_data):
        user = self.context.get('request').user
        friend = validated_data.get('friend')
        
        if user == friend:
            raise serializers.ValidationError({
                'detail': 'You cannot send a friend request to yourself.'
            })

        if Friend.objects.filter(owner=user, friend=friend).exists():
            raise serializers.ValidationError({
                'detail': 'You have already sent a friend request to this user.'
            })

        if Friend.objects.filter(owner=friend, friend=user).exists():
            raise serializers.ValidationError({
                'detail': 'You are already friends with this user.'
            })
        
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'An error occurred while processing your request. Please try again.'
            })


    class Meta:
        model = Friend
        fields = [
            'id',
            'owner',
            'is_owner',
            'owner_profile_id',
            'owner_profile_image',
            'friend',
            'friend_username',
            'friend_profile_id',
            'friend_profile_image',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'is_owner',
            'owner_profile_id',
            'owner_profile_image',
            'friend_username',
            'friend_profile_id',
            'friend_profile_image'
            'created_at',
        ]


class FriendDetailSerializer(FriendSerializer):
    """
    Friend model serializer.
    If the user received the friend request, 'is_friend' will be True.
    Validates that the user can't accept a friend request they sent
    and can't accept a friend request that has already been accepted.
    """
    friend = serializers.ReadOnlyField(source='friend.username')
    is_friend = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    def get_is_friend(self, obj):
        request = self.context.get('request')
        if obj.accepted:
            return True
        else:
            return False

    def create(self, validated_data):
        user = self.context.get('request').user
        friend = validated_data.get('friend')
    
    def validate(self, data):
        request = self.context.get('request')
        if self.instance.owner == request.user:
            raise serializers.ValidationError({
                'detail': 'You cannot accept friend request you sent.'
            })
        if self.instance.accepted:
            raise serializers.ValidationError({
                'detail': 'This friend request has already been accepted.'
            })
        return data

    class Meta(FriendSerializer.Meta):
        fields = FriendSerializer.Meta.fields + [
            'friend',
            'is_friend',
            'accepted'
        ]
        read_only_fields = FriendSerializer.Meta.read_only_fields + [
            'friend',
            'is_friend',
        ]

