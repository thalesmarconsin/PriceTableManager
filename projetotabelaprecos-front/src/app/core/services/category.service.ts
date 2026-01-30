import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria } from '../models/category.model';
import { map } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root' 
})
export class CategoryService {
  
  
  private categoriaAddress: string = environment.apiRoot + 'categories';

  constructor(private http: HttpClient) {}

  getCategoria(): Observable<Categoria[]> {
    return this.http
    .get(this.categoriaAddress) as Observable<Categoria[]>;
    }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http
    .get<{ category: Categoria }>(`${this.categoriaAddress}/${id}`)
    .pipe(
      map(res => res.category));
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http
    .post(this.categoriaAddress, categoria) as Observable<Categoria>;
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http
    .put(`${this.categoriaAddress}/${id}`, categoria) as Observable<Categoria>;
  }

  deleteCategoria(id: number): Observable<Categoria> {
    return this.http
    .delete(`${this.categoriaAddress}/${id}`) as Observable<Categoria>;
  }
}

