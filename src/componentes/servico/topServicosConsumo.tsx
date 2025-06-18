import React, { useEffect, useState } from "react";

interface ConsumoServico {
  nome: string;
  total: number;
}

interface Props {
  azulEscuro: string;
}

const TopServicosConsumo: React.FC<Props> = ({ azulEscuro }) => {
  const [consumoServicos, setConsumoServicos] = useState<ConsumoServico[]>([]);

  useEffect(() => {
    const carregarConsumo = async () => {
      try {
        const resposta = await fetch("http://localhost:3001/relatorio/servicos-mais-consumidos");
        if (!resposta.ok) {
          console.error("Erro ao buscar dados:", resposta.statusText);
          return;
        }
        const dados = await resposta.json();
        console.log("Consumo de serviços carregado:", dados);
        setConsumoServicos(dados);
      } catch (error) {
        console.error("Erro ao carregar consumo de serviços:", error);
      }
    };

    carregarConsumo();
  }, []);

  return (
    <div>
      <h5 style={{ color: azulEscuro }}>Serviços Mais Consumidos</h5>
      {consumoServicos.length === 0 ? (
        <p>Nenhum serviço consumido ainda.</p>
      ) : (
        consumoServicos.map((servico, index) => (
          <div key={index} className="mb-2" style={{ color: azulEscuro }}>
            <p>
              ➡️ <strong>{servico.nome}</strong>: {servico.total} vez(es)
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TopServicosConsumo;
