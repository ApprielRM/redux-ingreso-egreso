import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform( items: IngresoEgreso[]): IngresoEgreso[] {

    return items;

    // if ( items.length === 0 ) return;

    // console.log('pipe ', items)
    // return items.sort( (a, b) => {

    //   console.log('pipe ', a , b)
    //   if ( a.tipo === 'E' ) {
    //     return -1;
    //   }
    //     return 1;
    // });

  }

}
