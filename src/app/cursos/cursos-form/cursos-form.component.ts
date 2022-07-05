import { AlertModalService } from './../../shared/alert-modal.service';
import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Curso } from '../curso';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss']
})
export class CursosFormComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: CursosService,
    private modal: AlertModalService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    /**
     * Qualquer lógica que dependa do ID que está sendo pego na rota, ela vai precisar ser executada dentro du subscribe, pra não ter erro quando for chamar o valor desejado
     * Pois, essa lógica é assíncrona
     */
    // this.route.params.subscribe(
    //   (params: any) => {
    //     const id = params['id'];
    //     console.log(id);
    //     const curso$ = this.service.loadByID(id);
    //     curso$.subscribe(curso => {
    //       this.updateForm(curso);
    //     });
    //     // Como o params é any, o id também poderia ser pego como se fosse um objeto, com o exemplo abaixo, params.id
    //     // const id = params.id;
    //   }
    // );

    /**
     * Mesma lógica de cima, porém refatorado
     * Não precisa ter unsubscribe, pois o Angular faz isso sozinho
     * Quando o usuário sai da rota: cursos/editar/:id, ela é destruída, e com isso, o Angular automaticamente faz o unsubscribe
     * Essa é uma das raras exceções que não é preciso ser feito o unsubscribe manualmente
     * E o loadByID() já tem o take(1) no service, pra não precisar ser feito o unsubscribe
     */
    // this.route.params
    // .pipe(
    //   map((params: any) => params['id']),
    //   /**
    //    * O route.params continuará sendo observado, e caso ele seja modificado a gente vai ter outra chamada pro servidor com o ID em questão
    //    * E no caso, como estamos modificando o parâmetro, a gente não está interessado nos outros ID's que foram chamados, e sim somente na última requisição
    //    * O switchMap cancela as requisições anteriores, e apenas devolve o valor do último pedido
    //    */
    //   switchMap(id => this.service.loadByID(id))
    //   // Se eu quisesse pegar as aulas do curso, eu poderia fazer:
    //   // switchMap(curso => obterAulas())
    // )
    // // O valor recebido no subscribe, é o valor retornado pelo último observable, no caso, o switchMap
    // .subscribe(curso => this.updateForm(curso));

    // Operadores RxJS que podem ser úteis
    // concatMap -> ordem da requisição importa
    // mergeMap -> ordem não importa
    // exhaustMap -> casos de login(basicamente faz a requisição e obtém a resposta, antes de partir para a segunda tentativa)
    // Ex: faz o pedido 1, espera a resposta, e depois faz a requisição do pedido 2, pra obter a resposta, e depois fazer o pedido 3 e obter a resposta, e assim vai...

    const curso = this.route.snapshot.data['curso'];

    // Quando o formulário for inicializado, o curso já existirá, portanto não será necessário o uso do updateForm
    this.form = this.fb.group({
      // Se for criação, será retornado o valor null como primeiro value. Já se for edição, tanto o id quanto o nome terão valores, e o formulário já vai ser inicializado com os mesmos
      // BASICAMENTE VAI TRAZER MAIS PERFORMANCE A APLICAÇÃO. MAIS AGILIDADE NA HORA DE TRAZER OS DADOS EXISTENTES
      id: [curso.id],
      nome: [curso.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]]
    });
  }

  /**
   * É possível colocar o código desse método dentro do curso$.subscribe, porém fazer com métodos fica muito melhor, e mais legível o código
   * @param curso - Curso recebido
   * Não vai ser necessário fazer o patchValue mais, pois o curso já está todo dentro da const curso, antes do form
   */
  updateForm(curso: Curso) {
    this.form.patchValue({
      id: curso.id,
      nome: curso.nome
    });
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if(this.form.valid) {
      console.log('Submit');
      let msgSuccess = 'Curso criado com sucesso!';
      let msgError = 'Erro ao criar curso, tente novamente!';
      if(this.form.value.id){
        msgSuccess = 'Curso atualizado com sucesso!';
        msgError = 'Erro ao atualizar curso, tente novamente!';
      }
      this.service.save(this.form.value).subscribe({
        next: (s) => {
          this.modal.showAlertSuccess(msgSuccess);
          setTimeout(() => {
            this.router.navigate(['/cursos']);
          }, 3000);
        },
        error: (e) => {
          this.modal.showAlertDanger(msgError);
        }
      })
      // CÓDIGO ACIMA, MESMA LÓGICA DO QUE O DE BAIXO, PORÉM REFATORADO
      /*if(this.form.value.id){
        this.service.update(this.form.value).subscribe({
          next: (v) => {
            this.modal.showAlertSuccess('Curso editado com sucesso!')
            setTimeout(() => {
              this.router.navigate(['/cursos']);
            }, 3000);
          },
          error: e => this.modal.showAlertDanger('Erro ao editar curso, tente novamente!'),
          complete: () => console.log('Update completo')
        })
      } else {
        this.service.create(this.form.value).subscribe({
          next: (v) => {
            this.modal.showAlertSuccess('Curso criado com sucesso!');
            // Usando o location
            // this.location.back();
            // Ou usando o navigate
            setTimeout(() => {
              this.router.navigate(['/cursos']);
            }, 3000);
          },
          error: (e) => {
            this.modal.showAlertDanger('Erro ao criar curso, tente novamente!');
          },
          complete: () => console.log('Request completa')
      });
      }*/
    }
  }
  
  onCancel() {
    this.submitted = false;
    this.form.reset();
    // console.log('onCancel');
  }
}
