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

O sistema foi construído e conteinerizado com Docker, facilitando a execução em qualquer ambiente.

-   **Backend:** Java 17, Spring Boot, Spring Data JPA, Spring Mail, Maven.
-   **Frontend:** React, Material-UI (MUI), Axios.
-   **Banco de Dados:** PostgreSQL.
-   **Ambiente:** Docker & Docker Compose.

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

## 🚀 Como Executar o Projeto (com Docker)

Com Docker, todo o ambiente (Banco de Dados, Backend e Frontend) é configurado e iniciado com um único comando.

### Pré-requisitos
-   [Docker](https://www.docker.com/products/docker-desktop/) e **Docker Compose** instalados.

### Passos para Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/arthur-am/lab03_sistema_moeda_estudantil.git
    ```

2.  **Navegue para a raiz do projeto:**
    ```bash
    cd lab03_sistema_moeda_estudantil
    ```

3.  **Construa as imagens e inicie os containers:**
    ```bash
    docker-compose up --build
    ```
    *A primeira vez que você executar este comando pode demorar um pouco, pois o Docker precisará baixar as imagens base e construir seus aplicativos.*

### Acessando a Aplicação

Após os containers estarem rodando, a aplicação estará disponível nos seguintes endereços:

-   **Frontend (Interface do Usuário):** [http://localhost:3000](http://localhost:3000)
-   **Backend (API):** [http://localhost:8080](http://localhost:8080)

### Parando a Aplicação

Para parar todos os containers, pressione `Ctrl + C` no terminal onde o `docker-compose` está rodando e depois execute:
```bash
docker-compose down
```

---

### Próximo Passo

1.  Faça as alterações no seu `application.properties`.
2.  Salve o arquivo.
3.  Volte para a **raiz do seu projeto** no terminal.
4.  Execute novamente:
    ```bash
    docker-compose up --build
    ```