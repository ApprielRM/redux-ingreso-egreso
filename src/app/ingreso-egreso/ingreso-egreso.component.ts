import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'I';
  cargando: boolean = false;
  subscriptionUi: Subscription

  constructor(  private fb: FormBuilder,
                private IngresoEgresoService: IngresoEgresoService,
                private store: Store<AppState> ) { }

  ngOnInit() {

    this.subscriptionUi = this.store.select('ui')
      .subscribe( ({  isLoading }) => this.cargando = isLoading )

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required ],
      monto: ['', Validators.required ]
    })

  }

  ngOnDestroy() {
    if ( this.subscriptionUi ) {
      this.subscriptionUi.unsubscribe();
    }
  }

  guardar() {


    if ( this.ingresoForm.invalid ) { return }

      this.store.dispatch( ui.isLoading() )

      const { descripcion, monto } = this.ingresoForm.value;
      const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );
      this.IngresoEgresoService.crearIngresoEgreso( ingresoEgreso )
        .then( () => {
          this.ingresoForm.reset();
          this.store.dispatch( ui.stopLoading() );
          Swal.fire('Registro creado', descripcion, 'success')
        })
        .catch( err => {
          this.store.dispatch( ui.stopLoading() );
          Swal.fire('Error', err.message, 'error')
        } )

    }

}
