<?php
use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message().'<img src="'.MPP_URL.'/assets/admin/images/pro/notification-bar.png">',
    'options' => array(
        'show_name' => false
    )
));