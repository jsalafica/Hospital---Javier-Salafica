// import { startTime } from "./reloj.js";
// console.log(startTime);
const tarjeta = document.getElementById("pacientes");
const mainOculto = document.querySelector(".mainOculto");
const pacientesInternados = [];
const usuarios = [];
const pacientesGuardados = JSON.parse(localStorage.getItem("pacientes"));

// Lee JSON
const leePacientes = async () => {
    if(localStorage.getItem("pacientes")){
        // Pushea pacientes del localStorage
        pusheaLocalStorage();
        console.log("Pushea desde localstorage");
    } else {
        try {
            // Desde API
            const response = await fetch('https://central930ros.com/h_centenario/pacientes');
            const data = await response.json();
            // Pushea
            data.forEach((post) => {
                pacientesInternados.push(new Paciente(post.id,post.nombre,post.apellido,post.edad,post.sala,post.cama,post.diagnostico));
            });
        }
        catch (error) {
            console.log('Error: ', error);
        }
        guardaLocalStorage();
        console.log("Pushea desde API y guarda en localStorage");
        }
    // Verifica usuario Usando operador ternario
    // condicion ? true:false
    (ingresoUsuario)&&(ingresoPassword)?((console.log("Usuario ya logeado")),(mainOculto.style.display = 'block'),(imprimePacientes())):((modalLogin.show()),(console.log("Muestra modal login, usuario NO logeado")));
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
        this.diagnostico = diagnostico
    }
    imprimir(){
        const card = document.createElement('div');
        card.className = "col-md-3";
        card.innerHTML = `
                            <div class="card m-2">
                            <div class="card-header">
                            HC ${this.id}
                            </div>
                            <div class="card-body">
                                <div class="card-title">
                                    Nombre: ${this.nombre}<br>
                                    Apellido: ${this.apellido}
                                </div>
                                <div class="card-text">
                                    <div>Edad: ${this.edad} a??os</div>
                                    <div>Sala: ${this.sala}</div>
                                    <div>Cama: ${this.cama}</div>
                                    <div>Diagn??stico: ${this.diagnostico}</div>
                                </div>
                                <button class="btn btn-sm btnContacto mt-2" onclick="eliminarPaciente(${this.id})">Borrar</button>
                                <button class="btn btn-sm btnContacto mt-2" onclick="editarPaciente(${this.id})">Editar</button>
                            </div>
                            </div>`;
            tarjeta.appendChild(card);
    }
    eliminar(){
        console.log(this.id);
    }
}

// Evento de Carga de DOM
document.addEventListener("DOMContentLoaded", () => {
    leePacientes();
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

// Carga Usuarios con funci??n as??ncrona
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

let ingresoUsuario = sessionStorage.getItem("usuario");
let ingresoPassword = sessionStorage.getItem("password");
const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));

// Focus en input usuario
const modalLoginFocus = document.getElementById('modalLogin');
const nombreLogin = document.getElementById("nombreUsuario");
modalLoginFocus.addEventListener('shown.bs.modal', () => {
    nombreLogin.focus();
});

function pusheaLocalStorage(){
    for (const paciente of pacientesGuardados){
        pacientesInternados.push(new Paciente(paciente.id,paciente.nombre,paciente.apellido,paciente.edad,paciente.sala,paciente.cama,paciente.diagnostico));
    }
}

function guardaLocalStorage(){
    localStorage.setItem("pacientes", JSON.stringify(pacientesInternados));
}

function imprimePacientes(){
    tarjeta.innerHTML = "";
    pacientesInternados.forEach((p) => {
        p.imprimir();
    });
    // Operador AND (&&)
    pacientesInternados.length === 0 && (tarjeta.innerHTML = `<h4 class="text-center">No hay pacientes internados</h4>`);
}

