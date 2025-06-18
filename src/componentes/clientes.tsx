import { useState } from "react";
import { Button } from "react-bootstrap";
import ModalGenerico from "./modalBase";
import { useEffect } from "react";

import ClienteFormCadastro from "./cliente/clienteFormCadastro";
import ClienteListagemConteudo from "./cliente/clienteListagemConteudo";
import ClienteFormAtualizacao from "./cliente/clienteFormAtualizacao";
import ClienteFormExclusao from "./cliente/clienteFormExclusao"; // Certifique-se de que este é o arquivo ClienteFormExclusao.tsx atualizado
import ClienteTopConsumoListagemConteudo from "./cliente/clienteTopConsumoListagem";
import ClienteFormRegistrarConsumo from "./cliente/clienteFormRegistrarConsumo";

const azulPrincipal = "#007BFF";
const azulEscuro = "#003366";
const fundoClaro = "#f0f8ff";

export default function Clientes() {
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalListagem, setMostrarModalListagem] = useState(false);
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [step, setStep] = useState(1);
  const [cpfPesquisa, setCpfPesquisa] = useState("");

  const [mostrarModalRegistrarConsumo, setMostrarModalRegistrarConsumo] =
    useState(false);

  const [detalhesClienteSelecionado, setDetalhesClienteSelecionado] = useState<
    any[]
  >([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(
    null
  );

  const [itensMaisConsumidos, setItensMaisConsumidos] = useState<any[]>([]);
  const [mostrarModalItensMaisConsumidos, setMostrarModalItensMaisConsumidos] =
    useState(false);

  const [topClientesValor, setTopClientesValor] = useState<any[]>([]);
  const [mostrarModalTopClientesValor, setMostrarModalTopClientesValor] =
    useState(false);

  const carregarItensMaisConsumidos = async () => {
    try {
      const resposta = await fetch(
        "http://localhost:3001/relatorio/itens-mais-consumidos"
      );
      const dados = await resposta.json();
      setItensMaisConsumidos(dados);
      setMostrarModalItensMaisConsumidos(true);
    } catch (error) {
      console.error("Erro ao carregar itens mais consumidos:", error);
    }
  };

  const carregarTopClientesValor = async () => {
    try {
      const resposta = await fetch(
        "http://localhost:3001/relatorio/top-clientes-valor"
      );
      const dados = await resposta.json();
      setTopClientesValor(dados);
      setMostrarModalTopClientesValor(true);
    } catch (error) {
      console.error("Erro ao carregar top clientes por valor:", error);
    }
  };

  const carregarDetalhesConsumo = async (clienteId: number) => {
    try {
      const resposta = await fetch(
        `http://localhost:3001/relatorio/consumo-detalhado/${clienteId}`
      );
      const dados = await resposta.json();
      setClienteSelecionado(clienteId);
      setDetalhesClienteSelecionado(dados);
    } catch (error) {
      console.error("Erro ao carregar detalhes de consumo:", error);
    }
  };

  const registrarConsumo = async () => {
    if (!clienteSelecionado || !itemSelecionado || !quantidade) {
      alert("Preencha todos os campos.");
      return;
    }

    const rota =
      tipoItem === "produto"
        ? "http://localhost:3001/consumo-produto"
        : "http://localhost:3001/consumo-servico";

    const payload =
      tipoItem === "produto"
        ? {
            cliente_id: clienteSelecionado,
            produto_id: parseInt(itemSelecionado),
            quantidade: parseInt(quantidade),
          }
        : {
            cliente_id: clienteSelecionado,
            servico_id: parseInt(itemSelecionado),
            quantidade: parseInt(quantidade),
          };

    try {
      await fetch(rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Consumo registrado com sucesso!");
      setMostrarModalRegistrarConsumo(false);
      setClienteSelecionado(null);
      setItemSelecionado("");
      setQuantidade("");
    } catch (error) {
      console.error("Erro ao registrar consumo:", error);
      alert("Falha ao registrar consumo.");
    }
  };

  const [tipoBuscaExclusao, setTipoBuscaExclusao] = useState<"id" | "cpf">(
    "id"
  );
  const [valorBuscaExclusao, setValorBuscaExclusao] = useState("");

  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  const [tipoItem, setTipoItem] = useState<"produto" | "servico">("produto");
  const [itemSelecionado, setItemSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const clientesRes = await fetch(
        "http://localhost:3001/clientes/detalhes"
      );
      setClientes(await clientesRes.json());

      const produtosRes = await fetch("http://localhost:3001/produtos");
      setProdutos(await produtosRes.json());

      const servicosRes = await fetch("http://localhost:3001/servicos");
      setServicos(await servicosRes.json());
    };

    fetchData();
  }, []);

  const [topClientes, setTopClientes] = useState<any[]>([]);
  const [mostrarModalTopClientes, setMostrarModalTopClientes] = useState(false);

  const carregarTopClientes = async () => {
    try {
      const resposta = await fetch(
        "http://localhost:3001/relatorio/top-clientes-quantidade"
      );
      const dados = await resposta.json();
      setTopClientes(dados);
      setMostrarModalTopClientes(true);
    } catch (error) {
      console.error("Erro ao carregar top clientes:", error);
    }
  };

  const [cliente, setCliente] = useState({
    nome: "",
    nomeSocial: "",
    ddd: "",
    telefone: "",
    pets: [] as string[],
    rg: "",
    rgEmissao: "",
    cpf: "",
    cpfEmissao: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "pets") {
      setCliente({
        ...cliente,
        pets: value.split(",").map((pet) => pet.trim()),
      });
    } else {
      setCliente({ ...cliente, [name]: value });
    }
  };

  const handleCpfPesquisaChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novoCpf = e.target.value;
    setCpfPesquisa(novoCpf);

    if (novoCpf.length >= 11) {
      try {
        const res = await fetch(
          `http://localhost:3001/clientes/cpf/${novoCpf}`
        );
        if (!res.ok) throw new Error("Cliente não encontrado.");
        const data = await res.json();

        setCliente({
          nome: data.nome || "",
          nomeSocial: data.nomeSocial || "",
          ddd: "",
          telefone: data.telefone || "",
          pets: data.pets
            ? data.pets.split(",").map((p: string) => p.trim())
            : [],
          rg: "",
          rgEmissao: "",
          cpf: data.cpf_valor || "",
          cpfEmissao: data.cpf_dataEmissao || "",
        });
      } catch (error) {
        console.error("Erro ao buscar cliente por CPF:", error);
      }
    }
  };

  const salvar = async () => {
    const clienteBody = {
      nome: cliente.nome,
      nomeSocial: cliente.nomeSocial,
      cpf_valor: cliente.cpf,
      cpf_dataEmissao: cliente.cpfEmissao,
      dataCadastro: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:3001/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao cadastrar cliente.");
      }

      const { id } = await res.json();

      await fetch("http://localhost:3001/rgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: id,
          valor: cliente.rg,
          dataEmissao: cliente.rgEmissao,
        }),
      });

      await fetch("http://localhost:3001/telefones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: id,
          ddd: cliente.ddd,
          numero: cliente.telefone,
        }),
      });

      setMostrarModalCadastro(false);
      setStep(1);
      setCliente({
        nome: "",
        nomeSocial: "",
        ddd: "",
        telefone: "",
        pets: [],
        rg: "",
        rgEmissao: "",
        cpf: "",
        cpfEmissao: "",
      });

      const response = await fetch("http://localhost:3001/clientes/detalhes");
      const data = await response.json();
      setClientes(data);
      alert("Cliente cadastrado com sucesso!");
    } catch (error: any) {
      alert(`Erro ao salvar cliente: ${error.message}`);
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const atualizarCliente = async () => {
    const resBusca = await fetch(
      `http://localhost:3001/clientes/cpf/${cpfPesquisa}`
    );
    const clienteEncontrado = await resBusca.json();
    if (!clienteEncontrado?.id) return alert("Cliente não encontrado");

    try {
      // Atualizar dados básicos do cliente (nome e nomeSocial)
      const resCliente = await fetch(
        `http://localhost:3001/clientes/${clienteEncontrado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: cliente.nome,
            nomeSocial: cliente.nomeSocial,
          }),
        }
      );

      if (!resCliente.ok) {
        const errorData = await resCliente.json();
        throw new Error(errorData.message || "Erro ao atualizar cliente.");
      }

      // Separar DDD e número do campo cliente.telefone
      const telefoneLimpo = cliente.telefone.replace(/\D/g, ""); // Remove espaços, traços, etc
      const ddd = telefoneLimpo.substring(0, 2);
      const numero = telefoneLimpo.substring(2);

      // Atualizar telefone separado
      const resTelefone = await fetch(
        `http://localhost:3001/telefones/${clienteEncontrado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ddd: ddd,
            numero: numero,
          }),
        }
      );

      if (!resTelefone.ok) {
        const errorData = await resTelefone.json();
        throw new Error(errorData.message || "Erro ao atualizar telefone.");
      }

      // Resetar estado
      setMostrarModalAtualizar(false);
      setCpfPesquisa("");
      setStep(1);
      setCliente({
        nome: "",
        nomeSocial: "",
        ddd: "",
        telefone: "",
        pets: [],
        rg: "",
        rgEmissao: "",
        cpf: "",
        cpfEmissao: "",
      });

      // Recarregar lista de clientes
      const response = await fetch("http://localhost:3001/clientes/detalhes");
      const data = await response.json();
      setClientes(data);
      alert("Cliente atualizado com sucesso!");
    } catch (error: any) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const excluirCliente = async () => {
    if (!valorBuscaExclusao) {
      alert("Por favor, insira um valor para exclusão.");
      return;
    }

    let clienteId: number | undefined;

    try {
      if (tipoBuscaExclusao === "cpf") {
        const res = await fetch(
          `http://localhost:3001/clientes/cpf/${valorBuscaExclusao}`
        );
        if (!res.ok)
          throw new Error("Cliente não encontrado com o CPF informado.");

        const data = await res.json();
        clienteId = data?.id;
        if (!clienteId) throw new Error("Cliente não encontrado.");
      } else {
        const id = parseInt(valorBuscaExclusao);
        if (isNaN(id)) throw new Error("Por favor, insira um ID válido.");
        clienteId = id;
      }

      const confirmacao = window.confirm(
        `Tem certeza que deseja excluir o cliente com ${tipoBuscaExclusao.toUpperCase()}: ${valorBuscaExclusao}?`
      );

      if (!confirmacao) return;

      const resDelete = await fetch(
        `http://localhost:3001/clientes/${clienteId}`,
        { method: "DELETE" }
      );
      if (!resDelete.ok) {
        const error = await resDelete.text();
        throw new Error(`Erro ao excluir cliente: ${error}`);
      }

      alert("Cliente excluído com sucesso!");
      setMostrarModalExclusao(false);
      setTipoBuscaExclusao("id");
      setValorBuscaExclusao("");

      const resAtualizado = await fetch(
        "http://localhost:3001/clientes/detalhes"
      );
      const clientesAtualizados = await resAtualizado.json();
      setClientes(clientesAtualizados);
    } catch (error: any) {
      alert(error.message);
      console.error("Erro na exclusão:", error);
    }
  };

  const cardData = [
    {
      title: "Cadastrar Cliente",
      text: "Preencha os dados de um novo cliente.",
      image: "cadastro.png",
      buttonText: "📝Cadastrar Cliente",
      buttonColor: azulEscuro,
      onClick: () => {
        setMostrarModalCadastro(true);
        setStep(1);
        setCliente({
          nome: "",
          nomeSocial: "",
          ddd: "",
          telefone: "",
          pets: [],
          rg: "",
          rgEmissao: "",
          cpf: "",
          cpfEmissao: "",
        });
      },
    },
    {
      title: "Listar Clientes",
      text: "Visualize todos os clientes cadastrados",
      image: "listagem.png",
      buttonText: "📋Listar Clientes",
      buttonColor: azulEscuro,
      onClick: () => setMostrarModalListagem(true),
    },
    {
      title: "Atualizar Cliente",
      text: "Altere os dados de um cliente existente",
      image: "update.png",
      buttonText: "🛠️Atualizar Cliente",
      buttonColor: azulEscuro,
      onClick: () => {
        setMostrarModalAtualizar(true);
        setCpfPesquisa("");
        setCliente({
          nome: "",
          nomeSocial: "",
          ddd: "",
          telefone: "",
          pets: [],
          rg: "",
          rgEmissao: "",
          cpf: "",
          cpfEmissao: "",
        });
      },
    },

    {
      title: "Registrar Consumo",
      text: "Registre o consumo de produtos ou serviços para um cliente.",
      image: "consumo.png", // Troque pelo nome correto da sua imagem, se for diferente
      buttonText: "➕ Registrar Consumo",
      buttonColor: "green",
      onClick: () => setMostrarModalRegistrarConsumo(true),
    },

    {
      title: "Top Clientes Consumidores",
      text: "Visualize os 10 clientes que mais consumiram.",
      image: "listagem.png",
      buttonText: "📊 Ver Top Clientes",
      buttonColor: azulEscuro,
      onClick: () => carregarTopClientes(),
    },
    {
      title: "Itens Mais Consumidos",
      text: "Veja os produtos e serviços mais consumidos por todos os clientes.",
      image: "listagem.png",
      buttonText: "📈 Itens Mais Consumidos",
      buttonColor: azulEscuro,
      onClick: carregarItensMaisConsumidos,
    },
    {
      title: "Top Clientes por Valor",
      text: "Veja os 5 clientes que mais consumiram em valor.",
      image: "listagem.png",
      buttonText: "💰 Top Clientes por Valor",
      buttonColor: azulEscuro,
      onClick: carregarTopClientesValor,
    },
    {
      title: "Excluir Cliente",
      text: "Remova o registro completo um de cliente existente no sistema",
      image: "delete.png",
      buttonText: "🗑️Excluir Cliente",
      buttonColor: "red",
      onClick: () => {
        setMostrarModalExclusao(true);
        setTipoBuscaExclusao("id"); // Resetar para o padrão ao abrir
        setValorBuscaExclusao(""); // Limpar o valor
      },
    },
  ];

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: fundoClaro, minHeight: "82vh" }}
    >
      <div className="d-flex align-items-center justify-content-center gap-3 title pt-5">
        <img src="/client.png" alt="" style={{ width: "70px" }} />
        <h1 style={{ fontSize: "300%", color: azulEscuro }}>
          Menu de Clientes
        </h1>
      </div>

      <hr className="line" style={{ borderColor: azulPrincipal }} />
      <h5 className="subtitle mt-5" style={{ color: azulEscuro }}>
        Nos blocos abaixo, você poderá gerenciar os dados dos seus clientes.
      </h5>

      <div className="container mt-5">
        <div className="row justify-content-center">
          {cardData.map((card, index) => (
            <div className="col-md-3 col-sm-12 mb-4" key={index}>
              <div className="card shadow border-0 estilo-card">
                <div className="card-body">
                  <h5
                    className="card-title text-center titleCard"
                    style={{ color: azulEscuro }}
                  >
                    {card.title}
                  </h5>
                  <p
                    className="card-text text-center subtitleCard"
                    style={{ color: azulEscuro }}
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
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      className="mt-3 btn text-white"
                      style={{
                        backgroundColor: card.buttonColor,
                        borderColor: azulPrincipal,
                      }}
                      onClick={card.onClick}
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalGenerico
        show={mostrarModalCadastro}
        onHide={() => {
          setMostrarModalCadastro(false);
          setStep(1);
        }}
        title="Cadastro de Cliente"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
        footerButtons={[
          {
            text: "⬅ Voltar",
            onClick: () => setStep(step - 1),
            style: {
              backgroundColor: azulEscuro,
              display: step > 1 ? "inline-block" : "none",
            },
          },
          {
            text: "Próximo ➡️",
            onClick: () => setStep(step + 1),
            style: {
              backgroundColor: azulEscuro,
              display: step < 2 ? "inline-block" : "none",
            },
          },
          {
            text: "📝Cadastrar",
            onClick: salvar,
            style: {
              backgroundColor: azulEscuro,
              display: step === 2 ? "inline-block" : "none",
            },
          },
        ]}
      >
        <ClienteFormCadastro
          step={step}
          cliente={cliente}
          handleChange={handleChange}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalListagem}
        onHide={() => setMostrarModalListagem(false)}
        title="Listagem de Clientes"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
      >
        <ClienteListagemConteudo clientes={clientes} />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalAtualizar}
        onHide={() => setMostrarModalAtualizar(false)}
        title="Atualizar Cliente"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
        footerButtons={[
          {
            text: "🛠️ Atualizar",
            onClick: atualizarCliente,
            style: { backgroundColor: azulEscuro, borderColor: azulEscuro },
          },
        ]}
      >
        <ClienteFormAtualizacao
          cpfPesquisa={cpfPesquisa}
          cliente={cliente}
          handleChange={handleChange}
          handleCpfPesquisaChange={handleCpfPesquisaChange}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalExclusao}
        onHide={() => {
          setMostrarModalExclusao(false);
          setTipoBuscaExclusao("id"); // Resetar ao fechar
          setValorBuscaExclusao(""); // Limpar valor ao fechar
        }}
        title="Excluir Cliente"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        footerButtons={[
          {
            text: "Cancelar",
            onClick: () => {
              setMostrarModalExclusao(false);
              setTipoBuscaExclusao("id"); // Resetar ao cancelar
              setValorBuscaExclusao(""); // Limpar valor ao cancelar
            },
            variant: "outline-secondary",
          },
          {
            text: "🗑️ Confirmar Exclusão",
            onClick: excluirCliente,
            style: { backgroundColor: azulEscuro, borderColor: azulEscuro },
          },
        ]}
      >
        <ClienteFormExclusao
          tipoBusca={tipoBuscaExclusao}
          setTipoBusca={setTipoBuscaExclusao}
          valorBusca={valorBuscaExclusao}
          setValorBusca={setValorBuscaExclusao}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalTopClientes}
        onHide={() => setMostrarModalTopClientes(false)}
        title="Top 10 Clientes por Quantidade Consumida"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
      >
        <div>
          {topClientes.length === 0 ? (
            <p style={{ color: azulEscuro }}>
              Nenhum dado de consumo disponível.
            </p>
          ) : (
            topClientes.map((cliente, index) => (
              <div key={index} style={{ color: azulEscuro }} className="mb-3">
                <p>
                  <strong>Cliente:</strong> {cliente.nome}
                </p>
                <p>
                  <strong>Total de Consumos:</strong> {cliente.total}
                </p>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => carregarDetalhesConsumo(cliente.id)}
                >
                  Ver Detalhes de Consumo
                </Button>

                {clienteSelecionado === cliente.id && (
                  <div className="mt-2 ml-3">
                    {detalhesClienteSelecionado.length === 0 ? (
                      <p>Sem detalhes de consumo.</p>
                    ) : (
                      detalhesClienteSelecionado.map((item, idx) => (
                        <p key={idx}>
                          ➡️ <strong>{item.tipo}:</strong> {item.item} -{" "}
                          {item.quantidade} unidade(s)
                        </p>
                      ))
                    )}
                  </div>
                )}

                {index < topClientes.length - 1 && (
                  <hr style={{ borderColor: azulEscuro }} />
                )}
              </div>
            ))
          )}
        </div>
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalRegistrarConsumo}
        onHide={() => setMostrarModalRegistrarConsumo(false)}
        title="Registrar Consumo"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        footerButtons={[
          {
            text: "✔️ Registrar",
            onClick: registrarConsumo, // Essa será a função que envia os dados pro backend
            style: { backgroundColor: "green", borderColor: "darkgreen" },
          },
        ]}
      >
        <ClienteFormRegistrarConsumo
          clientes={clientes}
          produtos={produtos}
          servicos={servicos}
          clienteSelecionado={clienteSelecionado}
          tipoItem={tipoItem}
          itemSelecionado={itemSelecionado}
          quantidade={quantidade}
          handleChangeCliente={(e) => {
            const value = e.target.value;
            setClienteSelecionado(value !== "" ? parseInt(value) : null);
          }}
          handleChangeTipo={(e) => {
            setTipoItem(e.target.value as "produto" | "servico");
            setItemSelecionado("");
          }}
          handleChangeItem={(e) => setItemSelecionado(e.target.value)}
          handleChangeQuantidade={(e) => setQuantidade(e.target.value)}
        />
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalItensMaisConsumidos}
        onHide={() => setMostrarModalItensMaisConsumidos(false)}
        title="Itens Mais Consumidos (Produtos e Serviços)"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
      >
        <div>
          {itensMaisConsumidos.length === 0 ? (
            <p style={{ color: azulEscuro }}>Nenhum dado disponível.</p>
          ) : (
            itensMaisConsumidos.map((item, index) => (
              <p key={index} style={{ color: azulEscuro }}>
                <strong>{item.tipo}:</strong> {item.item} – Total Consumido:{" "}
                {item.total}
              </p>
            ))
          )}
        </div>
      </ModalGenerico>

      <ModalGenerico
        show={mostrarModalTopClientesValor}
        onHide={() => setMostrarModalTopClientesValor(false)}
        title="Top 5 Clientes que Mais Consumiram em Valor"
        azulEscuro={azulEscuro}
        fundoClaro={fundoClaro}
        size="lg"
      >
        <div>
          {topClientesValor.length === 0 ? (
            <p style={{ color: azulEscuro }}>Nenhum dado disponível.</p>
          ) : (
            topClientesValor.map((cliente, index) => (
              <p key={index} style={{ color: azulEscuro }}>
                <strong>
                  {index + 1}º - {cliente.nome}:
                </strong>{" "}
                R$ {parseFloat(cliente.total_gasto).toFixed(2)}
              </p>
            ))
          )}
        </div>
      </ModalGenerico>
    </div>
  );
}
