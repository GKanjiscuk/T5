import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { Servico } from "../types";

interface ServicoFormAtualizacaoProps {
  step: number;
  idPesquisa: string;
  handleIdPesquisaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  servico: Servico;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  servicoParaAtualizar: Servico | null;
  azulEscuro: string;
}

const ServicoFormAtualizacao: React.FC<ServicoFormAtualizacaoProps> = ({
  step,
  idPesquisa,
  handleIdPesquisaChange,
  servico,
  handleChange,
  servicoParaAtualizar,
  azulEscuro,
}) => {
  return (
    <>
      {step === 1 && (
        <Form.Group className="mb-3">
          <Form.Label>ID do Serviço:</Form.Label>
          <Form.Control
            type="text"
            value={idPesquisa}
            onChange={handleIdPesquisaChange}
            placeholder="Digite o ID do serviço"
          />
        </Form.Group>
      )}

      {step === 2 && servicoParaAtualizar && (
        <div>
          <h5 style={{ color: azulEscuro, marginBottom: "15px" }}>
            Dados Atuais do Serviço (ID: {servicoParaAtualizar.id}):
          </h5>
          <p style={{ color: azulEscuro }}>
            Preencha os campos que deseja atualizar. Deixe em branco para manter
            o valor atual.
          </p>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: azulEscuro }}>
              Nome do Serviço (Atual: {servicoParaAtualizar.nome})
            </Form.Label>
            <Form.Control
              name="nome"
              value={servico.nome}
              onChange={handleChange}
              placeholder="Novo nome"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: azulEscuro }}>
              Preço (Atual: R${" "}
              {parseFloat(servicoParaAtualizar.preco).toFixed(2)})
            </Form.Label>
            <Form.Control
              name="preco"
              value={servico.preco}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Novo preço (0.00)"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total de Consumos (não editável)</Form.Label>
            <Form.Control
              type="text"
              value={servicoParaAtualizar?.consumo ?? 0}
              readOnly
            />
          </Form.Group>
        </div>
      )}
      {step === 2 && !servicoParaAtualizar && (
        <p style={{ color: azulEscuro }}>
          Serviço não encontrado ou ID não fornecido.
        </p>
      )}
    </>
  );
};

export default ServicoFormAtualizacao;
