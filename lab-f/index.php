<?php

require_once 'autoload.php';

use App\Serializer;
use App\Encoder\JsonEncoder;
use App\Encoder\CsvEncoder;
use App\Encoder\YamlEncoder;

# Zapisywanie ciasteczek gdy klikniemy przycisk

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['input'])) {
        setcookie('input', $_POST['input'], time() + (86400 * 30), "/");
    }
    if (isset($_POST['input_format'])) {
        setcookie('input_format', $_POST['input_format'], time() + (86400 * 30), "/");
    }
    if (isset($_POST['output_format'])) {
        setcookie('output_format', $_POST['output_format'], time() + (86400 * 30), "/");
    }
}

# Odebranie danych z POSTA lub ciasteczek
if (isset($_POST['input'])) {
    $input = $_POST['input'];
} elseif (isset($_COOKIE['input'])) {
    $input = $_COOKIE['input'];
} else {
    $input = '';
}

# sprawdzanie foramtu wejścia

if (isset($_POST['input_format'])) {
    $inputFormat = $_POST['input_format'];
} elseif (isset($_COOKIE['input_format'])) {
    $inputFormat = $_COOKIE['input_format'];
} else {
    $inputFormat = 'csv';
}

# sprawdzanie formatu wyjścia

if (isset($_POST['output_format'])) {
    $outputFormat = $_POST['output_format'];
} elseif (isset($_COOKIE['output_format'])) {
    $outputFormat = $_COOKIE['output_format'];
} else {
    $outputFormat = 'json';
}

$output = '';

# konwersja poprzez serializer

if ($input != '') {

    # deserializacja zmieniamy wejście na tablice
    if ($inputFormat === 'json') {
        $inEnc = new JsonEncoder();
    } elseif ($inputFormat === 'yaml') {
        $inEnc = new YamlEncoder();
    } else {
        # obsługa csv, ssv i tsv
        $inEnc = new CsvEncoder($inputFormat);
    }

    $deserializer = new Serializer($inEnc);
    $data = $deserializer->deserialize($input);

    # serializacja zamieniamy tablice na wyjście

    if ($outputFormat === 'json') {
        $outEnc = new JsonEncoder();
    } elseif ($outputFormat === 'yaml') {
        $outEnc = new YamlEncoder();
    } else {
        $outEnc = new CsvEncoder($outputFormat);
    }

    $serializer = new Serializer($outEnc);
    $output = $serializer->serialize($data);
}

require 'templates/layout.php';