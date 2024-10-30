<?php

$elements->open_mixed_field(array(
	'name' => 'Misc',
	'options' => array(
		'show_name' => false,
	)
));
	$elements->add_field(array(
		'id' => 'e-box-shadow',
		'name' => 'Box shadow',
		'type' => 'text',
		'default' => $element_defaults['e-box-shadow'],
		'grid' => '2-of-6',
	));
	$elements->add_field(array(
		'id' => 'e-opacity',
		'name' => __( 'Opacity', 'masterpopups' ),
		'type' => 'select',
		'default' => $element_defaults['e-opacity'],
		'items' => XboxItems::opacity(),
	));
	$elements->add_field(array(
		'id' => 'e-overflow',
		'name' => 'Overflow',
		'type' => 'select',
		'default' => $element_defaults['e-overflow'],
		'items' => array(
			'auto' => 'Auto',
			'visible' => 'Visible',
			'hidden' => 'Hidden',
			'scroll' => 'Scroll',
		),
	));
	$elements->add_field(array(
		'id' => 'e-cursor',
		'name' => 'Cursor',
		'type' => 'select',
		'default' => $element_defaults['e-cursor'],
		'items' => array(
			'default' => 'Default',
			'pointer' => 'Pointer',
		),
	));
$elements->close_mixed_field();

$elements->add_field(array(
    'id' => 'e-valid-characters',
    'name' => __( 'Valid Characters', 'masterpopups' ),
    'type' => 'radio',
    'default' => $element_defaults['e-valid-characters'],
    'items' => array(
        'all' => 'All',
        'not-numbers' => 'Not Numbers',
        'only-numbers' => 'Only Numbers',
        'numbers-and-plus' => 'Numbers and .',
        'numbers-and-dash' => 'Numbers and -',
    ),
    'options' => array(
        'in_line' => false,
    )
));

$elements->add_field(array(
    'id' => 'e-min-characters',
    'name' => __( 'Min Characters', 'masterpopups' ),
    'type' => 'number',
    'default' => $element_defaults['e-min-characters'],
    'attributes' => array(
        'min' => '-1',
    ),
    'options' => array(
        'show_spinner' => true,
        'show_unit' => false
    ),
));

