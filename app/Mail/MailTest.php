<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MailTest extends Mailable
{
    use Queueable, SerializesModels;
    public $information;

    public function __construct()
    {
        //
    }
    // ConfiguracionCorreos
    public function build()
    {
        return $this->subject("Correo de prueba del sistema")
            ->view('MailTestView');
    }
}
