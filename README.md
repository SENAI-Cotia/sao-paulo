# EntreNos - Sistema de Agendamento e Triagem

O **EntreNos** é uma plataforma desenvolvida em **Java 21** com **Spring Boot 4** para facilitar o acolhimento e a organização de atendimentos. O sistema permite o cadastro de usuários, a realização de uma triagem lógica e o agendamento de horários.

---

##  Tecnologias Utilizadas

- **Linguagem:** Java 21 (Amazon Corretto)
- **Framework:** Spring Boot 4.0.5
- **Template Engine:** Thymeleaf
- **Persistência:** Spring Data JPA / Hibernate 7
- **Banco de Dados:** MySQL 8+
- **Gerenciador de Dependências:** Maven (via Maven Wrapper)

---

##  Estrutura do Projeto

O projeto segue o padrão de arquitetura em camadas para separação de responsabilidades:

- **Controller:** Gerenciamento de rotas e navegação das páginas
- **Model:** Definição das entidades de banco de dados (Aluno, Agendamento, Triagem)
- **Repository:** Interfaces para persistência e consultas ao banco de dados
- **Service:** Camada de lógica de negócio e validações do sistema
- **Resources:**
    - Templates HTML (Thymeleaf)
    - Arquivos estáticos (CSS/JS)
    - Configurações do sistema

---

##  Funcionalidades

###  Concluídas
- Configuração de persistência com MySQL
- Criação automatizada de tabelas via Hibernate
- Fluxo de cadastro de alunos integrado ao banco de dados

###  Em Desenvolvimento
- Página institucional (Sobre Nós)
- Sistema de login e autenticação de usuários
- Módulo de triagem para classificação de prioridade de atendimento
- Gerenciamento de calendário de agendamentos

---

##  Configuração e Instalação

###  Pré-requisitos
- Java Development Kit (JDK) 21 instalado
- Servidor MySQL ativo localmente

---

###  Banco de Dados

A aplicação está configurada para gerenciar o schema automaticamente.

No arquivo `src/main/resources/application.properties`, configure suas credenciais locais:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/entrenos_db?createDatabaseIfNotExist=true
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update