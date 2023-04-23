# TFC - VetOn

![logo](https://user-images.githubusercontent.com/72628840/233821735-8bbfb006-935d-437a-8686-707d2c1e4ade.png)

# Pré-Requisitos

* Download da ferramenta <a href="https://www.docker.com/get-started/">Docker Desktop</a>

# Manual de utilização  

### Containers do Docker

* Pull do container client
```sh
docker pull rubenulht/client:3.0
```

* Correr o container client
```sh
docker run -d -p 5000:5000 rubenulht/client:3.0
```

* Pull do container api
```sh
docker pull rubenulht/api:2.0
```

* Correr o container api
```sh
docker run -d -p 4000:4000 rubenulht/api:2.0
```

* Abrir o client
```sh
localhost:5000
```

# Credenciais

## Conta admin
```sh
username: admin
password: !1A12345
```

## Conta support
```sh
username: support1
password: !1A12345
```

# Créditos
Projeto realizado por:

<a href="https://github.com/rbnvsilva">Ruben Silva a22003218</a>  
<a href="https://github.com/RodrigoSimoes-22001628">Rodrigo Simões a22001628</a>

Um obrigado aos nossos Professores Orientadores:

<a href="https://www.linkedin.com/in/jplcarvalho/">Professor João Pedro Leal Abalada de Matos Carvalho</a>  
<a href="https://www.linkedin.com/in/joaopedropavia/">Professor João Pedro Calado Barradas Branco Pavia</a>
