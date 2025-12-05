# ETAPA 1: Build da Aplicação React
# Usa uma imagem Node para instalar dependências e rodar o build
FROM node:18-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para instalar as dependências
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Roda o comando de build para gerar os arquivos estáticos otimizados
RUN npm run build

# ETAPA 2: Servir a Aplicação com Nginx
# Usa uma imagem leve do Nginx
FROM nginx:1.23-alpine

# Copia a configuração personalizada do Nginx que criamos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados na ETAPA 1 (da pasta /app/build)
# para a pasta padrão que o Nginx usa para servir arquivos
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para o container poder receber requisições
EXPOSE 80

# Comando para iniciar o Nginx quando o container rodar
CMD ["nginx", "-g", "daemon off;"]
