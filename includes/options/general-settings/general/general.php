<?php
use MasterPopups\Includes\Functions as Functions;

$xbox->add_field(array(
    'id' => 'disable-user-roles',
    'name' => __( 'Disable popup management for', 'masterpopups' ),
    'type' => 'checkbox',
    'default' => array(),
    'items' => Functions::get_user_roles(array('edit_posts'), array('administrator')),
));

$xbox->add_field(array(
    'id' => 'enable-enqueue-popups',
    'name' => __( 'Enable popups queue', 'masterpopups' ),
    'desc' => __( 'By default the popups are displayed one at a time, if you want to show multiple  popups at time activate this option.', 'masterpopups' ),
    'type' => 'switcher',
    'default' => 'on',
));

$xbox->add_field(array(
    'id' => 'show-link-edit-popup',
    'name' => __( 'Show link to edit the Popup', 'masterpopups' ).' (for admin user)',
    'type' => 'switcher',
    'default' => 'off',
));

$xbox->add_field(array(
	'id' => 'mx-record-email-validation',
	'name' => __( 'MX Record Email Validation', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));

$xbox->add_field(array(
    'id' => 'attach-error-on-form-failed',
    'name' => __( 'Attach internal errors after form failed', 'masterpopups' ),
    'desc' => __( 'Activate this option to show internal errors when the form submission fails. Allows you to configure the form correctly.', 'masterpopups' ),
    'type' => 'switcher',
    'default' => 'on',
));

$xbox->add_field(array(
	'id' => 'load-google-fonts',
	'name' => __( 'Load Google Fonts', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));

$xbox->add_field(array(
	'id' => 'load-font-awesome',
	'name' => __( 'Load Font Awesome', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));

$xbox->add_field(array(
	'id' => 'send-data-to-developer',
	'name' => 'Collaborate with the development',
	'desc' => 'This option allows the developer to improve and optimize the options of the plugin.',
	'type' => 'switcher',
	'default' => 'on',
));
$xbox->add_field(array(
    'id' => 'popups-z-index',
    'name' => __( 'Z-Index for Popups', 'masterpopups' ),
    'type' => 'number',
    'default' => '99999999',
    'options' => array(
        'show_spinner' => true,
        'show_unit' => false,
    ),
    'attributes' => array(
        'min' => 1,
    ),
    'grid' => '2-of-8'
));

$xbox->add_field(array(
    'name' => __( 'Form validation messages', 'masterpopups' ),
    'type' => 'title',
));
$xbox->add_field(array(
    'id' => 'validation-msg-general',
    'name' => 'General',
    'type' => 'text',
    'default' => __( 'This field is required', 'masterpopups' ),
    'grid' => '5-of-8'
));
$xbox->add_field(array(
    'id' => 'validation-msg-email',
    'name' => 'Email',
    'type' => 'text',
    'default' => __( 'Invalid email address', 'masterpopups' ),
    'grid' => '5-of-8'
));
$xbox->add_field(array(
    'id' => 'validation-msg-checkbox',
    'name' => 'Checkbox',
    'type' => 'text',
    'default' => __( 'This field is required, please check', 'masterpopups' ),
    'grid' => '5-of-8'
));
$xbox->add_field(array(
    'id' => 'validation-msg-dropdown',
    'name' => 'Dropdown',
    'type' => 'text',
    'default' => __( 'This field is required. Please select an option', 'masterpopups' ),
    'grid' => '5-of-8'
));
$xbox->add_field(array(
    'id' => 'form-submission-back-to-form-text',
    'name' => __( 'Back to form', 'masterpopups' ),
    'type' => 'text',
    'default' => __( 'Back to form', 'masterpopups' ),
    'grid' => '2-of-8'
));
$xbox->add_field(array(
    'id' => 'form-submission-close-popup-text',
    'name' => __( 'Close', 'masterpopups' ),
    'type' => 'text',
    'default' => __( 'Close', 'masterpopups' ),
    'grid' => '2-of-8'
));

$xbox->add_field(array(
    'name' => __( 'Debug', 'masterpopups' ),
    'type' => 'title',
));
$xbox->add_field(array(
    'id' => 'debug-mode',
    'name' => __( 'Debug mode', 'masterpopups' ),
    'desc' => __( 'This option is only for developers, allows to see processes and errors in the console.', 'masterpopups' ),
    'type' => 'switcher',
    'default' => 'off',
));