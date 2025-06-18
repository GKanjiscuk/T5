export interface Pet {
  id: string;
  nome: string;
  genero: string;
  raca: string;
  especie: string; 
  cpfDono: string; 
}


export interface Cliente {
  nome: string;
  nomeSocial?: string;
  ddd: string;
  telefone: string;
  rg?: string;
  rgEmissao?: string;
  cpf: string;
  cpfEmissao?: string;
  pets?: Pet[]; 
}

export interface Produto {
  id: string; 
  nome: string;
  preco: string; 
  estoque: number;
  consumo: number;
}
export interface Servico {
  id: string;
  nome: string;
  preco: string;
  consumo: string;
}
