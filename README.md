# Sistema de Moeda Estudantil (StudentCoin) - Laboratório de Desenvolvimento de Software

## 📝 Descrição do Projeto

Este projeto consiste no desenvolvimento de um sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual, a **StudentCoin**. A plataforma permite que professores distribuam moedas aos seus alunos como recompensa por bom desempenho. Os alunos, por sua vez, podem trocar essas moedas por produtos e descontos em empresas parceiras cadastradas no sistema.

Este projeto é a entrega final (Sprint 03) para a disciplina de **Laboratório de Desenvolvimento de Software** do curso de **Engenharia de Software** da **PUC Minas**.

## 👥 Equipe

| Nome Completo           |
| ----------------------- |
| Arthur Araújo Mendonça  |
| Eddie Christian Pereira |
| Pedro Queiroz Rolim     |

### Professor
- João Paulo Carneiro Aramuni

## 🛠️ Tecnologias e Arquitetura

O sistema foi construído utilizando uma arquitetura de microsserviços com um backend RESTful e um frontend single-page application (SPA).

-   **Backend:**
    -   **Linguagem:** Java 17
    -   **Framework:** Spring Boot (Spring Web, Spring Data JPA, Spring Mail)
    -   **Banco de Dados:** PostgreSQL
    -   **Build & Dependências:** Maven

-   **Frontend:**
    -   **Framework:** React
    -   **UI Library:** Material-UI (MUI)
    -   **Comunicação API:** Axios

-   **Arquitetura Geral:** Model-View-Controller (MVC) no backend, com comunicação via API REST para o frontend.

## ✨ Funcionalidades Implementadas

#### Para Professores:
-   **Distribuição de Moedas:** Enviar moedas para alunos com motivo obrigatório.
-   **Consulta de Extrato:** Visualizar o histórico de moedas enviadas.

#### Para Alunos:
-   **Cadastro e Login:** Criar conta e acessar o sistema.
-   **Recebimento de Moedas:** Ser notificado por email ao receber moedas.
-   **Resgate de Vantagens:** Trocar moedas por produtos, gerando um cupom único por email.
-   **Consulta de Extrato e Saldo:** Visualizar saldo atual e histórico de transações.

#### Para Empresas Parceiras:
-   **Cadastro e Login:** Cadastrar a empresa na plataforma.
-   **Gestão de Vantagens:** Publicar e gerenciar vantagens (produtos/descontos).
-   **Validação de Cupons:** Receber notificações por email para validar os cupons de resgate.

## 🚀 Como Executar o Projeto

É necessário executar o Backend e o Frontend separadamente.

### 1. Backend (API Java/Spring)

1.  **Pré-requisitos:**
    -   JDK 17 ou superior.
    -   Maven 3.8 ou superior.
    -   PostgreSQL instalado e um banco de dados criado (ex: `studentcoin_db`).

2.  **Clone o repositório:**
    ```bash
    git clone https://github.com/arthur-am/lab03_sistema_moeda_estudantil/tree/main
    cd /Código/
    ```

3.  **Configure o banco de dados:**
    -   Abra `src/main/resources/application.properties`.
    -   Altere as propriedades `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password`.

4.  **Execute o projeto:**
    ```bash
    mvn spring-boot:run
    ```
    A API estará disponível em `http://localhost:8080`.

### 2. Frontend (App React)

1.  **Pré-requisitos:**
    -   Node.js e npm (ou Yarn).

2.  **Acesse o diretório do frontend:**
    ```bash
    cd student-coin-frontend 
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute o projeto:**
    ```bash
    npm start
    ```
    A aplicação estará disponível em `http://localhost:3000` (ou outra porta, se esta estiver em uso).
