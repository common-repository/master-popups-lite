<?php

$id_main_tab = 'main-tab';
$items_main_tab = array(
    'service-integration' => '<i class="xbox-icon xbox-icon-refresh"></i>'.__( 'Service Integration', 'masterpopups' ),
    'general' => '<i class="xbox-icon xbox-icon-object-group"></i>General',
    'custom-css' => '<i class="xbox-icon xbox-icon-paint-brush"></i>'.__( 'Custom CSS', 'masterpopups' ),
    'custom-js' => '<i class="xbox-icon xbox-icon-code"></i>'.__( 'Custom JS', 'masterpopups' ),
    'rate' => '<i class="xbox-icon xbox-icon-star"></i>Rate our Plugin',
    'promote' => '<i class="xbox-icon xbox-icon-dollar"></i>Promote & Earn money',
);
$items_main_tab = apply_filters('mpp_settings_tab_items', $items_main_tab, $id_main_tab );

$xbox->add_main_tab(array(
	'name' => 'Main tab',
	'id' => 'main-tab',
	'items' => $items_main_tab,
));

$xbox->open_tab_item('service-integration');
include MPP_DIR . 'includes/options/general-settings/service-integration/service-integration.php';
$xbox->close_tab_item('service-integration');

$xbox->open_tab_item('general');
include MPP_DIR . 'includes/options/general-settings/general/general.php';
$xbox->close_tab_item('general');

$xbox->open_tab_item('custom-css');
include MPP_DIR . 'includes/options/general-settings/custom-css/custom-css.php';
$xbox->close_tab_item('custom-css');

$xbox->open_tab_item('custom-js');
include MPP_DIR . 'includes/options/general-settings/custom-js/custom-js.php';
$xbox->close_tab_item('custom-js');

$xbox->open_tab_item('rate');
include MPP_DIR . 'includes/options/general-settings/rate.php';
$xbox->close_tab_item('rate');

$xbox->open_tab_item('promote');
include MPP_DIR . 'includes/options/general-settings/promote.php';
$xbox->close_tab_item('promote');

$xbox = apply_filters( 'mpp_settings_tab_fields', $xbox );

$xbox->close_tab('main-tab');



