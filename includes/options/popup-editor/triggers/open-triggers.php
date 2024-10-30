<?php

use MasterPopups\Includes\Functions;

/*
|---------------------------------------------------------------------------------------------------
| On Click element
|---------------------------------------------------------------------------------------------------
*/
$xbox->add_field( array(
	'type' => 'title',
	'name' => 'On Click',
	'desc' => __( 'Display the popup by clicking on certain element', 'masterpopups' ),
));

$xbox->add_field(array(
	'id' => 'trigger-open-on-click-event',
	'name' => __( 'Event', 'masterpopups' ),
	'type' => 'radio',
	'default' => 'click',
	'items' => array(
		'click' => 'Click',
		'hover' => 'Hover',
	),
	'options' => array(
		'desc_tooltip' => true,
	)
));

$content = __( 'Use this class to execute your popup:', 'masterpopups' );
$content .= '<div style="margin-left: 20px; display: inline-block;">';
	$content .= '<input class="ampp-input-selector" readonly onfocus="this.select()" value="mpp-trigger-popup-'.Functions::post_id().'" style="width: 220px;">';
$content .= '</div>';
$content .= '<div class="ampp-margin-top-10">';
	$content .= __( 'Usage examples:', 'masterpopups' );
	$content .= '<textarea class="ampp-input-selector" readonly style="display: block; margin-top: 4px; width: 100%;">';
		$content .= '<a href="#" class="mpp-trigger-popup-'.Functions::post_id().'">Open popup</a>';
		$content .= "\n".'<a href="mpp-trigger-popup-'.Functions::post_id().'">Open popup</a>';
	$content .= '</textarea>';
$content .= '</div>';

$xbox->add_field(array(
	'id' => 'trigger-open-on-click-info',
	'type' => 'html',
	'content' => $content,
	'grid' => '8-of-8',
	'options' => array(
		'desc_tooltip' => true,
		'show_name' => false,
	)
));
$xbox->add_field(array(
	'id' => 'trigger-open-on-click-custom-class',
	'name' => __( 'Enter your custom class', 'masterpopups' ),
	'type' => 'text',
	'default' => 'your-custom-class',
	'options' => array(
		'desc_tooltip' => true,
	)
));

$xbox->add_field(array(
	'id' => 'trigger-open-on-click-prevent-default',
	'name' => __( 'Prevent Default Event', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
	'desc' => __( 'Enable to avoid the default event when clicking', 'masterpopups' ),
	'options' => array(
		'desc_tooltip' => false,
	)
));

/*
|---------------------------------------------------------------------------------------------------
| On Load
|---------------------------------------------------------------------------------------------------
*/
$xbox->add_field( array(
	'type' => 'title',
	'name' => 'On Page Load',
	'desc' => __( 'Display the popup automatically after X seconds', 'masterpopups' ),
));
$xbox->open_mixed_field(array('name' => __( 'Status', 'masterpopups' ) ));
	$xbox->add_field(array(
		'id' => 'trigger-open-on-load',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'off',
		'options' => array(
			'desc_tooltip' => true,
			//'show_name' => false,
		)
	));
	$xbox->add_field(array(
		'id' => 'trigger-open-on-load-delay',
		'name' => __( 'Time delay', 'masterpopups' ),
		'type' => 'number',
		'default' => '1',
		'options' => array(
			'show_spinner' => true,
			'unit' => 'sec',
			'show_if' => array('trigger-open-on-load', '=', 'on' ),
		),
		'attributes' => array(
			'min' => 0,
		),
	));
$xbox->close_mixed_field();

$xbox->open_mixed_field(array(
	'name' => __( 'Set cookie', 'masterpopups' ),
	'desc' => __( 'Enable this option to display the popup only once.', 'masterpopups' ),
));
	$xbox->add_field(array(
		'id' => 'cookie-on-load',
		'name' => __( 'Enable', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'off',
		'options' => array(
			'desc_tooltip' => true,
			//'show_name' => false,
		)
	));
	$xbox->add_field(array(
		'id' => 'cookie-on-load-duration',
		'name' => __( 'Cookie duration', 'masterpopups' ),
		'type' => 'radio',
		'default' => 'days',
		'items' => array(
			'current_session' => __( 'Current session', 'masterpopups' ),
			'days' => __( 'Define days', 'masterpopups' ),
		),
	));
	$xbox->add_field(array(
		'id' => 'cookie-on-load-days',
		'name' => __( 'Days', 'masterpopups' ),
		'desc' => __( 'The popup will be displayed once every "X" days.', 'masterpopups' ),
		'type' => 'number',
		'default' => '7',
		'options' => array(
			'desc_tooltip' => true,
			'show_spinner' => true,
			'unit' => 'days',
			'show_if' => array('cookie-on-load-duration', '=', 'days' ),
		),
		'attributes' => array(
			'min' => 1,
		),
	));
$xbox->close_mixed_field();


use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message().'<img src="'.MPP_URL.'/assets/admin/images/pro/triggers-open.png">',
    'options' => array(
        'show_name' => false
    )
));