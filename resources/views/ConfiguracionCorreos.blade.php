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
            background-color: #f4f4f4;
        }

        /* Contenedor Principal */
        .factura-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            border: 1px solid #ddd;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Encabezado */
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
        }

        .title h1 {
            margin: 0;
            font-size: 24px;
            color: #0056b3;
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
            text-align: center;
        }

        /* --- NUEVOS ESTILOS PARA EL CÓDIGO CON TABLA (COMPATIBLE CON CORREO) --- */
        .code-wrapper {
            /* Contenedor central para la tabla */
            text-align: center;
            padding: 10px 0;
        }

        .code-table {
            /* Asegura que la tabla esté centrada */
            margin: 0 auto;
            border-collapse: collapse;
            border-spacing: 0;
        }

        .code-digit-cell {
            /* Estilo para cada dígito (celda) */
            border: 2px solid #0056b3;
            width: 25px;
            /* Reducimos el ancho */
            height: 35px;
            /* Reducimos la altura */
            line-height: 35px;
            /* Ajustamos la línea para centrado vertical */
            text-align: center;
            font-size: 20px;
            /* Reducimos el tamaño de la fuente */
            font-weight: bold;
            color: #0056b3;
            background-color: #e6f0ff;
            padding: 0;
            /* Aseguramos que no haya padding */
        }

        /* Ajustes de bordes redondeados para el primer y último dígito */
        .code-table tr td:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }

        .code-table tr td:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        /* --- FIN ESTILOS DEL CÓDIGO --- */


        /* Estilos de Tabla de Detalles (Mantenidos) */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .table-header th {
            background-color: #0056b3;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            font-size: 12px !important;
            border: 1px solid #004085;
            text-transform: uppercase;
        }

        .table-data td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
            font-size: 11px !important;
            color: #444;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

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
                <h1>DELFIN TECHNOLOGIES</h1>
                <h2>CORREO DE INCIDENCIAS</h2>
            </div>
        </div>


        <div class="details">
            <h1>Código de salida</h1>

            <div class="code-wrapper">
                <table class="code-table">
                    <tr>
                        @php
                            $codeDigits = str_split($Codigo);
                        @endphp
                        @foreach ($codeDigits as $digit)
                            <td class="code-digit-cell">{{ $digit }}</td>
                        @endforeach
                    </tr>
                </table>
            </div>
            <hr>


            <div class="d-flex justify-content-center">
                <a href="http://127.0.0.1:8000/AuthorizationCode?asign={{ $QconQuienUnidad }}&unfg={{ $Unidad }}&oprtd={{ $Operador }}&dest={{ $Destino }}&cgp={{ $Codigo }}&tytype={{ $tytype }}"
                    class="btn btn-primary">
                    Autorizar código
                </a>
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

        <div
            style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #777;">
            <p>Este es un correo generado automáticamente. Por favor, no responder a este mensaje.</p>
        </div>


    </div>
</body>

</html>