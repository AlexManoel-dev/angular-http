import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviarValorService {

  private emissor$ = new Subject<string>();

  emitirValor(valor: string) {
    this.emissor$.next(valor);    
  }

  getValor() {
    return this.emissor$.asObservable();
  }

  constructor() { }
}
