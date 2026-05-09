<?php

namespace App\Encoder;

class CsvEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return in_array($format, ['csv', 'ssv', 'tsv'], true);
    }

    public function decode(string $text, string $format): array
    {
        $text = str_replace(["\r\n", "\r"], "\n", trim($text));
        $lines = explode("\n", $text);

        if (!$lines || '' === trim($lines[0])) {
            return [];
        }

        $delimiter = $this->delimiter($format);
        $headers = str_getcsv(array_shift($lines), $delimiter, '"', '');
        $rows = [];

        foreach ($lines as $line) {
            if ('' === trim($line)) {
                continue;
            }

            $values = str_getcsv($line, $delimiter, '"', '');
            $row = [];

            foreach ($headers as $index => $header) {
                $row[$header] = $values[$index] ?? '';
            }

            $rows[] = $row;
        }

        return $rows;
    }

    public function encode(array $data, string $format): string
    {
        if (empty($data)) {
            return '';
        }

        $delimiter = $this->delimiter($format);
        $headers = array_keys($data[0]);
        $lines = [$this->line($headers, $delimiter)];

        foreach ($data as $row) {
            $values = [];

            foreach ($headers as $header) {
                $values[] = (string) ($row[$header] ?? '');
            }

            $lines[] = $this->line($values, $delimiter);
        }

        return implode("\n", $lines);
    }

    private function delimiter(string $format): string
    {
        if ('ssv' === $format) {
            return ';';
        }

        if ('tsv' === $format) {
            return "\t";
        }

        return ',';
    }

    private function line(array $values, string $delimiter): string
    {
        return implode($delimiter, $values);
    }
}
