import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

interface ProdutoFormExclusaoProps {
  idExclusao: string;
  handleIdExclusaoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  azulEscuro: string;
}

const ProdutoFormExclusao: React.FC<ProdutoFormExclusaoProps> = ({
  idExclusao,
  handleIdExclusaoChange,
  azulEscuro
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label style={{ color: azulEscuro }}>Digite o ID do produto que deseja excluir</Form.Label>
      <Form.Control
        value={idExclusao}
        onChange={handleIdExclusaoChange}
        placeholder="ID do produto"
        type="text"
      />
    </Form.Group>
  );
};

export default ProdutoFormExclusao;