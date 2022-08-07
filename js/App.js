import {muestraToast} from "./tostify.js";
import {startTime} from "./reloj.js";

const mainOculto = document.querySelector(".mainOculto");
const estadCamas = document.querySelector("#estadisticas");
const pacientesInternados = [];
const pacientesEgresados = [];
const salasDelHospital = [];
const usuarios = [];
let pacienteABorrar = [];
let pacienteAEditar = [];
const pacientesGuardados = JSON.parse(localStorage.getItem("pacientes"));
const salasGuardadas = JSON.parse(localStorage.getItem("salas"));
const egresosGuardados = JSON.parse(localStorage.getItem("egresos"));
const tarjeta = document.getElementById("pacientes");
const egreso = document.querySelector("#egresos");
let salaSeleccionada = "Todos";
const tituloSala = document.getElementById("tituloLogin");
const modalEditar = new bootstrap.Modal(document.querySelector("#modalEditarPaciente"));
let ingresoUsuario = sessionStorage.getItem("usuario");
let ingresoPassword = sessionStorage.getItem("password");
const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));

// Lee Pacientes
const leePacientes = async () => {
    console.time();
    if(localStorage.getItem("pacientes")){
        // Pushea pacientes del localStorage
        pusheaLocalStorage();
    } else {
        try {
            // Desde API
            const response = await fetch('https://central930ros.com/h_centenario/pacientes');
            const data = await response.json();
            // Pushea
            data.forEach((post) => {
                pacientesInternados.push(new Paciente(post.id,post.nombre,post.apellido,post.edad,post.sala,post.cama,post.diagnostico));
            });
            ordenarPacientesSala();
        }
        catch (error) {
            console.log('Error: ', error);
        }
        guardaLocalStorage();
        console.log("Pushea desde API y guarda en localStorage");
        }
        leeSalas();
}

// Lee Salas del Hospital
const leeSalas = async () => {
    if(localStorage.getItem("salas")){
        // Pushea salas del localStorage
        pusheaLocalStorageSalas();
    } else {
        try {
            // Desde JSON
            const response = await fetch('js/salas.json');
            const data = await response.json();
            // Pushea
            data.forEach((data) => {
                salasDelHospital.push(new SalasHospital(data.id,data.sala,data.cantCamas,data.camasOcupadas));
            });
        }
        catch (error) {
            console.log('Error: ', error);
        }
        guardaLocalStorageSalas();
        console.log("Pushea desde salas.json");
        }
        leeEgresos();
}

// Lee Pacientes egresados
const leeEgresos = async () => {
    if(localStorage.getItem("egresos")){
        // Pushea salas del localStorage
        pusheaLocalStorageEgresos();
    }
    muestraInfo();
    pintaEgresados();
    console.timeEnd();
    // Verifica usuario Usando operador ternario
    // condicion ? true:false
    (ingresoUsuario)&&(ingresoPassword)?((console.log("Usuario ya logeado")),(mainOculto.style.display = 'block'),(imprimePacientes())):((modalLogin.show()),(console.log("Muestra modal login, usuario NO logeado")));
}

// Clase salasHospital
class SalasHospital {
    constructor (id,sala,cantCamas,camasOcupadas){
        this.id = id,
        this.sala = sala,
        this.cantCamas = cantCamas,
        this.camasOcupadas = camasOcupadas
    }
    ocupaCama(){
        this.camasOcupadas ++;
    }
    pintar(){
        estadCamas.insertAdjacentHTML('beforeend', `
                                    <ul class="list-group mb-2">
                                        <li class="list-group-item">${this.sala}</li>
                                        <ul class="list-group-item">
                                            <li class="list-group-item">Camas totales: ${this.cantCamas}</li>
                                            <li class="list-group-item">Camas ocupadas: ${this.camasOcupadas}</li>
                                            <li class="list-group-item">Camas libres: ${this.cantCamas-this.camasOcupadas}</li>
                                        </ul>
                                    </ul>
                                    `);
    }
}

