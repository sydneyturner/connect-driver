import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { MapPage } from '../pages/map/map';
import { Driver } from '../models/driver';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  private token: string;
  public driver: Driver;
  public profile: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private http: Http) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Map', component: MapPage },
      { title: 'Profile', component: ProfilePage},
    ];

    this.driver = new Driver();
    this.driverInfo();
  }


  driverInfo() {
    this.token = localStorage.getItem("Token");
    console.log("profile token", this.token)

    this.http.get("http://localhost:3000/driver?jwt=" + this.token)
      .subscribe(
        result => {
          console.log(result.json());
          this.profile = result.json().user;
  
          console.log(this.profile);
          
        },
        error => {
          console.log(error);
        }
      );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    // this.app.getRootNav().setRoot(HomePage);
    // this.navCtrl.popToRoot();
    localStorage.clear();
    this.nav.push(HomePage);

  }
}
