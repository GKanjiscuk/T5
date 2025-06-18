import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Servico } from '../types';

interface ServicoFormCadastroProps {
  servico: Servico;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ServicoFormCadastro: React.FC<ServicoFormCadastroProps> = ({ servico, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Nome do Serviço</Form.Label>
        <Form.Control
          name="nome"
          value={servico.nome}
          onChange={handleChange}
          placeholder="Nome do Serviço"
          type="text"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Preço</Form.Label>
        <Form.Control
          name="preco"
          value={servico.preco}
          onChange={handleChange}
          type="number"
          step="0.01"
          placeholder="0.00"
        />
      </Form.Group>
     
    </>
  );
};

export default ServicoFormCadastro;