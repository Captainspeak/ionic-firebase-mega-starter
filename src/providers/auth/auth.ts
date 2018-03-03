import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  loginUser(email: string, password: string): Promise<firebase.User> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string
  ): Promise<firebase.User> {
    try {
      const newUser: firebase.User = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await newUser.sendEmailVerification();

      const userProfileDocument: AngularFirestoreDocument<
        any
      > = this.firestore.doc(`userProfile/${newUser.uid}`);

      await userProfileDocument.set({
        id: newUser.uid,
        email: email,
        displayName: displayName,
      });

      return newUser;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async googleSignIn() {
    // This will hold the logic for Google+ login
  }
}
