<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aceptación Quien con Quien</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
        .factura-container { width: 100%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 30px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 3px solid #0056b3; padding-bottom: 15px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; color: #0056b3; }
        .header h2 { margin: 5px 0 0; font-size: 16px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        
        .content { margin-top: 25px; line-height: 1.6; }
        .info-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .info-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
        .label { font-weight: bold; color: #555; width: 40%; }
        
        /* Estilo del Código */
        .code-wrapper { text-align: center; margin: 25px 0; }
        .code-table { margin: 0 auto; border-collapse: separate; border-spacing: 5px; }
        .code-digit-cell { border: 2px solid #0056b3; width: 35px; height: 45px; line-height: 45px; text-align: center; font-size: 22px; font-weight: bold; color: #0056b3; background-color: #e6f0ff; border-radius: 4px; }
        
        .btn-container { text-align: center; margin: 30px 0; }
        .btn-autorizar { background-color: #28a745; color: #ffffff !important; padding: 15px 35px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block; transition: background-color 0.3s; }
        
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="factura-container">
        <div class="header">
            <h1>DELFIN TECHNOLOGIES</h1>
            <h2>Aceptación Quien con Quien</h2>
        </div>

        <div class="content">
            <p>Se ha generado una nueva solicitud de asignación. Por favor, verifique los detalles a continuación:</p>
            
            <table class="info-table">
                <tr>
                    <td class="label">Unidad:</td>
                    <td>{{ $Unidad }}</td>
                </tr>
                <tr>
                    <td class="label">Operador:</td>
                    <td>{{ $Operador }}</td>
                </tr>
                <tr>
                    <td class="label">Destino:</td>
                    <td>{{ $Destino }}</td>
                </tr>
            </table>

           

            <div class="btn-container">
                <a href="{{ url('/AuthorizationQuiencQuien') }}?asign={{ $QconQuienUnidad }}&uGTYr={{ $User }}&uu={{ $Unidad }}" 
                   class="btn-autorizar">
                    SEGUIR CON LA ACEPTACIÓN
                </a>
            </div>
        </div>

        <div class="footer">
            <p>Este es un correo generado automáticamente por el sistema de Delfin Technologies.<br>
            <strong>Por favor, no responda a este mensaje.</strong></p>
        </div>
    </div>
</body>
</html>