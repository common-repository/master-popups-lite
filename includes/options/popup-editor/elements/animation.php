<?php
use MasterPopups\Includes\Assets as Assets;

$elements->open_mixed_field(array('name' => __( 'Entry animation', 'masterpopups' )));
	$elements->add_field(array(
		'id' => 'e-animation-enable',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-animation-enable'],
	));
	$elements->add_field(array(
		'id' => 'e-open-animation',
		'name' => __( 'Animation effect', 'masterpopups' ),
		'type' => 'select',
		'default' => $element_defaults['e-open-animation'],
		'items' => Assets::animations_in(),
		'options' => array(
			'show_if' => array('e-animation-enable', '=', 'on'),
		)
	));
	$elements->add_field(array(
		'id' => 'e-open-duration',
		'name' => __( 'Animation duration', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-open-duration'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'ms',
			'show_if' => array('e-animation-enable', '=', 'on'),
		),
		'attributes' => array(
			'min' => 0,
			'step' => 100,
		),
	));
	$elements->add_field(array(
		'id' => 'e-open-delay',
		'name' => __( 'Animation delay', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-open-delay'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'ms',
			'show_if' => array('e-animation-enable', '=', 'on'),
		),
		'attributes' => array(
			'min' => 0,
			'step' => 100,
		),
	));
$elements->close_mixed_field();