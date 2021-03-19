import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = []
  ingresoEgresoSubs: Subscription;

  constructor(  private store: Store<AppState>,
                private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresoEgresoSubs = this.store.select('ingresosEgreso')
      .subscribe( ({ items }) => this.ingresosEgresos = items )
  }

  ngOnDestroy() {
    this.ingresoEgresoSubs.unsubscribe()
  }

  borrar( uid: string ) {
    this.ingresoEgresoService.borrarIngresoEgreso( uid )
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch( err => Swal.fire('Error', err.message, 'error') )
  }

}
