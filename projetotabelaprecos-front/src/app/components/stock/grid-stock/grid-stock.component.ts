import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Stock } from '../../../core/models/stock.model';
import { StockService } from '../../../core/services/stock.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './grid-stock.component.html',
  styleUrls: ['./grid-stock.component.css']
})
export class GridStockComponent implements OnInit, AfterViewInit {
  colunasAMostrar: string[] = [
    'id',
    'produto',
    'categoria',
    'preco',
    'quantidade',
    'quantidade_minima',
    'status',
    'acoes'
  ];

  dataSourceS = new MatTableDataSource<Stock>([]);
  carregando = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStocks();
  }

  ngAfterViewInit(): void {
    this.dataSourceS.paginator = this.paginator;
    this.dataSourceS.sort = this.sort;
  }

  getStocks(): void {
    this.carregando = true;

    this.stockService.getStocks().subscribe({
      next: (dados) => {
        console.log('Dados do estoque recebidos:', dados);
        this.dataSourceS.data = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao recuperar dados do estoque:', erro);
        this.carregando = false;
      }
    });
  }

  filtrarGrid(event: Event): void {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSourceS.filter = valorFiltro.trim().toLowerCase();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'sem_estoque':
        return 'Sem estoque';
      case 'estoque_baixo':
        return 'Estoque baixo';
      default:
        return 'Estoque OK';
    }
  }

  movimentarEstoque(stock: Stock, tipo: 'entrada' | 'saida'): void {
    this.router.navigate(['/stock/move'], {
      queryParams: {
        produto_id: stock.produto_id,
        tipo
      }
    });
  }

  verHistorico(stock: Stock): void {
    this.router.navigate(['/stock/history'], {
      queryParams: {
        produto_id: stock.produto_id
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/']);
  }
}