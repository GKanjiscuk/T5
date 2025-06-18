import React, { useEffect, useState } from "react";

interface ItemConsumido {
  tipo: string;
  item: string;
  total: number;
}

const RelatorioItensMaisConsumidos: React.FC = () => {
  const [itens, setItens] = useState<ItemConsumido[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/relatorio/itens-mais-consumidos")
      .then((res) => res.json())
      .then((data) => setItens(data))
      .catch((error) => console.error("Erro ao buscar relatório:", error));
  }, []);

  return (
    <div>
      <h2>Itens Mais Consumidos (Produtos e Serviços)</h2>
      <ul>
        {itens.map((item, index) => (
          <li key={index}>
            {item.tipo}: {item.item} - Total consumido: {item.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatorioItensMaisConsumidos;
