# Estágio 1: Build com Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Web com Nginx
FROM nginx:stable-alpine
# Copia a build de produção para o diretório padrão do Nginx
COPY --from=builder /app/build /usr/share/nginx/html
# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia a nossa nova configuração personalizada
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]