function eliminarPaciente(id){
    let pacienteABorrar = pacientesInternados.find(paciente => paciente.id === id);
    Swal.fire({
        title: `Est?? seguro de eliminar al paciente ${pacienteABorrar.nombre} ${pacienteABorrar.apellido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        dangerMode : true
    }).then((result) => {
        if (result.isConfirmed) {
            pacienteABorrar.eliminar();
            // Si existe coincidencia y encontro el paciente
            if(pacienteABorrar){
                pacientesInternados.splice(pacientesInternados.indexOf(pacienteABorrar), 1);
                guardaLocalStorage();
                imprimePacientes();
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: `El paciente ${pacienteABorrar.nombre} ${pacienteABorrar.apellido}  ha sido borrado`
                });
            } else {
                Swal.fire({
                    title: 'Error, no se encontr?? el paciente!',
                    icon: 'error',
                    text: 'El paciente no ha sido borrado'
                });
            }
        }
    });
}

// Funcion carga datos al Modal Editar paciente
const modalEditar = new bootstrap.Modal(document.querySelector("#modalEditarPaciente"));
function editarPaciente(id){
    let pacienteAEditar = pacientesInternados.find(paciente => paciente.id === id);
    document.getElementById("idEdit").value = pacienteAEditar.id;
    document.getElementById("nombreEdit").value = pacienteAEditar.nombre;
    document.getElementById("apellidoEdit").value = pacienteAEditar.apellido;
    document.getElementById("edadEdit").value = pacienteAEditar.edad;
    document.getElementById("salaEdit").value = pacienteAEditar.sala;
    document.getElementById("camaEdit").value = pacienteAEditar.cama;
    document.getElementById("diagnosticoEdit").value = pacienteAEditar.diagnostico;
    modalEditar.show();
}

// Env??a formulario de edici??n de paciente
const formularioEdit = document.querySelector("#formEditarPaciente");
formularioEdit.addEventListener("submit", editarFormulario);
function editarFormulario(e) {
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
        }
        // return paciente;
    });
    guardaLocalStorage();
    imprimePacientes();
    muestraToast(`Paciente ${nombreEdit} ${apellidoEdit} editado correctamente`);
}

// Funcion Ordenar paciente
function ordenarPacientes(){
    pacientesInternados.sort((a, b) => a.edad - b.edad);
    muestraToast("Pacientes ordenados por edad");
}

// Ordena pacientes
const ordenaPacientes = document.getElementById("btnOrdenarPacientes");
ordenaPacientes.addEventListener("click", () => {
    console.log("Ordena pacientes por edad");
    ordenarPacientes();
    imprimePacientes();
});

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
    pacientesInternados.length = 0;
    // pusheaPacientes();
    leePacientes();
    imprimePacientes();
    muestraToast("Listado de pacientes reseteado");
});

// Captura evento btnNuevoPaciente
const nuevoPaciente = document.getElementById("btnNuevoPaciente");
const modalPaciente = new bootstrap.Modal(document.getElementById('modalNuevoPaciente'));
// nuevoPaciente.onclick = () => {modalNuevoPaciente.show()};
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
    // Obtengo datos del formulario
    const datos = new FormData(formulario);
    const idNuevoPaciente = pacientesInternados.length+1;
    const nombreNuevoPaciente = datos.get("nombre");
    const apellidoNuevoPaciente = datos.get("apellido");
    const edadNuevoPaciente = datos.get("edad");
    const salaNuevoPaciente = datos.get("sala");
    const camaNuevoPaciente = datos.get("cama");
    const diagnosticoNuevoPaciente = datos.get("diagnostico");
    // Agrego a array
    pacientesInternados.push(new Paciente(idNuevoPaciente,nombreNuevoPaciente,apellidoNuevoPaciente,edadNuevoPaciente,salaNuevoPaciente,camaNuevoPaciente,diagnosticoNuevoPaciente));
    
    // Almaceno en LocalStorage
    guardaLocalStorage();
    
    // Imprimo ??ltimo paciente ingresado
    // pacientesInternados[pacientesInternados.length -1].imprimir();

    // Imprime pacientes
    if(salaNuevoPaciente=="Todos"){
        muestraTodos();
    } else {
        filtraSala(salaNuevoPaciente);
    }

    // Resetea form
    formulario.reset();
    // Oculta modal
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
                title: 'Error, usuario y/o contrase??a incorrectos',
                icon: 'error',
                text: 'Vuelva a intentarlo'
            });
            formularioLogin.reset();
            nombreLogin.focus();
        }
    }
});

// Cancela login
function cancelarLogin(){
    formularioLogin.reset();
    window.location.assign("index.html");
}

// Toastify
function muestraToast(texto){
    Toastify({
        text: texto,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: "#557571",
        },
        stopOnFocus: true,
        close: true,
    }).showToast();
}

// Reloj
function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('hora').innerHTML = h + ":" + m;
    let t = setTimeout(startTime, 1000);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

const tituloSala = document.getElementById("tituloLogin");
// Escucha boton todos los pacientes
const botonTodos = document.querySelector("#btnTodos");
botonTodos.addEventListener("click",()=>{
    muestraTodos();
});

// Muestra todos los pacientes
function muestraTodos(){
    imprimePacientes();
    muestraToast("Todos los pacientes");
    tituloSala.innerHTML = "Pacientes internados"
}

// Escucha botones x sala
const btnsFiltroSala = document.querySelectorAll('.btnFiltroSala');
btnsFiltroSala.forEach((i) => {
    i.addEventListener("click",()=>{
        filtraSala(i.innerHTML);
    })
});

function filtraSala(sala){
    const pacientesSala = [];
    const pacientesDeSala = pacientes => pacientes.sala==sala;
    const pacientesSalaFilter = pacientesInternados.filter(pacientesDeSala);
    pacientesSalaFilter.forEach((p) => {
        pacientesSala.push(new Paciente(p.id,p.nombre,p.apellido,p.edad,p.sala,p.cama,p.diagnostico));
    })
    imprimePacientesSala(pacientesSala);
    muestraToast(`Pacientes filtrados por ${sala}`);
    tituloSala.innerHTML = `Pacientes: ${sala}`;
}

function imprimePacientesSala(sala){
    tarjeta.innerHTML = "";
    sala.forEach((p) => {
        p.imprimir();
    });
    sala.length === 0 && (tarjeta.innerHTML = `<h4 class="text-center">No hay pacientes internados</h4>`);
}