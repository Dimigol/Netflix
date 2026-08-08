FROM node:20-alpine

# Build context e a raiz do repositorio (ver docker-compose.yml) porque o
# server.js espera encontrar ../../frontend a partir de backend/src.
WORKDIR /app

COPY backend/package*.json backend/
RUN npm install --prefix backend

COPY backend backend
COPY frontend frontend

WORKDIR /app/backend

EXPOSE 5001

CMD ["npm", "start"]
