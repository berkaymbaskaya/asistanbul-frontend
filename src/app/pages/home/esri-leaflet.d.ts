declare module 'esri-leaflet' {
  interface Vector {
    // Define the properties and methods of the 'Vector' class here
    // For example:
    // property1: string;
    // method1(): void;
  }

  interface Esri {
    Vector: Vector;
  }

  const esri: Esri;

  export = esri;
}
