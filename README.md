
# 🐾 PetLovers 5 - Full CRUD and Reporting System

Este projeto é a entrega da **Atividade Avaliativa 5 - PetLovers 5**, com integração completa entre **Frontend (React + TypeScript)** e **Backend (Node.js + Express + MySQL)**.

## 📌 Objetivo da Atividade

Implementar um sistema completo de gestão para um pet shop, incluindo:

- CRUD completo de **Clientes**, **Pets**, **Produtos** e **Serviços**
- Registro de consumo (produtos/serviços)
- Relatórios avançados de consumo por cliente, por tipo de pet, e por valor total gasto.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Bootstrap
- **Backend:** Node.js + Express + MySQL
- **Banco de Dados:** MySQL
- **Ferramenta de Modelagem/Consulta:** MySQL Workbench

## ✅ Funcionalidades Implementadas

- **CRUD completo:**
  - Clientes (com telefones e pets)
  - Pets (com vínculo ao cliente)
  - Produtos
  - Serviços
- **Registro de Consumo:**  
  Clientes podem consumir produtos e serviços com quantidade e data.
- **Relatórios exigidos:**
  - Top 10 clientes por quantidade
  - Itens mais consumidos (produtos/serviços)
  - Consumo por tipo e raça de pets
  - Top 5 clientes por valor gasto

## ⚙️ Como rodar o projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/petlovers5.git
```

### 2. Instale as dependências do Frontend:

```bash
cd frontend
npm install
```

### 3. Instale as dependências do Backend:

```bash
cd backend
npm install
```

### 4. Configure o MySQL:

- Crie um banco chamado `petlovers`.
- Importe o dump SQL do projeto (caso tenha o arquivo `.sql`).

### 5. Rode o Backend:

```bash
node app.js
```

### 6. Rode o Frontend:

```bash
npm start
```

### 7. Acesse:

[http://localhost:3000](http://localhost:3000)

## 📡 Principais Rotas Backend (API REST)

### 📂 Clientes:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/clientes` | Lista todos os clientes |
| GET | `/clientes/detalhes` | Lista clientes com telefones e pets |
| POST | `/clientes` | Cadastrar cliente |
| PUT | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Deletar cliente |
| GET | `/clientes/cpf/:cpf` | Buscar cliente por CPF |

### 📂 Pets:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/clientes/:id/pets` | Listar pets de um cliente |
| POST | `/clientes/:id/pets` | Cadastrar pet para cliente |
| GET | `/pets` | Listar todos os pets |
| POST | `/pets` | Cadastrar pet usando CPF do dono |
| PUT | `/pets/:id` | Atualizar pet |
| DELETE | `/pets/:id` | Deletar pet |

### 📂 Produtos:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/produtos` | Listar produtos |
| POST | `/produtos` | Cadastrar produto |
| GET | `/produtos/:id` | Buscar produto por ID |
| PUT | `/produtos/:id` | Atualizar produto |
| DELETE | `/produtos/:id` | Deletar produto |

### 📂 Serviços:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/servicos` | Listar serviços |
| POST | `/servicos` | Cadastrar serviço |
| GET | `/servicos/:id` | Buscar serviço |
| PUT | `/servicos/:id` | Atualizar serviço |
| DELETE | `/servicos/:id` | Deletar serviço |

### 📥 Registro de Consumo:

| Método | Rota | Finalidade |
|---|---|---|
| POST | `/consumo-produto` | Registrar consumo de produto |
| POST | `/consumo-servico` | Registrar consumo de serviço |

### 📈 Relatórios:

| Rota | Descrição |
|---|---|
| GET | `/relatorio/top-clientes-quantidade` | Top 10 clientes que mais consumiram (quantidade) |
| GET | `/relatorio/itens-mais-consumidos` | Lista geral de produtos/serviços mais consumidos |
| GET | `/relatorio/consumo-por-tipo-raca` | Produtos/serviços mais consumidos por tipo e raça de pet |
| GET | `/relatorio/top-clientes-valor` | Top 5 clientes que mais gastaram (em valor) |

## 📌 Observações

- Backend roda por padrão na porta **3001**
- Frontend na **3000**
- Banco MySQL na porta padrão **3306**
- Para o Backend funcionar: precisa ter Node.js, NPM e MySQL instalados localmente.
