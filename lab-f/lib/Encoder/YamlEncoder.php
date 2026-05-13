<?php

namespace App\Encoder;

class YamlEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return $format === 'yaml';
    }

    public function encode(array $data): string {
        return yaml_emit($data);
    }

    public function decode(string $data): array {
        $result = yaml_parse($data);
        if (!is_array($result)) {
            return [];
        }

        return $result;
    }
}