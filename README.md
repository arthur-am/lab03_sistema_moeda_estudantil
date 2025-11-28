# 🏷️ StudentCoin 👨‍💻

> [!NOTE]
> Um sistema de moeda virtual para incentivar o mérito estudantil, permitindo que professores recompensem alunos e que estes troquem suas moedas por vantagens em empresas parceiras.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>StudentCoin</b> é um projeto acadêmico desenvolvido para a disciplina de Laboratório de Desenvolvimento de Software. A plataforma visa criar um ecossistema de reconhecimento onde o bom desempenho e a participação dos alunos são recompensados com uma moeda digital. Essa moeda pode ser utilizada para adquirir produtos e descontos, conectando o ambiente acadêmico ao comércio local e incentivando o engajamento estudantil.
      </div>
    </td>
    <td align="center">
      <div>
        <img src="https://i.imgur.com/your-logo-link-here.png" alt="Logo StudentCoin" width="120px"/>
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/arthur-am/lab03_sistema_moeda_estudantil/main.yml?branch=main)](https://github.com/arthur-am/lab03_sistema_moeda_estudantil/actions)
[![Versão](https://img.shields.io/badge/Versão-Release%202-blue)](https://github.com/arthur-am/lab03_sistema_moeda_estudantil)
[![Licença](https://img.shields.io/github/license/arthur-am/lab03_sistema_moeda_estudantil)](#-licença)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto
Este projeto foi criado para resolver o desafio de engajar e recompensar estudantes de forma moderna e tangível. A ideia é que professores possam distribuir "StudentCoins" como reconhecimento por participação, boas notas ou comportamento exemplar. Os alunos acumulam essas moedas e podem trocá-las por vantagens reais, como descontos em livrarias, lanchonetes e outros serviços parceiros, criando um ciclo virtuoso de incentivo.

O sistema foi desenvolvido no contexto acadêmico da PUC Minas, visando aplicar conceitos de arquitetura MVC, desenvolvimento full-stack, e boas práticas de engenharia de software em um cenário prático.

---

## ✨ Funcionalidades Principais
- 🔐 **Autenticação de Perfis:** Login e Cadastro para Alunos e Empresas Parceiras.
- 👨‍🏫 **Gestão de Moedas (Professor):** Envio de moedas para alunos e consulta de extrato de envios.
- 🎓 **Gestão de Carteira (Aluno):** Consulta de saldo, extrato e resgate de vantagens.
- 🏪 **Gestão de Vantagens (Empresa):** CRUD completo de vantagens (produtos/descontos) oferecidas.
- 📨 **Sistema de Notificações:** Envio de e-mails para confirmação de transações e resgates de cupons.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Framework/Biblioteca:** React
* **Estilização:** Material-UI (MUI)
* **Comunicação API:** Axios

### 🖥️ Back-end
* **Linguagem/Runtime:** Java 17 (JDK)
* **Framework:** Spring Boot
* **Banco de Dados:** PostgreSQL
* **ORM:** Hibernate/JPA
* **Autenticação:** Spring Security (Básico)

### ⚙️ Infraestrutura & DevOps
* **Containerização:** Docker & Docker Compose

---

## 🏗 Arquitetura
O sistema segue uma arquitetura em camadas (N-Tier) no backend, aderindo ao padrão Model-View-Controller (MVC). O frontend é uma Single-Page Application (SPA) desacoplada que consome a API RESTful do backend.

| Cadastro de Vantagens (Lab04S02) | Troca de Vantagens (Lab04S03) |
| :---: | :---: |
| ![Diagrama Cadastro de Vantagens](https://i.imgur.com/your-diagram1-link-here.png) | ![Diagrama Troca de Vantagens](https://i.imgur.com/your-diagram2-link-here.png) |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Docker** e **Docker Compose** instalados.

### 🔑 Variáveis de Ambiente
Antes de executar, configure seu serviço de e-mail no arquivo `Código/backend/src/main/resources/application.properties`:
```properties
spring.mail.username=seu.email.real@gmail.com
spring.mail.password=sua_senha_de_app_de_16_digitos
```

### 🐳 Execução Local Completa com Docker Compose
Com Docker, todo o ambiente (Banco de Dados, Backend e Frontend) é configurado e iniciado com um único comando.

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/arthur-am/lab03_sistema_moeda_estudantil.git
    ```
2.  **Navegue para a Raiz do Projeto:**
    ```bash
    cd lab03_sistema_moeda_estudantil
    ```
3.  **Suba os Serviços:**
    ```bash
    docker-compose up --build
    ```
    > [!NOTE]
    > A aplicação estará disponível em **[http://localhost:3000](http://localhost:3000)**.

4.  **Para Parar a Aplicação:**
    Pressione `Ctrl + C` e execute:
    ```bash
    docker-compose down
    ```

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn |
|---|---|---|
| Arthur Araújo Mendonça | [arthur-am](https://github.com/arthur-am) | [LinkedIn](https://www.linkedin.com/in/arthur-am/) |
| Eddie Christian Pereira | [EddieChristian](https://github.com/EddieChristian) | [LinkedIn](https://www.linkedin.com/in/eddie-christian-pereira-38323a1b4/) |
| Pedro Queiroz Rolim | [pedro-q-rolim](https://github.com/pedro-q-rolim) | [LinkedIn](https://www.linkedin.com/in/pedro-queiroz-rolim-a85973216/) |

---

## 🤝 Contribuição
Este é um projeto acadêmico. Contribuições são bem-vindas via Pull Request após alinhamento com os autores.

---

## 🙏 Agradecimentos
* **Engenharia de Software PUC Minas** - Pelo apoio institucional e fomento à inovação.
* **Prof. Dr. João Paulo Aramuni** - Pelos valiosos ensinamentos em Arquitetura de Software e Padrões de Projeto.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](./LICENSE)**.
