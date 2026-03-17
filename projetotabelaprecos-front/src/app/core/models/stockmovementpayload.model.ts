export interface StockMovementPayload {
  produto_id: number;
  tipo_movimentacao: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo?: string | null;
  observacao?: string | null;
}