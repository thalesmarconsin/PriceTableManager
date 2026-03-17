import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { StockService } from '../../../core/services/stock.service';
import { StockMovement } from '../../../core/models/stockmovement.model';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './history-stock.component.html',
  styleUrls: ['./history-stock.component.css']
})
export class StockHistoryComponent implements OnInit, AfterViewInit {
  colunasAMostrar: string[] = [
    'id',
    'produto_id',
    'tipo_movimentacao',
    'quantidade',
    'motivo',
    'observacao',
    'created_at'
  ];

  dataSource = new MatTableDataSource<StockMovement>([]);
  carregando = false;
  produtoId?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('produto_id');
    this.produtoId = id ? Number(id) : undefined;
    this.carregarHistorico();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  carregarHistorico(): void {
    this.carregando = true;

    this.stockService.getMovements(this.produtoId).subscribe({
      next: (dados) => {
        this.dataSource.data = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar histórico:', erro);
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/stock']);
  }
}