<?php

$xbox->add_main_tab(array(
	'name' => 'Main tab',
	'id' => 'main-tab',
	'items' => array(
		'general' => '<i class="xbox-icon xbox-icon-cog"></i>General',
		'subscribers' => '<i class="xbox-icon xbox-icon-users"></i>Subscribers',
	),
));

$xbox->open_tab_item('general');
include MPP_DIR . 'includes/options/audience/general/general.php';
$xbox->close_tab_item('general');

$xbox->open_tab_item('subscribers');
include MPP_DIR . 'includes/options/audience/subscribers/subscribers.php';
$xbox->close_tab_item('subscribers');

$xbox->close_tab('main-tab');



