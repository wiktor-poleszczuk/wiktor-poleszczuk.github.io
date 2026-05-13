<?php

namespace App\Encoder;

class CsvEncoder implements EncoderInterface {
    private $format;

    public function __construct(string $format = 'csv') {
        $this->format = $format;
    }

    public function supports(string $format): bool {
        return in_array($format, ['csv', 'ssv', 'tsv']);
    }

    public function decode(string $data): array {
        $delimiter = $this->getDelimiter();
        $lines = explode("\n", $data); # dzielenie na linie
        if (empty($lines)) {
            return [];
        }

        $firstLine = array_shift($lines); # Nagłówki w pierwszej lini poberamy i usuwamy
        $headers = str_getcsv($firstLine, $delimiter, '"', '');

        $result = [];
        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }

            $values = str_getcsv($line, $delimiter, '"', ''); # pobranie wartosci z lini
            $result[] = array_combine($headers, $values);
        }
        return $result;
    }

    public function encode(array $data): string {
        if (empty($data)) {
            return '';
        }

        $delimiter = $this->getDelimiter();
        $output = [];

        $headers = array_keys($data[0]); # Dodajemy nagłówek
        $output[] = implode($delimiter, $headers); # łączymy nazwy kolumn w jeden tekst rozdzielajac je wybranym znakiem
        # dodajemy dane w pętli
        foreach ($data as $row) {
            $output[] = implode($delimiter, $row);
        }

        return implode("\n", $output);
    }

    private function getDelimiter(): string {
        if ($this->format === 'ssv') {
            return ';';
        }
        if ($this->format === 'tsv') {
            return "\t";
        }

        return ',';
    }
}