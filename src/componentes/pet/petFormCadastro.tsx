import React, { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Pet, Cliente } from '../types';

interface PetFormCadastroProps {
  step: number;
  petEmEdicao: Pet;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  cpfPesquisa: string;
  handleCpfPesquisaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clientes: Cliente[];
}

const PetFormCadastro: React.FC<PetFormCadastroProps> = ({
  step,
  petEmEdicao,
  handleChange,
  cpfPesquisa,
  handleCpfPesquisaChange,
  clientes,
}) => {
  return (
    <>
      {step === 1 && (
        <Form.Group className="mb-3">
          <Form.Label>Digite o CPF do Dono</Form.Label>
          <Form.Control
            value={cpfPesquisa}
            onChange={handleCpfPesquisaChange}
            placeholder="Ex: 123.456.789-00"
          />
          <Form.Text className="text-muted">
            Será usado para vincular o pet ao cliente.
          </Form.Text>
        </Form.Group>
      )}
      {step === 2 && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Pet</Form.Label>
            <Form.Control
              name="nome"
              value={petEmEdicao.nome}
              onChange={handleChange}
              placeholder="Nome do Pet"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gênero</Form.Label>
            <Form.Select
              name="genero"
              value={petEmEdicao.genero}
              onChange={handleChange}
            >
              <option value="">Selecione o Gênero</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
              <option value="Indefinido">Indefinido</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Raça</Form.Label>
            <Form.Control
              name="raca"
              value={petEmEdicao.raca}
              onChange={handleChange}
              placeholder="Raça do Pet"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Espécie</Form.Label>
            <Form.Control
              name="especie"
              value={petEmEdicao.especie}
              onChange={handleChange}
              placeholder="Cachorro, Gato, Pássaro, etc."
            />
          </Form.Group>

        </>
      )}
      {step === 3 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <strong>CPF do Dono:</strong> {cpfPesquisa}
          </li>
          <li>
            <strong>Nome:</strong> {petEmEdicao.nome}
          </li>
          <li>
            <strong>Gênero:</strong> {petEmEdicao.genero}
          </li>
          <li>
            <strong>Raça:</strong> {petEmEdicao.raca}
          </li>
          <li>
            <strong>Espécie:</strong> {petEmEdicao.especie}
          </li>
        </ul>
      )}
    </>
  );
};

export default PetFormCadastro;