//Clase paciente
class Paciente {
    constructor (id,nombre,apellido,edad,sala,cama,diagnostico){
        this.id = id,
        // this.fechaIngreso = fechaIngreso,
        this.nombre = mayuscalaPrimerLetra(nombre),
        this.apellido = mayuscalaPrimerLetra(apellido),
        this.edad = edad,
        this.sala = sala,
        this.cama = cama,
        this.diagnostico = mayuscalaPrimerLetra(diagnostico),
        this.epicrisis = `Paciente ${this.apellido}, ${this.nombre} de ${this.edad} años de edad, internado en ${this.sala} cama ${this.cama}, ingresa el ${this.fechaIngreso}  con diagnóstico de ${this.diagnostico}.`;
    }
    imprimir(){
        const itemAccordion = document.createElement('div');
        itemAccordion.innerHTML = `
                        <div class="accordion-item m-1">
                            <h2 class="accordion-header" id="heading${this.id}">
                                <button class="accordion-button collapsed" type="button" title="Oprima para mas información" data-bs-toggle="collapse" data-bs-target="#collapse${this.id}" aria-expanded="true" aria-controls="collapse${this.id}"><span class="badge bg-secondary p-2 m-2">Cama ${this.cama}</span>${this.apellido}, ${this.nombre} (${this.edad} años) - Diagnóstico: ${this.diagnostico}</button>
                            </h2>
                            <div id="collapse${this.id}" class="accordion-collapse collapse" aria-labelledby="heading${this.id}" data-bs-parent="#pacientes">
                                <div class="accordion-body">
                                    <p><strong>Información</strong></p>
                                    <p>${this.epicrisis}</p>
                                    <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEliminar${this.id}">Egreso</button>
                                    <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEdit${this.id}">Editar</button>
                                </div>
                            </div>
                        </div>
                        `;
            tarjeta.appendChild(itemAccordion);
            const botonPacienteEliminar = document.getElementById(`btnPacienteEliminar${this.id}`);
            botonPacienteEliminar.addEventListener("click", () => {
                pacienteABorrar = pacientesInternados.find(paciente => paciente.id === this.id);
                pacienteABorrar.eliminar();
            });
            const botonPacienteEdit = document.getElementById(`btnPacienteEdit${this.id}`);
            botonPacienteEdit.addEventListener("click", () => {
                pacienteAEditar = pacientesInternados.find(paciente => paciente.id === this.id);
                pacienteAEditar.editar();
            });
    }
    eliminar(){
        (async () => {
            await Swal.fire({
                title: `Motivo del egreso del paciente <b>${this.nombre} ${this.apellido}</b>`,
                input: 'select',
                inputOptions: {
                    'Egreso': {
                        alta: 'Alta',
                        derivado: 'Derivado',
                        fuga: 'Fuga',
                        obito: 'Obito'
                    }
                },
                inputPlaceholder: 'Seleccione...',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            resolve()
                            if(pacienteABorrar){
                                pacientesInternados.splice(pacientesInternados.indexOf(pacienteABorrar), 1);
                                pacientesEgresados.push(new Egresado(this.id,this.apellido,this.nombre,this.edad,this.sala,this.cama,this.diagnostico,value));
                                guardaLocalStorage();
                                guardaLocalStorageSalas();
                                guardaLocalStorageEgresos();
                                imprimePacientes();
                                muestraInfo();
                                if(salaSeleccionada=="Todos"){
                                    muestraTodos();
                                } else {
                                    filtraSala(salaSeleccionada);
                                }
                                muestraToast(`El paciente ${this.nombre} ${this.apellido} ha egresado: ${value}`);
                                pintaEgresados();
                                console.log(pacientesEgresados);
                            }
                        } else {
                            resolve('Debe elegir una opción')
                            }
                    })
                }
            })
        })()
    }
    editar(){
        document.getElementById("idEdit").value = this.id;
        document.getElementById("nombreEdit").value = this.nombre;
        document.getElementById("apellidoEdit").value = this.apellido;
        document.getElementById("edadEdit").value = this.edad;
        document.getElementById("salaEdit").value = this.sala;
        document.getElementById("salaVieja").value = this.sala;
        document.getElementById("camaEdit").value = this.cama;
        document.getElementById("camaVieja").value = this.cama;
        document.getElementById("diagnosticoEdit").value = this.diagnostico;
        modalEditar.show();
    }
}

