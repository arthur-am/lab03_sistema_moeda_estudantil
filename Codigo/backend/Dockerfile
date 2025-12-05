# Estágio 1: Build com Maven
# Usamos a imagem da Eclipse Temurin, que é o padrão atual da comunidade Java
FROM maven:3.9-eclipse-temurin-17 AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia primeiro o pom.xml para aproveitar o cache do Docker
COPY pom.xml .

# Baixa todas as dependências
RUN mvn dependency:go-offline

# Copia o restante do código-fonte
COPY src ./src

# Compila o projeto e empacota em um .jar
RUN mvn package -DskipTests

# Estágio 2: Execução
# --- ESTA É A LINHA QUE CORRIGE O PROBLEMA ---
# Usamos a imagem JRE da Eclipse Temurin, que é leve e confiável
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia o .jar gerado no estágio anterior
# ATENÇÃO: Verifique se o nome do seu .jar corresponde a este
COPY --from=builder /app/target/student-coin-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta que a aplicação usa
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
