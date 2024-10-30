<?php

$elements->open_mixed_field(array(
	'options' => array(
		'show_name' => false,
	)
));
	$elements->add_field(array(
		'id' => 'e-bg-repeat',
		'name' => 'Background repeat',
		'type' => 'select',
		'default' => $element_defaults['e-bg-repeat'],
		'items' => array(
			'no-repeat' => 'No repeat',
			'repeat' => 'Repeat',
			'repeat-x' => 'Repeat-x',
			'repeat-y' => 'Repeat-y',
		),
	));
	$elements->add_field(array(
		'id' => 'e-bg-size',
		'name' => 'Background size',
		'type' => 'select',
		'default' => $element_defaults['e-bg-size'],
		'items' => array(
			'auto' => 'Auto',
			'cover' => 'Cover',
			'contain' => 'Contain',
		),
	));
	$elements->add_field(array(
		'id' => 'e-bg-position',
		'name' => 'Background position',
		'type' => 'text',
		'default' => $element_defaults['e-bg-position'],
		'row_class' => 'not-full-width',
		'attributes' => array(
			'style' => 'width: 110px'
		)
	));
	$elements->add_field(array(
		'id' => 'e-bg-image',
		'name' => 'Background image',
		'type' => 'file',
		'options' => array(
			'mime_types' => array( 'jpg', 'jpeg', 'png', 'gif', 'ico' ),
			'preview_size' => array( 'width' => '30px','height' => '30px' ),
		),
		'row_class' => 'mpp-image-file',
		'grid' => '7-of-8 last'
	));
$elements->close_mixed_field();

$elements->open_mixed_field(array(
	'options' => array(
		'show_name' => false,
	)
));
	$elements->add_field(array(
		'id' => 'e-bg-color',
		'name' => 'Background color',
		'type' => 'colorpicker',
		'default' => $element_defaults['e-bg-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-bg-enable-gradient',
		'name' => __( 'Enable gradient', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-bg-enable-gradient'],
	));
	$elements->add_field(array(
		'id' => 'e-bg-color-gradient',
		'name' => 'To color',
		'type' => 'colorpicker',
		'default' => $element_defaults['e-bg-color-gradient'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
			'show_if' => array('e-bg-enable-gradient', '=', 'on' )
		),
	));
	$elements->add_field(array(
		'id' => 'e-bg-angle-gradient',
		'name' => __( 'Angle', 'masterpopups' ),
		'type' => 'number',
		'default' => $element_defaults['e-bg-angle-gradient'],
		'options' => array(
			'show_spinner' => true,
			'unit' => $element_defaults['e-bg-angle-gradient_unit'],
			'show_if' => array('e-bg-enable-gradient', '=', 'on' )
		),
		'attributes' => array(
			'min' => -360,
			'max' => 360,
		),
	));
$elements->close_mixed_field();

$elements->add_field(array(
	'type' => 'title',
	'name' => 'Hover',
));
$elements->open_mixed_field(array('name' => 'Background on hover'));
	$elements->add_field(array(
		'id' => 'e-hover-bg-enable',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-hover-bg-enable'],
	));
	$elements->add_field(array(
		'id' => 'e-hover-bg-color',
		'name' => 'Background color',
		'type' => 'colorpicker',
		'default' => $element_defaults['e-hover-bg-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
			'show_if' => array('e-hover-bg-enable', '=', 'on')
		),
	));
$elements->close_mixed_field();