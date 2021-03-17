import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';

import { map } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor( public auth: AngularFireAuth,
                private firebase: AngularFirestore,
                private store: Store<AppState> ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser)
      if ( fuser ) {
        this.userSubscription = this.firebase.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firebaseUser: any) => {
            const user = Usuario.fireaseUser( firebaseUser );
            this.store.dispatch(  authActions.setUser( { user } ) )
          } )
      } else {
        if ( this.userSubscription ) {
          this.userSubscription.unsubscribe();
        }
        this.store.dispatch(  authActions.unSetUser() )
      }
    })
  }

  crearUsuario( nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
        const newUser = new Usuario( user.uid, nombre, user.email );
        return this.firebase.doc( `${user.uid}/usuario` ).set( { ...newUser } );
      } )
  }

  loginUsuario( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser !== null )
    )

  }

}
