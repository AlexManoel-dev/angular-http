import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnviarValorService } from '../enviar-valor.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-poc-unsub',
  template: `
    <app-poc-base [nome]="nome"
      [valor]="valor" estilo="bg-secondary">
    </app-poc-base>
  `
})
// O UNSUBSCRIBE ESTÁ SENDO FEITO DE FORMA INPERATIVA, NÃO ESTÁ SENDO USADO TUDO O QUE O RXJS E A PROGRAMAÇÃO REATIVA PODEM OFERECER
// EXISTEM MANEIRAS MAIS ELEGANTES DE SE FAZER A MESMA COISA, SEM FAZER A INSCRIÇÃO, O PUSH, E FAZER O UNSUBSCRIBE MANUALMENTE, QUE É ATRAVÉS DOS OPERADORES DO RXJS
// TAKE UNTIL e TAKE
export class PocUnsubComponent implements OnInit, OnDestroy {

  nome = 'Componente com unsubscribe';
  valor: string;

  // sub: Subscription;
  // Caso houver mais de um subscribe dentro do componente, pode-se fazer um array de subscriptions
  // E se não iniciar o array, fazendo Subscription[] = [], a aplicação buga
  sub: Subscription[] = [];

  constructor(private service: EnviarValorService) { }

  // ngOnInit() {
  //   this.sub = this.service.getValor()
  //     .pipe(tap(v => console.log(this.nome, v)))
  //     .subscribe(novoValor => this.valor = novoValor);
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  //   console.log(`${this.nome} foi destruído.`);
  // }

  ngOnInit() {
    this.sub.push(this.service.getValor()
      .pipe(tap(v => console.log(this.nome, v)))
      .subscribe(novoValor => this.valor = novoValor));
  }

  ngOnDestroy(): void {
    /**
     * Recebe a subscription e se desinscreve de cada uma do array
     * Isso evita ter uma variável para cada inscrição que for feita
     */
    this.sub.forEach(s => s.unsubscribe());
    console.log(`${this.nome} foi destruído.`);
  }


}