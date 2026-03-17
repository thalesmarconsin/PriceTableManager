export interface Stock {
  id: number;
  produto_id: number;
  produto?: string;
  categoria?: string | null;
  preco?: number;
  quantidade: number;
  quantidade_minima: number;
  status: 'estoque_ok' | 'estoque_baixo' | 'sem_estoque';
  created_at: string;
  updated_at: string;
}