from django.urls import path
from chats import views

urlpatterns = [
    path('chats/', views.ChatList.as_view()),
    path('chats/<int:pk>/', views.ChatDetail.as_view()),
    path('chats/<int:pk>/messages/', views.MessageList.as_view()),
    path('chats/<int:pk>/messages/<int:message_pk>/', views.MessageDetail.as_view()),
]