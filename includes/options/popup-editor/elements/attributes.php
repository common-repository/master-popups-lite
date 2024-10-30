<?php
$elements->add_field(array(
	'id' => 'e-attributes-id',
	'name' => 'ID',
	'type' => 'text',
	'default' => $element_defaults['e-attributes-id'],
	'grid' => '4-of-8',
	'desc' => __( 'E.g. custom-id', 'masterpopups' ),
));
$elements->add_field(array(
	'id' => 'e-attributes-class',
	'name' => __( 'Class', 'masterpopups' ),
	'type' => 'text',
	'default' => $element_defaults['e-attributes-class'],
	'grid' => '4-of-8',
	'desc' => __( 'E.g: custom-class', 'masterpopups' ),
));
$elements->add_field(array(
	'id' => 'e-attributes-title',
	'name' => 'Title',
	'type' => 'text',
	'default' => $element_defaults['e-attributes-title'],
	'grid' => '4-of-8',
	'desc' => __( 'E.g: Custom title', 'masterpopups' ),
));


