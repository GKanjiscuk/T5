import {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ModalGenerico from "./modalBase";

import { Pet, Cliente } from "./types";

import PetFormCadastro from "./pet/petFormCadastro";
import PetListagemConteudo from "./pet/petListagemConteudo";
import PetFormAtualizacao from "./pet/petFormAtualizacao";
import PetFormExclusao from "./pet/petFormExclusao";

const AZUL_PRINCIPAL = "#003366";
const AZUL_ESCURO = "#003366";
const FUNDO_CLARO = "#f0f8ff";

export default function Pets() {
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [mostrarModalListagem, setMostrarModalListagem] = useState(false);

  const [step, setStep] = useState(1);

  const [idPet, setIdPet] = useState("");

  const [petEmEdicao, setPetEmEdicao] = useState<Pet>({
    id: "",
    nome: "",
    genero: "",
    raca: "",
    especie: "",
    cpfDono: "",
  });

  const [cpfPesquisa, setCpfPesquisa] = useState("");

  const [pets, setPets] = useState<Pet[]>([]);

  const [consumoPorTipoRaca, setConsumoPorTipoRaca] = useState<any[]>([]);
  const [mostrarModalConsumoTipoRaca, setMostrarModalConsumoTipoRaca] =
    useState(false);

  const carregarConsumoPorTipoRaca = async () => {
    try {
      const resposta = await fetch(
        "http://localhost:3001/relatorio/consumo-por-tipo-raca"
      );
      const dados = await resposta.json();
      setConsumoPorTipoRaca(dados);
      setMostrarModalConsumoTipoRaca(true);
    } catch (error) {
      console.error("Erro ao carregar consumo por tipo e raça:", error);
      alert("Erro ao carregar o relatório.");
    }
  };

  useEffect(() => {
    carregarPets();
  }, []);

  const carregarPets = async () => {
    try {
      const res = await fetch("http://localhost:3001/pets");
      const data = await res.json();
      setPets(data);
    } catch {
      alert("Erro ao carregar pets.");
    }
  };

  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/clientes/detalhes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  }, []);

  const nextStep = () => {
    if (mostrarModalCadastro && step === 1) {
      setPetEmEdicao((prevPet: Pet) => ({ ...prevPet, cpfDono: cpfPesquisa }));
    }
    setStep((prev) => prev + 1);
  };
  const backStep = () => setStep((prev) => prev - 1);

  const handlePetChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setPetEmEdicao({ ...petEmEdicao, [e.target.name]: e.target.value });
  };

  const handleCpfPesquisaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCpfPesquisa(e.target.value);
  };

  const handleIdPetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdPet(e.target.value);
  };

  const fecharModal = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter(false);
    resetarEstadoModal();
  };

  const resetarEstadoModal = () => {
    setStep(1);
    setIdPet("");
    setCpfPesquisa("");
    setPetEmEdicao({
      id: "",
      nome: "",
      genero: "",
      raca: "",
      especie: "",
      cpfDono: "",
    });
  };

  const salvarPet = async () => {
    if (
      !petEmEdicao.nome ||
      !petEmEdicao.genero ||
      !petEmEdicao.raca ||
      !petEmEdicao.especie ||
      !petEmEdicao.cpfDono
    ) {
      alert(
        "Por favor, preencha todos os campos do pet e selecione o CPF do dono."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petEmEdicao), // sem campo `id`
      });

      if (!res.ok) throw new Error("Erro ao salvar pet.");

      alert("Pet cadastrado com sucesso!");
      await carregarPets(); // atualiza a lista com os dados do banco (incluindo o novo ID)
      fecharModal(setMostrarModalCadastro);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const atualizarPet = async () => {
    if (!idPet) {
      alert("Informe o ID do pet.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/pets/${idPet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: petEmEdicao.nome,
          genero: petEmEdicao.genero,
          raca: petEmEdicao.raca,
          tipo: petEmEdicao.especie,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar pet.");
      alert("Pet atualizado com sucesso!");
      fecharModal(setMostrarModalAtualizar);
      await carregarPets();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const excluirPet = async () => {
    try {
      const res = await fetch(`http://localhost:3001/pets/${idPet}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir pet.");
      alert("Pet excluído com sucesso!");
      fecharModal(setMostrarModalExclusao);
      await carregarPets();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const cardData = [
    {
      title: "Cadastrar Pet",
      text: "Preencha os dados de um novo pet para cadastra-lo no sistema",
      image: "cadastro.png",
      buttonText: "📝 Cadastrar Pet",
      buttonColor: AZUL_ESCURO,
      onClick: () => {
        setMostrarModalCadastro(true);
        resetarEstadoModal();
      },
    },
    {
      title: "Listar Pets",
      text: "Veja todos os pets cadastrados no sistema",
      image: "listagem.png",
      buttonText: "🔍 Listar Pets",
      buttonColor: AZUL_ESCURO,
      onClick: () => {
        setMostrarModalListagem(true);
        resetarEstadoModal();
      },
    },
    {
      title: "Atualizar Pet",
      text: "Atualize os dados de um pet ja existente no sistema",
      image: "update.png",
      buttonText: "✏ Atualizar Pet",
      buttonColor: AZUL_ESCURO,
      onClick: () => {
        setMostrarModalAtualizar(true);
        resetarEstadoModal();
      },
    },
    {
      title: "Consumo Pets",
      text: "Veja os serviços e produtos mais consumidos por tipo e raça de pets.",
      image: "listagem.png",
      buttonText: "📊 Consumo por Tipo/Raça",
      buttonColor: AZUL_ESCURO,
      onClick: carregarConsumoPorTipoRaca,
    },

    {
      title: "Excluir Pet",
      text: "Remova um pet já cadastrado no sistema",
      image: "delete.png",
      buttonText: "🗑 Excluir Pet",
      buttonColor: "red",
      onClick: () => {
        setMostrarModalExclusao(true);
        resetarEstadoModal();
      },
    },
  ];

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: FUNDO_CLARO,
        minHeight: "82vh",
        paddingBottom: "3rem",
      }}
    >
      <div className="d-flex align-items-center justify-content-center gap-3 title pt-5">
        <img src="/pets.png" style={{ width: "70px" }} alt="Ícone de Pets" />
        <h1 style={{ fontSize: "300%", color: AZUL_ESCURO, fontWeight: "700" }}>
          Menu - Pets
        </h1>
      </div>
      <hr className="line" style={{ borderColor: AZUL_PRINCIPAL }} />
      <h5 className="subtitle mt-5" style={{ color: AZUL_ESCURO }}>
        Abaixo estão todas as ferramentas de gerenciamento de dados dos pets.
      </h5>

      <div className="container mt-5">
        <div className="row justify-content-center">
          {cardData.map((card, index) => (
            <div className="col-md-3 col-sm-12 mb-4" key={index}>
              <div className="card shadow border-0 card-estilo">
                <div className="card-body d-flex flex-column justify-content-between align-items-center">
                  <h5
                    className="card-title text-center titleCard"
                    style={{ color: AZUL_ESCURO }}
                  >
                    {card.title}
                  </h5>
                  <p
                    className="card-text text-center subtitleCard flex-grow-1"
                    style={{ color: AZUL_ESCURO }}
                  >
                    {card.text}
                  </p>
                  <div className="text-center mb-3">
                    <img
                      src={card.image}
                      style={{ width: "70%" }}
                      className="d-block mx-auto"
                      alt={card.title}
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3 btn text-white"
                    style={{
                      backgroundColor: card.buttonColor,
                      borderColor: AZUL_PRINCIPAL,
                    }}
                    onClick={card.onClick}
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalGenerico
        show={mostrarModalCadastro}
        onHide={() => fecharModal(setMostrarModalCadastro)}
        title="Cadastrar Pet"
        azulEscuro={AZUL_PRINCIPAL}
        fundoClaro={FUNDO_CLARO}
        size="lg"
        footerButtons={[
          {
            text: "⬅ Voltar",
            onClick: backStep,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step > 1 ? "inline-block" : "none",
            },
          },
          {
            text: "Próximo ➡️",
            onClick: nextStep,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step < 3 ? "inline-block" : "none",
            },
            disabled:
              (step === 1 && !cpfPesquisa) ||
              (step === 2 &&
                (!petEmEdicao.nome ||
                  !petEmEdicao.genero ||
                  !petEmEdicao.raca ||
                  !petEmEdicao.especie ||
                  !petEmEdicao.cpfDono)),
          },
          {
            text: "Salvar Pet",
            onClick: salvarPet,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step === 3 ? "inline-block" : "none",
            },
          },
        ]}
      >
        <PetFormCadastro
          step={step}
          petEmEdicao={petEmEdicao}
          handleChange={handlePetChange}
          cpfPesquisa={cpfPesquisa}
          handleCpfPesquisaChange={handleCpfPesquisaChange}
          clientes={clientes}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalListagem}
        onHide={() => fecharModal(setMostrarModalListagem)}
        title="Todos os Pets"
        azulEscuro={AZUL_PRINCIPAL}
        fundoClaro={FUNDO_CLARO}
        size="lg"
      >
        <PetListagemConteudo pets={pets} clientes={clientes} />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalAtualizar}
        onHide={() => fecharModal(setMostrarModalAtualizar)}
        title="Atualizar Pet"
        azulEscuro={AZUL_PRINCIPAL}
        fundoClaro={FUNDO_CLARO}
        size="lg"
        footerButtons={[
          {
            text: "⬅ Voltar",
            onClick: backStep,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step > 1 ? "inline-block" : "none",
            },
          },
          {
            text: "Próximo ➡️",
            onClick: nextStep,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step < 3 ? "inline-block" : "none",
            },
            disabled: (step === 1 && !cpfPesquisa) || (step === 2 && !idPet),
          },
          {
            text: "Atualizar Pet",
            onClick: atualizarPet,
            style: {
              backgroundColor: AZUL_ESCURO,
              borderColor: AZUL_ESCURO,
              display: step === 3 ? "inline-block" : "none",
            },
          },
        ]}
      >
        <PetFormAtualizacao
          step={step}
          idPet={idPet}
          setIdPet={setIdPet}
          petEmEdicao={petEmEdicao}
          setPetEmEdicao={setPetEmEdicao}
          handleChange={handlePetChange}
          pets={pets}
          cpfPesquisa={cpfPesquisa}
          handleCpfPesquisaChange={handleCpfPesquisaChange}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalExclusao}
        onHide={() => fecharModal(setMostrarModalExclusao)}
        title="Excluir Pet"
        azulEscuro={AZUL_PRINCIPAL}
        fundoClaro={FUNDO_CLARO}
        footerButtons={[
          {
            text: "Cancelar",
            onClick: () => fecharModal(setMostrarModalExclusao),
            variant: "outline-secondary",
            style: {
              backgroundColor: FUNDO_CLARO,
              borderColor: AZUL_ESCURO,
              color: AZUL_ESCURO,
            },
          },
          {
            text: "🗑️ Confirmar Exclusão",
            onClick: excluirPet,
            style: { backgroundColor: "red", borderColor: "red" },
            disabled: !idPet,
          },
        ]}
      >
        <PetFormExclusao
          idPet={idPet}
          handleIdPetChange={(e) => setIdPet(e.target.value)}
          cpfDono={cpfPesquisa}
          handleCpfChange={(e) => setCpfPesquisa(e.target.value)}
          pets={pets}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalConsumoTipoRaca}
        onHide={() => setMostrarModalConsumoTipoRaca(false)}
        title="Consumo por Pets"
        azulEscuro={AZUL_PRINCIPAL}
        fundoClaro={FUNDO_CLARO}
        size="lg"
      >
        <div>
          {consumoPorTipoRaca.length === 0 ? (
            <p style={{ color: AZUL_ESCURO }}>Nenhum dado disponível.</p>
          ) : (
            consumoPorTipoRaca.map((item, index) => (
              <p key={index} style={{ color: AZUL_ESCURO }}>
                Tipo: <strong>{item.tipo}</strong> | Raça:{" "}
                <strong>{item.raca}</strong> |{" "}
                {item.produto
                  ? `Produto: ${item.produto}`
                  : `Serviço: ${item.servico}`}{" "}
                – Total: {item.total}
              </p>
            ))
          )}
        </div>
      </ModalGenerico>
    </div>
  );
}
