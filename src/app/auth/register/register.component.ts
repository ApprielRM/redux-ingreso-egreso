import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  loading = false;
  uiSubscription: Subscription

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private store: Store<AppState>,
                private router: Router ) { }

  ngOnInit() {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      email:   ['', [Validators.required, Validators.email ]],
      password: ['', Validators.required],
    })

    this.uiSubscription = this.store.select('ui')
    .subscribe( ui => {
      this.loading = ui.isLoading;
      console.log('Cargando subs');
    })

  }

  ngOnDestroy(): void {

    if ( this.uiSubscription ) {
      this.uiSubscription.unsubscribe();
    }

  }

  crearUsuario() {

    if (this.registroForm.invalid) { return }

    this.store.dispatch( ui.isLoading() )

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { nombre, email, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, email, password)
      .then( credenciales => {
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
        console.log( credenciales )
      })
      .catch( err => {
        console.error(err);
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href>Why do I have this issue?</a>'
        })
      })

  }


}
