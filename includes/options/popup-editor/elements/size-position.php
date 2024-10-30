<?php
use MasterPopups\Includes\Assets as Assets;
$elements->open_mixed_field(array('id' => 'e-size-position', 'name' => __( 'Position', 'masterpopups' )));
	$elements->add_field(array(
		'id' => 'e-position-top',
		'name' => __( 'Top', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-position-top'],
		'options' => array(
			'show_spinner' => true,
			'unit' => $element_defaults['e-position-top_unit'],
		),
	));
	$elements->add_field(array(
		'id' => 'e-position-left',
		'name' => __( 'Left', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-position-left'],
		'options' => array(
			'show_spinner' => true,
			'unit' => $element_defaults['e-position-left_unit'],
		),
	));
	$elements->add_field(array(
		'id' => 'e-position-top-right-page',
		'name' => __( 'On top right of the page', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-position-top-right-page'],
	));
$elements->close_mixed_field();

$elements->open_mixed_field(array('id' => 'e-size-position', 'name' => __( 'Size', 'masterpopups' )));
	$elements->add_field(array(
		'id' => 'e-size-width',
		'name' => __( 'Width', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-size-width'],
		'desc' => __( 'Element width, add only numbers or "auto"', 'masterpopups' ),
		'options' => array(
			'disable_spinner' => true,
			'unit' => $element_defaults['e-size-width_unit'],
			'desc_tooltip' => true,
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-size-height',
		'name' => __( 'Height', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-size-height'],
		'desc' => __( 'Element height, add only numbers or "auto"', 'masterpopups' ),
		'options' => array(
			'disable_spinner' => true,
			'unit' => $element_defaults['e-size-height_unit'],
			'desc_tooltip' => true,
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-full-screen',
		'name' => __( 'Full screen', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-full-screen'],
		'desc' => __( 'This element will cover the entire screen area', 'masterpopups' ),
		'options' => array(
			'desc_tooltip' => true,
		),
	));
$elements->close_mixed_field();


$elements->open_mixed_field(array('id' => 'e-padding', 'name' => __( 'Padding', 'masterpopups' )));
	$elements->add_field(array(
		'id' => 'e-padding-top',
		'name' => __( 'Padding top', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-padding-top'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'px',
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-padding-right',
		'name' => __( 'Padding right', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-padding-right'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'px',
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-padding-bottom',
		'name' => __( 'Padding bottom', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-padding-bottom'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'px',
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-padding-left',
		'name' => __( 'Padding left', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-padding-left'],
		'options' => array(
			'show_spinner' => true,
			'unit' => 'px',
		),
		'attributes' => array(
			'min' => 0,
		),
	));
$elements->close_mixed_field();