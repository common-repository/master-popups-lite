<?php


/*
|---------------------------------------------------------------------------------------------------
| Close Click on Overlay
|---------------------------------------------------------------------------------------------------
*/
$xbox->add_field( array(
	'type' => 'title',
	'name' => 'On Click Overlay',
	'desc' => __( 'Close the popup by clicking on overlay', 'masterpopups' ),
));
$xbox->open_mixed_field(array('name' => __( 'Status', 'masterpopups' ) ));
	$xbox->add_field(array(
		'id' => 'trigger-close-on-click-overlay',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'on',
		'options' => array(
			'desc_tooltip' => true,
			//'show_name' => false,
		)
	));
$xbox->close_mixed_field();

/*
|---------------------------------------------------------------------------------------------------
| Close with ESC key
|---------------------------------------------------------------------------------------------------
*/
$xbox->add_field( array(
	'type' => 'title',
	'name' => 'On ESC Keydown',
	'desc' => __( 'Close the popup by pressing the ESC Key', 'masterpopups' ),
));
$xbox->open_mixed_field(array('name' => __( 'Status', 'masterpopups' ) ));
	$xbox->add_field(array(
		'id' => 'trigger-close-on-esc-keydown',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'on',
		'options' => array(
			'desc_tooltip' => true,
			//'show_name' => false,
		)
	));
$xbox->close_mixed_field();




use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message().'<img src="'.MPP_URL.'/assets/admin/images/pro/triggers-close.png">',
    'options' => array(
        'show_name' => false
    )
));
