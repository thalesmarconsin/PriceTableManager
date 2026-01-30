import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Categoria } from '../../../core/models/category.model';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { MaterialModule } from '../../../../module/material.module';
import { SharedModule } from '../../../../module/shared.module';

@Component({
  selector: 'app-form-categories',
  standalone: true,
  imports: [MatFormFieldModule, MatToolbar, MaterialModule, SharedModule],
  templateUrl: './form-categories.component.html',
  styleUrl: `./form-categories.component.css`,
})
export class FormCategoriesComponent implements OnInit{
  form: FormGroup;
  id?: number;
  hide = true;
  titulo: string = 'Criação de Categoria';

  public get frmdados() {
    return this.form!.controls;
  }
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
    private categoriaService: CategoryService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      nome: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      const { idCategoria } = data;

      if (idCategoria) {
        this.id = idCategoria;
        if (this.id && this.id > 0) {
          this.categoriaService.getCategoriaById(this.id).subscribe({
            next: (res) => {
              this.titulo = `Editando Categoria - ${this.id} ${res.nome}`;
              const dato = { ...res } as Categoria;
              console.log(dato);
              this.form.patchValue(dato);
              this.frmdados['id'].disable();
            },
            error: (error) => {
              this.snackBarService.showErrorSnackbar(
                'Erro ao carregar Categoria'
              );
              console.log(error);
            },
          });
        } else {
          this.id = undefined;
          this.titulo = 'Criando Categoria';
          this.form.reset();
        }
      }
    });
  }

  salvarForm() {
    const { nome } = this.form.value;
    const dados: Categoria = {
      id: this.id!,
      nome: nome,
    }
    if (this.id && this.id > 0) {
      this.editCategoria(dados);
    } else {
      this.createCategoria(dados);
    }
  }

  createCategoria(dados: Categoria) {
    this.categoriaService.createCategoria(dados).subscribe({
      next: (res: any) => {
        this.snackBarService.showSuccessSnackbar('Categoria criada com sucesso!');
        this.redirecionarGrade();
      },
      error: (error: any) => {
        this.snackBarService.showErrorSnackbar(
          'Erro ao criar o Categoria!'
        );
        console.log(error);
      },
    });
  }

  editCategoria(dados: Categoria) {
    this.categoriaService.updateCategoria(dados.id, dados).subscribe({
      next: (res: any) => {
        this.snackBarService.showSuccessSnackbar('Categoria editada com sucesso!');
        this.redirecionarGrade();
      },
      error: (error: any) => {
        this.snackBarService.showErrorSnackbar(
          'Erro ao atualizar o Categoria!'
        );
        console.log(error);
      },
    });
  }

  redirecionarGrade() {
    this.router.navigate(['categories']);
  }
}
