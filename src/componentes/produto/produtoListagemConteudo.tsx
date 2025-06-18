import React from 'react';
import { Produto } from '../types';

interface ProdutoListagemConteudoProps {
  produtos: Produto[];
  azulEscuro: string;
}

const ProdutoListagemConteudo: React.FC<ProdutoListagemConteudoProps> = ({ produtos, azulEscuro }) => {
  return (
    <>
      {produtos.length === 0 ? (
        <p style={{ color: azulEscuro }}>Nenhum produto cadastrado.</p>
      ) : (
        produtos.map((prod, index) => (
          <div key={prod.id} className="mb-3" style={{ color: azulEscuro }}>
            <p><strong>ID:</strong> {prod.id}</p>
            <p><strong>Nome do Produto:</strong> {prod.nome}</p>
            <p><strong>Preço:</strong> R$ {parseFloat(prod.preco).toFixed(2)}</p>
            <p><strong>Estoque:</strong> {prod.estoque} unidades</p>
            {/* Se no futuro você adicionar estoque ou consumo no backend, pode reabilitar esses */}
            {/* <p><strong>Estoque:</strong> {prod.estoque} unidades</p> */}
            {/* <p><strong>Consumo:</strong> {prod.consumo} unidades</p> */}

            {index < produtos.length - 1 && <hr style={{ borderColor: azulEscuro }} />}
          </div>
        ))
      )}
    </>
  );
};

export default ProdutoListagemConteudo;
