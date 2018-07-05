import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  constructor(public navCtrl: NavController, private app: App) {
       if (localStorage.getItem("TOKEN")) {
      this.app.getRootNav().setRoot(ProfilePage);
    }
  }

  navigateToLogin() {
    this.navCtrl.push(LoginPage);
  }

  navigateToRegister(){
    this.navCtrl.push(RegistrationPage);
  }

}
