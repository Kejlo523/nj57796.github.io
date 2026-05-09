<?php

namespace App\Encoder;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return 'json' === $format;
    }

    public function decode(string $text, string $format): array
    {
        $data = json_decode($text, true);

        if (JSON_ERROR_NONE !== json_last_error()) {
            throw new \RuntimeException('Niepoprawny JSON.');
        }

        return is_array($data) ? $data : [];
    }

    public function encode(array $data, string $format): string
    {
        return (string) json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
