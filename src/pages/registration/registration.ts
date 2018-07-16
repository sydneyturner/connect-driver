import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
// import { ProfilePage } from '../profile/profile';
// import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  // public email: string;
  // public password: string;
  // public passwordCheck: string;
  // public firstname: string;
  // public lastname: string;

  public registration: FormGroup;
  public submitted: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public alertCtrl: AlertController, public formBuilder: FormBuilder) {
      this.registration = this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        passwordCheck: ['', Validators.required],
      })
  }

  onSubmit() {
    this.submitted = true;

    if (this.registration.valid) {
      this.register();
    }
  }

  // passwordsDontMatch(){
  //   const alert = this.alertCtrl.create({
  //     title: 'Passwords do not match',
  //     subTitle: 'Please enter again',
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  register() {
    if (this.registration.get('password').value == this.registration.get('passwordCheck').value) {
      this.http.post("http://localhost:3000/registerDriver", {
        password: this.registration.get('password').value,
        firstname: this.registration.get('firstname').value,
        lastname: this.registration.get('lastname').value,
        email: this.registration.get('email').value
      })
        .subscribe(
          result => {
            console.log(result);
            this.accountCreated();
            this.navCtrl.push(LoginPage, {
              password: this.registration.get('password').value,
              firstname: this.registration.get('firstname').value,
              lastname: this.registration.get('lastname').value,
              email: this.registration.get('email').value,
            });
          },
          error => {
            console.log(error);
          }
        );
    }
    else {
      this.passwordsNotMatching();
      console.log('Passwords do not match');
    }
    

    // in the future: if user is already registered, send alert.

  }

  passwordsNotMatching() {
    const alert = this.alertCtrl.create({
      title: 'Passwords do not match',
      subTitle: 'Please check your passwords and try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  accountCreated() {
    const alert = this.alertCtrl.create({
      title: 'Account created',
      subTitle: 'Please login.',
      buttons: ['OK']
    });
    alert.present();
  }

}
