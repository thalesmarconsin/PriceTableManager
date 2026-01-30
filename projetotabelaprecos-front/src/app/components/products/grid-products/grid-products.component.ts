import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../../../module/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { SharedModule } from '../../../../module/shared.module';
import { Produtos } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-grid-produtos',
  standalone: true,
  imports: [
    MatIcon,
    MaterialModule,
    SharedModule,
    MatPaginator,
    MatSort,
    CommonModule,
  ],
  templateUrl: './grid-products.component.html',
  styleUrl: './grid-products.component.css',
})
export class GridProductsComponent implements OnInit {
  categorias: Categoria[] = [];
  produtos: Produtos[] = [];
  dataSourceC!: MatTableDataSource<Categoria>;
  dataSourceP!: MatTableDataSource<Produtos>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  colunasAMostrar = [
    'id',
    'nome',
    'preco',
    'categoria',
    'acoes'
  ];

  constructor(
    private categoriaService: CategoryService,
    private produtosService: ProductService,
    private router: Router,
    private snackBarService: SnackbarService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCategoria();
    this.getProdutos();
  }

  getCategoria() {
    this.categoriaService.getCategoria().subscribe({
      next: (res: any) => {
        console.log('Dados da categoria recebidos:', res);

        this.categorias = res;

        this.dataSourceC = new MatTableDataSource(this.categorias);

        setTimeout(() => {
          this.dataSourceC.sort = this.sort;
          this.dataSourceC.paginator = this.paginator;
        });
      },
      error: (error: any) => {
        console.error('Erro ao recuperar dados da categoria:', error);
        this.snackBarService.showErrorSnackbar('Erro ao recuperar dados da categoria!');
      },
    });
  }

  getProdutos() {
    this.produtosService.getProdutos().subscribe({
      next: (res: any) => {
        console.log('Dados dos produtos recebidos:', res);

        this.produtos = res;

        this.dataSourceP = new MatTableDataSource(this.produtos);

        setTimeout(() => {
          this.dataSourceP.sort = this.sort;
          this.dataSourceP.paginator = this.paginator;
        });
      },
      error: (error: any) => {
        console.error('Erro ao recuperar dados dos produtos:', error);
        this.snackBarService.showErrorSnackbar('Erro ao recuperar dados dos produtos!');
      },
    });
  }

  filtrarGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceP.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceP.paginator) {
      this.dataSourceP.paginator.firstPage();
    }
  }

  createProduto() {
    this.router.navigate(['productsForm'], {
      relativeTo: this.activatedRoute,
    });
  }

  editProduto(id: number): void {
    this.router.navigate(['/products/editProducts', id]);
  }

  deleteProduto(id: number) {
    this.produtosService.deleteProdutos(id).subscribe({
      next: () => {
        this.snackBarService.showSuccessSnackbar('Produto deletada com sucesso!');
        this.getProdutos(); 
      },
      error: (error: any) => {
        console.error('Erro ao deletar produto:', error);
        this.snackBarService.showErrorSnackbar('Erro ao deletar produto!');
      },
    });
  }

  redirecionarFormC() {
    this.router.navigate(['products/productsForm']);
  }

  voltar() {
    this.router.navigate(['table']);
  }
  
}