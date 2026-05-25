import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProdutoSimplexInput {
  id: number;
  nome: string;
  lucro: number;
  custo: number;
}

export interface ProdutoSolucao {
  id: number;
  nome: string;
  quantidade: number;
}

export interface SimplexResult {
  status: string;
  lucro_maximo: number;
  solucao: ProdutoSolucao[];
  quantidade_utilizada: number;
  orcamento_utilizado: number;
  iteracoes: number;
}

export interface SimplexPayload {
  produtos: ProdutoSimplexInput[];
  max_quantidade: number;
  orcamento: number;
}

@Injectable({ providedIn: 'root' })
export class SimplexService {
  private simplexUrl: string = environment.apiRoot + 'simplex';

  constructor(private http: HttpClient) {}

  calcularSimplex(payload: SimplexPayload): Observable<SimplexResult> {
    return this.http.post<SimplexResult>(this.simplexUrl, payload);
  }
}
