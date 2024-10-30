<?php
$xbox->add_field(array(
	'id' => 'custom-css',
	'name' => __( 'Custom CSS', 'masterpopups' ),
	'type' => 'code_editor',
	'default' => '/* Change [id] by the popup id */
.mpp-popup-[id] .mpp-wrap {
}
',
	'desc' => '',
	'options' => array(
		'language' => 'css',
		'theme' => 'tomorrow_night',
		'height' => '220px',
	),
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
		'language' => 'javascript',
		'theme' => 'tomorrow_night',
		'height' => '200px',
	),
));
$xbox->add_field(array(
	'type' => 'title',
	'name' => 'Popup Callbacks',
	'desc' => __( 'You can use these functions to run your own code.', 'masterpopups'),
));
// $xbox->add_field(array(
// 	'id' => 'callback-before-open',
// 	'name' => __( 'Before Open Popup', 'masterpopups' ),
// 	'type' => 'code_editor',
// 	'options' => array(
// 		'language' => 'javascript',
// 		'theme' => 'tomorrow_night',
// 		'height' => '200px',
// 	),
// 	'desc' => __( 'Please enter valid javascript code. You can use jQuery or $. Important: Do not enter anything before or after the function.', 'masterpopups'),
// 	'default' => 'function( $, popup_instance, popup_id, options ){
//   //console.log("Before Open Popup");
// }'
// ));
$xbox->add_field(array(
	'id' => 'callback-after-open',
	'name' => __( 'After Open Popup', 'masterpopups' ),
	'type' => 'code_editor',
	'options' => array(
		'language' => 'javascript',
		'theme' => 'tomorrow_night',
		'height' => '200px',
	),
	'desc' => __( 'Please enter valid javascript code. You can use jQuery or $. Important: Do not enter anything before or after the function.', 'masterpopups'),
	'default' => 'function( $, popup_instance, popup_id, options ){
  //console.log("After Open Popup");
}'
));
// $xbox->add_field(array(
// 	'id' => 'callback-before-close',
// 	'name' => __( 'Before Close Popup', 'masterpopups' ),
// 	'type' => 'code_editor',
// 	'options' => array(
// 		'language' => 'javascript',
// 		'theme' => 'tomorrow_night',
// 		'height' => '200px',
// 	),
// 	'desc' => __( 'Please enter valid javascript code. You can use jQuery or $. Important: Do not enter anything before or after the function.', 'masterpopups'),
// 	'default' => 'function( $, popup_instance, popup_id, options ){
//   //console.log("Before Close Popup");
// }'
// ));
$xbox->add_field(array(
	'id' => 'callback-after-close',
	'name' => __( 'After Close Popup', 'masterpopups' ),
	'type' => 'code_editor',
	'options' => array(
		'language' => 'javascript',
		'theme' => 'tomorrow_night',
		'height' => '200px',
	),
	'desc' => __( 'Please enter valid javascript code. You can use jQuery or $. Important: Do not enter anything before or after the function.', 'masterpopups'),
	'default' => 'function( $, popup_instance, popup_id, options ){
  //console.log("After Close Popup");
}'
));

$xbox->add_field(array(
	'id' => 'callback-after-form-submission',
	'name' => __( 'After Form Submission', 'masterpopups' ),
	'type' => 'code_editor',
	'options' => array(
		'language' => 'javascript',
		'theme' => 'tomorrow_night',
		'height' => '200px',
	),
	'desc' => __( 'Please enter valid javascript code. You can use jQuery or $. Important: Do not enter anything before or after the function.', 'masterpopups'),
	'default' => 'function( $, popup_instance, popup_id, options, success ){
  //console.log("After Form Submission");
}'
));