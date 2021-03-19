import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  subsUser: Subscription;

  constructor( private authService: AuthService,
                private router: Router,
                private store: Store<AppState> ) { }

  ngOnInit() {
    this.subsUser = this.store.select('user')
                      .pipe(
                        filter( ({ user }) => user != null )
                      )
                      .subscribe( ({ user }) => this.nombre = user.nombre )
  }

  ngOnDestroy(): void {
    this.subsUser.unsubscribe();
  }

  logout() {

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    this.authService.logout()
      .then( () => {
        Swal.close();
        this.router.navigate(['/login']);
      })

  }

}
