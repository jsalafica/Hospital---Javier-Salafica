export function muestraToast(texto){
    Toastify({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "#557571",
        },
        stopOnFocus: true,
        close: true,
    }).showToast();
}