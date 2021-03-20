import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private store: Store<AppState>,
                private router: Router ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required ]
    })

    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.loading = ui.isLoading;
      })

  }

  ngOnDestroy(): void {

    if ( this.uiSubscription ) {
      this.uiSubscription.unsubscribe();
    }

  }

  login() {

    if ( this.loginForm.invalid ) { return }

    this.store.dispatch( ui.isLoading() )

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario( email, password )
      .then( credenciales => {
        // Swal.close();
        console.log(credenciales)
        this.store.dispatch( ui.stopLoading() )
        this.router.navigate(['/'])
      })
      .catch( err => {
        console.error(err);
        this.store.dispatch( ui.stopLoading() )
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href>Why do I have this issue?</a>'
        })
      })

  }

}
