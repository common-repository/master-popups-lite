<?php


$xbox->add_field(array(
    'id' => 'placeholder-color',
    'name' => 'Placeholder color',
    'type' => 'colorpicker',
    'default' => 'rgba(134,134,134,1)',
    'options' => array(
        'format' => 'rgba',
        'opacity' => 1,
    ),
));
$xbox->add_field(array(
    'id' => 'box-shadow',
    'name' => 'Box shadow',
    'type' => 'text',
    'default' => '0px 0px 16px 4px rgba(0,0,0,0.5)',
));


use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message(). '<img src="'.MPP_URL.'/assets/admin/images/pro/aditional-settings.png">',
    'options' => array(
        'show_name' => false
    )
));