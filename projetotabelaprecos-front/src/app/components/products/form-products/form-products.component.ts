import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Categoria } from '../../../core/models/category.model';
import { Produtos } from '../../../core/models/product.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../../../module/material.module';
import { SharedModule } from '../../../../module/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-products',
  standalone: true,
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.css',
  imports: [
    MatFormFieldModule,
    MaterialModule,
    SharedModule,
    NgxMaskDirective,
    CommonModule
  ],
  providers: [provideNgxMask()],
})
export class FormProductsComponent implements OnInit {
  form: FormGroup;
  id?: number;
  titulo: string = 'Criação de Produto';
  categorias: Categoria[] = [];

  get frmdados() {
    return this.form.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoryService,
    private produtoService: ProductService,
    private snackBarService: SnackbarService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      preco: ['', Validators.required],
      categoria_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();

    this.activatedRoute.queryParams.subscribe((params) => {
      const { idProduto } = params;
      if (idProduto) {
        this.id = +idProduto;
        this.titulo = `Editando Produto - ${this.id}`;
        this.carregarProduto();
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.getCategoria().subscribe({
      next: (res: Categoria[]) => (this.categorias = res),
      error: () =>
        this.snackBarService.showErrorSnackbar('Erro ao carregar categorias'),
    });
  }

  carregarProduto(): void {
    if (!this.id) return;
    this.produtoService.getProdutosById(this.id).subscribe({
      next: (res) => {
        this.form.patchValue(res);
        this.frmdados['id'].disable();
      },
      error: () =>
        this.snackBarService.showErrorSnackbar('Erro ao carregar produto'),
    });
  }

  salvarForm(): void {
    const { nome, preco, categoria_id } = this.form.getRawValue();
    const precoMask = parseFloat(
      String(preco).replace(/\./g, '').replace(',', '.')
    );
  
    const produto: Produtos = {
      id: this.id!,
      nome,
      preco: precoMask,
      categoria_id,
    };
  
    console.log('Enviando produto:', produto);
  
    const operacao = this.id && this.id > 0
      ? this.produtoService.updateProdutos(this.id, produto)
      : this.produtoService.createProdutos(produto);
  
    operacao.subscribe({
      next: () => {
        const mensagem = this.id ? 'Produto atualizado!' : 'Produto criado com sucesso!';
        this.snackBarService.showSuccessSnackbar(mensagem);
        this.redirecionarGrade();
      },
      error: (error: { status: number; error: { errors: any; message: string; }; }) => {
        console.error('Erro ao salvar produto:', error);
  
        if (error.status === 422 && error.error.errors) {
          const erros = error.error.errors;
          const mensagens = Object.values(erros).flat().join('\n');
          this.snackBarService.showErrorSnackbar(`Erro de validação:\n${mensagens}`);
        } else if (error.status === 500) {
          const mensagemDetalhada = error.error?.message || 'Erro interno no servidor.';
          this.snackBarService.showErrorSnackbar(`Erro 500:\n${mensagemDetalhada}`);
        } else {
          this.snackBarService.showErrorSnackbar('Erro inesperado ao salvar o produto. Verifique o console.');
        }
      }
    });
  }

  redirecionarGrade(): void {
    this.router.navigate(['products']);
  }
}