import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { Curso } from '../curso';
import { catchError, EMPTY, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];

  // Variáveis com a notação finlandesa, que é o nome da variável e o símbolo "$" no final representam um Observable
  cursos$: Observable<Curso[]>;
  // O error$ será do tipo boolean, pois, sempre que for emitido um erro, será emitido o valor de TRUE, pra que quando o error$ for consumido, mostre o erro juntamente com o pipe async
  error$ = new Subject<boolean>();

  constructor(private service: CursosService) { }

  ngOnInit(): void {
    // this.service.list()
    //   .subscribe(dados => this.cursos = dados);

    this.onRefresh();
  }
  
  onRefresh() {
    // cursos$ é um observable, e está recebendo um observable, por isso, está correto
    this.cursos$ = this.service.list()
      .pipe(
        catchError(error => {
          console.error(error);
          // Se existir algum erro, o error$ emitirá o valor de TRUE, que será usado dentro do *ngIf
          this.error$.next(true);
          return EMPTY;
        })
      );

      // Quando não irá ser usado o pipe async, e for feito a inscrição padrão com unsubscribe, ou com take, takeUntil, e etc
      // Podem ser feitas 3 lógicas aqui dentro
      // SUCESSO - pode-se fazer log, atribuir a variável local e etc
      // ERRO - pode-se fazer log, ou também fazer uma lógica parecida com a de cima, com subject e next(true)
      // COMPLETE - pode-se fazer log de que o observable está completo - ELE NÃO IRÁ MAIS EMITIR VALOR
      this.service.list()
      .pipe(
        // Também poderia ser feito dessa forma, e não precisaria do error na parte do subscribe
        // CASO EXISTIR, VÁRIOS OPERADORES DENTRO DO PIPE, O IDEAL É SEMPRE COLOCAR O CATCHERROR COMO O ÚLTIMO OPERADOR, DEPOIS DE MAP, TAP, SWITCHMAP E ETC
        // Porque caso ocorra algum erro dentro desses operadores rxjs, seja o map, tap, switchmap entre outros, é possível capturar e aplicar alguma lógica utilizando o catchError dentro do pipe
        catchError(error => EMPTY)
      )
      .subscribe({
        next: (v) => {
          this.cursos$ = v;
        },
        // error: (e) => {
        //   catchError(error => {
        //     this.error$.next(true);
        //     return EMPTY;
        //   })
        // },
        // complete: () => console.log('completo')
      });
  }

}