class Egresado {
    constructor (id,apellido,nombre,edad,sala,cama,diagnostico,egreso) {
        this.id = id,
        this.apellido = apellido,
        this.nombre = nombre,
        this.edad = edad,
        this.sala = sala,
        this.cama = cama,
        this.diagnostico = diagnostico,
        this.egreso = egreso
    }
    imprimir(){
        const itemAccordion = document.createElement('div');
        itemAccordion.innerHTML = `
                        <div class="accordion-item m-1">
                            <h2 class="accordion-header" id="heading${this.id}">
                                <button class="accordion-button collapsed" type="button" title="Oprima para mas información" data-bs-toggle="collapse" data-bs-target="#collapse${this.id}" aria-expanded="true" aria-controls="collapse${this.id}"><span class="badge bg-secondary p-2 m-2">Cama ${this.cama}</span>${this.apellido}, ${this.nombre} (${this.edad} años) - Diagnóstico: ${this.diagnostico}</button>
                            </h2>
                            <div id="collapse${this.id}" class="accordion-collapse collapse" aria-labelledby="heading${this.id}" data-bs-parent="#pacientes">
                                <div class="accordion-body">
                                    <p><strong>Información</strong></p>
                                    <p><strong>Egreso:</strong> ${this.egreso}</p>
                                </div>
                            </div>
                        </div>
                        `;
        egreso.appendChild(itemAccordion);
    }
}

// Egresados
function pintaEgresados(){
    egreso.innerHTML="";
    pacientesEgresados.forEach(p => {
        p.imprimir();
    });
    pacientesEgresados.length === 0 && (egreso.innerHTML = `<h5 class="text-center">No hay pacientes egresados</h5>`);
}

// Evento de Carga de DOM
document.addEventListener("DOMContentLoaded", () => {
    leePacientes();
    startTime();
});

// Carga Usuarios con función asíncrona anónima
(async ()=>{
    try {
        const response = await fetch('js/usuarios.json')
        const data = await response.json();
        data.forEach((u) => {
            usuarios.push(u);
        });
    }
    catch(error) {   
        console.log('error: ' , error);
    }
})();

// Focus en input usuario
const modalLoginFocus = document.getElementById('modalLogin');
const nombreLogin = document.getElementById("nombreUsuario");
modalLoginFocus.addEventListener('shown.bs.modal', () => {
    nombreLogin.focus();
});

// Funcion pushea LocalStorage
function pusheaLocalStorage(){
    for (const paciente of pacientesGuardados){
        pacientesInternados.push(new Paciente(paciente.id,paciente.nombre,paciente.apellido,paciente.edad,paciente.sala,paciente.cama,paciente.diagnostico));
    }
}
function pusheaLocalStorageSalas(){
    for (const sala of salasGuardadas){
        salasDelHospital.push(new SalasHospital(sala.id,sala.sala,sala.cantCamas,sala.camasOcupadas));
    }
}
function pusheaLocalStorageEgresos(){
    for (const paciente of egresosGuardados){
        pacientesEgresados.push(new Egresado(paciente.id,paciente.nombre,paciente.apellido,paciente.edad,paciente.sala,paciente.cama,paciente.diagnostico,paciente.egreso));
    }
}

