<?php

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Custom CSS', 'masterpopups' ),
	'desc' => __( 'Enter your custom css here.', 'masterpopups'),
));
$xbox->add_field(array(
	'id' => 'custom-css',
	'name' => __( 'Custom CSS', 'masterpopups' ),
	'type' => 'code_editor',
	'default' => '',
	'desc' => '',
	'options' => array(
		'show_name' => false,
		'language' => 'css',
		'theme' => 'tomorrow_night',
		'height' => '500px',
	),
));