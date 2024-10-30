<?php

$xbox->add_tab(array(
	'id' => 'tab-target',
	'items' => array(
		'display-target' => __( 'Pages', 'masterpopups' ),
		'display-conditions' => __( 'Conditions', 'masterpopups' ),
	),
));
$xbox->open_tab_item('display-target');
include MPP_DIR . 'includes/options/popup-editor/target/display-target.php';
$xbox->close_tab_item('display-target');


$xbox->open_tab_item('display-conditions');
include MPP_DIR . 'includes/options/popup-editor/target/display-conditions.php';
$xbox->close_tab_item('display-conditions');

$xbox->close_tab('tab-target');
