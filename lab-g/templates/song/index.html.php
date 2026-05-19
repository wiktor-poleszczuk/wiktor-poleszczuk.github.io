<?php

/** @var \App\Model\Song[] $songs */
/** @var \App\Service\Router $router */

$title = 'Song List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Songs List</h1>

    <a href="<?= $router->generatePath('song-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($songs as $song): ?>
            <li><h3><?= $song->getTitle() ?> - <?= $song->getArtist() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('song-show', ['id' => $song->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('song-edit', ['id' => $song->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';