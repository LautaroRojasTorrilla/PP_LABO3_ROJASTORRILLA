import { Crypto } from "./crypto.js";
import { leerLS, escribirLS, jsonToObject, objectToJson, limpiar } from "./local-storage.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

// Constantes y variables globales
const KEY_STORAGE = "cryptos";
const formulario = document.forms[0];
const btnGuardar = document.getElementById("btn-guardar");
const btnModificar = document.getElementById("btn-modificar");
const btnEliminar = document.getElementById("btn-eliminar");
const btnBorrar = document.getElementById("btn-borrar");
const items = [];

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    cargarItems();
    escuchandoFormulario();
    escucharGuardar();
    escucharModificar();
    agregarEventoClicTabla();
    escucharBorrarTodo(); // Agregamos la función de escucha para el botón de borrar
}

function escucharBorrarTodo() {
    btnBorrar.addEventListener("click", () => {
        const confirmacion = confirm("¿Estás seguro de que quieres borrar todos los datos?");
        if (confirmacion) {
            limpiar(KEY_STORAGE); // Limpiar el local storage
            items.length = 0; // Vaciar el array de items
            rellenarTabla(); // Vaciar la tabla
            alert("Todos los datos han sido borrados.");
        }
    });
}

function agregarEventoClicTabla() {
    const tbody = document.querySelector("#data-table tbody");
    const columnas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];

    tbody.addEventListener("click", (event) => {
        const fila = event.target.closest("tr");
        const columnasFila = fila.querySelectorAll("td");

        console.log(columnas);

        const datos = {};

        const encabezados = document.querySelectorAll("#data-table thead th");

        columnasFila.forEach((celda, index) => {
            const columna = encabezados[index].textContent.trim(); 
            console.log(columna);
            const valor = celda.textContent.trim();

            console.log("Columna:", columna, "Valor:", valor);

            if (columna && valor) {
                datos[columna] = valor;
            }
        });

        console.log(datos);

        cargarDatosEnFormulario(datos);
    });
}

async function cargarItems() {
    mostrarSpinner();

    const str = await leerLS(KEY_STORAGE);
    const objetos = jsonToObject(str) || [];

    console.log("Contenido del local storage:", objetos);

    objetos.forEach(obj => {
        const model = new Crypto(
            obj.id,
            obj.nombre,
            obj.simbolo,
            obj.fechaCreacion,
            obj.precioActual,
            obj.consenso,
            obj.cantidadCirculacion,
            obj.algoritmo,
            obj.sitioweb
        );
        
        items.push(model);
    });

    ocultarSpinner();

    rellenarTabla();
}

function crearCelda(contenido) {
    const celda = document.createElement("td");
    celda.textContent = contenido;
    return celda;
}

function crearFila(item, columnas) {
    const fila = document.createElement("tr");
    columnas.forEach(columna => {
        fila.appendChild(crearCelda(item[columna]));
    });
    return fila;
}

function rellenarTabla() {
    const tabla = document.getElementById("data-table");
    const tbody = tabla.querySelector('tbody');

    if (!tabla || !tbody) {
        console.error("No se encontró la tabla o tbody.");
        return;
    }

    tbody.innerHTML = '';

    const columnas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        fragment.appendChild(crearFila(item, columnas));
    });

    tbody.appendChild(fragment);
}

function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const model = obtenerModeloDeFormulario();
        console.log(model);

        const respuesta = model.verify();

        if (respuesta.success) {
            mostrarAlerta("Formulario verificado exitosamente. ");
        } else {
            mostrarAlerta(respuesta.rta);
        }
    });
}

function obtenerModeloDeFormulario() {
    const fechaActual = new Date();
    const id = fechaActual.getTime();
    const nombre = formulario.querySelector("#nombre").value;
    const simbolo = formulario.querySelector("#simbolo").value;
    const fechaCreacion = fechaActual.getTime();
    const precioActual = formulario.querySelector("#precio").value;
    const consensoSelect = document.getElementById('consenso');
    const consenso = consensoSelect.options[consensoSelect.selectedIndex].value;
    const cantidadCirculacion = formulario.querySelector("#cantidad").value;
    const algoritmoSelect = document.getElementById('algoritmo');
    const algoritmo = algoritmoSelect.options[algoritmoSelect.selectedIndex].value;
    const sitioWeb = formulario.querySelector("#sweb").value;

    console.log(simbolo);
    return new Crypto(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitioWeb);
}

// Función para cargar los datos del anuncio en el formulario para modificar
function cargarDatosEnFormulario(datos) {
    console.log(formulario);
    console.log(Object.keys(datos));
    Object.keys(datos).forEach(key => {
        const input = formulario.querySelector(`#${key}`);
        console.log(input);
        if (input) {
            input.value = datos[key];
        }
    });
}

// Función para escuchar el evento de modificar
function escucharModificar() {
    btnModificar.addEventListener("click", async () => {
        const model = obtenerModeloDeFormulario();
        const respuesta = model.verify();

        if (respuesta.success) {
            try {
                const index = items.findIndex(item => item.id === model.id);
                items[index] = model;
                await escribirLS(KEY_STORAGE, objectToJson(items));

                actualizarFormulario();
                cargarItemsYRellenarTabla();
            } catch (error) {
                mostrarError(error);
            }
        } else {
            mostrarAlerta(respuesta.rta);
        }
    });
}

async function guardarModelo(model) {
    items.push(model);
    await escribirLS(KEY_STORAGE, objectToJson(items));
}

async function cargarItemsYRellenarTabla() {
    cargarItems();
    rellenarTabla();
}

function mostrarError(error) {
    alert(error);
}

function mostrarAlerta(mensaje) {
    alert(mensaje);
}

function actualizarFormulario() {
    formulario.reset();
}

function escucharGuardar() {
    btnGuardar.addEventListener("click", async () => {
        const model = obtenerModeloDeFormulario();
        console.log(model);

        const respuesta = model.verify();

        if (respuesta.success) {
            try {
                await guardarModelo(model);
                actualizarFormulario();
                cargarItemsYRellenarTabla();
            } catch (error) {
                mostrarError(error);
            }
        } else {
            mostrarAlerta(respuesta.rta);
        }
    });
}
