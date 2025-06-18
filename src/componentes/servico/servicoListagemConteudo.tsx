import React from 'react';
import { Servico } from '../types';

interface ServicoListagemConteudoProps {
  servicos: Servico[];
  azulEscuro: string;
}

const ServicoListagemConteudo: React.FC<ServicoListagemConteudoProps> = ({ servicos, azulEscuro }) => {
  return (
    <>
      {servicos.length === 0 ? (
        <p style={{ color: azulEscuro }}>Nenhum serviço cadastrado.</p>
      ) : (
        servicos.map((serv, index) => (
          <div
            key={serv.id}
            className="mb-3 p-3"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: `1px solid ${azulEscuro}`,
              color: azulEscuro,
            }}
          >
            <p><strong>ID:</strong> {serv.id}</p>
            <p><strong>Nome do Serviço:</strong> {serv.nome}</p>
            <p><strong>Preço:</strong> R$ {serv.preco ? parseFloat(serv.preco).toFixed(2) : "0.00"}</p>
            <p><strong>Consumo:</strong> {serv.consumo ?? 0} vezes</p>
            {index < servicos.length - 1 && <hr style={{ borderColor: azulEscuro }} />}
          </div>
        ))
      )}
    </>
  );
};

export default ServicoListagemConteudo;
