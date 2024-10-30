<?php
use MasterPopups\Includes\Assets as Assets;

$xbox->add_tab(array(
	'id' => 'tab-device-editor',
	'items' => array(
		'device-editor-desktop' => 'Desktop',
		'device-editor-mobile' => 'Mobile',
	),
	'attributes' => array(
		'class' => 'tab-device-editor'
	)
));
$xbox->open_tab_item('device-editor-desktop');
mpp_add_fields_tab_elements($xbox, $class, 'desktop');
$xbox->close_tab_item('device-editor-desktop');

$xbox->open_tab_item('device-editor-mobile');
mpp_add_fields_tab_elements($xbox, $class, 'mobile');
$xbox->close_tab_item('device-editor-mobile');

$xbox->close_tab('tab-device-editor');


