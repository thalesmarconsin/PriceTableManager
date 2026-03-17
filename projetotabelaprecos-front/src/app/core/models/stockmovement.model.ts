import { Produtos } from "./product.model";

export interface StockMovement {
  id: number;
  produto_id: number;
  tipo_movimentacao: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo?: string | null;
  observacao?: string | null;
  created_at: string;
  updated_at: string;
  product?: Produtos;
}