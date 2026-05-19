<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Song;
use App\Service\Router;
use App\Service\Templating;

class SongController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $songs = Song::findAll();
        $html = $templating->render('song/index.html.php', [
            'songs' => $songs,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestSong, Templating $templating, Router $router): ?string
    {
        if ($requestSong) {
            $song = Song::fromArray($requestSong);
            // @todo missing validation
            $song->save();

            $path = $router->generatePath('song-index');
            $router->redirect($path);
            return null;
        } else {
            $song = new Song();
        }

        $html = $templating->render('song/create.html.php', [
            'song' => $song,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $songId, ?array $requestSong, Templating $templating, Router $router): ?string
    {
        $song = Song::find($songId);
        if (! $song) {
            throw new NotFoundException("Missing song with id $songId");
        }

        if ($requestSong) {
            $song->fill($requestSong);
            // @todo missing validation
            $song->save();

            $path = $router->generatePath('song-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('song/edit.html.php', [
            'song' => $song,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $songId, Templating $templating, Router $router): ?string
    {
        $song = Song::find($songId);
        if (! $song) {
            throw new NotFoundException("Missing song with id $songId");
        }

        $html = $templating->render('song/show.html.php', [
            'song' => $song,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $songId, Router $router): ?string
    {
        $song = Song::find($songId);
        if (! $song) {
            throw new NotFoundException("Missing song with id $songId");
        }

        $song->delete();
        $path = $router->generatePath('song-index');
        $router->redirect($path);
        return null;
    }

}