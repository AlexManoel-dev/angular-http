import { AlertModalService } from './../../shared/alert-modal.service';
import { CursosService } from './../cursos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]]
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
    }
  }
  
  onCancel() {
    this.submitted = false;
    this.form.reset();
    // console.log('onCancel');
  }
}
