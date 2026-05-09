<?php

namespace App;

use App\Encoder\EncoderInterface;

class Serializer
{
    private array $encoders;

    public function __construct(array $encoders)
    {
        $this->encoders = $encoders;
    }

    public function convert(string $text, string $from, string $to): string
    {
        if ($from === $to) {
            return $text;
        }

        $data = $this->encoder($from)->decode($text, $from);
        $data = $this->normalize($data);

        return $this->encoder($to)->encode($data, $to);
    }

    private function encoder(string $format): EncoderInterface
    {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }

        throw new \RuntimeException('Nieznany format.');
    }

    private function normalize(array $data): array
    {
        if (empty($data)) {
            return [];
        }

        if ($this->isAssoc($data)) {
            $data = [$data];
        }

        if (!isset($data[0]) || !is_array($data[0])) {
            throw new \RuntimeException('Kazdy element musi miec te same pola.');
        }

        $headers = array_keys($data[0]);
        $sortedHeaders = $headers;
        sort($sortedHeaders);

        foreach ($data as $index => $row) {
            if (!is_array($row)) {
                throw new \RuntimeException('Kazdy element musi miec te same pola.');
            }

            $rowHeaders = array_keys($row);
            sort($rowHeaders);

            if ($rowHeaders !== $sortedHeaders) {
                throw new \RuntimeException('Kazdy element musi miec te same pola.');
            }

            $orderedRow = [];

            foreach ($headers as $header) {
                $orderedRow[$header] = $row[$header];
            }

            $data[$index] = $orderedRow;
        }

        return $data;
    }

    private function isAssoc(array $array): bool
    {
        return array_keys($array) !== range(0, count($array) - 1);
    }
}
