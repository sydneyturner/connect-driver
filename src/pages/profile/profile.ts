import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, MenuController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
import { Driver } from '../../models/driver';
import { HomePage } from '../home/home';
import { EditProfilePage } from '../edit-profile/edit-profile';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private token: string;
  public driver: Driver;
  public profile: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,  private http: Http, 
    private app: App, public modalCtrl: ModalController, public menu: MenuController) {
    this.driver = new Driver();
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    
    this.token = localStorage.getItem("Token");
    console.log("profile token", this.token)

    this.http.get("http://localhost:3000/driver?jwt=" + this.token)
      .subscribe(
        result => {
          console.log(result.json());
          this.profile = result.json().user;
          console.log(this.driver);
          console.log(this.profile);
          
        },
        error => {
          console.log(error);
        }
      );

  }

  navigateToEditProfileModal(){
    let modal = this.modalCtrl.create(EditProfilePage, { token: this.token });
    modal.present();
    // this.navCtrl.push(EditProfilePage, {
    //   token: this.token,}
    // );
  }

  logout() {
    // this.app.getRootNav().setRoot(HomePage);
    // this.navCtrl.popToRoot();
    localStorage.clear();
    this.navCtrl.push(HomePage);
  }

  // openMenu() {
  //   this.menu.enable(true);
  //   this.menu.toggle();
  //   // make sure to disable menu before pushing to new page
  // }

  // navigateToAddPayment(){
  //   // this.menu.enable(false);
  //   this.navCtrl.push(AddPaymentPage);
  // }


}