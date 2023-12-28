import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  queryComplete: EventEmitter<any> = new EventEmitter();
  webServices: any = {
    yesilAlan: 'https://data.ibb.gov.tr/api/3/action/datastore_search',
  };
  constructor(private http: HttpClient, private snackBarMap: MatSnackBar) {}
  getMapoint(altkategori: Array<string>) {
    console.log('gelen veri servise', altkategori);
    let sqlString = '';
    for (let i = 0; i < altkategori.length; i++) {
      // Her öğe için OR bağlacını ekleyerek sorguyu oluştur
      sqlString += `ALTKATEGORI  = '${altkategori[i]}'`;

      // Son öğe değilse bir sonraki öğe için OR bağlacını ekle
      if (i < altkategori.length - 1) {
        sqlString += ' OR ';
      }
      console.log(sqlString);
    }
    const url = `https://services8.arcgis.com/2gvAr5l3DAsNjcNV/arcgis/rest/services/POI/FeatureServer/0//query?where=${sqlString}&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=`;
    return this.http.get(url);
  }
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(distance);
    return distance;
  }
  toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }
  showSnackbar() {
    this.snackBarMap.open('Haritadan konum seçiniz');
  }
  returnIcon(param: string) {
    var icon: any = {
      RESTORANT:
        'https://www.flaticon.com/free-icon/cutlery_4392607?term=eat&page=1&position=6&origin=search&related_id=4392607',
      CAFE: 'https://www.flaticon.com/free-icon/caffeine_3475354?term=cafe&page=1&position=11&origin=search&related_id=3475354',
      'BAKKAL/MARKET':
        'https://www.flaticon.com/free-icon/shopping-cart_10683181?term=shopping&page=1&position=22&origin=search&related_id=10683181',
      DURAK:
        'https://www.flaticon.com/free-icon/bus-stop_13098435?term=bus+station&page=1&position=20&origin=search&related_id=13098435',
      OTOPARK:
        'https://www.flaticon.com/free-icon/parking-lot_7276283?term=parking&page=1&position=12&origin=search&related_id=7276283',
      ASM: 'https://www.flaticon.com/free-icon/stethoscope_4751109?term=hospital&page=1&position=23&origin=search&related_id=4751109',
      ECZANE:
        'https://www.flaticon.com/free-icon/medicine_5929702?term=pharmacy&page=1&position=20&origin=search&related_id=5929702',
      HASTANE:
        'https://www.flaticon.com/free-icon/hospital_4354642?term=hospital&page=1&position=43&origin=search&related_id=4354642',
      POLIKLINIK:
        'https://www.flaticon.com/free-icon/hospital_2937454?term=hospital&page=1&position=20&origin=search&related_id=2937454',
      OTEL: 'https://www.flaticon.com/free-icon/hotel_3464494?term=hotel&page=1&position=7&origin=search&related_id=3464494',
      BELEDIYE:
        'https://www.flaticon.com/free-icon/goverment_6723402?term=goverment&page=1&position=5&origin=search&related_id=6723402',
      'POLIS MERKEZI':
        'https://www.flaticon.com/free-icon/police-badge_2100625?term=police&page=1&position=13&origin=search&related_id=2100625',
      ATM: 'https://www.flaticon.com/free-icon/atm_3464475?term=atm&page=1&position=1&origin=search&related_id=3464475',
      SINEMA:
        'https://www.flaticon.com/free-icon/clapperboard_12046855?term=cinema&page=1&position=44&origin=search&related_id=12046855',
      'SPOR SALONU':
        'https://www.flaticon.com/free-icon/barbell_1021753?term=gym&page=1&position=9&origin=search&related_id=1021753',
      'ANIT/TURBE':
        'https://www.flaticon.com/free-icon/democracy-monument_8773469?term=monument&page=1&position=3&origin=search&related_id=8773469',
      'DINI TESISLER':
        'https://www.flaticon.com/free-icon/mosque_10171239?term=mosque&page=1&position=7&origin=search&related_id=10171239',
      HAMAM:
        'https://www.flaticon.com/free-icon/bath-towel_9048652?term=bath&page=1&position=20&origin=search&related_id=9048652',
      'KULTUR-SANAT':
        'https://www.flaticon.com/free-icon/sculpture_6906217?term=cultur&page=1&position=7&origin=search&related_id=6906217',
      MEYDAN:
        'https://www.flaticon.com/free-icon/location_8396272?term=location&page=1&position=55&origin=search&related_id=8396272',
      MUZE: 'https://www.flaticon.com/free-icon/museum_9613943?term=museum&page=1&position=12&origin=search&related_id=9613943',
      'SARAY-KASIR':
        'https://www.flaticon.com/free-icon/buckingham-palace_1626612?term=palace&page=1&position=6&origin=search&related_id=1626612',
      TIYATRO:
        'https://www.flaticon.com/free-icon/theater_2185576?term=theatre&page=1&position=2&origin=search&related_id=2185576',
      'YESIL ALAN':
        'https://www.flaticon.com/free-icon/nature_4396420?term=nature&page=1&position=9&origin=search&related_id=4396420',
      AVM: 'https://www.flaticon.com/free-icon/shopping-mall_9201066?term=shopping+center&page=1&position=1&origin=search&related_id=9201066',
    };
    return icon.param;
  }

  wikistService() {
    let url = `https://services8.arcgis.com/2gvAr5l3DAsNjcNV/ArcGIS/rest/services/ilgicekiciyerler/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=`;
    return this.http.get(url);
  }
}
