import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

declare var google;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentLat: any;
  currentLong: any;
  marker: any;

  stops = [
    ['The Power and the Glory', -33.93009, 18.40808],
    ['The Backpack Hostel', -33.92715, 18.41047],
    ['Orphanage', -33.9258, 18.4132],
    ['Arcade Cafe', -33.9240931, 18.4148569],
    ['Hank Old Irish', -33.9216069, 18.4173553],
    ['La Parada', -33.92146, 18.41815],
    ['The Village Idiot', -33.91955, 18.42086],
    ['Bus Stop #1', -33.92085139, 18.42090853],
    ['Bus Stop #2', -33.9225382, 18.41906944],
    ['Bus Stop #3', -33.92392681, 18.41752751],
    ['Beerhouse', -33.92552, 18.41607],
    ['Bus Stop #4', -33.92654112, 18.41466696],
    ['Bus Stop #5', -33.92855058, 18.41214851],
    ['Yours Truly', -33.9302, 18.4109]
  ];

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage,
    public http: Http, private socket: Socket) {
  }

  ionViewDidLoad() {
    this.plt.ready().then(() => {
      let mapOptions = {
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.geolocation.getCurrentPosition().then(pos => {
        let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);


        // set marker at current user's current position
        this.currentLat = pos.coords.latitude;
        this.currentLong = pos.coords.longitude;

        let location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.map.panTo(location);

        if (!this.marker) {
          var image = " /assets/imgs/driver.png";
          this.marker = new google.maps.Marker({
            position: location,
            map: this.map,
            animation: google.maps.Animation.DROP,
            icon: image,
            //this.markerColor("#f4c842"),
          });
        }
        else {
          this.marker.setPosition(location);
        }
        // set stop locations and route
        this.setRedRoute();
        this.setLocations();
        // this.componentDidMount();
      }).catch((error) => {
        console.log('Error getting location', error);
      });

    });
  }


  // componentDidMount() {
  //   this.geolocation.getCurrentPosition().then(pos => {
  //     // let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  //     this.socket.emit('sendLocation', {
  //       driverLat: pos.coords.latitude,
  //       driverLng: pos.coords.longitude
  //     })
  //     console.log("Location is shared");
  //   })
    
  // }

  markerColor(color) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    };
  }

  // set stops
  setLocations() {
    for (var i = 0; i < this.stops.length; i++) {
      var location = this.stops[i];
      var position = new google.maps.LatLng(location[1], location[2]);
      var marker = new google.maps.Marker({
        map: this.map,
        position: position,
        icon: this.markerColor("#f12dff"),
      })
    }
  }

  setRedRoute() {
    this.http.get("http://localhost:3000/town-route?jwt=" + localStorage.getItem("TOKEN"), {

    })
      .subscribe(
        result => {
          var locationCoords = [];
          locationCoords = result.json();

          var route = new google.maps.Polyline({
            path: locationCoords,
            geodesic: true,
            strokeColor: '#700d77',
            strokeOpacity: 1.0,
            strokeWeight: 10
          });

          route.setMap(this.map);
        },

        error => {
          console.log(error);
        }
      );
  }

  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: 'Got you!'
      });
    }
    else {
      this.marker.setPosition(location);
    }
  }




}