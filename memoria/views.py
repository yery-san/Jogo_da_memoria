from datetime import timezone
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jogo
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout

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
        
         if request.user.is_authenticated:
            # return HttpResponse('Você já está logado. Por favor, saia para logar novamente.')
            return render(request, 'memoria/sair.html')
        #  return render(request, 'memoria/login.html')
        
         else: 
            return render(request, 'memoria/login.html') 
    
    else:
        username = request.POST.get('username')
        senha = request.POST.get('senha')
        
        user = authenticate(username=username, password=senha)
        
        if user:
            auth_login(request, user)
            return render(request, 'memoria/jogo.html')
        
        else:
            return HttpResponse('Usuário ou senha incorretos')
        
def logout(request):
    auth_logout(request)
    return render(request, 'memoria/login.html')

@login_required(login_url='login')
@csrf_exempt 
def jogo(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
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