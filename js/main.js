let noEsNumero = true;
let nombre = '';
let edad = 0;
let sumaEdad = 0;
let sala = '';
let cama = '';
let diagnostico = '';
let camaOcupada = 0;
const tarjeta = document.getElementById("pacientes");
let pacientesInternados = [
    {
        "nombre": "Javier",
        "edad": 49,
        "sala": 1,
        "cama": 2,
        "diagnostico": "Asma"
    },
    {
        "nombre": "Claudio",
        "edad": 47,
        "sala": 1,
        "cama": 4,
        "diagnostico": "Faringitis"
    },
    {
        "nombre": "Santino",
        "edad": 13,
        "sala": 2,
        "cama": 5,
        "diagnostico": "Cefalea"
    },
];

//Clase paciente
class Paciente {
    constructor (nombre,edad,sala,cama,diagnostico){
        this.nombre = nombre,
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
                            Paciente
                            </div>
                            <div class="card-body">
                                <div class="card-title">
                                    Nombre: ${this.nombre}
                                </div>
                                <div class="card-text">
                                    <div>Edad: ${this.edad} años</div>
                                    <div>Sala: ${this.sala}</div>
                                    <div>Cama: ${this.cama}</div>
                                    <div>Diagnóstico: ${this.diagnostico}</div>
                                </div>
                                <button id="btnPaciente" class="btn btn-sm btnContacto mt-2">Botón</button>
                            </div>
                            </div>`;
        tarjeta.appendChild(card);
    }
}
let pacientesNuevos = [];

// Pushea pacientesInternados en pacientesNuevos
pusheaPacientes();

//Valida Usuarios
const usuarios = [
    {
        nombreUsuario:"user",
        password:"1234"
    }
];
let ingresoUsuario = localStorage.getItem("usuario");
let ingresoPassword = localStorage.getItem("password");
let usuarioCorrecto = false;

if (ingresoUsuario=="" && ingresoPassword==""){
    do {
        if (ingresoUsuario=="" || ingresoPassword==""){
        } else {
            alert("Usuario incorrecto");
        }
        ingresoUsuario = prompt("Ingrese el nombre de usuario");
        if(ingresoUsuario==null){
            break;
        }
        ingresoPassword = prompt("Ingrese su contraseña");
        if(ingresoPassword==null){
            break;
        }
        for (const usuario of usuarios){
            // console.log(usuario.nombreUsuario);
            if(ingresoUsuario==usuario.nombreUsuario && ingresoPassword==usuario.password){
                usuarioCorrecto = true;
                localStorage.setItem("usuario",ingresoUsuario);
                localStorage.setItem("password",ingresoPassword);
            }
        }
    } while (!usuarioCorrecto);
} else {
    usuarioCorrecto = true;
}

if (usuarioCorrecto==true){
    // imprimirInternados();
    imprimePacientes();
    let opcionMenu = 0;
    do {
        opcionMenu = Number(prompt(`Menu:
                                    1-Nuevo paciente.
                                    2-Borrar paciente.
                                    3-Ordenar por edad (menor a mayor).
                                    4-Salir.`));
        switch(opcionMenu){
            case 1:
                do {
                    nombre = prompt('Ingrese el nombre del paciente: (Escriba "fin" para terminar)');
                    if(nombre=="fin"){
                        break;
                    }
        
                    //Verifica que se ingrese un numero
                    noEsNumero = true;
                    do {
                        edad = parseInt(prompt('Ingrese la edad (en años)'));
                        if(!isNaN(edad)){
                            noEsNumero = false;
                        }
                    } while (noEsNumero);
                    // sumaEdad+=edad;
                    sala = prompt('Ingrese la sala: (ej: 1, UTI, etc)');
                    cama = prompt('Ingrese el número de la cama');
                    diagnostico = prompt('Ingrese el diagnóstico');
                    // document.write(`El paciente ${nombre}, de ${edad} años de edad, se internó en sala: ${sala} cama ${cama} con el diagnóstico de ${diagnostico}.<br>`);
                    // console.log(`El paciente ${nombre}, de ${edad} años de edad, se internó en sala: ${sala} cama ${cama} con el diagnostico de ${diagnostico}.`);
                    // camaOcupada = sumaCama(camaOcupada);
                    // camaDisponible = restaCama(camaDisponible);
                    // console.log(`Suma edad: ${sumaEdad}`);
        
                    // Agrego a array
                    pacientesNuevos.push(new Paciente(nombre,edad,sala,cama,diagnostico));
        
                    // Imprimo ultimo paciente ingresado
                    pacientesNuevos[pacientesNuevos.length -1].imprimir();
        
                    // if(camaDisponible==0){
                    //     alert('No hay mas camas libres');
                    //     break;
                    // }
                } while (nombre!='FIN');
            break;
            case 2:
                let pacienteBorrar = prompt("Indique el nombre del paciente a borrar").toLowerCase();
                eliminarPaciente(pacienteBorrar);
                document.getElementById("pacientes").innerHTML = "";
                imprimePacientes();
            break;
            case 3:
                ordenarPacientes();
                document.getElementById("pacientes").innerHTML = "";
                imprimePacientes();
        }
    } while (opcionMenu!=4);
}

// function imprimirInternados(){
//     for(const pacienteInternado of pacientesInternados){
//         const card = document.createElement('div');
//             card.className = "col-md-3";
//             card.innerHTML = `
//                                 <div class="card m-2">
//                                 <div class="card-header">
//                                 Paciente
//                                 </div>
//                                 <div class="card-body">
//                                     <div class="card-title">
//                                         Nombre: ${pacienteInternado.nombre}
//                                     </div>
//                                     <div class="card-text">
//                                         Edad: ${pacienteInternado.edad} años<br>
//                                         Sala: ${pacienteInternado.sala}<br>
//                                         Cama: ${pacienteInternado.cama}<br>
//                                         Diagnóstico: ${pacienteInternado.diagnostico}
//                                     </div>
//                                 </div>
//                                 </div>`;
//             tarjeta.appendChild(card);
//     }
// }

function pusheaPacientes(){
    for (let pacientes of pacientesInternados){
        pacientesNuevos.push(new Paciente(pacientes.nombre,pacientes.edad,pacientes.sala,pacientes.cama,pacientes.diagnostico));
    }
}
function imprimePacientes(){
    for(const paciente of pacientesNuevos){
        paciente.imprimir();
    }
}
function eliminarPaciente(nom){
    let pacienteABorrar = pacientesNuevos.find(paciente => paciente.nombre.toLowerCase() === nom);
    // Si existe coincidencia y encontro el paciente
    if(pacienteABorrar){
            pacientesNuevos.splice(pacientesNuevos.indexOf(pacienteABorrar), 1);
            console.log(pacientesNuevos);
    } else {
        alert("El paciente no existe");
    }
}
function ordenarPacientes(){
    pacientesNuevos.sort((a, b) => a.edad - b.edad);
}