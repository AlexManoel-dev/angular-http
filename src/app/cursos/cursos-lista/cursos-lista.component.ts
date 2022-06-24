import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { Curso } from '../curso';
import { Observable } from 'rxjs';

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

  constructor(private service: CursosService) { }

  ngOnInit(): void {
    // this.service.list()
    //   .subscribe(dados => this.cursos = dados);

    // cursos$ é um observable, e está recebendo um observable, por isso, está correto
    this.cursos$ = this.service.list();
  }

}
