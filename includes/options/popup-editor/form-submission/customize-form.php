<?php

use MasterPopups\Includes\Functions;
use MasterPopups\Includes\Assets;

$xbox->open_mixed_field(array('name' => 'Font'));
	$xbox->add_field(array(
		'id' => 'form-submission-font-size',
		'name' => 'Font size',
		'type' => 'number',
		'default' => '14',
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$xbox->add_field(array(
		'id' => 'form-submission-font-color',
		'name' => 'Font color',
		'type' => 'colorpicker',
		'default' => 'rgba(68, 68, 68, 1)',
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
    $xbox->add_field(array(
        'id' => 'form-submission-font-color-success',
        'name' => 'Font color on Success',
        'type' => 'colorpicker',
        'default' => 'rgba(68, 68, 68, 1)',
        'options' => array(
            'format' => 'rgba',
            'opacity' => 1,
        ),
    ));
	$xbox->add_field(array(
		'id' => 'form-submission-font-family',
		'name' => 'Font family',
		'type' => 'select',
		'default' => 'Roboto',
		'items' => array(
			'Fonts' => Assets::local_fonts(),
			'Google Fonts' => XboxItems::google_fonts(),
		),
		'options' => array(
			'sort' => 'asc',
			'search' => true,
		),
	));
$xbox->close_mixed_field();

$xbox->open_mixed_field(array('name' => 'Border'));
	$xbox->add_field(array(
		'id' => 'form-submission-border-width',
		'name' => 'Border width',
		'type' => 'number',
		'default' => '1',
		'attributes' => array(
			'min' => 0,
		),
		'options' => array(
			'show_spinner' => true,
		),
	));
	$xbox->add_field(array(
		'id' => 'form-submission-border-color',
		'name' => 'Border color',
		'type' => 'colorpicker',
		'default' => 'rgba(0, 181, 183, 1)',
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
	$xbox->add_field(array(
		'id' => 'form-submission-border-style',
		'name' => 'Border style',
		'type' => 'select',
		'default' => 'solid',
		'items' => XboxItems::border_style(),
	));
$xbox->close_mixed_field();

$xbox->open_mixed_field(array('name' => 'Background'));
	$xbox->add_field(array(
		'id' => 'form-submission-bg-color',
		'name' => 'Background color',
		'type' => 'colorpicker',
		'default' => 'rgba(245, 245, 245, 1)',
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
	$xbox->add_field(array(
		'id' => 'form-submission-bg-image',
		'name' => 'Background image',
		'type' => 'file',
		'options' => array(
			'mime_types' => array( 'jpg', 'jpeg', 'png', 'gif', 'ico' ),
			'preview_size' => array( 'width' => '30px','height' => '30px' ),
		),
		'row_class' => 'mpp-image-file',
		'grid' => '7-of-8 last'
	));
$xbox->close_mixed_field();

$xbox->add_field(array(
	'id' => 'form-submission-footer-enable',
	'name' => __( 'Show text "Back to form/Close" on success', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
	'options' => array(
	)
));
$xbox->add_field(array(
	'id' => 'form-submission-footer-font-size',
	'name' => 'Footer font size',
	'type' => 'number',
	'default' => '13',
	'attributes' => array(
		'min' => 0,
	),
	'options' => array(
		'show_spinner' => true,
	),
));


