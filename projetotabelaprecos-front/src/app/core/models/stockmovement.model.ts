import { Produtos } from "./product.model";

export interface StockMovement {
  id: number;
  produto_id: number;
  tipo_movimentacao: 'Entrada no estoque' | 'Saída do estoque' | 'Ajuste de estoque';
  quantidade: number;
  motivo?: string | null;
  observacao?: string | null;
  created_at: string;
  updated_at: string;
  product?: Produtos;
}