// Funcion guarda LocalStorage
function guardaLocalStorage(){
    localStorage.setItem("pacientes", JSON.stringify(pacientesInternados));
}
function guardaLocalStorageSalas(){
    localStorage.setItem("salas", JSON.stringify(salasDelHospital));
}
function guardaLocalStorageEgresos(){
    localStorage.setItem("egresos", JSON.stringify(pacientesEgresados));
}

// Funcion imprime pacientes
function imprimePacientes(){
    let contador;
    let salaActual = "";
    tarjeta.innerHTML = "";
    salasDelHospital.forEach((s) => {
        contador=0;
        const h4 = document.createElement("h4");
        h4.className = "mt-4 text-center";
        h4.innerHTML = s.sala;
        tarjeta.appendChild(h4);
        pacientesInternados.forEach((pac) => {
            if(pac.sala == s.sala && salaActual!=s.sala){
                pac.imprimir();
                contador++;
                }
        });
        if(contador==0){
            tarjeta.insertAdjacentHTML('beforeend', `
                                    <h5 class="text-center">
                                        Sin pacientes internados
                                    </h5>
                                    `);
        }
    });
    actualizaCamas();
    // Operador AND (&&)
    pacientesInternados.length === 0 && (tarjeta.innerHTML = `<h4 class="text-center">No hay pacientes internados</h4>`);
}

// Funcion que actualiza camas
function actualizaCamas(){
    salasDelHospital.forEach((s) => {
        s.camasOcupadas=0;
        pacientesInternados.forEach((p)=>{
            if(p.sala == s.sala){
                s.ocupaCama();
            }
        })
    });
    pintaCamas();
}
function pintaCamas(){
    estadCamas.innerHTML="";
    salasDelHospital.forEach((s) => {
        s.pintar();
    })
}

const info = document.querySelector("#infoApp");
// Agrego info derecha
function muestraInfo(){
    info.innerHTML="";
    info.insertAdjacentHTML('beforeend', `
                    <div class="card">
                        <h5 class="card-header">Instrucciones</h5>
                        <div class="card-body">
                            <p>Haga click <a href="#" data-bs-toggle="modal" data-bs-target="#modalInstrucciones">aquí</a> para obtener instrucciones del uso de la aplicación</p>
                        </div>
                    </div>`);
    info.insertAdjacentHTML('beforeend', `
                    <div class="card mt-2">
                        <h5 class="card-header">Estadísticas</h5>
                        <div class="card-body">
                            <p>Cantidad de pacientes internados: ${pacientesInternados.length}</p>
                            <p>Cantidad de pacientes egresados: ${pacientesEgresados.length}</p>
                        </div>
                    </div>
                    `);
    actualizaCamas();
}

// Envía formulario de edición de paciente
const formularioEdit = document.querySelector("#formEditarPaciente");
formularioEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    let camaLibre = true;
    let camaFueraRango = false;
    modalEditar.hide();
    const idEdit = document.getElementById("idEdit").value;
    const nombreEdit = document.getElementById("nombreEdit").value;
    const apellidoEdit = document.getElementById("apellidoEdit").value;
    const edadEdit = document.getElementById("edadEdit").value;
    const salaVieja = document.getElementById("salaVieja").value;
    const salaEdit = document.getElementById("salaEdit").value;
    const camaVieja = document.getElementById("camaVieja").value;
    const camaEdit = document.getElementById("camaEdit").value;
    const diagnosticoEdit = document.getElementById("diagnosticoEdit").value;

    // Verifico cama libre o fuera de rango
    if(salaVieja == salaEdit && camaVieja==camaEdit){
    } else {
        pacientesInternados.forEach(p => {
            if(p.sala == salaEdit && p.cama == camaEdit){
                // console.log(`${salaEdit} cama ${camaEdit} está ocupada`);
                muestraToast(`${salaEdit} cama ${camaEdit} está ocupada`);
                camaLibre = false;
            }
        });
        salasDelHospital.forEach(s => {
            if(s.sala == salaEdit && (camaEdit > s.cantCamas || camaEdit <= 0)){
                camaFueraRango = true;
                muestraToast(`${salaEdit} cama ${camaEdit} fuera de rango`);
            }
        });
    }
    if(camaLibre==true && camaFueraRango==false){
        pacientesInternados.map((paciente) => {
            if(paciente.id == idEdit){
                paciente.nombre = mayuscalaPrimerLetra(nombreEdit);
                paciente.apellido = mayuscalaPrimerLetra(apellidoEdit);
                paciente.edad = edadEdit;
                paciente.sala = salaEdit;
                paciente.cama = camaEdit;
                paciente.diagnostico = mayuscalaPrimerLetra(diagnosticoEdit);
                paciente.epicrisis = `Paciente ${apellidoEdit}, ${nombreEdit} de ${edadEdit} años de edad, internado en ${salaEdit} cama ${camaEdit},  con diagnóstico de ${diagnosticoEdit}.`;
            }
            return paciente;
        });
        actualizaCamas();
        ordenarPacientesSala();
        guardaLocalStorage();
        guardaLocalStorageSalas();
        // imprimePacientes();
        if(salaSeleccionada=="Todos"){
            muestraTodos();
        } else {
        filtraSala(salaSeleccionada);
        }
        muestraToast(`Paciente ${nombreEdit} ${apellidoEdit} editado correctamente`);
    }
});

