import { take } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Curso } from './curso';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, tap } from 'rxjs';

// Como o provide está sendo "in root", o import do módulo HttpClientModule tem que ser no app.module
@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private readonly API = `${environment.API}cursos`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Curso[]>(this.API)
      .pipe(
        delay(2000),
        tap(console.log)
      )
  }
  
  loadByID(id: number) {
    return this.http.get<Curso>(`${this.API}/${id}`).pipe(take(1));
  }

  private create(curso: Curso) {
    return this.http.post<Curso>(this.API, curso).pipe(take(1));
  }

  private update(curso: Curso) {
    return this.http.put<Curso>(`${this.API}/${curso.id}`, curso).pipe(take(1));
  }

  /**
   * @params - curso a ser salvo
   * Irá salvar o curso, independente se é criação ou edição
   */
  save(curso: Curso) {
    if(curso.id){
      return this.update(curso);
    }
    return this.create(curso);
  }

  remove(id: number) {
    return this.http.delete<Curso>(`${this.API}/${id}`).pipe(take(1));
  }
}
