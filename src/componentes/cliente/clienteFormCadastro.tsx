import React from "react";
import { Form } from "react-bootstrap";

interface ClienteFormCadastroProps {
  step: number;
  cliente: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClienteFormCadastro: React.FC<ClienteFormCadastroProps> = ({
  step,
  cliente,
  handleChange,
}) => {
  return (
    <>
      {step === 1 && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control
              name="nome"
              value={cliente.nome}
              onChange={handleChange}
              required
              isInvalid={cliente.nome.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              Nome é obrigatório.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome Social</Form.Label>
            <Form.Control
              name="nomeSocial"
              value={cliente.nomeSocial}
              onChange={handleChange}
              required
              isInvalid={cliente.nomeSocial.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              Nome social é obrigatório.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                placeholder="DDD"
                style={{ maxWidth: "80px" }}
                name="ddd"
                value={cliente.ddd}
                onChange={handleChange}
                required
                isInvalid={cliente.ddd.trim() === ""}
              />
              <Form.Control
                placeholder="Número"
                name="telefone"
                value={cliente.telefone}
                onChange={handleChange}
                required
                isInvalid={cliente.telefone.trim() === ""}
              />
            </div>
            <Form.Text muted>Ex: (11) 99999-9999</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>RG</Form.Label>
            <Form.Control
              name="rg"
              value={cliente.rg}
              onChange={handleChange}
              required
              isInvalid={cliente.rg.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              RG é obrigatório.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data de Emissão do RG</Form.Label>
            <Form.Control
              type="date"
              name="rgEmissao"
              value={cliente.rgEmissao}
              onChange={handleChange}
              required
              isInvalid={cliente.rgEmissao.trim() === ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CPF</Form.Label>
            <Form.Control
              name="cpf"
              value={cliente.cpf}
              onChange={handleChange}
              required
              isInvalid={!/^\d{11}$/.test(cliente.cpf)}
            />
            <Form.Control.Feedback type="invalid">
              CPF deve ter 11 números (sem pontos ou traço).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data de Emissão do CPF</Form.Label>
            <Form.Control
              type="date"
              name="cpfEmissao"
              value={cliente.cpfEmissao}
              onChange={handleChange}
              required
              isInvalid={cliente.cpfEmissao.trim() === ""}
            />
          </Form.Group>
        </>
      )}

      {step === 2 && (
        <>
          <p>Confirme os dados:</p>
          <ul>
            <li>
              <strong>Nome:</strong> {cliente.nome}
            </li>
            <li>
              <strong>Nome Social:</strong> {cliente.nomeSocial}
            </li>
            <li>
              <strong>Telefone:</strong> ({cliente.ddd}) {cliente.telefone}
            </li>
            <li>
              <strong>RG:</strong> {cliente.rg}
            </li>
            <li>
              <strong>Data Emissão RG:</strong> {cliente.rgEmissao}
            </li>
            <li>
              <strong>CPF:</strong> {cliente.cpf}
            </li>
            <li>
              <strong>Data Emissão CPF:</strong> {cliente.cpfEmissao}
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default ClienteFormCadastro;
