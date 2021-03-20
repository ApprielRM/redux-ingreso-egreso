import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos:number = 0;
  egresos :number = 0

  totalEgresos  :number = 0;
  totalIngresos :number = 0;

  subsIngresoEgreso: Subscription;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];
  public doughnutChartType: ChartType = 'doughnut';

  constructor( private store: Store<AppStateWithIngreso> ) { }

  ngOnInit() {
    this.subsIngresoEgreso = this.store.select('ingresosEgreso')
      .subscribe( ({ items }) => this.generarEstadisticas( items ) );
  }

  ngOnDestroy() {
    this.subsIngresoEgreso.unsubscribe();
  }

  generarEstadisticas( items: IngresoEgreso[] ) {

    this.ingresos = 0;
    this.egresos  = 0
    this.totalEgresos  = 0;
    this.totalIngresos = 0;


    for ( const item of items ) {
      if ( item.tipo === 'I' ) {
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }

    this.doughnutChartData = [ [this.totalIngresos, this.totalEgresos] ]

  }

}
