import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from '../../../module/material.module';
import { SimplexService, SimplexResult } from '../../core/services/simplex.service';
import { ProductService } from '../../core/services/product.service';
import { Produtos } from '../../core/models/product.model';

interface ProdutoSimplex {
  id: number;
  nome: string;
  lucro: number;
  custo: number;
  ativo: boolean;
}

const CORES = [
  '#e53935', '#fb8c00', '#8e24aa', '#039be5', '#f9a825',
  '#43a047', '#00897b', '#d81b60', '#3949ab', '#6d4c41',
];

@Component({
  selector: 'app-simplex',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './simplex.component.html',
  styleUrl: './simplex.component.css',
})
export class SimplexComponent implements OnInit {
  resultado: SimplexResult | null = null;
  carregando = false;
  carregandoProdutos = false;
  erro: string | null = null;

  produtosSimplex: ProdutoSimplex[] = [];
  maxQuantidade = 180;
  orcamento = 10000;

  constructor(
    private simplexService: SimplexService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregandoProdutos = true;
    this.productService.getProdutos().subscribe({
      next: (res: Produtos[]) => {
        this.produtosSimplex = res.map(p => ({
          id: p.id,
          nome: p.nome ?? '',
          lucro: p.preco,
          custo: 0,
          ativo: true,
        }));
        this.carregandoProdutos = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar produtos. Verifique se o servidor está rodando.';
        this.carregandoProdutos = false;
      },
    });
  }

  get produtosAtivos(): ProdutoSimplex[] {
    return this.produtosSimplex.filter(p => p.ativo);
  }

  calcular(): void {
    const ativos = this.produtosAtivos;
    if (ativos.length === 0) {
      this.erro = 'Selecione pelo menos um produto para calcular.';
      return;
    }

    this.carregando = true;
    this.erro = null;
    this.resultado = null;

    this.simplexService.calcularSimplex({
      produtos: ativos.map(p => ({ id: p.id, nome: p.nome, lucro: p.lucro, custo: p.custo })),
      max_quantidade: this.maxQuantidade,
      orcamento: this.orcamento,
    }).subscribe({
      next: (res) => {
        this.resultado = res;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao calcular o Simplex. Verifique se o servidor está rodando.';
        this.carregando = false;
        console.error(err);
      },
    });
  }

  getCorProduto(index: number): string {
    return CORES[index % CORES.length];
  }

  irParaProdutos(): void {
    this.router.navigate(['/products']);
  }

  voltarHome(): void {
    this.router.navigate(['/']);
  }
}
