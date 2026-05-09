<?php

namespace App\Encoder;

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return 'yaml' === $format;
    }

    public function decode(string $text, string $format): array
    {
        if (!function_exists('yaml_parse')) {
            throw new \RuntimeException('Rozszerzenie YAML nie jest wlaczone.');
        }

        $data = yaml_parse($text);

        return is_array($data) ? $data : [];
    }

    public function encode(array $data, string $format): string
    {
        if (!function_exists('yaml_emit')) {
            throw new \RuntimeException('Rozszerzenie YAML nie jest wlaczone.');
        }

        return yaml_emit($data);
    }
}
