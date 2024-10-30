<?php

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Custom JS', 'masterpopups' ),
	'desc' => __( 'Enter your custom js here.', 'masterpopups')." Without &#60;script&#62; tags",
));
$xbox->add_field(array(
	'id' => 'custom-javascript',
	'name' => __( 'Custom JS', 'masterpopups' ),
	'type' => 'code_editor',
	'default' => '(function($){
	jQuery(document).ready(function($){

	});
})(jQuery);
',
	'desc' => '',
	'options' => array(
		'show_name' => false,
		'language' => 'javascript',
		'theme' => 'tomorrow_night',
		'height' => '500px',
	),
));