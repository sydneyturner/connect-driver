import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../auth.service';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public email: string;
  public password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
      // if (localStorage.getItem("TOKEN")) {
    //   this.app.getRootNav().setRoot(ProfilePage);
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  login() {
    let callback = (err) => {
      if (err) {
        // TODO: display error
        return;
      }

      this.navCtrl.setRoot(MapPage);
      // this.navCtrl.setRoot(TabsPage);
    }

    this.authService.login(this.email, this.password, callback);
  }

}
