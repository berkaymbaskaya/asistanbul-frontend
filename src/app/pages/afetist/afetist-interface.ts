import Graphic from "@arcgis/core/Graphic.js";

export interface afetPoiModel{
    adi:string;
    mahalle:string;
    geometry:any;
    esriData:any
}
export interface kapanacakYollarModel{
    adi:string;
    mahalle:string;
    geometry:any;
    esriData:Graphic
}