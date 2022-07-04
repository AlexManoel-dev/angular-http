import { CursosService } from './../cursos.service';
import { Curso } from './../curso';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoResolverGuard implements Resolve<Curso> {

  constructor(private service: CursosService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Curso | Observable<Curso> | Promise<Curso> {
    if(route.params && route.params['id']){
      return this.service.loadByID(route.params['id']);
    }

    /**
     * O of() retorna um Observable a partir de um objeto
     */
    return of({
      id: null,
      nome: null
    });
  }
}
