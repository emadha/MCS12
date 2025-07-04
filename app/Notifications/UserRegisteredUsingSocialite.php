<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserRegisteredUsingSocialite extends Notification
{
    use Queueable;

    public string $newTemporaryPassword;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $newTemporaryPassword)
    {
        $this->newTemporaryPassword = $newTemporaryPassword;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Mecarshop')
            ->greeting('Welcome to Mecarshop.com')
            ->line("We're sending you this e-mail because you just signed up on mecarshop.com.")
            ->line("")
            ->line("You signed up using a third party network, this action will create your password automatically.")
            ->line('Your temporary password is: **'.$this->newTemporaryPassword.'**')
            ->line("You may want to change that password from your account panel when you have the time to, or you can keep using the site by Signing In using this network.")
            ->action('Goto Mecarshop.com now!', url('/'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
