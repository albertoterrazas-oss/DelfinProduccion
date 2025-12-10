<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CodigoVerificacion extends Mailable
{
    use Queueable, SerializesModels;

    // use Queueable, SerializesModels;
    public $information;

    public function __construct($information)
    {
        $this->information = $information;
    }
    // ConfiguracionCorreos
    // app/Mail/CodigoVerificacion.php

    public function build()
    {
        return $this->subject("Codigo Verificacion")
            // **Asegúrate de que 'CodigoSs' es el nombre correcto de tu archivo .blade.php**
            ->view('CodigoSs', [
                'information' => $this->information,
                'Codigo' => $this->information->Codigo,
            ]);
    }
}
