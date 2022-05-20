<?php
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];

$email = "Este mensaje fue enviado por: ".$nombre." ".$apellido."\r\n";
$email .= "Su correo es: ".$correo."\r\n";
$email .= "Su mensaje es: ".$mensaje."\r\n";
$email .= "Enviado el: ".date("d/m/Y", time());

$destinatario = "jsalafica@gmail.com";
$asunto = "Este correo fué enviado desde la web";

mail($destinatario, $asunto, utf8_decode($email));
header("Location:exito.html");

?>