from datetime import timezone
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jogo
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

def cadastrar(request):
    if request.method == "GET":
        return render(request, 'memoria/cadastrar.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
    
        user = User.objects.filter(username=username).first()
        
        if user:
            return HttpResponse('Já possui um usuario logado com esse username')
        
        user = User.objects.create_user(username=username, email=email, password=senha)
        user.save()
        return redirect('login')
     

    
def login(request):
    if request.method == "GET":
        return render(request, 'memoria/login.html')
    
    else:
        username = request.POST.get('username')
        senha = request.POST.get('senha')
        
        user = authenticate(username=username, password=senha)
        
        if user:
            return render(request, 'memoria/jogo.html') #redirect('index')
        else:
            return HttpResponse('email ou senha invalidos')
        
# def plataforma (request):
#     if request.user.is_authenticated:
#      return HttpResponse('Plataforma')
 
#     else:
#         return HttpResponse('Você precisa está logado para acessar essa área')
    
# @login_required(login_url='login')
# def index(request):
#     return render(request, 'memoria/index.html')

@login_required(login_url='login')
@csrf_exempt 
def jogo(request):
    if request.method == 'POST':
        nome = request.user.username
        tentativas = int(request.POST.get('tentativas'))
        tempo = (request.POST.get('tempo'))
        data_hora = timezone.now()

        # Salva a partida no banco de dados
        jogo = Jogo.objects.create(nome=nome, tentativas=tentativas, tempo=tempo, data_hora=data_hora)
        jogo.save()

        return redirect(ranking)
    
    return render(request, 'memoria/jogo.html')

def ranking(request):
    jogos = Jogo.objects.all().order_by('tentativas', 'tempo', '-data_hora')  # Ordena por tentativas, tempo e data
    context = {
        'jogos': jogos
    }
    return render(request, 'memoria/ranking.html', context)