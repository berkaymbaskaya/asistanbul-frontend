import { Component, OnInit } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import esriConfig from '@arcgis/core/config.js';
import MapView from '@arcgis/core/views/MapView';
import Locate from "@arcgis/core/widgets/Locate.js";
//
import { AfetistService } from './afetist.service';
import { afetPoiModel } from './afetist-interface';
import { kapanacakYollarModel } from './afetist-interface';
@Component({
  selector: 'app-afetist',
  templateUrl: './afetist.component.html',
  styleUrls: ['./afetist.component.scss'],
})
export class AfetistComponent implements OnInit {
  constructor(private afetistService: AfetistService) { }
  kapanacakYollarList: kapanacakYollarModel[] = [];
  afetpoiList: afetPoiModel[] = [];
  view: MapView  | null= null;
  popupTPoi:any;
  popupTYol:any;
  ngOnInit() {
    //PORTAL LOAD
    esriConfig.portalUrl = "https://cbs.elazig.bel.tr/portal/";
    let webmap = new WebMap({
      portalItem: {
        id: "1eee7531694a4a8782c1912d7557e6aa"
      }
    });
    this.view = new MapView({
      map: webmap,
      container: 'map', // HTML elementi nereye gömüleceğini belirtin,
    });
    webmap.loadAll().then(() => {
      console.log("webmap is load");
      const kapanabilecekYollar:any = webmap.allLayers.find(function (layer: any) {
        return layer.title === "Kapanabilecek Yollar"
      });
      const afetPoi:any = webmap.allLayers.find(function (layer: any) {
        console.log(layer)
        return layer.title === "Afet Poi"
      });
      console.log("**********",afetPoi.popupTemplate)
      this.popupTPoi=afetPoi.popupTemplate;
      this.popupTYol=kapanabilecekYollar.popupTemplate;

      if(this.view){
        let locateWidget = new Locate({
          view: this.view,
          scale: 5000
        });
        this.view?.ui.add(locateWidget, "top-right");
      }

      // locateWidget.locate().then(function (results) {
      //   console.log("LOCATE***",results)

      // })
      setTimeout(() => {
        this.afetistService.getkapanacakYollar(kapanabilecekYollar).then((res: any) => {
          console.log(res)
          res.forEach((item: any) => {
            this.kapanacakYollarList.push({ adi: item.attributes.adi, mahalle: item.attributes.mahalle, geometry: item.geometry, esriData :item});
          })
        });
        this.afetistService.getAfetPoi(afetPoi).then((res: any) => {
          console.log(res);
          res.forEach((item: any) => {
            this.afetpoiList.push({ adi: item.attributes.adi, mahalle: item.attributes.mahalle, geometry: item.geometry, esriData: item });
          })
        })
      }, 500);
      //"Afet Poi"

    });
  }
  goToFeatureYol(element: kapanacakYollarModel) {
    console.log(element);
    this.goToGeom(element.esriData,this.popupTYol)
  };
  goToFeaturePoi(element: afetPoiModel) {
    console.log(element);
    this.goToGeom(element.esriData,this.popupTPoi)

  };
  goToGeom(data: any,popupTemp:any) {
    data.popupTemplate=popupTemp;
    console.log("gelen data",data)
    this.view?.openPopup({
      features: [data] ,
      shouldFocus :true,
      location :data.geometry.centroid, });
      console.log("***",data.geometry.centroid)
      this.view?.goTo(data.geometry)

  };



}
