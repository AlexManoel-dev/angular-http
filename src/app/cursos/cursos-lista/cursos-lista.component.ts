import { ActivatedRoute, Router } from '@angular/router';
import { AlertModalService } from './../../shared/alert-modal.service';
import { AlertModalComponent } from './../../shared/alert-modal/alert-modal.component';
import { CursosService } from './../cursos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../curso';
import { catchError, EMPTY, Observable, Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  // bsModalRef: BsModalRef;

  deleteModalRef: BsModalRef;

  @ViewChild('deleteModal') deleteModal: any;

  cursoSelecionado: Curso;

  // cursos: Curso[];

  // Variáveis com a notação finlandesa, que é o nome da variável e o símbolo "$" no final representam um Observable
  cursos$: Observable<Curso[]>;
  // O error$ será do tipo boolean, pois, sempre que for emitido um erro, será emitido o valor de TRUE, pra que quando o error$ for consumido, mostre o erro juntamente com o pipe async
  error$ = new Subject<boolean>();

  constructor(
    private service: CursosService,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
          // this.error$.next(true);
          // Função com alert-modal criada abaixo
          this.handleError();
          return EMPTY;
        })
      );

      // Quando não irá ser usado o pipe async, e for feito a inscrição padrão com unsubscribe, ou com take, takeUntil, e etc
      // Podem ser feitas 3 lógicas aqui dentro
      // SUCESSO - pode-se fazer log, atribuir a variável local e etc
      // ERRO - pode-se fazer log, ou também fazer uma lógica parecida com a de cima, com subject e next(true)
      // COMPLETE - pode-se fazer log de que o observable está completo - ELE NÃO IRÁ MAIS EMITIR VALOR
      //this.service.list()
      //.pipe(
        // Também poderia ser feito dessa forma, e não precisaria do error na parte do subscribe
        // CASO EXISTIR, VÁRIOS OPERADORES DENTRO DO PIPE, O IDEAL É SEMPRE COLOCAR O CATCHERROR COMO O ÚLTIMO OPERADOR, DEPOIS DE MAP, TAP, SWITCHMAP E ETC
        // Porque caso ocorra algum erro dentro desses operadores rxjs, seja o map, tap, switchmap entre outros, é possível capturar e aplicar alguma lógica utilizando o catchError dentro do pipe
        //catchError(error => EMPTY)
      //)
      //.subscribe({
        //next: (v) => {
          //this.cursos$ = v;
        //},
        // error: (e) => {
        //   catchError(error => {
        //     this.error$.next(true);
        //     return EMPTY;
        //   })
        // },
        // complete: () => console.log('completo')
      //});
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde.');
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
  }

  onEdit(id: number) {
    this.router.navigate(['editar', id], { relativeTo: this.route }); // relativeTo: representa que a rota a ser navegada vai ser relativa a atual portanto, "cursos/editar/:id"
    // Também da pra fazer assim, mas o jeito acima talvez se encaixa melhor na maioria das situações
    // this.router.navigate(['cursos/editar', id]);
  }

  onDelete(curso: Curso) {
    this.cursoSelecionado = curso;
    this.deleteModalRef = this.modalService.show(this.deleteModal, { class: 'modal-sm' });
  }

  onConfirmDelete(): void {
    this.service.remove(this.cursoSelecionado.id)
      .subscribe({
        next: (v) => {
          this.onRefresh();
          this.deleteModalRef?.hide();
        },
        error: (e) => {
          this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde.');
          this.deleteModalRef?.hide();
        },
        complete: () => console.info('complete')
      });
  }
 
  onDeclineDelete(): void {
    this.deleteModalRef?.hide();
  }
}