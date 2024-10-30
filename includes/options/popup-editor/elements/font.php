<?php
use MasterPopups\Includes\Assets as Assets;

$elements->open_mixed_field(array(
	'name' => 'Basic',
	'options' => array(
		'show_name' => false,
	)
));
	$elements->add_field(array(
		'id' => 'e-font-family',
		'name' => 'Font family',
		'type' => 'select',
		'default' => $element_defaults['e-font-family'],
		'items' => array(
			'Fonts' => Assets::local_fonts(),
			'Google Fonts' => XboxItems::google_fonts(),
		),
		'options' => array(
			'sort' => 'asc',
			'search' => true,
		),
	));
	$elements->add_field(array(
		'id' => 'e-font-color',
		'name' => 'Font color',
		'type' => 'colorpicker',
		'default' => $element_defaults['e-font-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
	$elements->add_field(array(
		'id' => 'e-font-size',
		'name' => 'Font size',
		'type' => 'number',
		'default' => $element_defaults['e-font-size'],
		'options' => array(
			'show_spinner' => true,
			'unit' => $element_defaults['e-font-size_unit'],
		),
		'attributes' => array(
			'min' => 0,
		),
	));
	$elements->add_field(array(
		'id' => 'e-font-weight',
		'name' => 'Font weight',
		'type' => 'select',
		'default' => $element_defaults['e-font-weight'],
		'items' => XboxItems::font_weight(),
	));
	$elements->add_field(array(
		'id' => 'e-font-style',
		'name' => 'Font style',
		'type' => 'select',
		'default' => $element_defaults['e-font-style'],
		'items' => XboxItems::font_style(),
	));
	$elements->add_field(array(
		'id' => 'e-text-align',
		'name' => 'Text align',
		'type' => 'select',
		'default' => $element_defaults['e-text-align'],
		'items' => XboxItems::text_align(),
	));
	$elements->add_field(array(
		'id' => 'e-line-height',
		'name' => 'Line height',
		'type' => 'number',
		'default' => $element_defaults['e-line-height'],
		'options' => array(
			'show_spinner' => true,
			'unit' => $element_defaults['e-line-height_unit'],
		),
		'attributes' => array(
			'min' => 0,
			'step' => 0.1,
			'precision' => 1
		),
	));
	$elements->add_field(array(
		'id' => 'e-white-space',
		'name' => 'White space',
		'type' => 'select',
		'default' => $element_defaults['e-white-space'],
		'items' => array(
			'normal' => 'Normal',
			'nowrap' => 'No Wrap',
		),
	));
	$elements->add_field(array(
		'id' => 'e-text-transform',
		'name' => 'Text transform',
		'type' => 'select',
		'default' => $element_defaults['e-text-transform'],
		'items' => XboxItems::text_transform(),
	));
	$elements->add_field(array(
		'id' => 'e-text-decoration',
		'name' => 'Text decoration',
		'type' => 'select',
		'default' => $element_defaults['e-text-decoration'],
		'items' => array(
			'none' => 'None',
			'underline' => 'Underline',
			'overline' => 'Overline',
			'line-through' => 'Line Through',
		),
	));
    $elements->add_field(array(
        'id' => 'e-letter-spacing',
        'name' => 'Letter spacing',
        'type' => 'text',
        'default' => $element_defaults['e-letter-spacing'],
        'grid' => '1-of-6',
    ));
	$elements->add_field(array(
		'id' => 'e-text-shadow',
		'name' => 'Text shadow',
		'type' => 'text',
		'default' => $element_defaults['e-text-shadow'],
		'grid' => '3-of-8',
	));
$elements->close_mixed_field();

$elements->add_field(array(
	'type' => 'title',
	'name' => 'Hover',
));
$elements->open_mixed_field(array('name' => 'Font on hover'));
	$elements->add_field(array(
		'id' => 'e-hover-font-enable',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-hover-font-enable'],
	));
	$elements->add_field(array(
		'id' => 'e-hover-font-color',
		'name' => 'Font color',
		'type' => 'colorpicker',
		'default' => $element_defaults['e-hover-font-color'],
		'options' => array(
			'format' => 'rgba',
			'opacity' => 0,
			'show_if' => array('e-hover-font-enable', '=', 'on')
		),
	));
$elements->close_mixed_field();