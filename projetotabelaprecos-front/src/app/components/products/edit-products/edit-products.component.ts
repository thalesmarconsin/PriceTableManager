import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Produtos } from '../../../core/models/product.model';
import { Categoria } from '../../../core/models/category.model';
import { MaterialModule } from '../../../../module/material.module';
import { SharedModule } from '../../../../module/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-products',
  standalone: true,
  imports: [
    MaterialModule, 
    SharedModule,
    CommonModule
  ],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css'
})
export class EditProductsComponent implements OnInit {
  form!: FormGroup;
  titulo: string = 'Editar Produto';
  id!: number;
  produto: Produtos = {} as Produtos; 
  categorias: Categoria[] = []; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProductService,
    private categoriaService: CategoryService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log("ID do produto:", this.id);
    this.form = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      preco: ['', [Validators.required]],
      categoria_id: ['', Validators.required],
    });
    if (this.id) {
      this.produtoService.getProdutosById(this.id).subscribe({
        next: (produto) => {
          console.log('Produto carregado:', produto);
          if (!produto) {
            console.error('Produto não encontrado!');
            return;
          }
          this.produto = produto;
          this.form.patchValue({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            categoria_id: produto.categoria_id,
          });
        },
        error: (err) => {
          this.snackbar.showErrorSnackbar(`Erro ao carregar produto: ${err.message || 'Erro desconhecido'}`);
        }
      });
    }
    this.categoriaService.getCategoria().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (err) => {
        this.snackbar.showErrorSnackbar(`Erro ao carregar categorias: ${err.message || 'Erro desconhecido'}`);
      }
    });
  }

  carregarProduto(id: number): void {
    this.produtoService.getProdutosById(id).subscribe({
      next: (produto) => {
        console.log('Produto carregado:', produto); 
        if (!produto) {
          console.error('Produto não encontrado!');
          return; 
        }
        this.form.patchValue({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          categoria_id: produto.categoria_id, 
        });
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err); 
        this.snackbar.showErrorSnackbar(`Erro ao carregar produto: ${err.message || 'Erro desconhecido'}`);
      }
    });
  }

  salvarForm() {
    if (this.form.invalid) {
      return; 
    }

    const dados: Produtos = {
      id: this.id,
      nome: this.form.get('nome')?.value,
      preco: this.form.get('preco')?.value,
      categoria_id: this.form.get('categoria_id')?.value,
    };

    this.produtoService.updateProdutos(this.id, dados).subscribe({
      next: () => {
        this.snackbar.showSuccessSnackbar('Produto atualizado com sucesso!');
        this.router.navigate(['products']);
      },
      error: (err) => {
        let errorMessage = 'Erro ao atualizar produto!';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.snackbar.showErrorSnackbar(errorMessage);
      }
    });
  }

  redirecionarGrade() {
    this.router.navigate(['products']); 
  }
}