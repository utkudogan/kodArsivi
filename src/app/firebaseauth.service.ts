import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class FirebaseauthService {
  constructor(public firebaseAuth: AngularFireAuth) {}

  async logout() {
    return await this.firebaseAuth
      .signOut()
      .then(() => {})
      .catch((error) => {});
  }

  async EpostaParolaKayitOl(user: User) {
    try {
      return await this.firebaseAuth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
      console.log('Kullanıcı Kayıt Hatası : ', error);
    }
  }

  async EpostaParolaGirisYap(user: User) {
    try {
      return await this.firebaseAuth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
      console.log('Kullanıcı Giriş Hatası : ', error);
    }
  }

  async sifreSifirla(eposta) {
    try {
      return await this.firebaseAuth.sendPasswordResetEmail(eposta);
    } catch (error) {
      console.log('Şifre Sıfırlama Hatası : ', error);
    }
  }
}
