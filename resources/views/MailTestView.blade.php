<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo de Prueba</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .mail-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
        }

        .header {
            padding: 20px;
            border-bottom: 2px solid #0056b3;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #0056b3;
        }

        .header h2 {
            margin: 5px 0 0;
            font-size: 16px;
            color: #555;
            font-weight: normal;
        }

        .content {
            padding: 25px;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
        }

        .content h3 {
            margin-top: 0;
            color: #0056b3;
            font-size: 18px;
        }

        .message-box {
            background-color: #f9f9f9;
            border-left: 4px solid #0056b3;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
        }

        .footer {
            padding: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #777;
            background-color: #fafafa;
        }
    </style>
</head>

<body>
    <div class="mail-container">

        <div class="header">
            <h1>DELFIN TECNOLOGYS</h1>
            <h2>Correo de prueba del sistema</h2>
        </div>

        <div class="content">
            <h3>Hola,</h3>

            <p>
                Este correo ha sido enviado correctamente como parte de una prueba de funcionamiento
                del sistema de notificaciones.
            </p>

            <div class="message-box">
                <strong>¿Qué valida este correo?</strong>
                <ul>
                    <li>Configuración correcta del servidor de correo</li>
                    <li>Formato y diseño del mensaje</li>
                    <li>Recepción exitosa en el destinatario</li>
                </ul>
            </div>

            <p>
                No es necesario realizar ninguna acción adicional.
                Si usted recibió este mensaje, significa que el sistema de envío de correos
                está operando de manera correcta.
            </p>

            <p>
                Saludos,<br>
                <strong>Equipo de Delfin Tecnologys</strong>
            </p>
        </div>

        <div class="footer">
            <p>
                Este es un correo generado automáticamente para fines de prueba.<br>
                Por favor, no responda a este mensaje.
            </p>
        </div>

    </div>
</body>

</html>
