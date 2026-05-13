<?php

namespace App\Encoder;

class JsonEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return $format === 'json';
    }

    public function encode(array $data): string {
        return json_encode($data, JSON_PRETTY_PRINT);
    }

    public function decode(string $data): array {
        $result = json_decode($data, true);
        if ($result === null) {
            return [];
        }
        return $result;
    }
}
