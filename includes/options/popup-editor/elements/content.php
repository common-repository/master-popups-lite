<?php
use MasterPopups\Includes\Assets as Assets;

$elements->add_field(array(
	'id' => 'e-content-textarea',
	'name' => __( 'Text/HTML', 'masterpopups' ),
	'type' => 'textarea',
	'default' => $element_defaults['e-content-textarea'],
	'desc' => 'Enter a valid text/html',
	'options' => array(
		'show_name' => false,
	),
	'insert_after_field' => '<a class="xbox-btn xbox-btn-teal xbox-btn-icon xbox-btn-small ampp-float-btn ampp-open-icon-library ">'.__( 'Insert icon', 'masterpopups' ).'</a>'
));

$elements->add_field(array(
	'id' => 'e-content-shortcode',
	'name' => 'Shortcode',
	'type' => 'textarea',
	'default' => $element_defaults['e-content-shortcode'],
	'desc' => sprintf(__( 'Please enter only %s. Not html. We recommend going to Advanced tab and in the "Overflow" option choose "Auto"', 'masterpopups' ), '[Shortcode]'),
	'options' => array(
		'show_name' => false,
	),
));

$elements->add_field(array(
	'id' => 'e-content-close-icon',
	'name' => 'Close icon',
	'type' => 'icon_selector',
	'default' => $element_defaults['e-content-close-icon'],
	'items' => Assets::close_icons(),
	'options' => array(
		'show_name' => false,
		//'load_with_ajax' => true,
		'ajax_data' => array('class_name' => 'MasterPopups\Includes\Assets', 'function_name' => 'close_icons'),
		'size' => '40px',
		'wrap_height' => '150px'
	)
));

$elements->add_field(array(
	'id' => 'e-content-object',
	'name' => __( 'Choose object', 'masterpopups' ),
	'type' => 'icon_selector',
	'default' => $element_defaults['e-content-object'],
	'items' => array(),
	'options' => array(
		'show_name' => false,
		'hide_buttons' => true,
		'hide_search' => true,
		'size' => '40px',
	),
	'append_in_field' => '<a class="xbox-btn xbox-btn-teal xbox-btn-icon xbox-btn-small ampp-open-object-library">Select object</a>',
));

$elements->add_field(array(
	'id' => 'e-content-image',
	'name' => __( 'Image URL', 'masterpopups' ),
	'type' => 'file',
	'default' => $element_defaults['e-content-image'],
	'options' => array(
		'mime_types' => array( 'jpg', 'jpeg', 'png', 'gif', 'ico' ),
		'preview_size' => array( 'width' => '30px','height' => '30px' ),
		'show_if' => array('', 'aa'),
	),
	'row_class' => 'mpp-image-file',
	'grid' => '7-of-8 last'
));

$elements->add_field(array(
	'id' => 'e-content-url',
	'name' => __( 'Iframe URL', 'masterpopups' ),
	'type' => 'text',
	'default' => $element_defaults['e-content-url'],
	'options' => array(
		'helper' => '<i class="xbox-icon xbox-icon-link"></i>',
	),
));

$elements->add_field(array(
	'id' => 'e-video-type',
	'name' => __( 'Choose video type', 'masterpopups' ),
	'type' => 'radio',
	'default' => $element_defaults['e-video-type'],
	'items' => array(
		'youtube' => 'Youtube',
	),
));
$elements->add_field(array(
	'id' => 'e-content-video',
	'name' => __( 'Video URL', 'masterpopups' ),
	'type' => 'oembed',
	'default' => $element_defaults['e-content-video'],
	'desc' => __( 'Example:', 'masterpopups' ) . ' https://www.youtube.com/watch?v=34Na4j8AVgA',
	'options' => array(
		'preview_onload' => false,
		'show_if' => array('e-video-type', 'in', array('youtube', 'vimeo') ),
		'preview_size' => array( 'width' => '100%', 'height' => '200px' ),
	),
));
$elements->open_mixed_field(array('name' => 'Poster image', 'id' =>'e-mixed-video-poster'));
	$elements->add_field(array(
		'id' => 'e-video-load-thumbnail',
		'name' => __( 'Video thumbnail', 'masterpopups' ),
		'type' => 'button',
		'content' => __( 'Load', 'masterpopups' ),
		'options' => array(
			'size' => 'small',
			'color' => 'teal'
		)
	));
	$elements->add_field(array(
		'id' => 'e-video-poster',
		'name' => __( 'From custom url', 'masterpopups' ),
		'type' => 'file',
		'default' => $element_defaults['e-video-poster'],
		'options' => array(
			'mime_types' => array( 'jpg', 'jpeg', 'png', 'gif', 'ico' ),
			'preview_size' => array( 'width' => '30px','height' => '30px' ),
		),
		'row_class' => 'mpp-image-file',
		'grid' => '6-of-8 last'
	));

