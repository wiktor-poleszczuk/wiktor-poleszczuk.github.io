<?php

namespace App;

use App\Encoder\EncoderInterface;

class Serializer
{
    private $encoder;
    public function __construct(EncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }
    public function serialize(array $data): string
    {
        return $this->encoder->encode($data);
    }
    public function deserialize(string $data): array
    {
        return $this->encoder->decode($data);
    }
}