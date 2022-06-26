import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnviarValorService } from '../enviar-valor.service';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-poc-take',
  template: `
    <app-poc-base [nome]="nome"
      [valor]="valor" estilo="bg-info">
    </app-poc-base>
  `
})
// MELHOR EXEMPLO PARA SE USAR COM CHAMADAS HTTP, POIS A REQUISIÇÃO É FEITA E LOGO EM SEGUIDA É FEITO O UNSUBSCRIBE
export class PocTakeComponent implements OnInit, OnDestroy {

  nome = 'Componente com take';
  valor: string;

  constructor(private service: EnviarValorService) {}

  ngOnInit() {
    this.service.getValor()
      .pipe(
        tap(v => console.log(this.nome, v)),
        // Aqui é passado quantas vezes eu quero receber a resposta
        // Pra casos onde não irá haver segunda tentativa, geralmente é utilizado o take 1
        // Pois a requisição é feita, um valor é retornado, também vem um response de sucesso ou erro, e o unsub acontece
        take(1)
      )
      // Por conta do take, o valor vai ser recebido, atribuído á variável, e acabou, o unsub é feito
      .subscribe(novoValor => this.valor = novoValor);
  }

  ngOnDestroy(): void {
    console.log(`${this.nome} foi destruído.`);
  }

}