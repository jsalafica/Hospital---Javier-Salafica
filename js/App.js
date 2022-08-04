import {muestraToast} from "./tostify.js";
import {startTime} from "./reloj.js";

const mainOculto = document.querySelector(".mainOculto");
const estadCamas = document.querySelector("#estadisticas");
const pacientesInternados = [];
const salasDelHospital = [];
const usuarios = [];
let pacienteABorrar = [];
let pacienteAEditar = [];
const salas = [
    {
        sala: "Sala 1",
        cantCamas: 20,
        camasOcupadas: 0
    },
    {
        sala: "Sala 2",
        cantCamas: 25,
        camasOcupadas: 0
    },
    {
        sala: "Sala 3",
        cantCamas: 29,
        camasOcupadas: 0
    },
    {
        sala: "UCO",
        cantCamas: 6,
        camasOcupadas: 0
    },
    {
        sala: "UTI",
        cantCamas: 12,
        camasOcupadas: 0
    }
];
// const salas = ["Sala 1","Sala 2","Sala 3","UCO","UTI"];
// const salas = [];
const pacientesGuardados = JSON.parse(localStorage.getItem("pacientes"));
const salasGuardadas = JSON.parse(localStorage.getItem("salas"));
const tarjeta = document.getElementById("pacientes");
let salaSeleccionada = "Todos";
const tituloSala = document.getElementById("tituloLogin");
const modalEditar = new bootstrap.Modal(document.querySelector("#modalEditarPaciente"));

// Lee Pacientes
const leePacientes = async () => {
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
    // Verifica usuario Usando operador ternario
    // condicion ? true:false
    // (ingresoUsuario)&&(ingresoPassword)?((console.log("Usuario ya logeado")),(mainOculto.style.display = 'block'),(imprimePacientes())):((modalLogin.show()),(console.log("Muestra modal login, usuario NO logeado")));
}

// Lee Salas del Hospital
const leeSalas = async () => {
    if(localStorage.getItem("salas")){
        // Pushea salas del localStorage
        pusheaLocalStorageSalas();
        muestraInfo();
    } else {
        try {
            // Desde JSON
            const response = await fetch('js/salas.json');
            const data = await response.json();
            // Pushea
            data.forEach((data) => {
                salasDelHospital.push(new SalasHospital(data.id,data.sala,data.cantCamas,data.camasOcupadas));
            });
            // console.log(salasDelHospital);
            muestraInfo();
        }
        catch (error) {
            console.log('Error: ', error);
        }
        guardaLocalStorageSalas();
        console.log("Pushea desde salas.json");
        }
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
        this.nombre = nombre,
        this.apellido = apellido,
        this.edad = edad,
        this.sala = sala,
        this.cama = cama,
        this.diagnostico = diagnostico,
        this.epicrisis = `Paciente ${this.apellido}, ${this.nombre} de ${this.edad} años de edad, internado en ${this.sala} cama ${this.cama},  con diagnóstico de ${this.diagnostico}.`;
    }
    imprimir(){
        const itemAccordion = document.createElement('div');
        itemAccordion.innerHTML = `
                        <div class="accordion-item m-1">
                            <h2 class="accordion-header" id="heading${this.id}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${this.id}" aria-expanded="true" aria-controls="collapse${this.id}"><span class="badge bg-secondary p-2 m-2">Cama ${this.cama}</span>${this.apellido}, ${this.nombre} (${this.edad} años) - Diagnostico: ${this.diagnostico}</button>
                            </h2>
                            <div id="collapse${this.id}" class="accordion-collapse collapse" aria-labelledby="heading${this.id}" data-bs-parent="#pacientes">
                                <div class="accordion-body">
                                ${this.epicrisis}<br>
                                    <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEliminar${this.id}">Borrar</button>
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
        Swal.fire({
            title: `Está seguro de eliminar al paciente <b>${this.nombre} ${this.apellido}</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            dangerMode : true
        }).then((result) => {
            if (result.isConfirmed) {
                if(pacienteABorrar){
                    pacientesInternados.splice(pacientesInternados.indexOf(pacienteABorrar), 1);
                    guardaLocalStorage();
                    guardaLocalStorageSalas();
                    imprimePacientes();
                    muestraInfo();
                    if(salaSeleccionada=="Todos"){
                        muestraTodos();
                    } else {
                        filtraSala(salaSeleccionada);
                    }
                    muestraToast(`El paciente ${this.nombre} ${this.apellido} ha sido borrado`);
                } else {
                    Swal.fire({
                        title: 'Error, no se encontró el paciente!',
                        icon: 'error',
                        text: 'El paciente no ha sido borrado'
                    });
                }
            }
        });
    }
    editar(){
        document.getElementById("idEdit").value = this.id;
        document.getElementById("nombreEdit").value = this.nombre;
        document.getElementById("apellidoEdit").value = this.apellido;
        document.getElementById("edadEdit").value = this.edad;
        document.getElementById("salaEdit").value = this.sala;
        document.getElementById("camaEdit").value = this.cama;
        document.getElementById("diagnosticoEdit").value = this.diagnostico;
        modalEditar.show();
    }
}

// Evento de Carga de DOM
document.addEventListener("DOMContentLoaded", () => {
    leePacientes();
    // muestraInfo();
    startTime();
});

// Lee el listado de pacientes cada 5 segundos
// let intervalo = setInterval(() => {
//     imprimePacientes();
//     console.log("Lee pacientes cada 5 segundos");
// }, 5000);

