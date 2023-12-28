import { Injectable } from '@angular/core';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Query from "@arcgis/core/rest/support/Query.js";
@Injectable({
  providedIn: 'root'
})

export class AfetistService {

  constructor() { }
  kapanacakYollar:string="https://cbs.elazig.bel.tr/server/rest/services/DENEME_10/FeatureServer/0";
  kapanacakYollarTable = new FeatureLayer({
    url: this.kapanacakYollar
  });

  afetPoi:string="https://cbs.elazig.bel.tr/server/rest/services/DENEME_10/FeatureServer/1";
  afetPoiTable = new FeatureLayer({
   url: this.afetPoi
 });
  async getkapanacakYollar(layer:any){
    let query = layer.createQuery();
    query.where="31=31"
    query.outFields = ["*"];
    query.returnGeometry = true;
    const response= await this.kapanacakYollarTable.queryFeatures(query);
    return response.features;
  };
  async getAfetPoi(layer:any){
    this.afetPoiTable;
    let query =layer.createQuery();
    query.where="31=31"
    query.outFields = ["*"];
    query.returnGeometry = true;
    const response= await this.afetPoiTable.queryFeatures(query);
    return response.features;
  }
}
