import React from "react";

interface ClienteListagemConteudoProps {
  clientes: {
    id: number;
    nome: string;
    nomeSocial: string;
    cpf: string;
    telefone: string;
    pets: string;
  }[];
}

const ClienteListagemConteudo: React.FC<ClienteListagemConteudoProps> = ({
  clientes,
}) => {
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {clientes.map((cli, index) => (
        <div key={index}>
          <p>
            <strong>Nome:</strong> {cli.nome}
          </p>
          <p>
            <strong>Nome Social:</strong> {cli.nomeSocial}
          </p>
          <p>
            <strong>Telefone:</strong> {cli.telefone || "Não informado"}
          </p>
          <p>
            <strong>Pet:</strong> {cli.pets || "Nenhum"}
          </p>
          <p>
            <strong>CPF:</strong> {cli.cpf || "Não informado"}
          </p>

          {index < clientes.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default ClienteListagemConteudo;
