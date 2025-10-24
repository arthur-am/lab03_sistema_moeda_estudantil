# Estágio 1: Build com Node.js
# Usamos uma imagem do Node na versão 18
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package.json package-lock.json ./
RUN npm install

# Copia o resto do código do frontend
COPY . .

# Gera a build de produção otimizada
RUN npm run build

# Estágio 2: Servidor Web com Nginx
# Usamos um servidor web leve para servir os arquivos estáticos
FROM nginx:stable-alpine

# Copia os arquivos da build de produção do estágio anterior para o diretório do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O Nginx inicia automaticamente, então o CMD é opcional mas é uma boa prática
CMD ["nginx", "-g", "daemon off;"]