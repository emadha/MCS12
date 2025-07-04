<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
      style="background: black;scrollbar-width: thin"
      dir="{{$rtl ? 'rtl':'ltr'}}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ $title  }}</title>
    <meta name="robots" content="noindex,nofollow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://accounts.google.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
        rel="stylesheet">

    <script src="https://accounts.google.com/gsi/client" async></script>
    <!-- Scripts -->
    @routes('admin')
    @viteReactRefresh
    @vite(['resources/js/admin.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased" style="scroll-behavior: smooth;">
@inertia
</body>
</html>