// Funcion ordenar pacientes por sala y cama
function ordenarPacientesSala(){
    pacientesInternados.sort((a, b) => (a.sala > b.sala) ? 1 : (a.sala === b.sala) ? (a.cama - b.cama) : -1 )
}

// Logout
const logoutUser = document.getElementById("btnLogout");
logoutUser.addEventListener("click", () => {
    console.log(`Logout: ${logoutUser}`);
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("password");
    muestraToast("Loguot exitoso");
    window.location.assign("index.html");
});

// Resetea pacientes
const reseteaPacientes = document.getElementById("btnReset");
reseteaPacientes.addEventListener("click", () => {
    console.log("Resetea pacientes");
    localStorage.removeItem("pacientes");
    localStorage.removeItem("salas");
    localStorage.removeItem("egresos");
    pacientesInternados.length = 0;
    salasDelHospital.length = 0;
    pacientesEgresados.length = 0;
    leePacientes();
    tituloSala.innerHTML = "Pacientes internados";
    salaSeleccionada="Todos";
    muestraToast("Listado de pacientes reseteado");
});

// Captura evento btnNuevoPaciente
const nuevoPaciente = document.getElementById("btnNuevoPaciente");
const modalPaciente = new bootstrap.Modal(document.getElementById('modalNuevoPaciente'));
nuevoPaciente.addEventListener("click", () => {
    modalPaciente.show();
});

// Focus en input nombre
const modalNuevoPaciente = document.getElementById("modalNuevoPaciente");
modalNuevoPaciente.addEventListener('shown.bs.modal', () => {
    const nombre = document.getElementById("nombre");
    nombre.focus();
});

