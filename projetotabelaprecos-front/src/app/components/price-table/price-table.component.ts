import { Component, OnInit, ViewChild } from '@angular/core';
import { Produtos } from '../../core/models/product.model';
import { Categoria } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../module/material.module';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule, 
    FormsModule
  ],
  styleUrl: `./price-table.component.css`,
})
export class PriceTableComponent implements OnInit {
  produtos: Produtos[] = [];
  categorias: Categoria[] = [];
  dataSourceP!: MatTableDataSource<Produtos>;
  selectedCategory: number | null = null;
  sortField: string = '';
  colunasAMostrar = ['id', 'nome', 'preco', 'categoria'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private produtoService: ProductService,
    private categoriaService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategorias();
    this.getProdutos();
  }

  getCategorias() {
    this.categoriaService.getCategoria().subscribe({
      next: (res: any) => {
        console.log('Categorias recebidas:', res);
        this.categorias = res;
      },
      error: (err: any) => {
        console.error('Erro ao buscar categorias:', err);
      }
    });
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.nome ?? 'Categoria não encontrada';
  }

  getProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (res: any) => {
        let produtosFiltrados = res;
        
        if (this.selectedCategory !== null) {
          produtosFiltrados = produtosFiltrados.filter(
            (p: any) => p.categoria_id === this.selectedCategory
          );
        }

        if (this.sortField) {
          produtosFiltrados.sort((a: any, b: any) => {
            if (this.sortField === 'nome') {
              return a.nome.localeCompare(b.nome);
            } else if (this.sortField === 'preco') {
              return a.preco - b.preco;
            }
            return 0;
          });
        }
  
        this.produtos = produtosFiltrados.map((produto: any) => ({
          ...produto,
          categoriaNome: this.getCategoriaNome(produto.categoria_id)
        }));
  
        this.dataSourceP = new MatTableDataSource(this.produtos);
  
        setTimeout(() => {
          this.dataSourceP.sort = this.sort;
          this.dataSourceP.paginator = this.paginator;
        });
      },
      error: (err: any) => {
        console.error('Erro ao buscar produtos:', err);
      }
    });
  }
  

  filtrarGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceP.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSourceP.paginator) {
      this.dataSourceP.paginator.firstPage();
    }
  }  

  editProduto(id: number) {
    this.router.navigate([`/produtos/edit`, id]);
  }

  deleteProduto(id: number) {
    // Implemente a lógica de exclusão aqui
    console.log('Produto excluído:', id);
  }

  redirecionarGridC() {
    this.router.navigate(['/categories']);
  }

  redirecionarGridP() {
    this.router.navigate(['/products']);
  }
}