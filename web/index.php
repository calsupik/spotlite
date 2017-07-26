<?php

require('../vendor/autoload.php');

$app = new Silex\Application();
$app['debug'] = true;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

// Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => __DIR__.'/views',
));

// Register database
$dbopts = parse_url(getenv('DATABASE_URL'));
$app->register(new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
  array(
  'pdo.server' => array(
    'driver'   => 'pgsql',
    'user' => $dbopts["user"],
    'password' => $dbopts["pass"],
    'host' => $dbopts["host"],
    'port' => $dbopts["port"],
    'dbname' => ltrim($dbopts["path"],'/')
    )
  )
);

// Our web handlers

// Default route
$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('index.twig');
});

// 'db' route
$app->get('/db/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT name FROM test_table');
  $st->execute();

  $names = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['name']);
    $names[] = $row;
  }

  return json_encode($names);
});

// 'getlocations' route
$app->get('/getlocations/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT * FROM locations');
  $st->execute();

  $locations = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['name']);
    $locations[] = $row;
  }

  return json_encode($locations);
});

$app->run();
