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

@Component({
  selector: 'app-grid-categorias',
  standalone: true,
  imports: [
    MatIcon,
    MaterialModule,
    SharedModule,
    MatPaginator,
    MatSort,
    CommonModule,
  ],
  templateUrl: './grid-categories.component.html',
  styleUrl: './grid-categories.component.css',
})
export class GridCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  dataSource!: MatTableDataSource<Categoria>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  colunasAMostrar = [
    'id',
    'nome',
    'acoes'
  ];

  constructor(
    private categoriaService: CategoryService,
    private router: Router,
    private snackBarService: SnackbarService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCategoria();
  }

  getCategoria() {
    this.categoriaService.getCategoria().subscribe({
      next: (res: any) => {
        console.log('Dados recebidos:', res);

        this.categorias = res;

        this.dataSource = new MatTableDataSource(this.categorias);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: (error: any) => {
        console.error('Erro ao recuperar dados:', error);
        this.snackBarService.showErrorSnackbar('Erro ao recuperar dados!');
      },
    });
  }

  filtrarGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createCategoria() {
    this.router.navigate(['categoriesForm'], {
      relativeTo: this.activatedRoute,
    });
  }

  editCategoria(id: number): void {
    this.router.navigate(['/categories/editCategories', id]);
  }

  deleteCategoria(id: number) {
    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => {
        this.snackBarService.showSuccessSnackbar('Categoria deletada com sucesso!');
        this.getCategoria(); 
      },
      error: (error: any) => {
        console.error('Erro ao deletar categoria:', error);
        this.snackBarService.showErrorSnackbar('Erro ao deletar categoria!');
      },
    });
  }

  redirecionarFormC() {
    this.router.navigate(['categories/categoriesForm']);
  }

  voltar() {
    this.router.navigate(['table']);
  }
  
}