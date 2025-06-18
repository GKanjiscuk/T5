// app.js - Backend funcional completo com rotas para atender todos os requisitos
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Importe o pacote cors
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); // Use o middleware cors para permitir todas as origens

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fatec",
  database: "petlovers",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados");
});

// ------------------------ CRUD CLIENTES ------------------------
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM Cliente", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Listar todos os clientes com seus telefones e pets
app.get("/clientes/detalhes", (req, res) => {
  db.query(
    `
    SELECT 
      c.id,
      c.nome,
      c.nomeSocial,
      c.cpf_valor AS cpf,
      IFNULL(GROUP_CONCAT(DISTINCT CONCAT(t.ddd, ' ', t.numero) SEPARATOR ', '), '') AS telefone,
      IFNULL(GROUP_CONCAT(DISTINCT p.nome SEPARATOR ', '), '') AS pets
    FROM Cliente c
    LEFT JOIN Telefone t ON c.id = t.cliente_id
    LEFT JOIN Pet p ON c.id = p.cliente_id
    GROUP BY c.id, c.nome, c.nomeSocial, c.cpf_valor
  `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/clientes", (req, res) => {
  const { nome, nomeSocial, cpf_valor, cpf_dataEmissao, dataCadastro } =
    req.body;
  db.query(
    "INSERT INTO Cliente (nome, nomeSocial, cpf_valor, cpf_dataEmissao, dataCadastro) VALUES (?, ?, ?, ?, ?)",
    [nome, nomeSocial, cpf_valor, cpf_dataEmissao, dataCadastro],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

app.put("/clientes/:id", (req, res) => {
  const { nome, nomeSocial } = req.body;
  db.query(
    "UPDATE Cliente SET nome = ?, nomeSocial = ? WHERE id = ?",
    [nome, nomeSocial, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(200);
    }
  );
});

app.delete("/clientes/:id", (req, res) => {
  db.query("DELETE FROM Cliente WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
});

app.get("/clientes/cpf/:cpf", (req, res) => {
  const cpf = req.params.cpf;

  const clienteQuery = `
    SELECT id, nome, nomeSocial, cpf_valor AS cpf
    FROM Cliente
    WHERE cpf_valor = ?
  `;

  db.query(clienteQuery, [cpf], (err, clienteResults) => {
    if (err) return res.status(500).json(err);
    if (clienteResults.length === 0)
      return res.status(404).json({ erro: "Cliente não encontrado" });

    const cliente = clienteResults[0];

    const telefoneQuery = `
      SELECT CONCAT(ddd, ' ', numero) AS telefone
      FROM Telefone
      WHERE cliente_id = ?
    `;

    db.query(telefoneQuery, [cliente.id], (err, telefoneResults) => {
      if (err) return res.status(500).json(err);

      const telefones = telefoneResults.map(t => t.telefone).join(", ");

      const petQuery = `
        SELECT nome FROM Pet
        WHERE cliente_id = ?
      `;

      db.query(petQuery, [cliente.id], (err, petResults) => {
        if (err) return res.status(500).json(err);

        const pets = petResults.map(p => p.nome).join(", ");

        // Resposta final com todos os dados consolidados:
        res.json({
          id: cliente.id,
          nome: cliente.nome,
          nomeSocial: cliente.nomeSocial,
          cpf: cliente.cpf,
          telefone: telefones,
          pets: pets,
        });
      });
    });
  });
});

app.put("/telefones/:clienteId", (req, res) => {
  const { ddd, numero } = req.body;
  const clienteId = req.params.clienteId;

  db.query(
    "UPDATE Telefone SET ddd = ?, numero = ? WHERE cliente_id = ?",
    [ddd, numero, clienteId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Telefone não encontrado para o cliente." });
      }

      res.json({ message: "Telefone atualizado com sucesso" });
    }
  );
});





// ------------------------ CRUD PETS ------------------------
app.get("/clientes/:id/pets", (req, res) => {
  db.query(
    "SELECT * FROM Pet WHERE cliente_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/clientes/:id/pets", (req, res) => {
  const { nome, tipo, raca, genero } = req.body;
  db.query(
    "INSERT INTO Pet (cliente_id, nome, tipo, raca, genero) VALUES (?, ?, ?, ?, ?)",
    [req.params.id, nome, tipo, raca, genero],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// ------------------------ PETS ------------------------

app.get("/pets", (req, res) => {
  db.query(
    `
    SELECT p.id, p.nome, p.raca, p.tipo AS especie, p.genero, c.cpf_valor AS cpfDono
    FROM Pet p JOIN Cliente c ON p.cliente_id = c.id
  `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/pets", (req, res) => {
  const { nome, genero, raca, especie, cpfDono } = req.body;

  if (!nome || !genero || !raca || !especie || !cpfDono) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos." });
  }

  // Buscar o ID do cliente com base no CPF
  db.query(
    "SELECT id FROM Cliente WHERE cpf_valor = ?",
    [cpfDono],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Erro ao buscar cliente", details: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Cliente não encontrado" });

      const clienteId = results[0].id;

      // Inserir o pet
      db.query(
        "INSERT INTO Pet (nome, genero, raca, tipo, cliente_id) VALUES (?, ?, ?, ?, ?)",
        [nome, genero, raca, especie, clienteId],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar pet", details: err });

          res.status(201).json({
            message: "Pet cadastrado com sucesso",
            petId: result.insertId,
          });
        }
      );
    }
  );
});

app.put("/pets/:id", (req, res) => {
  const { nome, genero, raca, tipo } = req.body;
  db.query(
    "UPDATE Pet SET nome = ?, genero = ?, raca = ?, tipo = ? WHERE id = ?",
    [nome, genero, raca, tipo, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(200);
    }
  );
});

app.delete("/pets/:id", (req, res) => {
  db.query("DELETE FROM Pet WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
});

// ------------------------ CRUD PRODUTOS E SERVIÇOS ------------------------
app.get("/produtos", (req, res) => {
  db.query("SELECT * FROM Produto", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/produtos", (req, res) => {
  const { nome, preco, estoque } = req.body;

  db.query(
    "INSERT INTO Produto (nome, preco, estoque) VALUES (?, ?, ?)",
    [nome, preco, estoque],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir produto:", err);
        return res.status(500).json(err);
      }
      res.json({ id: result.insertId });
    }
  );
});

app.get("/servicos", (req, res) => {
  db.query("SELECT * FROM Servico", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/servicos", (req, res) => {
  const { nome, preco } = req.body;

  db.query(
    "INSERT INTO Servico (nome, preco) VALUES (?, ?)",
    [nome, preco],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ status: "Serviço cadastrado com sucesso." });
    }
  );
});

app.get("/servicos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Servico WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ error: "Serviço não encontrado" });
    res.json(results[0]);
  });
});

