<?php

/**
 * ContactMessageMail
 *
 * Mailable class for sending contact form submissions via email.
 * Uses the 'emails.contact' Blade view to render the message content.
 * The subject dynamically includes the sender's name.
 */

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
  use Queueable, SerializesModels;

  public $data; // Array containing 'name', 'email', and 'message' from the contact form

  public function __construct($data)
  {
    $this->data = $data;
  }

  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'New Contact Message from ' . $this->data['name'],
    );
  }

  public function content(): Content
  {
    return new Content(
      view: 'emails.contact', // Renders resources/views/emails/contact.blade.php
    );
  }
}
