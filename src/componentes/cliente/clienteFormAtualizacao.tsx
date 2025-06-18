import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

interface Cliente {
  nome: string;
  nomeSocial: string;
  ddd: string;
  telefone: string;
  pets: string[];
  rg: string;
  rgEmissao: string;
  cpf: string;
  cpfEmissao: string;
}

interface ClienteFormAtualizacaoProps {
  cpfPesquisa: string;
  cliente: Cliente;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCpfPesquisaChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ClienteFormAtualizacao: React.FC<ClienteFormAtualizacaoProps> = ({
  cpfPesquisa,
  cliente,
  handleChange,
  handleCpfPesquisaChange,
}) => {
  return (
    <Form>
      {/* CPF para buscar */}
      <Form.Group className="mb-3">
        <Form.Label>CPF do Cliente para Buscar:</Form.Label>
        <Form.Control
          type="text"
          name="cpfPesquisa"
          value={cpfPesquisa}
          onChange={handleCpfPesquisaChange}
          placeholder="Digite o CPF"
        />
      </Form.Group>

      {/* Nome */}
      <Form.Group className="mb-3">
        <Form.Label>Nome:</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={cliente.nome}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Nome Social */}
      <Form.Group className="mb-3">
        <Form.Label>Nome Social:</Form.Label>
        <Form.Control
          type="text"
          name="nomeSocial"
          value={cliente.nomeSocial}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Telefone */}
      <Form.Group className="mb-3">
        <Form.Label>Telefone:</Form.Label>
        <Form.Control
          type="text"
          name="telefone"
          value={cliente.telefone}
          onChange={handleChange}
          placeholder="Ex: (11) 91234-5678"
        />
      </Form.Group>

      {/* Pets */}
      <Form.Group className="mb-3">
        <Form.Label>Pets (não editável - para isso vá para o formulário da aba pets):</Form.Label>
        <Form.Control
          as="textarea"
          name="pets"
          value={cliente.pets.join(", ")}
          onChange={handleChange}
          placeholder="Ex: Rex, Bella"
          readOnly
        />
      </Form.Group>
    </Form>
  );
};

export default ClienteFormAtualizacao;
