<?php
$xbox->add_tab(array(
	'id' => 'tab-general-popup',
	'items' => array(
		'general-popup-popup' => 'Popup',
		'general-popup-animations' => __( 'Animations', 'masterpopups' ),
		'general-popup-overlay' => 'Overlay',
		'general-popup-preloader' => 'Preloader',
		'general-popup-sticky' => 'Sticky',
		'general-popup-additional' => __( 'Additional Settings', 'masterpopups' ),
	),
));
	$xbox->open_tab_item('general-popup-popup');
	include MPP_DIR . 'includes/options/popup-editor/general/popup.php';
	$xbox->close_tab_item('general-popup-popup');

	$xbox->open_tab_item('general-popup-animations');
	include MPP_DIR . 'includes/options/popup-editor/general/animations.php';
	$xbox->close_tab_item('general-popup-animations');

	$xbox->open_tab_item('general-popup-overlay');
	include MPP_DIR . 'includes/options/popup-editor/general/overlay.php';
	$xbox->close_tab_item('general-popup-overlay');

	$xbox->open_tab_item('general-popup-preloader');
	include MPP_DIR . 'includes/options/popup-editor/general/preloader.php';
	$xbox->close_tab_item('general-popup-preloader');

	$xbox->open_tab_item('general-popup-sticky');
	include MPP_DIR . 'includes/options/popup-editor/general/sticky.php';
	$xbox->close_tab_item('general-popup-sticky');

	$xbox->open_tab_item('general-popup-additional');
	include MPP_DIR . 'includes/options/popup-editor/general/additional.php';
	$xbox->close_tab_item('general-popup-additional');

$xbox->close_tab('tab-general-popup');
