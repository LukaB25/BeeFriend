from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
    

class IsOwnerOrFriendOtherwiseReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or obj.friend == request.user
    

class IsSenderOrReceiver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user or obj.chat.receiver == request.user

    

# class IsFriendOrReadOnly(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return obj.friend == request.user