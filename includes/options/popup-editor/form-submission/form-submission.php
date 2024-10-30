<?php

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Form Type', 'masterpopups' ),
));
$items_popup_type = array(
    'none' => __( 'None', 'masterpopups' ),
    'user-subscription' => __( 'Subscription Form', 'masterpopups' ),
    'contact-form' => __( 'Contact Form', 'masterpopups' ),
);
$items_popup_type = apply_filters('mpp_items_popup_type', $items_popup_type);
$xbox->add_field(array(
	'id' => 'form-submission-type',
	'name' => 'Form Submission Type',
	'type' => 'radio',
	'default' => 'none',
	'items' => $items_popup_type,
	'options' => array(
		'show_name' => false,
	)
));
$xbox->add_tab(array(
	'id' => 'tab-form-submission',
	'items' => array(
		'subscription-form' => __( 'Subscription Form', 'masterpopups' ),
		'contact-form' => __( 'Contact Form', 'masterpopups' ),
		'actions-form' => __( 'Actions after submission', 'masterpopups' ),
		'customize-form' => __( 'Customize', 'masterpopups' ),
	),
));
$xbox->open_tab_item('subscription-form');
include MPP_DIR . 'includes/options/popup-editor/form-submission/subscription-form.php';
$xbox->close_tab_item('subscription-form');

$xbox->open_tab_item('contact-form');
include MPP_DIR . 'includes/options/popup-editor/form-submission/contact-form.php';
$xbox->close_tab_item('contact-form');

$xbox->open_tab_item('actions-form');
include MPP_DIR . 'includes/options/popup-editor/form-submission/actions-form.php';
$xbox->close_tab_item('actions-form');

$xbox->open_tab_item('customize-form');
include MPP_DIR . 'includes/options/popup-editor/form-submission/customize-form.php';
$xbox->close_tab_item('customize-form');

$xbox->close_tab('tab-form-submission');