<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CodigoAutorizacionQuiencQuien extends Mailable
{
    use Queueable, SerializesModels;
    public $information;

    public function __construct($information)
    {
        $this->information = $information;
    }
    // ConfiguracionCorreos
    public function build()
    {
        return $this->subject($this->information->Titulo)
            ->view('AceptacionQuiencQuien', [
                'Unidad' => $this->information->Unidad,
                'User' => $this->information->User,
                'Operador' => $this->information->Operador,
                'Destino' => $this->information->Destino,
                'QconQuienUnidad' => $this->information->QconQuienUnidad,
            ]);
    }
}
