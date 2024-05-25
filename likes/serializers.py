from django.db import IntegrityError
from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    """
    Like serializer related to the User and Post instances
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    title = serializers.ReadOnlyField(source='post.title')

    class Meta:
        model = Like
        fields = [
            'id',
            'owner',
            'post',
            'title',
            'created_at',
        ]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'You have already liked this post.'
            })
