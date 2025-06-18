import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { Form } from "react-bootstrap";
import { Pet } from "../types";

interface PetFormAtualizacaoProps {
  step: number;
  idPet: string;
  setIdPet: Dispatch<SetStateAction<string>>;
  petEmEdicao: Pet;
  setPetEmEdicao: Dispatch<SetStateAction<Pet>>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  pets: Pet[];
  cpfPesquisa: string;
  handleCpfPesquisaChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PetFormAtualizacao: React.FC<PetFormAtualizacaoProps> = ({
  step,
  idPet,
  setIdPet,
  petEmEdicao,
  setPetEmEdicao,
  handleChange,
  pets,
  cpfPesquisa,
  handleCpfPesquisaChange,
}) => {
  // Filtrar pets do dono pelo CPF informado
  const petsDoDono = useMemo(
    () => pets.filter((p) => p.cpfDono === cpfPesquisa),
    [cpfPesquisa, pets]
  );

  // Quando um pet for selecionado no passo 2, preencher automaticamente o form
  useEffect(() => {
    if (step === 3 && idPet) {
      const foundPet = pets.find((p) => String(p.id) === idPet);
      if (foundPet) {
        console.log("Pet encontrado:", foundPet);
        setPetEmEdicao(foundPet);
      } else {
        console.warn(`Pet com ID ${idPet} não encontrado`);
        setPetEmEdicao({
          id: "",
          nome: "",
          genero: "",
          raca: "",
          especie: "",
          cpfDono: "",
        });
      }
    }
  }, [step, idPet, pets, setPetEmEdicao]);

  return (
    <>
      {step === 1 && (
        <Form.Group className="mb-3">
          <Form.Label>CPF do Dono (para encontrar o pet)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o CPF do dono"
            value={cpfPesquisa}
            onChange={handleCpfPesquisaChange}
          />
        </Form.Group>
      )}

      {step === 2 && (
        <>
          {petsDoDono.length === 0 ? (
            <p>Nenhum pet encontrado para o CPF informado.</p>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Selecione o Pet a ser Atualizado</Form.Label>
              <Form.Select
                value={idPet}
                onChange={(e) => setIdPet(e.target.value)}
              >
                <option value="">Selecione um pet</option>
                {petsDoDono.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    ID {pet.id} - {pet.nome} ({pet.especie}, {pet.raca})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </>
      )}

      {step === 3 && petEmEdicao.id && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Pet</Form.Label>
            <Form.Control
              name="nome"
              value={petEmEdicao.nome}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gênero</Form.Label>
            <Form.Select
              name="genero"
              value={petEmEdicao.genero}
              onChange={handleChange}
            >
              <option value="">Selecione o gênero</option>
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
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Espécie</Form.Label>
            <Form.Control
              name="especie"
              value={petEmEdicao.especie}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dono (CPF)</Form.Label>
            <Form.Control name="cpfDono" value={petEmEdicao.cpfDono} readOnly />
          </Form.Group>
        </>
      )}
    </>
  );
};

export default PetFormAtualizacao;