// Evento submit nuevo paciente
const formulario = document.getElementById("formNuevoPaciente");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    let camaLibre = true;
    let camaFueraRango = false;
    const datos = new FormData(formulario);
    const idNuevoPaciente = pacientesInternados.length+1;
    const nombreNuevoPaciente = datos.get("nombre");
    const apellidoNuevoPaciente = datos.get("apellido");
    const edadNuevoPaciente = datos.get("edad");
    const salaNuevoPaciente = datos.get("sala");
    const camaNuevoPaciente = datos.get("cama");
    const diagnosticoNuevoPaciente = datos.get("diagnostico");

    // Verifico cama libre o fuera de rango
    pacientesInternados.forEach(p => {
        if(p.sala == salaNuevoPaciente && p.cama == camaNuevoPaciente){
            muestraToast(`${salaNuevoPaciente} cama ${camaNuevoPaciente} está ocupada`);
            camaLibre = false;
        }
    });
    salasDelHospital.forEach(s => {
        if(s.sala == salaNuevoPaciente && (camaNuevoPaciente > s.cantCamas || camaNuevoPaciente <= 0)){
            camaFueraRango = true;
            muestraToast(`${salaNuevoPaciente} cama ${camaNuevoPaciente} fuera de rango`);
        }
    });
    
    if(camaLibre==true && camaFueraRango==false){
        pacientesInternados.push(new Paciente(idNuevoPaciente,nombreNuevoPaciente,apellidoNuevoPaciente,edadNuevoPaciente,salaNuevoPaciente,camaNuevoPaciente,diagnosticoNuevoPaciente));
        ordenarPacientesSala();
        guardaLocalStorage();
        guardaLocalStorageSalas();
        muestraInfo();
        if(salaSeleccionada=="Todos"){
            muestraTodos();
        } else {
            filtraSala(salaNuevoPaciente);
        }
        formulario.reset();
        modalPaciente.hide();
        muestraToast(`Paciente ${nombreNuevoPaciente} ${apellidoNuevoPaciente} ingresado correctamente`);
    }
});

// Evento submit login
const formularioLogin = document.getElementById("formLogin");
formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let passUsuario = document.getElementById("passUsuario").value;
    for (const usuario of usuarios){
        if(nombreUsuario==usuario.nombreUsuario && passUsuario==usuario.password){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'Usuario ingresado correctamente!'
            })
            sessionStorage.setItem("usuario",nombreUsuario);
            sessionStorage.setItem("password",passUsuario);
            ingresoUsuario = nombreUsuario;
            ingresoPassword = passUsuario;
            mainOculto.style.display = 'block';
            modalLogin.hide();
            imprimePacientes();
            break;
        } else {
            Swal.fire({
                title: 'Error, usuario y/o contraseña incorrectos',
                icon: 'error',
                text: 'Vuelva a intentarlo'
            });
            formularioLogin.reset();
            nombreLogin.focus();
        }
    }
});

// Cancela login
const botonCancelarLogin = document.getElementById("btnCancelarLogin");
botonCancelarLogin.addEventListener("click", () => {
    formularioLogin.reset();
    window.location.assign("index.html");
});

// Escucha boton todos los pacientes
const botonTodos = document.querySelector("#btnTodos");
botonTodos.addEventListener("click", () =>{
    muestraTodos();
    salaSeleccionada="Todos";
});

// Muestra todos los pacientes
function muestraTodos(){
    imprimePacientes();
    tituloSala.innerHTML = "Pacientes internados"
}

// Escucha botones x sala
const btnsFiltroSala = document.querySelectorAll('.btnFiltroSala');
btnsFiltroSala.forEach((i) => {
    i.addEventListener("click",()=>{
        salaSeleccionada = i.innerHTML;
        filtraSala(i.innerHTML);
    })
});

// Funcion filtro de sala
function filtraSala(sala){
    const pacientesDeSala = pacientes => pacientes.sala==sala;
    const pacientesSalaFilter = pacientesInternados.filter(pacientesDeSala);
    imprimePacientesSala(pacientesSalaFilter,sala);
    muestraToast(`Pacientes filtrados por ${sala}`);
    tituloSala.innerHTML = `Pacientes: ${sala}`;
}

// Funcion imprime sala filtrada
function imprimePacientesSala(pacSala,sala){
    tarjeta.innerHTML = "";
    const div = document.createElement("div");
        div.innerHTML = `
                        <h4 class="m-4">${sala}</h4>
                        `;
        tarjeta.appendChild(div);
    pacSala.forEach((p) => {
        p.imprimir();
    });
    pacSala.length === 0 && (tarjeta.innerHTML = `<h4 class="text-center">No hay pacientes internados</h4>`);
}

// Funcion mayuscula primera letra
function mayuscalaPrimerLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fecha actual
const fecha = new Date();
console.log(fecha.toLocaleDateString());