import React from "react";
import { Form } from "react-bootstrap";

interface ClienteFormRegistrarConsumoProps {
  clientes: any[];
  produtos: any[];
  servicos: any[];
  clienteSelecionado: number | null;
  tipoItem: "produto" | "servico";
  itemSelecionado: string;
  quantidade: string;
  handleChangeCliente: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangeTipo: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangeItem: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangeQuantidade: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClienteFormRegistrarConsumo: React.FC<ClienteFormRegistrarConsumoProps> = ({
  clientes,
  produtos,
  servicos,
  clienteSelecionado,
  tipoItem,
  itemSelecionado,
  quantidade,
  handleChangeCliente,
  handleChangeTipo,
  handleChangeItem,
  handleChangeQuantidade,
}) => {
  return (
    <Form>
      {/* Cliente */}
      <Form.Group className="mb-3">
        <Form.Label>Cliente:</Form.Label>
        <Form.Select
          value={clienteSelecionado !== null ? clienteSelecionado : ""}
          onChange={handleChangeCliente}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Tipo de consumo */}
      <Form.Group className="mb-3">
        <Form.Label>Tipo de Consumo:</Form.Label>
        <Form.Select value={tipoItem} onChange={handleChangeTipo}>
          <option value="produto">Produto</option>
          <option value="servico">Serviço</option>
        </Form.Select>
      </Form.Group>

      {/* Item */}
      <Form.Group className="mb-3">
        <Form.Label>{tipoItem === "produto" ? "Produto:" : "Serviço:"}</Form.Label>
        <Form.Select value={itemSelecionado} onChange={handleChangeItem}>
          <option value="">Selecione um {tipoItem}</option>
          {(tipoItem === "produto" ? produtos : servicos).map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Quantidade */}
      <Form.Group className="mb-3">
        <Form.Label>Quantidade:</Form.Label>
        <Form.Control
          type="number"
          min={1}
          value={quantidade}
          onChange={handleChangeQuantidade}
        />
      </Form.Group>
    </Form>
  );
};

export default ClienteFormRegistrarConsumo;
