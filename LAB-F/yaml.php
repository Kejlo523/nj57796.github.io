<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Jędrzej Nowak',
    'index' => '57796',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;
