import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { StockService } from '../../../core/services/stock.service';
import { StockMovementPayload } from '../../../core/models/stockmovementpayload.model';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './movement-stock.component.html',
  styleUrls: ['./movement-stock.component.css']
})
export class StockMovementComponent implements OnInit {
  form!: FormGroup;
  carregando = false;
  produtoId!: number;
  tipoInicial: 'entrada' | 'saida' | 'ajuste' = 'entrada';
  mensagem = '';
  erro = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.produtoId = Number(this.route.snapshot.queryParamMap.get('produto_id'));
    this.tipoInicial = (this.route.snapshot.queryParamMap.get('tipo') as 'entrada' | 'saida' | 'ajuste') || 'entrada';

    this.form = this.fb.group({
      produto_id: [this.produtoId, Validators.required],
      tipo_movimentacao: [this.tipoInicial, Validators.required],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      motivo: [''],
      observacao: ['']
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    const payload: StockMovementPayload = this.form.value;

    this.stockService.createMovement(payload).subscribe({
      next: () => {
        this.mensagem = 'Movimentação registrada com sucesso.';
        this.carregando = false;
        setTimeout(() => {
          this.router.navigate(['/stock']);
        }, 800);
      },
      error: (err) => {
        this.erro = err?.error?.mensagem || 'Erro ao registrar movimentação.';
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/stock']);
  }
}