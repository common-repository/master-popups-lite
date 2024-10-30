<?php
use MasterPopups\Includes\Assets as Assets;

$xbox->open_mixed_field(array('name' => __( 'Entry animation', 'masterpopups' )));
	$xbox->add_field(array(
		'id' => 'open-animation',
		'name' => __( 'Animation effect', 'masterpopups' ),
		'type' => 'select',
		'default' => 'mpp-zoomIn',
		'items' => Assets::animations_in(),
	));
	$xbox->add_field(array(
		'id' => 'open-duration',
		'name' => __( 'Animation duration', 'masterpopups' ),
		'type' => 'number',
		'default' => 800,
		'options' => array(
			'show_spinner' => true,
			'unit' => 'ms',
		),
		'attributes' => array(
			'min' => 0,
			'step' => 100,
		),
	));
$xbox->close_mixed_field();

$xbox->open_mixed_field(array('name' => __( 'Exit animation', 'masterpopups' )));
	$xbox->add_field(array(
		'id' => 'close-animation',
		'name' => __( 'Animation effect', 'masterpopups' ),
		'type' => 'select',
		'default' => 'mpp-zoomOut',
		'items' => Assets::animations_out(),
	));
	$xbox->add_field(array(
		'id' => 'close-duration',
		'name' => __( 'Animation duration', 'masterpopups' ),
		'type' => 'number',
		'default' => 700,
		'options' => array(
			'show_spinner' => true,
			'unit' => 'ms',
		),
		'attributes' => array(
			'min' => 0,
			'step' => 100,
		),
	));
$xbox->close_mixed_field();