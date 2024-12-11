from django.urls import path
from . import views

urlpatterns = [
    path('', views.cadastrar, name='cadastrar'),
    path('login/', views.login, name='login'),
    path('sair/', views.logout, name='logout'),
    path('jogo/', views.jogo, name='jogo'),
    path('ranking/', views.ranking, name='ranking'),
]
