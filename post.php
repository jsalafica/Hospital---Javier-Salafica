<?php
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];

$correo = "Este mensaje fue enviado por: ".$nombre." ".$apellido."\r\n";
$correo .= "Su correo es: ".$correo."\r\n";
$correo .= "Su mensaje es: ".$mensaje."\r\n";
$correo .= "Enviado el: ".date("d/m/Y", time());

$destinatario = "jsalafica@gmail.com";
$asunto = "Este correo fué enviado desde la web";

mail($destinatario, $asunto, utf8_decode($correo), $header);
header("Location:exito.html");

?>