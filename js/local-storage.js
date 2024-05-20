const delay = 2.5;

export function leerLS(clave) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const valor = JSON.parse(localStorage.getItem(clave));
                resolve(valor);
            }
            catch (error) {
                reject(error);
            }
        }, delay * 1000);
    });
}

export function escribirLS(clave, valor) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.setItem(clave, JSON.stringify(valor));
                resolve();
            } catch (error) {
                reject(error);
            }
        }, delay * 1000);
    });
}

export function limpiar(clave) {
    localStorage.removeItem(clave);
}

export function jsonToObject(jsonString) {
    return JSON.parse(jsonString);
}

export function objectToJson(objeto) {
    return JSON.stringify(objeto);
}
