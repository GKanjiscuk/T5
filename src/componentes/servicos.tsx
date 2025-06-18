import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useEffect } from "react";
import ModalGenerico from "./modalBase";
import TopServicosConsumo from "./servico/topServicosConsumo";
import { Servico } from "./types";
import ServicoFormAtualizacao from "./servico/servicoFormAtualizacao";
import ServicoFormExclusao from "./servico/servicoFormExclusao";

export default function Servicos() {
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalListagem, setMostrarModalListagem] = useState(false);
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [step, setStep] = useState(1);

  const azulPrincipal = "#003366";
  const azulEscuro = "#003366";
  const fundoClaro = "#f0f8ff";

  const [servicos, setServicos] = useState<
    { id: number; nome: string; preco: string; consumo: number }[]
  >([]);

  const [servico, setServico] = useState<Servico>({
    id: "",
    nome: "",
    preco: "",
    consumo: "",
  });

  const [idPesquisa, setIdPesquisa] = useState("");

  const [servicoParaAtualizar, setServicoParaAtualizar] =
    useState<Servico | null>(null);

  const [
    mostrarModalServicosMaisConsumidos,
    setMostrarModalServicosMaisConsumidos,
  ] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setServico((prevServico) => ({
      ...prevServico,
      [name]: value,
    }));
  };

  const handleIdPesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdPesquisa(e.target.value);
  };

  const atualizarServico = async () => {
    try {
      await fetch(
        `http://localhost:3001/servicos/${servico.id || idPesquisa}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome:
              servico.nome !== "" ? servico.nome : servicoParaAtualizar?.nome,
            preco:
              servico.preco !== ""
                ? parseFloat(servico.preco)
                : servicoParaAtualizar?.preco,
            consumo:
              servico.consumo !== ""
                ? parseInt(servico.consumo)
                : servicoParaAtualizar?.consumo ?? 0,
          }),
        }
      );

      alert("Serviço atualizado com sucesso!");
      carregarServicos();
      setMostrarModalAtualizar(false);
      setStep(1);
      setIdPesquisa("");
      setServico({ id: "", nome: "", preco: "", consumo: "" });
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
    }
  };

  const buscarServicoPorId = async () => {
    try {
      const resposta = await fetch(
        `http://localhost:3001/servicos/${idPesquisa}`
      );
      if (!resposta.ok) {
        alert("Serviço não encontrado.");
        return false;
      }

      const servicoEncontrado = await resposta.json();

      setServico({
        id: servicoEncontrado.id.toString(),
        nome: servicoEncontrado.nome,
        preco:
          servicoEncontrado.preco !== null
            ? servicoEncontrado.preco.toString()
            : "0.00",
        consumo: servicoEncontrado.consumo.toString(),
      });

      setServicoParaAtualizar(servicoEncontrado);
      setStep(2);
      return true;
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      return false;
    }
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleNextStep = async () => {
    if (step === 1) {
      const sucesso = await buscarServicoPorId();
      if (sucesso) {
        setStep(2);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const salvar = async () => {
    if (!servico.nome || !servico.preco) {
      alert("Por favor, preencha o nome e o preço.");
      return;
    }

    try {
      console.log("Dados enviados ao backend:", {
        nome: servico.nome,
        preco: parseFloat(servico.preco),
        consumo: parseInt(servico.consumo) || 0,
      });

      await fetch("http://localhost:3001/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: servico.nome,
          preco: parseFloat(servico.preco),
        }),
      });

      alert("Serviço cadastrado com sucesso!");
      setMostrarModalCadastro(false);
      setStep(1);
      setServico({ id: "", nome: "", preco: "", consumo: "" });
      carregarServicos(); 
    } catch (error) {
      console.error("Erro ao cadastrar serviço:", error);
    }
  };

  const carregarServicos = async () => {
    try {
      const resposta = await fetch("http://localhost:3001/servicos");
      const dados = await resposta.json();
      setServicos(dados);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const [idExclusao, setIdExclusao] = useState("");

  const excluirServico = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/servicos/${id}`, {
        method: "DELETE",
      });
      alert("Serviço excluído com sucesso!");
      carregarServicos();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  const [mostrarModalConsumoServicos, setMostrarModalConsumoServicos] =
    useState(false);

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
        <img src="/service.png" style={{ width: "70px" }} />
        <h1 style={{ fontSize: "300%", color: azulEscuro, fontWeight: "700" }}>
          Menu de Serviços
        </h1>
      </div>

      <hr className="line" style={{ borderColor: azulPrincipal }} />
      <h5 className="subtitle mt-5" style={{ color: azulEscuro }}>
        Nos blocos abaixo, você poderá gerenciar os dados dos seus serviços.
      </h5>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 estilo-card"
              
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Cadastrar Serviço
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Cadastrar novo serviço.
                </p>
                <div className="text-center mb-3">
                  <img
                    src="cadastro.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Serviço"
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
                    📝Cadastrar Serviço
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
              setServico({ id: "", nome: "", preco: "", consumo: "" });
            }}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Cadastro de Serviço</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              {step === 1 && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Serviço</Form.Label>
                    <Form.Control
                      name="nome"
                      value={servico.nome}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control
                      name="preco"
                      value={servico.preco}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              )}
              {step === 2 && (
                <>
                  <p style={{ color: azulEscuro, fontWeight: "600" }}>
                    Confirme os dados:
                  </p>
                  <ul style={{ color: azulEscuro, fontWeight: "600" }}>
                    <li>
                      <strong>Nome do Serviço:</strong> {servico.nome}
                    </li>
                    <li>
                      <strong>Preço:</strong> {servico.preco}
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
                  onClick={back}
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
                  onClick={next}
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
                  onClick={salvar}
                >
                  📝Cadastrar
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 estilo-card"
              
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Listar Serviços
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Listar todos os serviços cadastrados
                </p>
                <div className="text-center mb-3">
                  <img
                    src="listagem.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Serviço"
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
                    📋Listar Serviços
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
              <Modal.Title>Listagem de Serviços</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              {servicos.length === 0 ? (
                <p>Nenhum serviço cadastrado.</p>
              ) : (
                servicos.map((serv, index) => (
                  <div key={index}>
                    <p>
                      <strong>ID:</strong> {serv.id}
                    </p>
                    <p>
                      <strong>Nome do Serviço:</strong> {serv.nome}
                    </p>
                    <p>
                      <strong>Preço:</strong> {serv.preco}
                    </p>
                    <p>
                      <strong>Consumo:</strong> {serv.consumo} serviços
                    </p>
                    {index < servicos.length - 1 && <hr />}
                  </div>
                ))
              )}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: azulPrincipal }} />
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 estilo-card"
              
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Atualizar Serviço
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Alterar os dados de um serviço
                </p>
                <div className="text-center mb-3">
                  <img
                    src="update.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Serviço"
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
                    onClick={() => setMostrarModalAtualizar(true)}
                  >
                    ✏️Atualizar Serviço
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={mostrarModalAtualizar}
            onHide={() => {
              setMostrarModalAtualizar(false);
              setStep(1);
              setIdPesquisa("");
              setServico({ id: "", nome: "", preco: "", consumo: "" });
            }}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Atualização de Serviço</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              <ServicoFormAtualizacao
                step={step}
                idPesquisa={idPesquisa}
                handleIdPesquisaChange={handleIdPesquisaChange}
                servico={servico}
                handleChange={handleChange}
                servicoParaAtualizar={servicoParaAtualizar}
                azulEscuro={azulEscuro}
              />
            </Modal.Body>

            <Modal.Footer style={{ backgroundColor: azulPrincipal }}>
              {step > 1 && (
                <Button
                  style={{
                    backgroundColor: azulEscuro,
                    borderColor: azulEscuro,
                  }}
                  onClick={back}
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
                  onClick={handleNextStep}
                  disabled={step === 1 && idPesquisa.trim() === ""}
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
                  onClick={atualizarServico}
                >
                  Atualizar Serviço
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 estilo-card"
              
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Excluir Serviço
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Remova um serviço cadastrado
                </p>
                <div className="text-center mb-3">
                  <img
                    src="delete.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Serviço"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="danger"
                    className="mt-3 btn"
                    onClick={() => setMostrarModalExclusao(true)}
                  >
                    🗑️Excluir Serviço
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={mostrarModalExclusao}
            onHide={() => {
              setMostrarModalExclusao(false);
              setIdExclusao("");
            }}
            centered
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: azulPrincipal, color: fundoClaro }}
            >
              <Modal.Title>Excluir Serviço</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ backgroundColor: fundoClaro, color: azulEscuro }}
            >
              <ServicoFormExclusao
                idExclusao={idExclusao}
                handleIdExclusaoChange={(e) => setIdExclusao(e.target.value)}
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
                onClick={() => {
                  const idNum = parseInt(idExclusao);
                  if (isNaN(idNum)) {
                    alert("Por favor, insira um ID numérico válido.");
                    return;
                  }
                  excluirServico(idNum);
                  setIdExclusao("");
                  setMostrarModalExclusao(false);
                }}
              >
                Excluir Serviço
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="col-md-3 col-sm-12 mb-4">
            <div
              className="card shadow border-0 estilo-card"
              
            >
              <div className="card-body">
                <h5
                  className="card-title text-center titleCard"
                  style={{ color: azulEscuro }}
                >
                  Serviços Mais Consumidos
                </h5>
                <p
                  className="card-text text-center subtitleCard"
                  style={{ color: azulEscuro }}
                >
                  Veja os serviços que tiveram mais consumo
                </p>
                <div className="text-center mb-3">
                  <img
                    src="listagem.png"
                    style={{ width: "70%" }}
                    className="d-block mx-auto"
                    alt="Serviços Mais Consumidos"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="mb-3 btn"
                    style={{
                      backgroundColor: azulEscuro,
                      borderColor: azulEscuro,
                    }}
                    onClick={() => setMostrarModalServicosMaisConsumidos(true)}
                  >
                    📊 Ver Relatório
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ModalGenerico
            show={mostrarModalServicosMaisConsumidos}
            onHide={() => setMostrarModalServicosMaisConsumidos(false)}
            title="Serviços Mais Consumidos"
            azulEscuro={azulEscuro}
            fundoClaro={fundoClaro}
          >
            <TopServicosConsumo azulEscuro={azulEscuro} />
          </ModalGenerico>
        </div>
      </div>
    </div>
  );
}
