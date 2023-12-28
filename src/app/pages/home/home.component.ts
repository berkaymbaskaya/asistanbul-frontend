import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { ChatComponent } from 'src/app/component/chat/chat.component';
import { PoiService } from 'src/app/services/poi.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { ModalController } from '@ionic/angular';
import { poiDataModel } from './poi.interface';
import { OrderByPipe } from 'src/app/pipes/orderby';
// Kendi özel seçenekler türünüzü tanımlayın
interface CustomTileLayerOptions extends L.TileLayerOptions {
  ext?: string;
}

class CustomTileLayer extends L.TileLayer {
  constructor(urlTemplate: string, options?: CustomTileLayerOptions) {
    super(urlTemplate, options);
  }
}

export interface myData {
  ilce: string;
  mahalle: string;
  enlem: number;
  boylam: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  loadVisible: boolean = true;
  map: any;
  modal: any;
  modalIsOpen: boolean = false;
  @ViewChild('drawer') drawer!: MatDrawer;
  filterPoi: myData[] = [];
  snackBarRef!: MatSnackBarRef<any>; // Snackbar referansını tutacak değişken
  deviceType: string = ''; // mobil or laptob
  @ViewChild('chatModal') chatModal: HTMLIonModalElement | undefined;
  @ViewChild('ionMenu') ionmMenu: any | undefined;

  modalPoint: number | null | undefined = 1.0;
  poiData: poiDataModel[] = [];
  myLoc: any = {
    lat: null,
    lon: null,
  };
  selectionMapVisible: boolean = false;
  ///******/
  constructor(
    private snackBar: MatSnackBar,
    private poiService: PoiService,
    private renderer: Renderer2,
    private el: ElementRef,
    private chatService: ChatService,
    private modalCtrl: ModalController
  ) {
    //event listeners
    // this.poiService.queryComplete.subscribe((res) => {
    //   console.log("sorguyu tamamladı");
    //   this.createPoiMarker(res);
    //   this.poiData=res.features;
    //   console.log("ion menu:",this.ionmMenu)
    //   this.ionmMenu?.open()
    // });
    // this.chatService.closeReq.subscribe(() => {
    //   console.log("kapatma isteği")
    //   this.modalIsOpen = false;
    // })
  }

  title = 'hackathon';
  ngAfterViewInit(): void {
    this.deviceType = this.getDeviceType();
    console.log('Cihaz Türü:', this.deviceType);
    if (this.deviceType === 'laptop') {
      setTimeout(() => {
        this.openAsistan();
      }, 1500);
    }
    this.mapSet();
    this.chatService.createThread().subscribe((res: any) => {
      console.log(res);
      this.chatService.threadid = res.id;
    });
    setInterval(() => {
      this.map.invalidateSize(); // doesn't seem to do anything
      console.log('fix');
    }, 500);
  }
  ngOnInit() {
    this.chatService.chatFinish.subscribe((res) => {
      console.log('data', res);
      //parse data
      console.log(res.kategori);
      let kategoriArray: Array<string> = res.kategori.split(',');
      console.log(kategoriArray);
      this.toogleModal();
      this.poiService.getMapoint(kategoriArray).subscribe((res: any) => {
        this.poiData = []; // clear previous data
        console.log(res);
        //HARİTA İŞLEMLERİ
        this.createPoiMarker(res.features);
        var selfLoc = new L.LatLng(this.myLoc.lat, this.myLoc.lon);
        res.features.forEach((item: any) => {
          var poiLoc = new L.LatLng(
            item.geometry.coordinates[0],
            item.geometry.coordinates[1]
          );
          let distance = this.distanceCalculater(
            this.myLoc.lat,
            this.myLoc.lon,
            item.geometry.coordinates[1],
            item.geometry.coordinates[0]
          );
          // let distance = selfLoc.distanceTo(poiLoc) / 1000;
          this.poiData.push({
            enlem: item.geometry.coordinates[0],
            boylam: item.geometry.coordinates[1],
            id: item.properties.id,
            mahalle: item.properties.mahalle,
            ustkategori: item.properties.ustkategori,
            ilce: item.properties.ilce,
            adres: item.properties.adres,
            altkategori: item.properties.altkategori,
            isim: item.properties.isim,
            distance: distance,
            icon: this.poiService.returnIcon(item.properties.altkategori),
          });
        });
        setTimeout(() => {
          console.log(this.poiData);
          console.log(this.ionmMenu);
          this.ionmMenu?.open();
        }, 250);
      });
    });
    this.chatService.locationOrselection.subscribe((res: any) => {
      console.log('lokasyon mu , seçim mi ? ', res);
      if (res === 'locate') {
        this.setLocate();
      } else if (res === 'select') {
        this.selectionMap();
        const myDiv = this.el.nativeElement.querySelector('#map');
        this.renderer.setStyle(myDiv, 'cursor', 'crosshair');
        console.log('crosshair');
      }
    });
  }
  asistanDefaultFirstMessage() {
    console.log(346364);
    this.chatService.closeReq.emit(true);
    this.chatService.firsMessageTrigger.emit(true);
  }