$elements->close_mixed_field();

$elements->add_field(array(
	'id' => 'e-play-icon',
	'name' => __( 'Play icon', 'masterpopups' ),
	'type' => 'icon_selector',
	'default' => $element_defaults['e-play-icon'],
	'items' => Assets::play_icons(),//Load by ajax
	'options' => array(
		'load_with_ajax' => false,
		'wrap_height' => 'auto',
		'size' => '40px',
		'hide_search' => true,
		'hide_buttons' => true,
	)
));

$elements->open_mixed_field(array('name' => 'Video options', 'id' =>'e-mixed-video-options'));
	$elements->add_field(array(
		'id' => 'e-video-youtube-parameters',
		'name' => __( 'Parameters', 'masterpopups' ),
		'type' => 'text',
		'default' => $element_defaults['e-video-youtube-parameters'],
		'grid' => '6-of-8',
		'options' => array(
			'show_if' => array('e-video-type', '=', 'youtube')
		)
	));
$elements->close_mixed_field();

$elements->add_field(array(
	'id' => 'e-button-styles',
	'name' => __( 'Button styles', 'masterpopups' ),
	'type' => 'html',
	'options' => array(
		'show_name' => false,
	),
	'content' => $class->get_html_button_styles()
));

//Form
$elements->add_field(array(
	'id' => 'e-field-placeholder',
	'name' => 'Field placeholder',
	'type' => 'text',
	'default' => $element_defaults['e-field-placeholder'],
));
$elements->add_field(array(
	'id' => 'e-field-name',
	'name' => __( 'Field name', 'masterpopups' ),
	'type' => 'text',
	'default' => $element_defaults['e-field-name'],
	'desc' => __( 'Attribute "name" of the field.', 'masterpopups' ). '
<ul style="padding: 8px 0px; margin-left: 15px; list-style: disc;">
<li>For "Email" enter: <strong>field_email</strong></li>
<li>For "Name" enter: <strong>field_first_name</strong></li>
<li>For "Last Name" enter: <strong>field_last_name</strong></li>
<li>For "Phone", "Input text" or another element you can enter your own name.</li>
</ul>
'.sprintf(__( 'If you wish you can also enter the name of the custom field of your service. Go to %s and Explore your custom fields.', 'masterpopups' ), '<a href="'.$class->plugin->settings_url.'" target="_blank">'.__( 'Service Integration', 'masterpopups' ).'</a>' ),
));
$elements->add_field(array(
	'id' => 'e-field-value',
	'name' => __( 'Default value', 'masterpopups' ),
	'type' => 'text',
	'default' => $element_defaults['e-field-name'],
));
$elements->add_field(array(
	'id' => 'e-field-required',
	'name' => __( 'Required field', 'masterpopups' ),
	'type' => 'switcher',
	'desc' => __( 'Enable to make this field mandatory when submitting the form.', 'masterpopups' ),
	'default' => $element_defaults['e-field-required'],
));

$elements->open_mixed_field(array('name' => __('Checked', 'aaa'), 'id' => 'e-mixed-checked-options'));
	$elements->add_field(array(
		'id' => 'e-field-checked',
		'name' => __( 'Checked by default', 'masterpopups' ),
		'type' => 'switcher',
		'default' => $element_defaults['e-field-checked'],
	));
	$elements->add_field(array(
		'id' => 'e-field-checked-color',
		'name' => __( 'Color', 'masterpopups' ),
		'type' => 'colorpicker',
		'default' => $element_defaults['e-field-checked-color'],
		'desc' => __( 'The color when it is activated.', 'masterpopups' ),
		'options' => array(
			'format' => 'rgba',
			'opacity' => 1,
		),
	));
$elements->close_mixed_field();
$elements->add_field(array(
	'id' => 'e-field-options',
	'name' => __( 'Options', 'masterpopups' ),
	'type' => 'textarea',
	'default' => $element_defaults['e-field-options'],
	'desc' => __( 'Please enter the list of options, one option for each line. It is also possible to add: value|Display', 'masterpopups' ),
	'attributes' => array(
		'rows' => '4',
	),
));
$elements->add_field(array(
    'id' => 'e-input-type',
    'name' => __( 'Input type', 'masterpopups' ),
    'type' => 'select',
    'default' => $element_defaults['e-input-type'],
    'items' => array(
        'text' => 'text',
        'date' => 'date',
        'time' => 'time',
        'number' => 'number'
    ),
));
