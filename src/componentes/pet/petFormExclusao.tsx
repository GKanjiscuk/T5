import React, { ChangeEvent, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { Pet } from '../types';

interface PetFormExclusaoProps {
  idPet: string;
  handleIdPetChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  cpfDono: string;
  handleCpfChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pets: Pet[];
}

const PetFormExclusao: React.FC<PetFormExclusaoProps> = ({
  idPet,
  handleIdPetChange,
  cpfDono,
  handleCpfChange,
  pets
}) => {
  const petsDoDono = useMemo(
    () => pets.filter((p) => p.cpfDono === cpfDono),
    [cpfDono, pets]
  );

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>CPF do Dono</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o CPF do dono"
          value={cpfDono}
          onChange={handleCpfChange}
        />
      </Form.Group>

      {cpfDono && petsDoDono.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Selecione o Pet a ser Excluído</Form.Label>
          <Form.Select value={idPet} onChange={handleIdPetChange}>
            <option value="">Selecione um pet</option>
            {petsDoDono.map((pet) => (
              <option key={pet.id} value={pet.id}>
                ID {pet.id} - {pet.nome} ({pet.especie}, {pet.raca})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {cpfDono && petsDoDono.length === 0 && (
        <p style={{ color: 'gray' }}>Nenhum pet encontrado para este CPF.</p>
      )}
    </>
  );
};

export default PetFormExclusao;
