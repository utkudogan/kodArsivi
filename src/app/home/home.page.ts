import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { FirebaseauthService } from '../firebaseauth.service';
import { Kod } from '../kod';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  deger: Kod = { baslik: null, icerikTuru: null, kodSatiri: null, tarih: null };
  kodlar: any;
  userID: string;

  constructor(
    private firebaseauthService: FirebaseauthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private angularFireAuth: AngularFireAuth
  ) {
    this.angularFireAuth.authState.subscribe((kullanici) => {
      if (kullanici) {
        this.userID = kullanici.uid;
        console.log(this.userID);
        this.kodListele();
      } else {
        this.router.navigateByUrl('/welcome');
      }
    });
  }

  logout() {
    this.firebaseauthService.logout();
  }

  kodListele() {
    this.firestoreService.kodListele('tarih', 'desc', this.userID).subscribe(
      (sonuc) => {
        this.kodlar = sonuc;
        console.log(sonuc);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  kodEkle() {
    this.deger.tarih = Math.floor(Date.now() / 1000);

    this.firestoreService
      .kodEkle(this.deger, this.userID)
      .then((sonuc) => {
        this.deger.baslik = null;
        this.deger.icerikTuru = null;
        this.deger.kodSatiri = null;
        this.deger.tarih = null;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  kodGuncelle(id, deger) {
    this.firestoreService.kodGuncelle(id, deger, this.userID);
    console.log(deger);
  }

  kodSil(id) {
    this.firestoreService.kodSil(id, this.userID);
    console.log('Kayıt Silindi!');
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Kod Sil',
      message: 'Bu kodu silmek istiyor musunuz?',
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Sil',
          handler: () => {
            this.kodSil(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertGuncelle(kayit) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Kod Güncelle',
      inputs: [
        {
          name: 'baslik',
          type: 'text',
          id: 'kodID',
          value: kayit.payload.doc.data().baslik,
          placeholder: ' Başlık Giriniz',
        },
        {
          name: 'icerikTuru',
          type: 'text',
          id: 'icerikTuruID',
          value: kayit.payload.doc.data().icerikTuru,
          placeholder: 'İçerik Türünü Giriniz',
        },
        {
          name: 'kodSatiri',
          type: 'textarea',
          id: 'kodSatiriID',
          value: kayit.payload.doc.data().kodSatiri,
          placeholder: 'Kod Satırlarını Giriniz',
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Güncelle',
          handler: (sonuc) => {
            let guncellenecekData = {
              baslik: null,
              icerikTuru: null,
              kodSatiri: null,
              tarih: null,
            };

            if (
              sonuc.baslik !== '' &&
              sonuc.icerikTuru !== '' &&
              sonuc.kodSatiri !== '' &&
              (sonuc.baslik !== kayit.payload.doc.data().baslik ||
                sonuc.icerikTuru !== kayit.payload.doc.data().icerikTuru ||
                sonuc.kodSatiri !== kayit.payload.doc.data().kodSatiri)
            ) {
              guncellenecekData.tarih = Math.floor(Date.now() / 1000);
              guncellenecekData.baslik = sonuc.baslik;
              guncellenecekData.icerikTuru = sonuc.icerikTuru;
              guncellenecekData.kodSatiri = sonuc.kodSatiri;
              this.kodGuncelle(kayit.payload.doc.id, guncellenecekData);
            } else {
              console.log('Değişiklik Yok');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertYeniEkle() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Kod Ekle',
      inputs: [
        {
          name: 'baslik',
          type: 'text',
          id: 'kodID',
          value: '',
          placeholder: ' Başlık Giriniz',
        },
        {
          name: 'icerikTuru',
          type: 'text',
          id: 'icerikTuruID',
          value: '',
          placeholder: 'İçerik Türünü Giriniz',
        },
        {
          name: 'kodSatiri',
          type: 'textarea',
          id: 'kodSatiriID',
          value: '',
          placeholder: 'Kod Satırlarını Giriniz',
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Kaydet',
          handler: (sonuc) => {
            if (
              sonuc.baslik !== '' &&
              sonuc.icerikTuru !== '' &&
              sonuc.kodSatiri !== ''
            ) {
              this.deger.tarih = Math.floor(Date.now() / 1000);
              this.deger.baslik = sonuc.baslik;
              this.deger.icerikTuru = sonuc.icerikTuru;
              this.deger.kodSatiri = sonuc.kodSatiri;
              this.kodEkle();
            } else {
              console.log('Değişiklik Yok');
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
