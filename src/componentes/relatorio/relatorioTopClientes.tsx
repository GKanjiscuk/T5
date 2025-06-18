import React, { useEffect, useState } from "react";

interface ClienteConsumo {
  id: number;
  nome: string;
  total_gasto: number;
}

const RelatorioTopClientesValor: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteConsumo[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/relatorio/top-clientes-valor")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Erro ao buscar relatório:", error));
  }, []);

  return (
    <div>
      <h2>Top 5 Clientes que Mais Consumiram em Valor</h2>
      <ol>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nome} – R$ {cliente.total_gasto.toFixed(2)}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RelatorioTopClientesValor;
