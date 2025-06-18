import React, { useEffect, useState } from "react";

interface ConsumoPorPet {
  tipo: string;
  raca: string;
  produto?: string;
  servico?: string;
  total: number;
}

const RelatorioConsumoPorTipoRaca: React.FC = () => {
  const [consumos, setConsumos] = useState<ConsumoPorPet[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/relatorio/consumo-por-tipo-raca")
      .then((res) => res.json())
      .then((data) => setConsumos(data))
      .catch((error) => console.error("Erro ao buscar relatório:", error));
  }, []);

  return (
    <div>
      <h2>Consumo por Tipo e Raça de Pets</h2>
      <ul>
        {consumos.map((consumo, index) => (
          <li key={index}>
            Tipo: {consumo.tipo}, Raça: {consumo.raca} –{" "}
            {consumo.produto ? `Produto: ${consumo.produto}` : `Serviço: ${consumo.servico}`} – Total: {consumo.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatorioConsumoPorTipoRaca;
