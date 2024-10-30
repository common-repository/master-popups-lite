<?php

$xbox->add_field(array(
    'id' => 'display-on-devices',
    'name' => __( 'Display popup on these devices', 'masterpopups' ),
    'type' => 'checkbox',
    'default' => array('desktop', 'tablet', 'mobile'),
    'items' => array(
        'desktop' => 'Desktop',
        'tablet' => 'Tablet',
        'mobile' => 'Mobile',
    ),
));



use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message().'<img src="'.MPP_URL.'/assets/admin/images/pro/display-by-users.png">',
    'options' => array(
        'show_name' => false
    )
));