import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { StockMovement } from '../models/stockmovement.model';
import { StockMovementPayload } from '../models/stockmovementpayload.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getStocks(categoriaId?: number, produtoId?: number): Observable<Stock[]> {
    let params = new HttpParams();

    if (categoriaId) {
      params = params.set('categoria_id', categoriaId);
    }

    if (produtoId) {
      params = params.set('produto_id', produtoId);
    }

    return this.http.get<Stock[]>(`${this.apiUrl}/stocks`, { params });
  }

  getStockById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/stocks/${id}`);
  }

  updateMinimum(id: number, quantidade_minima: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/stocks/${id}/minimum`, {
      quantidade_minima
    });
  }

  getMovements(produtoId?: number, tipoMovimentacao?: string): Observable<StockMovement[]> {
    let params = new HttpParams();

    if (produtoId) {
      params = params.set('produto_id', produtoId);
    }

    if (tipoMovimentacao) {
      params = params.set('tipo_movimentacao', tipoMovimentacao);
    }

    return this.http.get<StockMovement[]>(`${this.apiUrl}/stock-movements`, { params });
  }

  createMovement(payload: StockMovementPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock-movements`, payload);
  }
}