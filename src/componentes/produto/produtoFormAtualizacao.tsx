import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Produto } from '../types';

interface ProdutoFormAtualizacaoProps {
  produto: Produto;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  azulEscuro: string;
}

const ProdutoFormAtualizacao: React.FC<ProdutoFormAtualizacaoProps> = ({
  produto,
  handleChange,
  azulEscuro
}) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: azulEscuro }}>Nome do Produto</Form.Label>
        <Form.Control
          name="nome"
          value={produto.nome}
          onChange={handleChange}
          placeholder="Digite o novo nome"
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: azulEscuro }}>Preço</Form.Label>
        <Form.Control
          name="preco"
          value={produto.preco}
          onChange={handleChange}
          type="number"
          step="0.01"
          placeholder="Digite o novo preço"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: azulEscuro }}>Estoque</Form.Label>
        <Form.Control
          name="estoque"
          value={produto.estoque.toString()}
          onChange={handleChange}
          type="number"
          placeholder="Digite o novo estoque"
        />
      </Form.Group>
    </>
  );
};

export default ProdutoFormAtualizacao;
