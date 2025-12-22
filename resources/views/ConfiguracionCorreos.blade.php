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

        /* --- ESTILOS DEL CÓDIGO --- */
        .code-wrapper {
            text-align: center;
            padding: 10px 0;
        }

        .code-table {
            margin: 0 auto;
            border-collapse: collapse;
        }

        .code-digit-cell {
            border: 2px solid #0056b3;
            width: 25px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #0056b3;
            background-color: #e6f0ff;
        }

        /* --- NUEVO ESTILO PELÓN PARA EL BOTÓN (COMPATIBLE CON CORREO) --- */
        .btn-autorizar {
            background-color: #0056b3;
            color: #ffffff !important;
            padding: 12px 25px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            border: 1px solid #004494;
        }

        /* Estilos de Tabla de Detalles */
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
    </style>
</head>

<body>
    <div class="factura-container">
        <div class="header">
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
                        @php $codeDigits = str_split($Codigo); @endphp
                        @foreach ($codeDigits as $digit)
                            <td class="code-digit-cell">{{ $digit }}</td>
                        @endforeach
                    </tr>
                </table>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

            <div style="text-align: center; padding: 10px 0;">
                <a href="http://192.168.0.57:1142/AuthorizationCode?asign={{ $QconQuienUnidad }}&unfg={{ $Unidad }}&oprtd={{ $Operador }}&dest={{ $Destino }}&cgp={{ $Codigo }}&tytype={{ $tytype }}"
                   class="btn-autorizar">
                    Autorizar código
                </a>
            </div>
        </div>

        <div class="details">
            <h1>LISTADO DE INCIDENCIAS REGISTRADAS</h1>
            <table>
                <thead>
                    <tr class="table-header">
                        <th>NOMBRE DE LA VERIFICACIÓN</th>
                        <th>OBSERVACIONES DE INCIDENCIA</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($incidencias as $item)
                        <tr class="table-data">
                            <td>{{ $item->listaVerificacion->ListaVerificacion_nombre ?? 'N/A' }}</td>
                            <td>{{ $item->IncidenciasMovimiento_observaciones }}</td>
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