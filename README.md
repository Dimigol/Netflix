# Netflix Clone

Aplicacao full stack inspirada na experiencia da Netflix, com autenticacao, selecao de perfis, catalogo dinamico, player com trailers do YouTube, pagina "Bombando", "Minha lista", troca de avatar e tema claro/escuro.

O projeto usa frontend em JavaScript vanilla com modulos ES, servido pelo proprio backend Express. A API persiste usuarios, perfis, catalogo e lista do usuario em MongoDB.

## Indice

- [Visao geral](#visao-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Deploy gratuito](#deploy-gratuito)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [Scripts](#scripts)
- [Seed do catalogo](#seed-do-catalogo)
- [Rotas da API](#rotas-da-api)
- [Notas de desenvolvimento](#notas-de-desenvolvimento)
- [Troubleshooting](#troubleshooting)

## Visao geral

Esta aplicacao simula uma plataforma de streaming com:

- Tela inicial de login/cadastro.
- Selecao e criacao de multiplos perfis por usuario.
- Catalogo separado por paginas como Inicio, Series, Filmes, Jogos, Bombando e Minha lista.
- Cards com hover preview, modal de detalhes e player.
- Persistencia de progresso/lista por usuario e perfil.
- Catalogo carregado via API e normalizado para evitar capas/videos quebrados.

## Funcionalidades

- Autenticacao com JWT.
- Cadastro e login com senha criptografada usando `bcryptjs`.
- Login por tecla `Enter`.
- Alternancia entre tema claro e escuro com persistencia em `localStorage`.
- Visualizacao/ocultacao da senha no login.
- Multiplos perfis por conta.
- Criacao e edicao de perfil.
- Troca de avatar usando imagens locais do projeto.
- Catalogo vindo do MongoDB.
- Paginas especificas para filmes, series, bombando, jogos e minha lista.
- Pagina "Bombando" com ordem estavel por perfil e por dia.
- Botao para adicionar/remover titulo da "Minha lista".
- "Minha lista" separada por perfil ativo.
- Player baseado em embed do YouTube.
- Fallbacks para imagens e videos indisponiveis.

## Stack

**Frontend**

- HTML5
- CSS3
- JavaScript vanilla com ES modules
- Componentes reutilizaveis em JS

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- CORS

**Infra**

- Docker Compose
- MongoDB 7
- Backend servido na porta `5001`

## Estrutura do projeto

```text
Netflix/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Regras das rotas
│   │   ├── middleware/       # Autenticacao JWT
│   │   ├── models/           # Schemas Mongoose
│   │   ├── routes/           # Rotas Express
│   │   ├── seeds/            # Seed do catalogo
│   │   ├── utils/            # Utilitarios do backend
│   │   └── server.js         # Entrada da API/servidor estatico
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── assets/               # Imagens locais
│   ├── components/           # Card, Carousel, Modal
│   ├── pages/                # Home, catalogo, player e paginas internas
│   ├── services/             # Cliente da API, auth e Minha lista
│   ├── shared/               # CSS/scripts compartilhados
│   └── utils/                # Helpers do frontend
├── docs/                     # Documentacao complementar de setup
├── docker-compose.yml
└── README.md
```

## Como executar

### Opcao 1: Docker Compose

Pre-requisitos:

- Docker Desktop instalado.
- Portas `5001` e `27017` livres.

```bash
docker-compose up -d
docker exec netflix-backend npm run seed
```

Acesse:

```text
http://localhost:5001
```

### Opcao 2: Execucao local

Pre-requisitos:

- Node.js `>=18`
- MongoDB local ou remoto

Instale as dependencias:

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=troque-esta-chave-em-desenvolvimento
NODE_ENV=development
PORT=5001
```

Popule o catalogo:

```bash
npm run seed
```

Inicie a aplicacao:

```bash
npm start
```

Acesse:

```text
http://localhost:5001
```

## Deploy gratuito

A forma mais simples de publicar esta aplicacao gratuitamente e usar:

```text
Render Free Web Service -> backend Express + frontend estatico
MongoDB Atlas Free -> banco MongoDB
GitHub -> repositorio conectado ao deploy
```

### 1. Criar banco no MongoDB Atlas

1. Crie uma conta em MongoDB Atlas.
2. Crie um cluster gratuito.
3. Crie um usuario de banco com senha.
4. Libere acesso de rede para o Render. Para testes, pode usar `0.0.0.0/0`; em producao, prefira restringir IPs quando possivel.
5. Copie a connection string no formato `mongodb+srv://...`.

Exemplo:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/netflix-clone?retryWrites=true&w=majority
```

### 2. Publicar no Render

Este repositorio ja inclui um arquivo [render.yaml](render.yaml) com a configuracao do servico web.

No Render:

1. Clique em **New +**.
2. Escolha **Blueprint** ou **Web Service** conectado ao GitHub.
3. Se usar Blueprint, selecione este repositorio e o Render lera `render.yaml`.
4. Configure a variavel `MONGODB_URI` com a string do MongoDB Atlas.
5. Confirme o deploy.

Se configurar manualmente como Web Service:

```text
Build Command:
cd backend && npm install

Start Command:
cd backend && npm start
```

Variaveis:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/netflix-clone?retryWrites=true&w=majority
JWT_SECRET=uma-chave-grande-e-segura
NODE_ENV=production
```

O Render define `PORT` automaticamente.

### 3. Popular o catalogo em producao

Depois que o banco Atlas estiver configurado, rode o seed apontando para o banco remoto.

Localmente:

```bash
cd backend
MONGODB_URI="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/netflix-clone?retryWrites=true&w=majority" npm run seed
```

Se preferir, adicione temporariamente a mesma `MONGODB_URI` em `backend/.env` e rode:

```bash
cd backend
npm run seed
```

### 4. Acessar a aplicacao

A URL final tera este formato:

```text
https://nome-do-servico.onrender.com
```

Observacao: no plano gratuito, o Render pode "dormir" depois de um periodo sem acessos. A primeira abertura depois disso pode demorar alguns segundos.

## Variaveis de ambiente

O backend usa as seguintes variaveis:

| Variavel | Obrigatoria | Descricao |
| --- | --- | --- |
| `MONGODB_URI` | Sim | String de conexao com MongoDB |
| `JWT_SECRET` | Sim | Chave usada para assinar tokens JWT |
| `PORT` | Nao | Porta do servidor. Padrao: `5001` |
| `NODE_ENV` | Nao | Ambiente de execucao |

Exemplo com Docker Compose:

```env
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/netflix-clone?authSource=admin
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
PORT=5001
```

## Scripts

Execute os scripts dentro de `backend/`.

| Script | Descricao |
| --- | --- |
| `npm start` | Inicia o servidor Express |
| `npm run dev` | Inicia com `nodemon` |
| `npm run seed` | Sincroniza o catalogo inicial no MongoDB |

## Seed do catalogo

O arquivo [backend/src/seeds/seedContent.js](backend/src/seeds/seedContent.js) sincroniza o catalogo base.

O seed usa `bulkWrite` com `upsert`, entao pode ser executado novamente para atualizar registros existentes sem apagar todo o banco:

```bash
cd backend
npm run seed
```

O catalogo tambem normaliza imagens e trailers para reduzir a chance de cards sem capa ou videos indisponiveis.

## Rotas da API

Base URL local:

```text
http://localhost:5001/api
```

### Health

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API esta no ar |

### Auth

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/auth/register` | Cria uma conta |
| `POST` | `/auth/login` | Autentica usuario |
| `POST` | `/auth/verify` | Valida token JWT |

### Content

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/content` | Lista conteudos. Aceita `category` e `limit` |
| `GET` | `/content/:id` | Retorna conteudo por ID |
| `GET` | `/content/search?q=termo` | Busca no catalogo |
| `GET` | `/content/recommendations` | Retorna recomendacoes autenticadas |

### User

Rotas protegidas por JWT. Quando houver perfil ativo, o frontend envia o header `X-Profile-Id`.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/user/profile` | Cria um perfil |
| `GET` | `/user/profile` | Retorna o perfil ativo |
| `PUT` | `/user/profile/:profileId` | Atualiza nome/avatar do perfil |
| `PATCH` | `/user/profile/:profileId` | Alias para atualizar perfil |
| `POST` | `/user/profile/:profileId` | Alias para atualizar perfil |
| `POST` | `/user/watchhistory` | Salva progresso de exibicao |
| `GET` | `/user/watchhistory` | Lista historico do perfil |
| `PUT` | `/user/watchhistory/:contentId` | Adiciona/remove item da Minha lista |
| `GET` | `/user/mylist` | Lista favoritos do perfil ativo |

## Notas de desenvolvimento

- O frontend e estatico e fica em `frontend/`.
- O Express serve a pasta `frontend` diretamente.
- As paginas usam scripts proprios dentro de `frontend/pages/*`.
- Componentes compartilhados ficam em `frontend/components`.
- O cliente HTTP centralizado fica em [frontend/services/api.js](frontend/services/api.js).
- A regra de Minha lista fica em [frontend/services/myList.js](frontend/services/myList.js).
- A selecao de perfil e enviada nas requisicoes autenticadas via header `X-Profile-Id`.
- A pagina "Bombando" usa uma ordenacao deterministica por perfil/dia para evitar mudanca a cada reload.

## Troubleshooting

### Porta 5001 em uso

```bash
lsof -nP -iTCP:5001 -sTCP:LISTEN
```

Pare o processo que estiver usando a porta ou altere `PORT` no `backend/.env`.

### MongoDB nao conecta

Verifique se o Mongo esta rodando e se `MONGODB_URI` esta correta.

Com Docker:

```bash
docker-compose ps
docker-compose logs mongodb
```

### Catalogo vazio

Execute o seed:

```bash
cd backend
npm run seed
```

### Frontend parece desatualizado

Faca um hard refresh no navegador:

```text
Cmd + Shift + R
```

ou reinicie o backend para garantir que os arquivos estaticos novos estao sendo servidos.

## Status

Projeto em desenvolvimento ativo, com foco em evoluir a experiencia de catalogo, perfis, lista personalizada e organizacao do frontend.
