import { Categoria } from "./category.model";

export interface Produtos {
  id: number;
  nome?: string;
  preco: number;
  categoria_id: number;
  categoria?: Categoria;
}
