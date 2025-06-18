import React from 'react';

interface ClienteTopConsumo {
  nome: string;
  total: number;
}

interface ClienteTopConsumoListagemConteudoProps {
  clientes: ClienteTopConsumo[];
  azulEscuro: string;
}

const ClienteTopConsumoListagemConteudo: React.FC<ClienteTopConsumoListagemConteudoProps> = ({ clientes, azulEscuro }) => {
  return (
    <>
      {clientes.length === 0 ? (
        <p style={{ color: azulEscuro }}>Nenhum dado de consumo disponível.</p>
      ) : (
        clientes.map((cliente, index) => (
          <div key={index} className="mb-3" style={{ color: azulEscuro }}>
            <p><strong>Cliente:</strong> {cliente.nome}</p>
            <p><strong>Total de Consumos:</strong> {cliente.total}</p>
            {index < clientes.length - 1 && <hr style={{ borderColor: azulEscuro }} />}
          </div>
        ))
      )}
    </>
  );
};

export default ClienteTopConsumoListagemConteudo;
