<?php
$xbox->add_field(array(
	'id' => 'overlay-show',
	'name' => __( 'Show overlay', 'masterpopups' ),
	'desc' => __( 'Disable this option if you do not want to display an overlay background. Overlay will never show for "Notification Bar"', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));
$xbox->open_mixed_field(array('name' => __( 'Overlay background', 'masterpopups' ) ));
	$xbox->add_field(array(
		'id' => 'overlay-bg-color',
		'name' => 'Background color',
		'type' => 'colorpicker',
		'default' => 'rgba(0, 1, 5, 0.8)',
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
	$xbox->add_field(array(
		'id' => 'overlay-bg-repeat',
		'name' => 'Background repeat',
		'type' => 'select',
		'default' => 'no-repeat',
		'items' => array(
			'no-repeat' => 'No repeat',
			'repeat' => 'Repeat',
			'repeat-x' => 'Repeat-x',
			'repeat-y' => 'Repeat-y',
		),
	));
	$xbox->add_field(array(
		'id' => 'overlay-bg-size',
		'name' => 'Background size',
		'type' => 'select',
		'default' => 'cover',
		'items' => array(
			'auto' => 'Auto',
			'cover' => 'Cover',
			'contain' => 'Contain',
		),
	));
	$xbox->add_field(array(
		'id' => 'overlay-bg-position',
		'name' => 'Background position',
		'type' => 'text',
		'default' => 'center center',
		'row_class' => 'not-full-width',
		'attributes' => array(
			'style' => 'width: 110px'
		)
	));
	$xbox->add_field(array(
		'id' => 'overlay-bg-image',
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
	'id' => 'overlay-opacity',
	'name' => __( 'Overlay opacity', 'masterpopups' ),
	'type' => 'select',
	'default' => '1',
	'items' => XboxItems::opacity(),
));



