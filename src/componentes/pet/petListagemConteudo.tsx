import React from "react";
import { Cliente, Pet } from "../types";

interface PetListagemConteudoProps {
  pets: {
    id: string;
    nome: string;
    raca: string;
    especie: string;
    genero: string;
    cpfDono: string;
  }[];
  clientes: { nome: string; cpf: string }[];
}

const PetListagemConteudo: React.FC<PetListagemConteudoProps> = ({
  pets,
  clientes,
}) => {
  const getNomeCliente = (cpf: string) => {
    const cliente = clientes.find((c) => c.cpf === cpf);
    return cliente ? cliente.nome : "Dono Desconhecido";
  };

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {pets.length === 0 ? (
        <p>Nenhum pet cadastrado.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Raça</th>
              <th>Espécie</th>
              <th>Gênero</th>
              <th>Dono</th>
              <th>CPF do Dono</th>
            </tr>
          </thead>
          <tbody>
            {[...pets]
              .sort((a, b) => Number(a.id) - Number(b.id)) // ordenação por ID numérica
              .map((pet, index) => (
                <tr key={index}>
                  <td>{pet.id}</td>
                  <td>{pet.nome}</td>
                  <td>{pet.raca}</td>
                  <td>{pet.especie}</td>
                  <td>{pet.genero}</td>
                  <td>{getNomeCliente(pet.cpfDono)}</td>
                  <td>{pet.cpfDono}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PetListagemConteudo;
