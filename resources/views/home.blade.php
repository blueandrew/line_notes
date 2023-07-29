<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        <title>Laravel</title>

        @vite("resources/css/app.css")
    </head>
    <body>
        <div id="app">
            <app-component/>
        </div>

        @vite("resources/js/app.js")
    </body>
</html>
