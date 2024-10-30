<?php

$xbox->add_tab(array(
	'id' => 'tab-triggers',
	'items' => array(
		'display-popup-triggers' => __( 'When to show Popup', 'masterpopups' ),
		'close-popup-triggers' => __( 'When to close Popup', 'masterpopups' ),
	),
));
$xbox->open_tab_item('display-popup-triggers');
include MPP_DIR . 'includes/options/popup-editor/triggers/open-triggers.php';
$xbox->close_tab_item('display-popup-triggers');

$xbox->open_tab_item('close-popup-triggers');
include MPP_DIR . 'includes/options/popup-editor/triggers/close-triggers.php';
$xbox->close_tab_item('close-popup-triggers');


$xbox->close_tab('tab-triggers');

