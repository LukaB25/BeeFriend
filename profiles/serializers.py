from rest_framework import serializers
from .models import Profile
from friends.models import Friend


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()
    post_count = serializers.ReadOnlyField()
    friend_count = serializers.ReadOnlyField()
    post_interaction_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    def get_friends(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            friends = Friend.objects.filter(
                owner=user, friend=obj.owner
            ).first()
            print(friends)
            if friends:
                return friends.accepted
            else:
                return None
        return None


    class Meta:
        model = Profile
        fields = [
            'id',
            'owner',
            'is_owner',
            'name',
            'bio',
            'image',
            'friends',
            'post_count',
            'friend_count',
            'post_interaction_count',
            'created_at',
            'updated_at',
        ]