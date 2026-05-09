<?php
spl_autoload_register(function (string $class): void {
    // Map \App\ namespace to lib/ directory
    $prefix = 'App\\';
    $baseDir = __DIR__.'/lib/';

    if (0 === strpos($class, $prefix)) {
        // Remove namespace prefix and convert to file path
        $relative = substr($class, strlen($prefix));
        $file = $baseDir.str_replace('\\', '/', $relative).'.php';

        if (file_exists($file)) {
            require $file;
        }
    }
});
