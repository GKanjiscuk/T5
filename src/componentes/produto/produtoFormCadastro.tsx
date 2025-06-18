import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Produto } from '../types';

interface ProdutoFormCadastroProps {
  produto: Produto;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ProdutoFormCadastro: React.FC<ProdutoFormCadastroProps> = ({ produto, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Nome do Produto</Form.Label>
        <Form.Control
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          placeholder="Nome do Produto"
          type="text"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Preço</Form.Label>
        <Form.Control
          name="preco"
          value={produto.preco}
          onChange={handleChange}
          type="number"
          step="0.01"
          placeholder="0.00"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Estoque</Form.Label>
        <Form.Control
          name="estoque"
          value={produto.estoque.toString()}
          onChange={handleChange}
          type="number"
          placeholder="0"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Consumo (Opcional)</Form.Label>
        <Form.Control
          name="consumo"
          value={produto.consumo.toString()}
          onChange={handleChange}
          type="number"
          placeholder="0"
        />
      </Form.Group>
    </>
  );
};

export default ProdutoFormCadastro;