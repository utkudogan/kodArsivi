import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(public angularFirestore: AngularFirestore) {}

  kodEkle(kayit, user) {
    return this.angularFirestore
      .doc<any>('kullanicilar/' + user)
      .collection('kod')
      .add(kayit);
  }

  kodListele(alan, yon, user) {
    return this.angularFirestore
      .doc<any>('kullanicilar/' + user)
      .collection('kod', (sirala) => sirala.orderBy(alan, yon))
      .snapshotChanges();
  }

  kodGuncelle(id, deger, user) {
    this.angularFirestore
      .doc('kullanicilar/' + user + '/kod/' + id)
      .update(deger);
  }

  kodSil(id, user) {
    this.angularFirestore.doc('kullanicilar/' + user + '/kod/' + id).delete();
  }
}
