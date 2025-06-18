import React from 'react';
import { Form } from 'react-bootstrap';

interface ClienteFormExclusaoProps {
  tipoBusca: 'id' | 'cpf';
  setTipoBusca: (value: 'id' | 'cpf') => void;
  valorBusca: string;
  setValorBusca: (value: string) => void;
}

const ClienteFormExclusao: React.FC<ClienteFormExclusaoProps> = ({
  tipoBusca,
  setTipoBusca,
  valorBusca,
  setValorBusca,
}) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label className='pe-2'>Excluir por:</Form.Label>
        <Form.Check
          type="radio"
          label="ID do Cliente"
          name="tipoBusca"
          id="radioId"
          value="id"
          checked={tipoBusca === 'id'}
          onChange={() => setTipoBusca('id')}
          inline
        />
        <Form.Check
          type="radio"
          label="CPF do Cliente"
          name="tipoBusca"
          id="radioCpf"
          value="cpf"
          checked={tipoBusca === 'cpf'}
          onChange={() => setTipoBusca('cpf')}
          inline
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{tipoBusca === 'id' ? 'ID do Cliente' : 'CPF do Cliente'}</Form.Label>
        <Form.Control
          value={valorBusca}
          onChange={(e) => setValorBusca(e.target.value)}
          placeholder={
            tipoBusca === 'id'
              ? 'Digite o ID do cliente'
              : 'Digite o CPF do cliente (somente números)'
          }
        />
      </Form.Group>
    </>
  );
};

export default ClienteFormExclusao;