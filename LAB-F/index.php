<?php

require __DIR__.'/autoload.php';

use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;
use App\Serializer;

$formats = [
    'csv' => 'CSV',
    'ssv' => 'SSV',
    'tsv' => 'TSV',
    'json' => 'JSON',
    'yaml' => 'YAML',
];

$input = $_POST['input'] ?? $_COOKIE['input'] ?? '';
$from = $_POST['from'] ?? $_COOKIE['from'] ?? 'csv';
$to = $_POST['to'] ?? $_COOKIE['to'] ?? 'json';
$output = '';
$error = '';

if ('POST' === $_SERVER['REQUEST_METHOD']) {
    setcookie('input', $input, time() + 60 * 60 * 24 * 30);
    setcookie('from', $from, time() + 60 * 60 * 24 * 30);
    setcookie('to', $to, time() + 60 * 60 * 24 * 30);

    try {
        $serializer = new Serializer([
            new CsvEncoder(),
            new JsonEncoder(),
            new YamlEncoder(),
        ]);

        $output = $serializer->convert($input, $from, $to);
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
    }
}

function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function selected(string $current, string $value): string
{
    return $current === $value ? ' selected' : '';
}
?>
<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Jędrzej Nowak (57796) - PTW LAB F</title>
    <style>
        body {
            margin: 0;
            font-family: "Inter", Arial, sans-serif;
            background-color: #111111;
            color: #eeeeee;
        }

        main {
            max-width: 1000px;
            margin: 12px auto;
            padding: 16px;
            background-color: #181818;
            border: 1px solid #2f2f2f;
            border-radius: 8px;
            box-sizing: border-box;
        }

        h1 {
            margin-top: 0;
            margin-bottom: 12px;
        }

        form,
        .result {
            padding: 16px;
            margin-bottom: 12px;
            background-color: #202020;
            border: 1px solid #2f2f2f;
            border-radius: 6px;
        }

        label {
            display: block;
            margin-top: 12px;
            font-weight: bold;
            color: #cccccc;
        }

        textarea,
        select {
            width: 100%;
            margin-top: 6px;
            padding: 10px;
            box-sizing: border-box;
            font: inherit;
            background-color: #212121;
            border: 1px solid #353535;
            border-radius: 6px;
            color: #eeeeee;
            outline: none;
        }

        textarea:focus,
        select:focus {
            border-color: #5578a6;
            background-color: #242424;
        }

        textarea {
            min-height: 220px;
            resize: vertical;
            font-family: Consolas, monospace;
        }

        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        button {
            width: 100%;
            margin-top: 16px;
            padding: 10px;
            border: 0;
            border-radius: 4px;
            background-color: #4c6788;
            color: #ffffff;
            font: inherit;
            cursor: pointer;
        }

        button:hover {
            background-color: #5a7697;
        }

        h2 {
            margin-top: 0;
            margin-bottom: 12px;
        }

        pre {
            min-height: 160px;
            margin: 0;
            padding: 12px;
            background-color: #222222;
            border: 1px solid #2f2f2f;
            border-radius: 6px;
            white-space: pre-wrap;
            font-family: Consolas, monospace;
            color: #dddddd;
        }

        .error {
            padding: 12px;
            background-color: rgba(180, 60, 60, 0.15);
            border: 1px solid rgba(180, 60, 60, 0.4);
            border-radius: 6px;
            color: #ff9f9f;
            font-weight: bold;
        }

        @media (max-width: 700px) {
            .row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
<main>
    <h1>Konwerter danych</h1>

    <form method="post">
        <label for="input">Dane wejściowe</label>
        <textarea id="input" name="input"><?= e($input) ?></textarea>

        <div class="row">
            <div>
                <label for="from">Format wejściowy</label>
                <select id="from" name="from">
                    <?php foreach ($formats as $value => $label): ?>
                        <option value="<?= e($value) ?>"<?= selected($from, $value) ?>><?= e($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label for="to">Format wyjściowy</label>
                <select id="to" name="to">
                    <?php foreach ($formats as $value => $label): ?>
                        <option value="<?= e($value) ?>"<?= selected($to, $value) ?>><?= e($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <button type="submit">Konwertuj</button>
    </form>

    <section class="result">
        <h2>Wynik</h2>

        <?php if ($error): ?>
            <p class="error"><?= e($error) ?></p>
        <?php endif; ?>

        <pre><?= e($output) ?></pre>
    </section>
</main>
</body>
</html>
