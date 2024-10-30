<?php
$xbox->add_field(array(
	'id' => 'inline-should-close',
	'name' => __( 'Should close popup on Inline Mode', 'masterpopups' ),
	'desc' => __( 'If is disabled, any element or action to close the popup will be deleted or disabled.', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'off',
));
use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message(),
    'options' => array(
        'show_name' => false
    )
));