app.put("/servicos/:id", (req, res) => {
  const { nome, preco, consumo } = req.body;
  const { id } = req.params;

  if (nome === undefined || preco === undefined || consumo === undefined) {
    return res
      .status(400)
      .json({ erro: "Dados incompletos para atualização." });
  }

  db.query(
    "UPDATE Servico SET nome = ?, preco = ?, consumo = ? WHERE id = ?",
    [nome, preco, consumo, id],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar serviço:", err);
        return res.status(500).json(err);
      }
      res.json({ status: "Serviço atualizado com sucesso." });
    }
  );
});

app.delete("/servicos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Servico WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Serviço não encontrado." });
    }

    res.json({ message: "Serviço excluído com sucesso." });
  });
});

// ------------------------ REGISTRO DE CONSUMO ------------------------
app.post("/consumo/produto", (req, res) => {
  const { cliente_id, produto_id, quantidade, data_consumo } = req.body;
  db.query(
    "INSERT INTO ProdutoConsumido (cliente_id, produto_id, quantidade, data_consumo) VALUES (?, ?, ?, ?)",
    [cliente_id, produto_id, quantidade, data_consumo],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

app.post("/consumo/servico", (req, res) => {
  const { cliente_id, servico_id, quantidade, data_consumo } = req.body;
  db.query(
    "INSERT INTO ServicoConsumido (cliente_id, servico_id, quantidade, data_consumo) VALUES (?, ?, ?, ?)",
    [cliente_id, servico_id, quantidade, data_consumo],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// ------------------------ CRUD COMPLETO DE PRODUTOS ------------------------

// Buscar um produto por ID
app.get("/produtos/:id", (req, res) => {
  db.query(
    "SELECT * FROM Produto WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ error: "Produto não encontrado" });
      res.json(results[0]);
    }
  );
});

// Atualizar um produto
app.put("/produtos/:id", (req, res) => {
  const { nome, preco, estoque } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE Produto SET nome = ?, preco = ?, estoque = ? WHERE id = ?",
    [nome, preco, estoque, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ status: "Produto atualizado com sucesso." });
    }
  );
});

// Excluir um produto
app.delete("/produtos/:id", (req, res) => {
  db.query(
    "DELETE FROM Produto WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Produto não encontrado" });
      res.json({ message: "Produto excluído com sucesso" });
    }
  );
});

