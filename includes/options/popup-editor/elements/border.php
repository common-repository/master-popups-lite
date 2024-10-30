<?php
$elements->open_mixed_field(array('id' => 'e-border', 'name' => 'Border'));
	$elements->add_field(array(
		'id' => 'e-border-top-width',
		'name' => __( 'Border top width', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-border-top-width'],
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$elements->add_field(array(
		'id' => 'e-border-right-width',
		'name' => __( 'Border right width', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-border-right-width'],
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$elements->add_field(array(
		'id' => 'e-border-bottom-width',
		'name' => __( 'Border bottom width', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-border-bottom-width'],
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$elements->add_field(array(
		'id' => 'e-border-left-width',
		'name' => __( 'Border left width', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-border-left-width'],
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$elements->add_field(array(
		'id' => 'e-border-color',
		'name' => __( 'Border color', 'masterpopups' ),
		'type' => 'colorpicker',
		'default' => $element_defaults['e-border-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
	$elements->add_field(array(
		'id' => 'e-border-style',
		'name' => __( 'Border style', 'masterpopups' ),
		'type' => 'select',
		'default' => $element_defaults['e-border-style'],
		'items' => XboxItems::border_style(),
	));
$elements->close_mixed_field();

$elements->add_field(array(
	'id' => 'e-border-radius',
	'name' => __( 'Border radius', 'masterpopups' ),
	'type' => 'number',
	'default' => $element_defaults['e-border-radius'],
	'attributes' => array(
		'min' => 0,
	),
	'options' => array(
		'show_spinner' => true,
	),
));

/*
|---------------------------------------------------------------------------------------------------
| Hover
|---------------------------------------------------------------------------------------------------
*/
$elements->add_field(array(
	'type' => 'title',
	'name' => 'Hover',
));
$elements->open_mixed_field(array('name' => 'Border color on hover'));
	$elements->add_field(array(
		'id' => 'e-hover-border-enable',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-hover-border-enable'],
	));
	$elements->add_field(array(
		'id' => 'e-hover-border-color',
		'name' => __( 'Border color', 'masterpopups' ),
		'type' => 'colorpicker',
		'default' => $element_defaults['e-hover-border-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
			'show_if' => array('e-hover-border-enable', '=', 'on')
		),
	));
$elements->close_mixed_field();

/*
|---------------------------------------------------------------------------------------------------
| Focus
|---------------------------------------------------------------------------------------------------
*/
$elements->add_field(array(
	'type' => 'title',
	'name' => 'Focus',
));
$elements->open_mixed_field(array('name' => 'Border color on focus'));
	$elements->add_field(array(
		'id' => 'e-focus-border-enable',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-focus-border-enable'],
	));
	$elements->add_field(array(
		'id' => 'e-focus-border-color',
		'name' => __( 'Border color', 'masterpopups' ),
		'type' => 'colorpicker',
		'default' => $element_defaults['e-focus-border-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
			'show_if' => array('e-focus-border-enable', '=', 'on')
		),
	));
$elements->close_mixed_field();