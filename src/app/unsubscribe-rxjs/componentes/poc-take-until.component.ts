import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnviarValorService } from '../enviar-valor.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-poc-take-until',
  template: `
    <app-poc-base [nome]="nome"
      [valor]="valor" estilo="bg-primary">
    </app-poc-base>
  `
})
export class PocTakeUntilComponent implements OnInit, OnDestroy {

  nome = 'Componente com takeUntil';
  valor: string;

  unsub$ = new Subject();

  constructor(private service: EnviarValorService) {}

  // É a solução mais elegante caso precise com que o observable fique vivo durante todo o ciclo de vida do componente
  ngOnInit() {
    this.service.getValor()
      .pipe(
        tap(v => console.log(this.nome, v)),
        // Recebe um notificador. Fica escutando outro observable, e até esse observable emitir um valor, continua inscrito
        // No primeiro momento que o observable que foi passado para o takeUntil emitir valor, aí se desinscreve automaticamente
        takeUntil(this.unsub$)
      )
      .subscribe(novoValor => this.valor = novoValor);
  }

  ngOnDestroy(): void {
    // Ativa a inscrição
    this.unsub$.next('');
    // Acaba com os problemas de memory lick
    this.unsub$.complete();
    console.log(`${this.nome} foi destruído.`);
  }
}