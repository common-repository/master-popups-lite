<?php

$elements->open_mixed_field(array('name' => __( 'On Click Actions', 'masterpopups' ) ));
	$elements->add_field(array(
		'id' => 'e-onclick-action',
		'name' => __( 'Action', 'masterpopups' ),
		'type' => 'radio',
		'default' => $element_defaults['e-onclick-action'],
		'items' => array(
			'default' => __( 'Default', 'masterpopups' ),
			'close-popup' => __( 'Close popup', 'masterpopups' ),
			'redirect-to-url' => __( 'Redirect to URL', 'masterpopups' ),
		),
		'options' => array(
			'in_line' => false,
		)
	));
	$elements->add_field(array(
		'id' => 'e-onclick-popup-id',
		'name' => __( 'Popup id', 'masterpopups' ),
		'type' => 'text',
		'desc' => __( 'Enter the popup id. E.g: 20', 'masterpopups' ),
		'default' => $element_defaults['e-onclick-popup-id'],
		'options' => array(
			'show_if' => array('e-onclick-action', 'in', array('open-popup', 'open-popup-and-not-close'))
		),
	));
	$elements->add_field(array(
		'id' => 'e-onclick-url',
		'name' => __( 'Enter URL', 'masterpopups' ),
		'type' => 'text',
		'desc' => __( 'Enter a valid url with http/https. e.g: http://google.com', 'masterpopups' ),
		'default' => $element_defaults['e-onclick-url'],
		'options' => array(
			'show_if' => array('e-onclick-action', '=', 'redirect-to-url')
		)
	));
	$elements->add_field(array(
		'id' => 'e-onclick-target',
		'name' => 'Target',
		'type' => 'radio',
		'default' => $element_defaults['e-onclick-target'],
		'items' => array(
			'_self' => __( 'Same Window', 'masterpopups' ),
			'_blank' => __( 'New Window', 'masterpopups' ),
		),
		'options' => array(
			'show_if' => array('e-onclick-action', '=', 'redirect-to-url')
		)
	));
$elements->close_mixed_field();