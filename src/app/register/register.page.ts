import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseauthService } from '../firebaseauth.service';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userData: User = new User();

  constructor(
    private firebaseAuthService: FirebaseauthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async kayit() {
    const kullanici = await this.firebaseAuthService.EpostaParolaKayitOl(
      this.userData
    );
    if (kullanici) {
      console.log('Kullanıcı oluşturuldu !');
      this.router.navigateByUrl('/home');
    }
  }
}
