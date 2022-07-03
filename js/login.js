let noEsNumero = true;
let nombre = '';
let edad = 0;
let sumaEdad = 0;
let sala = '';
let cama = '';
let diagnostico = '';
let camaOcupada = 0;
const tarjeta = document.getElementById("pacientes");
const mainOculto = document.querySelector(".mainOculto");
const pacientesInternados = [
    {
        "id": 1,
        "nombre": "Javier",
        "apellido": "Perez",
        "edad": 49,
        "sala": 1,
        "cama": 2,
        "diagnostico": "Asma"
    },
    {
        "id": 2,
        "nombre": "Claudio",
        "apellido": "Gomez",
        "edad": 47,
        "sala": 1,
        "cama": 4,
        "diagnostico": "Faringitis"
    },
    {
        "id": 3,
        "nombre": "Santino",
        "apellido": "Lopez",
        "edad": 13,
        "sala": 2,
        "cama": 5,
        "diagnostico": "Cefalea"
    },
];
const pacientesNuevos = [];
const pacientesLocalStorage = [];

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
                            Paciente ${this.id}
                            </div>
                            <div class="card-body">
                                <div class="card-title">
                                    Nombre: ${this.nombre}<br>
                                    Apellido: ${this.apellido}
                                </div>
                                <div class="card-text">
                                    <div>Edad: ${this.edad} años</div>
                                    <div>Sala: ${this.sala}</div>
                                    <div>Cama: ${this.cama}</div>
                                    <div>Diagnóstico: ${this.diagnostico}</div>
                                </div>
                                <button class="btn btn-sm btnContacto mt-2" onclick="eliminarPaciente(${this.id})">Borrar</button>
                                <button class="btn btn-sm btnContacto mt-2" onclick="editarPaciente(${this.id})">Editar</button>
                            </div>
                            </div>`;
        tarjeta.appendChild(card);
    }
}

// Pushea pacientesInternados en pacientesNuevos
pusheaPacientes();

// Pushea pacientes del localStorage
// pusheaLocalStorage();

//Valida Usuarios
const usuarios = [
    {
        nombreUsuario:"user",
        password:"1234"
    }
];
let ingresoUsuario = sessionStorage.getItem("usuario");
let ingresoPassword = sessionStorage.getItem("password");

console.log(ingresoUsuario,ingresoPassword);
const myModalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
if (ingresoUsuario==null && ingresoPassword==null){
    myModalLogin.show();
    console.log("muestra modal");
} else {
    console.log("Usuario ingresado");
    mainOculto.style.display = 'block';
    imprimePacientes();
}

// Focus en input usuario
const modalLogin = document.getElementById('modalLogin');
modalLogin.addEventListener('shown.bs.modal', function () {
    let nombre = document.getElementById("nombreUsuario");
    nombre.focus();
});
const formularioLogin = document.getElementById("formLogin");
formularioLogin.addEventListener("submit", checkUser);

function pusheaPacientes(){
    for (let paciente of pacientesInternados){
        pacientesNuevos.push(new Paciente(paciente.id,paciente.nombre,paciente.apellido,paciente.edad,paciente.sala,paciente.cama,paciente.diagnostico));
    }
}

// function pusheaLocalStorage(){
//     pacientesNuevos.push(new Paciente(paciente.id,paciente.nombre,paciente.apellido,paciente.edad,paciente.sala,paciente.cama,paciente.diagnostico));
// }

function imprimePacientes(){
    document.getElementById("pacientes").innerHTML = "";
    // for(const paciente of pacientesNuevos){
    //     paciente.imprimir();
    // }
    pacientesNuevos.forEach((p) => {
        p.imprimir();
    });
}

function eliminarPaciente(id){
    // console.log(id);
    // let pacienteABorrar = pacientesNuevos.find(paciente => paciente.nombre.toLowerCase() === nom);
    let confirmaBorrar = confirm(`Está seguro que deseas borrar al paciente ${id}?`);
    if(confirmaBorrar==true){
        let pacienteABorrar = pacientesNuevos.find(paciente => paciente.id === id);
        // Si existe coincidencia y encontro el paciente
        if(pacienteABorrar){
            pacientesNuevos.splice(pacientesNuevos.indexOf(pacienteABorrar), 1);
            // 
            imprimePacientes();
        } else {
        alert("El paciente no existe");
        }
    }
}

function editarPaciente(id){
    alert(`Proximamente editaremos el paciente id: ${id}`);
}

function ordenarPacientes(){
    pacientesNuevos.sort((a, b) => a.edad - b.edad);
}

// Ordena pacientes
const ordenaPacientes = document.getElementById("btnOrdenarPacientes");
ordenaPacientes.addEventListener("click", () => {
    console.log("Ordena pacientes por edad");
    ordenarPacientes();
    // document.getElementById("pacientes").innerHTML = "";
    imprimePacientes();
});

// Captura evento btnNuevoPaciente
const nuevoPaciente = document.getElementById("btnNuevoPaciente");
const myModalPaciente = new bootstrap.Modal(document.getElementById('modalNuevoPaciente'));
// nuevoPaciente.onclick = () => {modalNuevoPaciente.show()};
nuevoPaciente.addEventListener("click", () => {
    // console.log("Hiciste click en el boton nuevo paciente");
    myModalPaciente.show();
});

// Focus en input nombre
const modalNuevoPaciente = document.getElementById("modalNuevoPaciente");
modalNuevoPaciente.addEventListener('shown.bs.modal', function () {
    let nombre = document.getElementById("nombre");
    nombre.focus();
});

// Envía formulario
const formulario = document.getElementById("formNuevoPaciente");
formulario.addEventListener("submit", enviarFormulario);

function enviarFormulario(e) {
    e.preventDefault();
    let idNuevoPaciente = pacientesNuevos.length+1;
    let nombreNuevoPaciente = document.getElementById("nombre").value;
    let apellidoNuevoPaciente = document.getElementById("apellido").value;
    let edadNuevoPaciente = document.getElementById("edad").value;
    let salaNuevoPaciente = document.getElementById("sala").value;
    let camaNuevoPaciente = document.getElementById("cama").value;
    let diagnosticoNuevoPaciente = document.getElementById("diagnostico").value;

    // Agrego a array
    pacientesNuevos.push(new Paciente(idNuevoPaciente,nombreNuevoPaciente,apellidoNuevoPaciente,edadNuevoPaciente,salaNuevoPaciente,camaNuevoPaciente,diagnosticoNuevoPaciente));

    // Almaceno en LocalStorage
    // const almacenaLocal = (clave, valor) => {
    //     localStorage.setItem(clave, valor);
    // }
    // almacenaLocal("almacenados", JSON.stringify(idNuevoPaciente,nombreNuevoPaciente,apellidoNuevoPaciente,edadNuevoPaciente,salaNuevoPaciente,camaNuevoPaciente,diagnosticoNuevoPaciente));
    // console.log(JSON.parse(localStorage.getItem("almacenados")));

    // Imprimo último paciente ingresado
    pacientesNuevos[pacientesNuevos.length -1].imprimir();

    //Resetea form
    formulario.reset();

    //Oculta modal
    myModalPaciente.hide();
}

function checkUser(e){
    e.preventDefault();
    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let passUsuario = document.getElementById("passUsuario").value;
    console.log(nombreUsuario,passUsuario);
    for (const usuario of usuarios){
        if(nombreUsuario==usuario.nombreUsuario && passUsuario==usuario.password){
            sessionStorage.setItem("usuario",nombreUsuario);
            sessionStorage.setItem("password",passUsuario);
            mainOculto.style.display = 'block';
            myModalLogin.hide();
            imprimePacientes();
        } else {
            alert("Usuario incorrecto");
        }
    }
}