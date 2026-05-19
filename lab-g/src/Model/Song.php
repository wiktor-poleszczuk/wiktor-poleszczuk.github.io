<?php
namespace App\Model;

use App\Service\Config;

class Song
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $artist = null;
    private ?int $duration = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Song
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Song
    {
        $this->title = $title;

        return $this;
    }

    public function getArtist(): ?string
    {
        return $this->artist;
    }

    public function setArtist(?string $artist): Song
    {
        $this->artist = $artist;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): Song
    {
        $this->duration = $duration;

        return $this;
    }

    public static function fromArray($array): Song
    {
        $song = new self();
        $song->fill($array);

        return $song;
    }

    public function fill($array): Song
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId((int)$array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['artist'])) {
            $this->setArtist($array['artist']);
        }
        if (isset($array['duration'])) {
            $this->setDuration((int)$array['duration']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM song';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $songs = [];
        $songsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($songsArray as $songArray) {
            $songs[] = self::fromArray($songArray);
        }

        return $songs;
    }

    public static function find($id): ?Song
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM song WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $songArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $songArray) {
            return null;
        }
        $song = Song::fromArray($songArray);

        return $song;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO song (title, artist, duration) VALUES (:title, :artist, :duration)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'artist' => $this->getArtist(),
                'duration' => $this->getDuration(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE song SET title = :title, artist = :artist, duration = :duration WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':artist' => $this->getArtist(),
                ':duration' => $this->getDuration(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM song WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setArtist(null);
        $this->setDuration(null);
    }
}