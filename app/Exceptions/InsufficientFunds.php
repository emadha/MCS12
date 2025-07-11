<?php

namespace App\Exceptions;

use Exception;

class InsufficientFunds extends Exception
{
    protected $message = 'Insufficient funds';
}
