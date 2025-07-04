<?php

return [
    'except' => [
        'debugbar.*', 'horizon.*', 'admin.*', 'ignition.*',
    ],

    'groups' => [
        'admin' => ['*']
    ],
];
