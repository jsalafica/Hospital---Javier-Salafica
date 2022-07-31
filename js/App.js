import {muestraToast} from "./tostify.js";
import {startTime} from "./reloj.js";

const mainOculto = document.querySelector(".mainOculto");
const pacientesInternados = [];
const usuarios = [];
let pacienteABorrar = [];
let pacienteAEditar = [];
const pacientesGuardados = JSON.parse(localStorage.getItem("pacientes"));
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
        card.className = "col-md-6";
        // card.innerHTML = `
        //                     <div class="card m-2">
        //                     <div class="card-header">
        //                     HC ${this.id}
        //                     </div>
        //                     <div class="card-body">
        //                         <div class="card-title">
        //                             Nombre: ${this.nombre}<br>
        //                             Apellido: ${this.apellido}
        //                         </div>
        //                         <div class="card-text">
        //                             <div>Edad: ${this.edad} años</div>
        //                             <div>Sala: ${this.sala}</div>
        //                             <div>Cama: ${this.cama}</div>
        //                             <div>Diagnóstico: ${this.diagnostico}</div>
        //                         </div>
        //                         <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEliminar${this.id}">Borrar</button>
        //                         <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEdit${this.id}">Editar</button>
        //                     </div>
        //                     </div>`;
        card.innerHTML = `
                        <div class="accordion-item m-1">
                            <h2 class="accordion-header" id="heading${this.id}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${this.id}" aria-expanded="true" aria-controls="collapse${this.id}"><span class="badge bg-secondary p-2 m-2">${this.cama}</span>${this.apellido}, ${this.nombre} (${this.edad} años) - Diagnostico: ${this.diagnostico}</button>
                            </h2>
                            <div id="collapse${this.id}" class="accordion-collapse collapse" aria-labelledby="heading${this.id}" data-bs-parent="#pacientes">
                                <div class="accordion-body">
                                    Diagnóstico: ${this.diagnostico}.<br>
                                    Lugar: ${this.sala} - Cama: ${this.cama}<br>
                                    <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEliminar${this.id}">Borrar</button>
                                    <button class="btn btn-sm btnContacto mt-2" id="btnPacienteEdit${this.id}">Editar</button>
                                </div>
                            </div>
                        </div>
                        `;
            tarjeta.appendChild(card);

            const botonPacienteEliminar = document.getElementById(`btnPacienteEliminar${this.id}`);
            botonPacienteEliminar.addEventListener("click", () => {
                // eliminarPaciente(this.id);
                pacienteABorrar = pacientesInternados.find(paciente => paciente.id === this.id);
                pacienteABorrar.eliminar();
            })

            const botonPacienteEdit = document.getElementById(`btnPacienteEdit${this.id}`);
            botonPacienteEdit.addEventListener("click", () => {
                // editarPaciente(this.id);
                pacienteAEditar = pacientesInternados.find(paciente => paciente.id === this.id);
                pacienteAEditar.editar();

            })
    }
    eliminar(){
        Swal.fire({
            title: `Está seguro de eliminar al paciente ${this.nombre} ${this.apellido}?`,
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
                    imprimePacientes();
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

// Funcion guarda LocalStorage
function guardaLocalStorage(){
    localStorage.setItem("pacientes", JSON.stringify(pacientesInternados));
}

// Funcion imprime pacientes
function imprimePacientes(){
    let salaActual = "";
    tarjeta.innerHTML = "";
    const salas = ["Sala 1","Sala 2","Sala 3","UTI","UCO"];
    salas.forEach((s) => {
        const div = document.createElement("div");
        div.innerHTML = `
                        <h4 class="m-4">${s}</h4>
                        `;
        tarjeta.appendChild(div);
        pacientesInternados.forEach((pac) => {
            if(pac.sala == s && salaActual!=s){
                const pacientesDeSala = pacientes => pacientes.sala==pac.sala;
                const pacientesSalaFiltrada = pacientesInternados.filter(pacientesDeSala);
                salaActual=s;
                pacientesSalaFiltrada.forEach((p) => {
                    p.imprimir();
                });
            }
        });
    });
    // Operador AND (&&)
    pacientesInternados.length === 0 && (tarjeta.innerHTML = `<h4 class="text-center">No hay pacientes internados</h4>`);
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
        }
        // return paciente;
    });
    ordenarPacientesSala();
    guardaLocalStorage();
    // imprimePacientes();
    if(salaSeleccionada=="Todos"){
        muestraTodos();
    } else {
    filtraSala(salaSeleccionada);
    }
    muestraToast(`Paciente ${nombreEdit} ${apellidoEdit} editado correctamente`);
});

// Funcion Ordenar paciente
function ordenarPacientes(){
    pacientesInternados.sort((a, b) => a.edad - b.edad);
    muestraToast("Pacientes ordenados por edad");
}

// Funcion ordenar pacientes por sala
function ordenarPacientesSala(){
    pacientesInternados.sort((a, b) => (a.sala > b.sala) ? 1 : (a.sala === b.sala) ? (a.cama - b.cama) : -1 )
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
    muestraToast("Todos los pacientes");
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