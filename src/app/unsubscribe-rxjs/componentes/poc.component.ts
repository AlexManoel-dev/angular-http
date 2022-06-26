import { tap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnviarValorService } from '../enviar-valor.service';

@Component({
  selector: 'app-poc',
  template: `
    <app-poc-base [nome]="nome"
      [valor]="valor" estilo="bg-danger">
    </app-poc-base>
  `
})
export class PocComponent implements OnInit, OnDestroy {

  // COMPONENTES SEM UNSUBSCRIBE, MESMO DEPOIS DE DESTRUÍDOS, CONTINUAM ESCUTANDO POR MUDANÇAS DE VALORES
  // Isso causa problemas de memória, no caso, o browser não vai estar liberando a memória para o coletor de lixo de memória
  // E isso pode levar a problemas de lentidão e performance na aplicação
  // INDEPENDENTE DA FORMA QUE FOR FEITO, É SUPER IMPORTANTE SE DESINSCREVER DO OBSERVABLE TODA VEZ QUE O COMPONENTE FOR DESTRUÍDO
  // Analise a situação do seu componente, escolha uma das opções e se desinscreva, MAS POR FAVOR NÃO DEIXE DE SE DESINSCREVER DOS OBSERVABLES
  nome = 'Componente sem unsubscribe';
  valor: string;

  constructor(private service: EnviarValorService) { }

  ngOnInit() {
    this.service.getValor()
      .pipe(tap(v => console.log(this.nome, v)))
      .subscribe(novoValor => this.valor = novoValor);
  }

  ngOnDestroy(): void {
    console.log(`${this.nome} foi destruído.`);
  }

}