// ------------------------ CRUD DE PRODUTOS CONSUMIDOS ------------------------

// Listar todos os consumos de produtos
app.get("/consumo/produto", (req, res) => {
  db.query(
    `
    SELECT pc.id, c.nome AS cliente, p.nome AS produto, pc.quantidade, pc.data_consumo
    FROM ProdutoConsumido pc
    JOIN Cliente c ON pc.cliente_id = c.id
    JOIN Produto p ON pc.produto_id = p.id
    ORDER BY pc.data_consumo DESC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// Buscar consumo de produto por ID
app.get("/consumo/produto/:id", (req, res) => {
  db.query(
    `
    SELECT pc.id, c.nome AS cliente, p.nome AS produto, pc.quantidade, pc.data_consumo
    FROM ProdutoConsumido pc
    JOIN Cliente c ON pc.cliente_id = c.id
    JOIN Produto p ON pc.produto_id = p.id
    WHERE pc.id = ?
    `,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: "Registro de consumo não encontrado" });
      res.json(results[0]);
    }
  );
});

// Atualizar um registro de consumo de produto
app.put("/consumo/produto/:id", (req, res) => {
  const { cliente_id, produto_id, quantidade, data_consumo } = req.body;
  db.query(
    `
    UPDATE ProdutoConsumido
    SET cliente_id = ?, produto_id = ?, quantidade = ?, data_consumo = ?
    WHERE id = ?
    `,
    [cliente_id, produto_id, quantidade, data_consumo, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ error: "Registro de consumo não encontrado" });
      res.json({ message: "Registro de consumo atualizado com sucesso" });
    }
  );
});

// Deletar um registro de consumo de produto
app.delete("/consumo/produto/:id", (req, res) => {
  db.query(
    "DELETE FROM ProdutoConsumido WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ error: "Registro de consumo não encontrado" });
      res.json({ message: "Registro de consumo excluído com sucesso" });
    }
  );
});

// ------------------------ RELATÓRIOS ------------------------

// 1. Top 10 clientes por quantidade consumida
app.get("/relatorio/top-clientes-quantidade", (req, res) => {
  db.query(
    `
        SELECT c.id, c.nome, SUM(IFNULL(pc.quantidade,0) + IFNULL(sc.quantidade,0)) AS total
        FROM Cliente c
        LEFT JOIN ProdutoConsumido pc ON c.id = pc.cliente_id
        LEFT JOIN ServicoConsumido sc ON c.id = sc.cliente_id
        GROUP BY c.id
        ORDER BY total DESC
        LIMIT 10
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// 2. Produtos mais consumidos
app.get("/relatorio/produtos-mais-consumidos", (req, res) => {
  db.query(
    `
        SELECT p.nome, SUM(pc.quantidade) AS total
        FROM Produto p
        JOIN ProdutoConsumido pc ON p.id = pc.produto_id
        GROUP BY p.id
        ORDER BY total DESC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// 3. Serviços mais consumidos
app.get("/relatorio/servicos-mais-consumidos", (req, res) => {
  db.query(
    `
        SELECT s.nome, IFNULL(SUM(sc.quantidade), 0) AS total
        FROM Servico s
        LEFT JOIN ServicoConsumido sc ON s.id = sc.servico_id
        GROUP BY s.id
        ORDER BY total DESC;

    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// 4. Consumo por tipo e raça de pet
app.get("/relatorio/consumo-por-pet", (req, res) => {
  db.query(
    `
        SELECT pet.tipo, pet.raca, SUM(IFNULL(pc.quantidade,0) + IFNULL(sc.quantidade,0)) AS total
        FROM Pet pet
        JOIN Cliente c ON pet.cliente_id = c.id
        LEFT JOIN ProdutoConsumido pc ON c.id = pc.cliente_id
        LEFT JOIN ServicoConsumido sc ON c.id = sc.cliente_id
        GROUP BY pet.tipo, pet.raca
        ORDER BY total DESC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/consumo-produto", (req, res) => {
  const { cliente_id, produto_id, quantidade } = req.body;

  const data_consumo = new Date().toISOString().split('T')[0]; // Data atual no formato 'YYYY-MM-DD'

  db.query(
    "INSERT INTO ProdutoConsumido (cliente_id, produto_id, quantidade, data_consumo) VALUES (?, ?, ?, ?)",
    [cliente_id, produto_id, quantidade, data_consumo],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Consumo de produto registrado com sucesso" });
    }
  );
});


app.post("/consumo-servico", (req, res) => {
  const { cliente_id, servico_id, quantidade } = req.body;

  const data_consumo = new Date().toISOString().split('T')[0]; // Data atual no formato 'YYYY-MM-DD'

  db.query(
    "INSERT INTO ServicoConsumido (cliente_id, servico_id, quantidade, data_consumo) VALUES (?, ?, ?, ?)",
    [cliente_id, servico_id, quantidade, data_consumo],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Consumo de serviço registrado com sucesso" });
    }
  );
});


app.get("/relatorio/consumo-detalhado/:clienteId", (req, res) => {
  const clienteId = req.params.clienteId;

  const query = `
    SELECT p.nome AS item, pc.quantidade, 'Produto' AS tipo
    FROM ProdutoConsumido pc
    JOIN Produto p ON pc.produto_id = p.id
    WHERE pc.cliente_id = ?

    UNION ALL

    SELECT s.nome AS item, sc.quantidade, 'Serviço' AS tipo
    FROM ServicoConsumido sc
    JOIN Servico s ON sc.servico_id = s.id
    WHERE sc.cliente_id = ?
  `;

  db.query(query, [clienteId, clienteId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/relatorio/itens-mais-consumidos", (req, res) => {
  const query = `
    SELECT 'Produto' AS tipo, p.nome AS item, SUM(pc.quantidade) AS total
    FROM ProdutoConsumido pc
    JOIN Produto p ON pc.produto_id = p.id
    GROUP BY p.id

    UNION ALL

    SELECT 'Serviço' AS tipo, s.nome AS item, SUM(sc.quantidade) AS total
    FROM ServicoConsumido sc
    JOIN Servico s ON sc.servico_id = s.id
    GROUP BY s.id

    ORDER BY total DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/relatorio/consumo-por-tipo-raca", (req, res) => {
  const query = `
    SELECT pet.tipo, pet.raca, p.nome AS produto, SUM(pc.quantidade) AS total
    FROM ProdutoConsumido pc
    JOIN Produto p ON pc.produto_id = p.id
    JOIN Cliente c ON pc.cliente_id = c.id
    JOIN Pet pet ON c.id = pet.cliente_id
    GROUP BY pet.tipo, pet.raca, p.nome

    UNION ALL

    SELECT pet.tipo, pet.raca, s.nome AS servico, SUM(sc.quantidade) AS total
    FROM ServicoConsumido sc
    JOIN Servico s ON sc.servico_id = s.id
    JOIN Cliente c ON sc.cliente_id = c.id
    JOIN Pet pet ON c.id = pet.cliente_id
    GROUP BY pet.tipo, pet.raca, s.nome

    ORDER BY total DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/relatorio/top-clientes-valor", (req, res) => {
  const query = `
    SELECT c.id, c.nome, 
      SUM(IFNULL(pc.quantidade * p.preco,0) + IFNULL(sc.quantidade * s.preco,0)) AS total_gasto
    FROM Cliente c
    LEFT JOIN ProdutoConsumido pc ON c.id = pc.cliente_id
    LEFT JOIN Produto p ON pc.produto_id = p.id
    LEFT JOIN ServicoConsumido sc ON c.id = sc.cliente_id
    LEFT JOIN Servico s ON sc.servico_id = s.id
    GROUP BY c.id
    ORDER BY total_gasto DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