  mapSet() {
    let self = this;
    this.map = L.map('map').setView([41.1, 29], 11);
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 19,
    //   attribution:
    //     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    // }).addTo(this.map);

    const Stadia_AlidadeSmoothDark = new CustomTileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png',
      }
    );
    Stadia_AlidadeSmoothDark.addTo(this.map);

    // navigator.geolocation.getCurrentPosition(function (location) {
    //   console.log('loc', location);
    //   self.myLoc.lat = location.coords.latitude;
    //   self.myLoc.long = location.coords.latitude;
    //   var latlng = new L.LatLng(
    //     location.coords.latitude,
    //     location.coords.longitude
    //   );
    //   console.log(latlng);
    //   setTimeout(() => {
    //     self.map.flyTo(
    //       [location.coords.latitude, location.coords.longitude],
    //       15,
    //       {
    //         animate: true,
    //         duration: 0.5,
    //       }
    //     );
    //   }, 600);

    // self.map.locate({setView: true, maxZoom: 16,timeout:6000})

    // L.marker([location.coords.latitude, location.coords.longitude], {
    //   icon: humanIcon,
    // })
    // .addTo(self.map)
    // .bindPopup('Buradasın !')
    // .openPopup();
    setTimeout(() => {
      self.map.closePopup();
      self.map.invalidateSize(); // doesn't seem to do anything
    }, 4200);
    setTimeout(() => {
      self.loadVisible = false;
      // self.map.locate({ setView: true, maxZoom: 16, timeout: 6000 });
    }, 1400);
  }
  async openAsistan() {
    if (this.deviceType == 'mobil') {
      this.modalIsOpen = true;
      //  this.modal = await this.modalCtrl.create({
      //   component: ChatComponent,
      //   initialBreakpoint:1.0,
      //   breakpoints:[0,0.1,1.0],
      //   backdropDismiss:false,
      //   backdropBreakpoint:0.5
      // });
    } else if (this.deviceType == 'laptop') {
      this.snackBarRef = this.snackBar.openFromComponent(ChatComponent, {
        data: 'some data',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }
  closeAsistan() {
    console.log('kapattım');
    this.snackBarRef.dismiss();
  }

  createPoiMarker(data: any) {
    var myIcon: any;
    let self = this;
    // CALCULATE NEW EXTEND
    var minLat = data[0].geometry.coordinates[0];
    var maxLat = data[0].geometry.coordinates[0];
    var minLng = data[0].geometry.coordinates[1];
    var maxLng = data[0].geometry.coordinates[1];
    const poiData = data;
    data.forEach((item: any) => {
      let popupTemplate = `<divstyle="display: flex; flex-direction: column; margin-bottom: 1rem;width:300px"> <ion-card-title
      style="
        font-size: medium;
        margin-bottom: 5px;
        font-weight: 500;
        margin-top: 10px;
      "
      >${item.properties.isim}</ion-card-title
    >
    <ion-card-subtitle style="margin-bottom: 2px"
      >${item.properties.mahalle} / ${item.properties.ilce}</ion-card-subtitle
    >
    <ion-card-subtitle>${item.properties.adres}</ion-card-subtitle>
  </div>`;
      var popup = L.popup({ className: 'my-popup' });
      popup.setContent(popupTemplate);
      myIcon = L.icon({
        iconUrl: item.properties.icon,
        iconSize: [25, 25],
      });
      let marker = L.marker(
        [item.geometry.coordinates[1], item.geometry.coordinates[0]],
        {
          icon: myIcon,
        }
      ).bindPopup(popup);
      marker.addTo(this.map);
      var currentLat = item.geometry.coordinates[0];
      var currentLng = item.geometry.coordinates[1];
      // En küçük ve en büyük değerleri güncelle
      minLat = Math.min(minLat, currentLat);
      maxLat = Math.max(maxLat, currentLat);
      minLng = Math.min(minLng, currentLng);
      maxLng = Math.max(maxLng, currentLng);
    });
    setTimeout(() => {
      var boundingBox = L.latLngBounds(
        L.latLng(minLng, minLat),
        L.latLng(maxLng, maxLat)
      );
      this.map.fitBounds(boundingBox);
    }, 500);
    this.map.on('zoomend', function () {
      var currentZoom = self.map.getZoom();
      myIcon.iconSize = [10, 10];
      console.log(currentZoom);
    });
  }
  getDeviceType(): string {
    return window.innerWidth < 768 ? 'mobil' : 'laptop';
  }
  async toogleModal() {
    // this.modalIsOpen=false;
    this.modalPoint = await this.chatModal?.getCurrentBreakpoint();

    if (this.modalPoint == 0.1) {
      this.chatModal?.setCurrentBreakpoint(1.0);
      this.modalPoint = 1.0;
    } else if (this.modalPoint == 1.0) {
      this.chatModal?.setCurrentBreakpoint(0.1);
      this.modalPoint = 0.1;
    }
  }
  goToPoi(item: poiDataModel) {
    this.map.flyTo([item.boylam, item.enlem], 15, {
      animate: true,
      duration: 0.5,
    });
    let latlng = new L.LatLng(item.boylam, item.enlem);
    // var popup = L.popup(latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>'})
    // .openOn(this.map);
    let popupTemplate = `<divstyle="display: flex; flex-direction: column; margin-bottom: 1rem"> <ion-card-title
      style="
        font-size: medium;
        margin-bottom: 5px;
        font-weight: 500;
        margin-top: 10px;
      "
      >${item.isim}</ion-card-title
    >
    <ion-card-subtitle style="margin-bottom: 2px"
      >${item.mahalle} /${item.ilce}</ion-card-subtitle
    >
    <ion-card-subtitle>${item.adres}</ion-card-subtitle>
  </div>`;
    var popup = L.popup({ className: 'my-popup' })
      .setLatLng(latlng)
      .setContent(popupTemplate)
      .openOn(this.map);
  }
  setBoudingBox() {}

  setLocate() {
    let self = this;
    navigator.geolocation.getCurrentPosition(function (location) {
      console.log('loc', location);
      self.myLoc.lat = location.coords.latitude;
      self.myLoc.lon = location.coords.longitude;
      var latlng = new L.LatLng(
        location.coords.latitude,
        location.coords.longitude
      );
      console.log(latlng);
      setTimeout(() => {
        self.map.flyTo(
          [location.coords.latitude, location.coords.longitude],
          15,
          {
            animate: true,
            duration: 0.5,
          }
        );
      }, 600);
      var humanIcon = L.icon({
        iconUrl:
          'https://cdn3.iconfinder.com/data/icons/maps-and-navigation-7/65/68-512.png',
        iconSize: [40, 40], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -96], // point from which the popup should open relative to the iconAnchor
      });
      L.marker([location.coords.latitude, location.coords.longitude], {
        icon: humanIcon,
      })
        .addTo(self.map)
        .bindPopup('Buradasın !')
        .openPopup();
    });
  }
  selectionMap() {
    this.selectionMapVisible = true;

    // this.poiService.showSnackbar();
    this.map.on('click', (e: any) => {
      const myDiv = this.el.nativeElement.querySelector('#map');
      this.renderer.setStyle(myDiv, 'cursor', 'pointer');
      this.selectionMapVisible = false;
      console.log(e);
      if (this.myLoc.lat != null) {
        console.log('değer seçili');
        return;
      } else if (this.myLoc.lat == null) {
        console.log('edğer boş');
        this.myLoc.lat = e.latlng.lat;
        this.myLoc.lon = e.latlng.lng;
        console.log(this.myLoc);
        var humanIcon = L.icon({
          iconUrl:
            'https://cdn3.iconfinder.com/data/icons/maps-and-navigation-7/65/68-512.png',
          iconSize: [40, 40], // size of the icon
          shadowSize: [50, 64], // size of the shadow
          iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
          popupAnchor: [-3, -96], // point from which the popup should open relative to the iconAnchor
        });

        this.map.flyTo([this.myLoc.lat, this.myLoc.lon], 15, {
          animate: true,
          duration: 0.5,
        });
        L.marker([this.myLoc.lat, this.myLoc.lon], {
          icon: humanIcon,
        })
          .addTo(this.map)
          .bindPopup('Buradasın !')
          .openPopup();
      }
    });
  }
  distanceCalculater(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadius = 6371; // Earth's mean radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000; // Distance in meters

    return distance;
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180);
  }
  googleMaps(enlem: number, boylam: number) {
    console.log('https://maps.google.com/?q=' + boylam, ',' + enlem);
    window.open(`https://maps.google.com/?q=${boylam},${enlem}`, '_blank');
  }
  whatsApp(enlem: number, boylam: number) {
    let urlEncode = btoa(`https://maps.google.com/?q=${boylam},${enlem}`);
    window.open(`https://wa.me/905065323498?text=${urlEncode}`, '_blank');
    console.log(`https://wa.me/905065323498?text=${urlEncode}`);
  }
}
