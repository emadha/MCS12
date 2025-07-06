<x-mail::message>
# Introduction

## Your balance has been credited {{ $credit->amount }}
{{ $credit->note }}

<x-mail::button :url="''">
    View Transactions
</x-mail::button>

    Thanks,
{{ config('app.name') }}
</x-mail::message>
