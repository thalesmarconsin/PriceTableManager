import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Categoria } from '../../../core/models/category.model';
import { MaterialModule } from '../../../../module/material.module';
import { SharedModule } from '../../../../module/shared.module';

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  imports: [MaterialModule, SharedModule],
  templateUrl: './edit-categories.component.html',
  styleUrl: './edit-categories.component.css',
})
export class EditCategoriesComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  titulo: string = 'Editar Categoria';

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      nome: ['', [Validators.required, Validators.maxLength(150)]],
    });
  
    this.route.params.subscribe(params => {
      this.id = +params['id'];  
      console.log('ID da categoria:', this.id);  
  
      if (this.id) {
        this.carregarCategoria(this.id);
      } else {
        console.error('ID inválido ou não encontrado na URL');
      }
    });
  }

  carregarCategoria(id: number): void {
    this.categoriaService.getCategoriaById(id).subscribe({
      next: (res: Categoria) => {
        this.form.patchValue({
          id: res.id,
          nome: res.nome,
        });
      },
      error: () => {
        this.snackbar.showErrorSnackbar('Erro ao carregar categoria');
        this.router.navigate(['/categories']);
      }
    });
  }

  salvarForm() {
    if (isNaN(this.id) || this.id <= 0) {
      this.snackbar.showErrorSnackbar('ID inválido');
      return;
    }
  
    const dados: Categoria = {
      id: this.id,
      nome: this.form.get('nome')?.value,
    };
  
    this.categoriaService.updateCategoria(this.id, dados).subscribe({
      next: () => {
        this.snackbar.showSuccessSnackbar('Categoria atualizada com sucesso!');
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.snackbar.showErrorSnackbar('Erro ao atualizar categoria!');
      },
    });
  }

  cancelar() {
    this.router.navigate(['/categories']);
  }
}