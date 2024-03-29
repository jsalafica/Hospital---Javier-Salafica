const navbar = `
    <header class="header">
        <nav class="navbar navbar-expand-lg navbar-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html"><img src="images/index.jpg" alt="Logo" width="140"></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="historia.html">Historia</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="servicios.html">Servicios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="telefonos.html">Teléfonos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="galeria.html">Galería</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="contacto.html">Contacto</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav d-flex" id="navLogin">
                        <li class="nav-item">
                            <a class="nav-link" id="hora">Hora</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle"href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Internación</a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" id="btnNuevoPaciente" href="#">Nuevo</a></li>
                                <li><a class="dropdown-item" id="btnReset" href="#" title="Resetea listado de pacientes">Reset</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" id="btnLogout" href="#">Cerrar sesión</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
`;
// inserting navbar in beginning of body
document.body.insertAdjacentHTML("afterbegin", navbar);