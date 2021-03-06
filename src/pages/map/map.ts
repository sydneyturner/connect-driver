import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { markDirty } from '@angular/core/src/render3';

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
  route: any;
  // oldMarker: any;
  markerLatLng: any;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage,
    public http: Http, private socket: Socket) {
    // private socket: Socket

    
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

      // this.geolocation.getCurrentPosition().then(pos => {
      //   let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      //   this.map.setCenter(latLng);
      //   this.map.setZoom(16);

      // set marker at current user's current position
      // this.currentLat = pos.coords.latitude;
      // this.currentLong = pos.coords.longitude;

      // let location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      let location = new google.maps.LatLng(-33.9288, 18.4108);

      this.map.panTo(location);
      // if (!this.marker) {
      //   var image = " /assets/imgs/driver.png";
      //   this.marker = new google.maps.Marker({
      //     position: location,
      //     map: this.map,
      //     animation: google.maps.Animation.DROP,
      //     icon: image,
      //     //this.markerColor("#f4c842"),
      //   });
      // }
      // else {
      //   this.marker.setPosition(location);
      // }
      var image = " /assets/imgs/driver.png";
      
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: image,
        draggable: true,
        //this.markerColor("#f4c842"),
      });


      // this.updatedMarker(this.marker);

      // google.maps.event.addListener(
      //   this.marker, 'drag', function() {
      //     document.getElementById('lat1').innerHTML = this.marker.position.lat().toFixed(20);
      //     document.getElementById('lng1').innerHTML = this.marker.position.lng().toFixed(20);
      //     // document.getElementById('zoom').innerHTML = map
      //   }
      // )

      // console.log(this.marker.position.lat());
      // console.log(this.marker.position.lng());

      // set stop locations and route
      this.setRedRoute();
      this.setLocations();
      // this.componentDidMount();
      // }).catch((error) => {
      //   console.log('Error getting location', error);
      // });

    });
  }



  shareLocation() {
      this.currentLat = this.marker.position.lat();
      this.currentLong = this.marker.position.lng();
      console.log(this.currentLat);
      console.log(this.currentLong);

    // this.geolocation.getCurrentPosition().then(pos => {
      // let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      this.socket.emit('sendLocation', {
        driverLat: this.currentLat,
        driverLng: this.currentLong
        // string: 'Hello this is Sydney'
      })
      console.log("Location is shared");
    

  }

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
    this.http.get("http://localhost:3000/stops/town-route", {

    })
      .subscribe(
        result => {
          var stops = [];
          stops = result.json();
          for (var i = 0; i < stops.length; i++) {
            // console.log(stops[i]);
            var lat = stops[i].lat;
            var lng = stops[i].lng;
            var position = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
              map: this.map,
              position: position,
              icon: this.markerColor("#f12dff"),
            })

          }
        },
        error => {
          console.log(error);
        }
      );
  }

  // later: generalize to all routes
  setRedRoute() {
    this.http.get("http://localhost:3000/routes", {

    })
      .subscribe(
        result => {
          var routes = [];
          routes = result.json();
          var locationCoords = [];
          // var route: any;
          for (var i = 0; i < routes.length; i++) {
            var lat = routes[i].lat;
            var lng = routes[i].lng;
            let latLng = new google.maps.LatLng(lat, lng);
            locationCoords.push(latLng)
            // console.log(locationCoords[i]);
          }
          // for(var i = 0; i < routes.length; i++) {
          //   console.log(routes[i]);
          // }
          this.route = new google.maps.Polyline({
            path: locationCoords,
            geodesic: true,
            strokeColor: '#1784c4',
            strokeOpacity: 1.0,
            strokeWeight: 10
          });

          this.route.setMap(this.map);
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