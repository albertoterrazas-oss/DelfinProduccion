<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo de Incidencias</title>
    <style>
        /* Estilos Generales para el Correo */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4; /* Fondo ligero para simular el cuerpo del correo */
        }

        /* Contenedor Principal */
        .factura-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto; /* Centra el contenido y da un margen superior/inferior */
            border: 1px solid #ddd;
            padding: 20px;
            background-color: #ffffff; /* Fondo blanco para el contenido */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Encabezado */
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #0056b3; /* Línea separadora */
            padding-bottom: 10px;
        }

        /* Estilos del Logo/Imagen (Si se usara) */
        .circle {
            width: 300px;
            height: 100px;
            margin-right: 20px;
            /* Estos estilos se conservan, aunque el tag <img> no está presente */
        }

        .title h1 {
            margin: 0;
            font-size: 24px;
            color: #0056b3; /* Color azul para el título principal */
        }

        .title h2 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .details {
            margin-top: 20px;
        }

        .details h1 {
            font-size: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #555;
        }

        /* Estilos para la Tabla de Incidencias */
        table {
            width: 100%;
            border-collapse: collapse; /* Elimina el espacio entre bordes */
            margin-top: 15px;
        }

        .table-header th {
            background-color: #0056b3; /* Fondo azul oscuro para la cabecera */
            color: #ffffff; /* Texto blanco */
            padding: 10px;
            text-align: center;
            font-size: 12px !important;
            border: 1px solid #004085;
            text-transform: uppercase;
        }
        
        /* Estilos de las celdas de datos */
        .table-data td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
            font-size: 11px !important;
            color: #444;
        }
        
        /* Alternar colores de fila para mejor legibilidad */
        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        /* Estilos de texto (se usan para asegurar que los estilos inline no choquen) */
        .letracontainerbold {
            font-weight: bold;
        }

        .letracontainer {
            font-weight: normal;
        }
    </style>
</head>

<body>
    <div class="factura-container">
        <div class="header">
            {{-- Puedes colocar un logo aquí si lo deseas --}}
            {{-- <img src="[URL_DE_TU_IMAGEN_O_BASE64]" alt="Logo de DELFIN TECNOLOGYS" class="circle"> --}}

            <div class="title">
                <h1>DELFIN TECNOLOGYS</h1>
                <h2>CORREO DE INCIDENCIAS</h2>
            </div>
        </div>
        
        <div class="details">
            <h1>LISTADO DE INCIDENCIAS REGISTRADAS</h1>

            <table>
                <thead>
                    <tr class="table-header">
                        <th class="letracontainerbold">NOMBRE DE LA VERIFICACIÓN</th>
                        <th class="letracontainerbold">OBSERVACIONES DE INCIDENCIA</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($incidencias as $item)
                        <tr class="table-data">
                            {{-- Nombre de la Verificación (ListaVerificacion_nombre) --}}
                            <td class="letracontainer">
                                {{ $item->listaVerificacion->ListaVerificacion_nombre ?? 'N/A' }}
                            </td>
                            {{-- Observaciones de la Incidencia (IncidenciasMovimiento_observaciones) --}}
                            <td class="letracontainer">
                                {{ $item->IncidenciasMovimiento_observaciones }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #777;">
            <p>Este es un correo generado automáticamente. Por favor, no responder a este mensaje.</p>
        </div>
    </div>
</body>

</html>