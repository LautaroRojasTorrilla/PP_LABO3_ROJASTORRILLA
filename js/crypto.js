import { CryptoBase } from "./cryptobase.js";

class Crypto extends CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitioWeb) {
        super(id, nombre, simbolo, fechaCreacion, precioActual);
        this.consenso = consenso;
        this.cantidadCirculacion = cantidadCirculacion;
        this.algoritmo = algoritmo;
        this.sitioWeb = sitioWeb;
    }

    verify() {
        return this.checkNombre();
    }

    checkNombre() {
        return { success: true, rta: null };
    }
}

export { Crypto };