import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produtos } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root' 
})
export class ProductService {
  
  private produtoAddress: string = environment.apiRoot + 'products';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produtos[]> {
    return this.http
    .get<Produtos[]>(this.produtoAddress);
  }
  
  getProdutosById(id: number): Observable<Produtos> {
    return this.http
      .get<{ product: Produtos }>(`${this.produtoAddress}/${id}`)
      .pipe(
        map(res => res.product)  
      );
  }

  createProdutos(produtos: Produtos): Observable<Produtos> {
    return this.http
    .post<Produtos>(this.produtoAddress, produtos);
  }
  
  updateProdutos(id: number, produtos: Produtos): Observable<Produtos> {
    return this.http
    .put<Produtos>(`${this.produtoAddress}/${id}`, produtos);
  }
  
  deleteProdutos(id: number): Observable<void> {
    return this.http
    .delete<void>(`${this.produtoAddress}/${id}`);
  }
} 

