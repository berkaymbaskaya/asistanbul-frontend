import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { PoiService } from 'src/app/services/poi.service';
import { dataModel } from './data-interface';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
interface CustomTileLayerOptions extends L.TileLayerOptions {
  ext?: string;
}
class CustomTileLayer extends L.TileLayer {
  constructor(urlTemplate: string, options?: CustomTileLayerOptions) {
    super(urlTemplate, options);
  }
}
@Component({
  selector: 'app-wikist',
  templateUrl: './wikist.component.html',
  styleUrls: ['./wikist.component.scss'],
})
export class WikistComponent implements OnInit {
  @ViewChild('modal') detailModal: any | undefined;
  map: any;
  modalIsOpen: boolean = false;
  constructor(
    private poiService: PoiService,
    private modalCtrl: ModalController,
    private elementRef: ElementRef
  ) {}
  data: dataModel[] = [];
  ngOnInit() {
    this.mapSet();
    setInterval(() => {
      this.map.invalidateSize(); // doesn't seem to do anything
    }, 500);
  }
  mapSet() {
    let self = this;
    this.map = L.map('map').setView(
      [41.01577356880532, 28.958973106872385],
      14
    );
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
    this.poiService.wikistService().subscribe((res: any) => {
      console.log(res);
      const data = res.features;
      data.forEach((item: any) => {
        //vreatearray for html form service
        this.data.push({
          isim: item.properties.İsim,
          ilce_adi: item.properties.İlce,
          mahalle: item.properties.Mahalle,
          adres: item.properties.adres,
          enlem: item.geometry.coordinates[0],
          boylam: item.geometry.coordinates[1],
        });
        let obj: dataModel = {
          isim: item.properties.İsim,
          ilce_adi: item.properties.İlce,
          mahalle: item.properties.Mahalle,
          adres: item.properties.adres,
          enlem: item.geometry.coordinates[0],
          boylam: item.geometry.coordinates[1],
        };
        // create geoemtry form service
        let latlng = new L.LatLng(
          item.geometry.coordinates[1],
          item.geometry.coordinates[0]
        );
        var poiIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/13435/13435705.png',
          iconSize: [40, 40], // size of the icon
        });
        let popupTemplate = `<ion-card-title> ${item.properties.İsim} </ion-card-title>
        <ion-button id="id="button-submit"  class="popup-trigger" style="margin-top:30px"> Bilgi Al <ion-icon
        slot="icon-only"
        name="information-circle-outline"
      ></ion-icon> </ion-button>`;
        var popup = L.popup({ className: 'my-popup' })
          .setLatLng(latlng)
          .setContent(popupTemplate);

        L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {
          icon: poiIcon,
        })
          .on('click', this.markerClick)
          .addTo(self.map)
          .bindPopup(popup)
          .bindTooltip(item.properties.İsim);
      });
    });
  }
  markerClick(e: any) {
    console.log(e);
  }
  goMap(item: dataModel) {
    let self = this;
    this.map.flyTo([item.boylam, item.enlem], 15, {
      animate: true,
      duration: 0.5,
    });
    let latlng = new L.LatLng(item.boylam, item.enlem);
    var poiIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/13435/13435705.png',
      iconSize: [40, 40], // size of the icon
    });
    let popupTemplate = `<ion-card-title> ${item.isim} </ion-card-title>
    <ion-button id="id="button-submit"  class="popup-trigger" style="margin-top:30px"> Bilgi Al <ion-icon
    slot="icon-only"
    name="information-circle-outline"
  ></ion-icon> </ion-button>`;
    var popup = L.popup({ className: 'my-popup' })
      .setLatLng(latlng)
      .setContent(popupTemplate)
      .openOn(this.map);
  }

  async openDetail(item: dataModel) {
    console.log('detail', item);
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { data: item },
    });
    modal.present();
  }
}
