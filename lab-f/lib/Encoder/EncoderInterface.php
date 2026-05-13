<?php

namespace App\Encoder;

interface EncoderInterface
{
    public function supports(string $format): bool;
    public function encode(array $data): string;
    public function decode(string $data): array;
}