// Evento que limpia el intervalo al mover el mouse
// document.addEventListener("mousemove", () => {
//     clearInterval(intervalo);
//     intervalo = setInterval(() => {
//         imprimePacientes();
//         console.log("Lee pacientes cada 5 segundos");
//     }, 5000);
// });

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

// Carga salas y camas
// (async ()=>{
//     try {
//         const response = await fetch('js/salas.json')
//         const data = await response.json();
//         data.forEach((s) => {
//             salas.push(s);
//             // console.log(s);
//         });
//     }
//     catch(error) {   
//         console.log('error: ' , error);
//     }
// })();

let ingresoUsuario = sessionStorage.getItem("usuario");
let ingresoPassword = sessionStorage.getItem("password");
const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));

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

// Funcion guarda LocalStorage
function guardaLocalStorage(){
    localStorage.setItem("pacientes", JSON.stringify(pacientesInternados));
}
function guardaLocalStorageSalas(){
    localStorage.setItem("salas", JSON.stringify(salasDelHospital));
}

// Funcion imprime pacientes
function imprimePacientes(){
    let salaActual = "";
    tarjeta.innerHTML = "";
    // console.log(salas);
    salasDelHospital.forEach((s) => {
        const h4 = document.createElement("h4");
        h4.className = "m-4";
        h4.innerHTML = s.sala;
        tarjeta.appendChild(h4);
        pacientesInternados.forEach((pac) => {
            if(pac.sala == s.sala && salaActual!=s.sala){
                const pacientesDeSala = pacientes => pacientes.sala==pac.sala;
                const pacientesSalaFiltrada = pacientesInternados.filter(pacientesDeSala);
                salaActual=s.sala;
                pacientesSalaFiltrada.forEach((p) => {
                    p.imprimir();
                });
            }
        });
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
                // s.camasOcupadas++;
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

const info = document.querySelector("#infoPacientes");
// Agrego info derecha
function muestraInfo(){
    info.innerHTML="";
    info.insertAdjacentHTML('beforeend', `
                    <h4 class="m-4">Información</h4>
                    <div class="card">
                        <h5 class="card-header">Instrucciones</h5>
                        <div class="card-body">
                            <p>Acá voy a poner instrucciones para el manejo de los pacientes cargados, incluido como editar, borrar, etc. Tiene que ser bastante info así queda bien explicado como es que funciona la gestión de pacientes. Va a quedar buenardo</p>
                        </div>
                    </div>`);
    info.insertAdjacentHTML('beforeend', `
                    <div class="card mt-4">
                        <h5 class="card-header">Estadísticas</h5>
                        <div class="card-body">
                            <p>Cantidad de pacientes internados: ${pacientesInternados.length}</p>
                        </div>
                    </div>
                    `);
    actualizaCamas();
}

// Envía formulario de edición de paciente
const formularioEdit = document.querySelector("#formEditarPaciente");
formularioEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    modalEditar.hide();
    const idEdit = document.getElementById("idEdit").value;
    const nombreEdit = document.getElementById("nombreEdit").value;
    const apellidoEdit = document.getElementById("apellidoEdit").value;
    const edadEdit = document.getElementById("edadEdit").value;
    const salaEdit = document.getElementById("salaEdit").value;
    const camaEdit = document.getElementById("camaEdit").value;
    const diagnosticoEdit = document.getElementById("diagnosticoEdit").value;
    pacientesInternados.map((paciente) => {
        if(paciente.id == idEdit){
            paciente.nombre = nombreEdit;
            paciente.apellido = apellidoEdit;
            paciente.edad = edadEdit;
            paciente.sala = salaEdit;
            paciente.cama = camaEdit;
            paciente.diagnostico = diagnosticoEdit;
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
    pacientesInternados.length = 0;
    salasDelHospital.length = 0;
    // pusheaPacientes();
    leePacientes();
    // imprimePacientes();
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
    const datos = new FormData(formulario);
    const idNuevoPaciente = pacientesInternados.length+1;
    const nombreNuevoPaciente = datos.get("nombre");
    const apellidoNuevoPaciente = datos.get("apellido");
    const edadNuevoPaciente = datos.get("edad");
    const salaNuevoPaciente = datos.get("sala");
    const camaNuevoPaciente = datos.get("cama");
    const diagnosticoNuevoPaciente = datos.get("diagnostico");
    pacientesInternados.push(new Paciente(idNuevoPaciente,nombreNuevoPaciente,apellidoNuevoPaciente,edadNuevoPaciente,salaNuevoPaciente,camaNuevoPaciente,diagnosticoNuevoPaciente));
    ordenarPacientesSala();
    guardaLocalStorage();
    guardaLocalStorageSalas();
    muestraInfo();
    // Imprimo último paciente ingresado
    // pacientesInternados[pacientesInternados.length -1].imprimir();
    if(salaSeleccionada=="Todos"){
        muestraTodos();
    } else {
        filtraSala(salaNuevoPaciente);
    }
    formulario.reset();
    modalPaciente.hide();
    muestraToast(`Paciente ${nombreNuevoPaciente} ${apellidoNuevoPaciente} ingresado correctamente`);
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
            mainOculto.style.display = 'block';
            modalLogin.hide();
            imprimePacientes();
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
    // muestraToast("Todos los pacientes");
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