export function checkUser(e){
    e.preventDefault();
    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let passUsuario = document.getElementById("passUsuario").value;
    console.log(nombreUsuario,passUsuario);
    for (const usuario of usuarios){
        if(nombreUsuario==usuario.nombreUsuario && passUsuario==usuario.password){
            sessionStorage.setItem("usuario",nombreUsuario);
            sessionStorage.setItem("password",passUsuario);
            mainOculto.style.display = 'block';
            modalLogin.hide();
            imprimePacientes();
        } else {
            alert("Usuario incorrecto");
            formularioLogin.reset();
        }
    }
}