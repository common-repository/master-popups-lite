<?php
require_once('SplClassLoader.php');

// Load the ConstantContactAPI2 namespace
$loader = new \ConstantContactAPI2\SplClassLoader('ConstantContactAPI2', dirname(__DIR__));
$loader->register();
