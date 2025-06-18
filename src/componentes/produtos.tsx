import React, { useState, ChangeEvent } from "react";
import { Modal, Button } from "react-bootstrap";
import { Produto } from "./types";
import { useEffect } from "react";
import ModalGenerico from "./modalBase";
import { Form } from "react-bootstrap";
import ProdutoFormCadastro from "../componentes/produto/produtoFormCadastro";
import ProdutoListagemConteudo from "../componentes/produto/produtoListagemConteudo";
import ProdutoFormAtualizacao from "../componentes/produto/produtoFormAtualizacao";
import ProdutoFormExclusao from "../componentes/produto/produtoFormExclusao";

export default function Produtos() {
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalListagem, setMostrarModalListagem] = useState(false);
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [step, setStep] = useState(1);

  const azulPrincipal = "#003366";
  const azulEscuro = "#003366";
  const fundoClaro = "#f0f8ff";

  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch("http://localhost:3001/produtos");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const [produto, setProduto] = useState<Produto>({
    id: "",
    nome: "",
    preco: "",
    estoque: 0,
    consumo: 0,
  });

  const [idPesquisa, setIdPesquisa] = useState("");
  const [idExclusao, setIdExclusao] = useState("");
  const [produtoParaAtualizar, setProdutoParaAtualizar] =
    useState<Produto | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "estoque" || name === "consumo") {
      setProduto((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value) || 0,
      }));
    } else {
      setProduto((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleIdPesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdPesquisa(e.target.value);
  };

  const handleIdExclusaoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdExclusao(e.target.value);
  };

  const buscarProdutoPorId = async () => {
    console.log("Iniciando busca do produto...");

    try {
      const resposta = await fetch(
        `http://localhost:3001/produtos/${idPesquisa}`
      );
      console.log("Resposta status:", resposta.status);

      if (!resposta.ok) {
        alert("Produto não encontrado.");
        return false; // <- Sinaliza erro para o nextStep
      }

      const produtoEncontrado = await resposta.json();
      console.log("Produto encontrado:", produtoEncontrado);

      setProduto({
        id: produtoEncontrado.id,
        nome: produtoEncontrado.nome,
        preco:
          produtoEncontrado.preco !== null
            ? produtoEncontrado.preco.toString()
            : "0.00",
        estoque: produtoEncontrado.estoque,
        consumo: 0,
      });

      return true; // <- Sucesso
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return false;
    }
  };

  const nextStep = async () => {
    console.log("Clicou em Próximo - Step atual:", step);
    console.log("ID digitado:", idPesquisa);

    if (mostrarModalAtualizar && step === 1) {
      console.log("Chamando buscarProdutoPorId...");
      const sucesso = await buscarProdutoPorId();
      if (sucesso) {
        setStep(2); // <- Só avança se o produto existir
      }
      return;
    }

    // Validação no cadastro
    if (mostrarModalCadastro && step === 1) {
      if (!produto.nome || !produto.preco || produto.estoque === 0) {
        alert("Por favor, preencha nome, preço e estoque para o produto.");
        return;
      }
      if (isNaN(parseFloat(produto.preco))) {
        alert("Por favor, insira um preço válido.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const backStep = () => setStep((prev) => prev - 1);

  const resetProdutoForm = () => {
    setProduto({
      id: "",
      nome: "",
      preco: "",
      estoque: 0,
      consumo: 0,
    });
  };

  const salvarProduto = async () => {
    if (!produto.nome || !produto.preco || isNaN(parseFloat(produto.preco))) {
      alert("Por favor, preencha nome e preço válidos.");
      return;
    }

    try {
      await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: produto.nome,
          preco: parseFloat(produto.preco),
          estoque: produto.estoque,
        }),
      });

      alert("Produto cadastrado com sucesso!");
      carregarProdutos();
      setMostrarModalCadastro(false);
      resetProdutoForm();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  const atualizarProduto = async () => {
    if (!produto.preco || isNaN(parseFloat(produto.preco))) {
      alert("Preço inválido. Por favor, preencha um preço numérico.");
      return;
    }

    try {
      await fetch(`http://localhost:3001/produtos/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: produto.nome,
          preco: parseFloat(produto.preco), // ✅ Garantindo que vai número
          estoque: produto.estoque,
        }),
      });

      alert("Produto atualizado com sucesso!");
      carregarProdutos();
      setMostrarModalAtualizar(false);
      resetProdutoForm();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const excluirProduto = async () => {
    try {
      await fetch(`http://localhost:3001/produtos/${idExclusao}`, {
        method: "DELETE",
      });

      alert("Produto excluído com sucesso!");
      carregarProdutos();
      setIdExclusao("");
      setMostrarModalExclusao(false);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: fundoClaro,
        minHeight: "82vh",
        paddingBottom: "3rem",
      }}
    >
      <div className="d-flex align-items-center justify-content-center gap-3 title pt-5">
        <img
          src="/product.png"
          style={{ width: "70px" }}
          alt="Ícone de Produto"
        />
        <h1 style={{ fontSize: "300%", color: azulEscuro, fontWeight: "700" }}>
          Menu de Produtos
        </h1>
      </div>

      <hr className="line" style={{ borderColor: azulPrincipal }} />
      <h5 className="subtitle mt-5" style={{ color: azulEscuro }}>
        Nos blocos abaixo, você poderá gerenciar os dados dos seus produtos.
      </h5>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 card-estilo"
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Cadastrar Produto
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Cadastrar novo produto.
                </p>
                <div className="text-center mb-3">
                  <img
                    src="cadastro.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Cadastro"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="mt-3 btn text-white"
                    style={{
                      backgroundColor: azulPrincipal,
                      borderColor: azulPrincipal,
                    }}
                    onClick={() => setMostrarModalCadastro(true)}
                  >
                    📝Cadastrar Produto
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={mostrarModalCadastro}
            onHide={() => {
              setMostrarModalCadastro(false);
              setStep(1);
              resetProdutoForm();
            }}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Cadastro de Produto</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              {step === 1 && (
                <ProdutoFormCadastro
                  produto={produto}
                  handleChange={handleChange}
                />
              )}
              {step === 2 && (
                <>
                  <p style={{ color: azulEscuro, fontWeight: "600" }}>
                    Confirme os dados:
                  </p>
                  <ul style={{ color: azulEscuro, fontWeight: "600" }}>
                    <li>
                      <strong>Nome do Produto:</strong> {produto.nome}
                    </li>
                    <li>
                      <strong>Preço:</strong> R${" "}
                      {parseFloat(produto.preco).toFixed(2)}
                    </li>
                    <li>
                      <strong>Estoque:</strong> {produto.estoque} unidades
                    </li>
                    <li>
                      <strong>Consumo:</strong> {produto.consumo} unidades
                    </li>
                  </ul>
                </>
              )}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: azulPrincipal }}>
              {step > 1 && (
                <Button
                  style={{
                    backgroundColor: azulEscuro,
                    borderColor: azulEscuro,
                  }}
                  onClick={backStep}
                >
                  ⬅Voltar
                </Button>
              )}
              {step < 2 && (
                <Button
                  style={{
                    backgroundColor: azulEscuro,
                    borderColor: azulEscuro,
                  }}
                  onClick={nextStep}
                >
                  Próximo➡️
                </Button>
              )}
              {step === 2 && (
                <Button
                  style={{
                    backgroundColor: azulEscuro,
                    borderColor: azulEscuro,
                  }}
                  onClick={salvarProduto}
                >
                  📝Cadastrar
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 card-estilo"
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Listar Produtos
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Listar todos os produtos cadastrados
                </p>
                <div className="text-center mb-3">
                  <img
                    src="listagem.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Listagem"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="mt-3 btn text-white"
                    style={{
                      backgroundColor: azulPrincipal,
                      borderColor: azulPrincipal,
                    }}
                    onClick={() => setMostrarModalListagem(true)}
                  >
                    📋Listar Produtos
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={mostrarModalListagem}
            onHide={() => setMostrarModalListagem(false)}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Listagem de Produtos</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              <ProdutoListagemConteudo
                produtos={produtos}
                azulEscuro={azulEscuro}
              />
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: azulPrincipal }} />
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 card-estilo"
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Atualizar Produto
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Alterar os dados de um produto
                </p>
                <div className="text-center mb-3">
                  <img
                    src="update.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Atualização"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="mt-3 btn text-white"
                    style={{
                      backgroundColor: azulPrincipal,
                      borderColor: azulPrincipal,
                    }}
                    onClick={() => {
                      setMostrarModalAtualizar(true);
                      setStep(1);
                      resetProdutoForm();
                      setIdPesquisa("");
                      setProdutoParaAtualizar(null);
                    }}
                  >
                    ✏️Atualizar Produto
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ModalGenerico
            show={mostrarModalAtualizar}
            onHide={() => {
              setMostrarModalAtualizar(false);
              setStep(1);
              setIdPesquisa("");
              resetProdutoForm();
              setProdutoParaAtualizar(null);
            }}
            title={
              step === 1
                ? "Informe o ID do Produto para Atualização"
                : `Atualização de Produto - ID: ${produto.id}`
            }
            azulEscuro={azulEscuro}
            fundoClaro={fundoClaro}
            size="lg"
            footerButtons={[
              ...(step > 1
                ? [
                    {
                      text: "⬅ Voltar",
                      onClick: backStep,
                      style: {
                        backgroundColor: azulEscuro,
                        borderColor: azulEscuro,
                      },
                    },
                  ]
                : []),
              ...(step === 1
                ? [
                    {
                      text: "Próximo ➡️",
                      onClick: nextStep,
                      style: {
                        backgroundColor: azulEscuro,
                        borderColor: azulEscuro,
                      },
                      disabled: !idPesquisa,
                    },
                  ]
                : []),
              ...(step === 2
                ? [
                    {
                      text: "Atualizar Produto",
                      onClick: atualizarProduto,
                      style: {
                        backgroundColor: azulEscuro,
                        borderColor: azulEscuro,
                      },
                    },
                  ]
                : []),
            ]}
          >
            {step === 1 ? (
              <Form.Group className="mb-3">
                <Form.Label style={{ color: azulEscuro }}>
                  ID do Produto
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o ID do produto"
                  value={idPesquisa}
                  onChange={handleIdPesquisaChange}
                />
              </Form.Group>
            ) : (
              <ProdutoFormAtualizacao
                produto={produto}
                handleChange={handleChange}
                azulEscuro={azulEscuro}
              />
            )}
          </ModalGenerico>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 card-estilo"
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Excluir Produto
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Remova um produto cadastrado
                </p>
                <div className="text-center mb-3">
                  <img
                    src="delete.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Exclusão"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="danger"
                    className="mt-3 btn"
                    onClick={() => setMostrarModalExclusao(true)}
                  >
                    🗑️Excluir Produto
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={mostrarModalExclusao}
            onHide={() => setMostrarModalExclusao(false)}
            centered
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Excluir Produto</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              <ProdutoFormExclusao
                idExclusao={idExclusao}
                handleIdExclusaoChange={handleIdExclusaoChange}
                azulEscuro={azulEscuro}
              />
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: azulPrincipal }}>
              <Button
                style={{ backgroundColor: azulEscuro, borderColor: azulEscuro }}
                onClick={() => setMostrarModalExclusao(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={excluirProduto}
                disabled={!idExclusao}
              >
                Excluir Produto
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
