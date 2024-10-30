<?php
// $xbox->open_mixed_field(array(
// 	'name' => __( 'Preloader ', 'masterpopups'),
// 	'options' => array(
// 		'show_name' => false,
// 	)
// ));
$xbox->add_field(array(
	'id' => 'preloader-show',
	'name' => __( 'Show preloader', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));
$xbox->add_field(array(
	'id' => 'preloader-duration',
	'name' => __( 'Preloader duration', 'masterpopups' ),
	'type' => 'number',
	'default' => 1000,
	'options' => array(
		'show_spinner' => true,
		'unit' => 'ms',
		// 'show_if' => array('preloader-show', '=', 'on')
	),
	'attributes' => array(
		'min' => 0,
		'max' => 5000,
		'step' => 100,
	),
));
$xbox->add_field(array(
	'id' => 'preloader-color-1',
	'name' => __( 'Preloader color 1', 'masterpopups' ),
	'type' => 'colorpicker',
	'default' => 'rgba(0,221,210,1)',
	'options' => array(
		'format' => 'rgba',
		'opacity' => 1,
		// 'show_if' => array('preloader-show', '=', 'on')
	),
));
$xbox->add_field(array(
	'id' => 'preloader-color-2',
	'name' => __( 'Preloader color 2', 'masterpopups' ),
	'type' => 'colorpicker',
	'default' => 'rgba(62,153,255,1)',
	'options' => array(
		'format' => 'rgba',
		'opacity' => 1,
		// 'show_if' => array('preloader-show', '=', 'on')
	),
));
// $xbox->close_mixed_field();