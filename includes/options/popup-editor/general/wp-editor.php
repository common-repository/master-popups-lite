<?php
use MasterPopups\Includes\Assets as Assets;

$xbox->add_field(array(
	'id' => 'use-wp-editor',
	'name' => __( 'Use Custom Embed Content', 'masterpopups' ),
	'desc' => __( 'Enable this option to add the content inside the Wordpress Editor or in HTML Code field. (This will replace the Visual Editor).', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'off',
));

//$xbox->add_field(array(
//	'id' => 'wp-editor-start',
//	'type' => 'html',
//	'insert_before_row' => '<div id="ampp-wrap-wp-editor">',
//));
$xbox->add_html(array(
    'content' => '<div id="ampp-wrap-wp-editor">',
));
	$xbox->add_field(array(
		'type' => 'title',
		'name' => __( 'Custom Embed Content', 'masterpopups' ),
		'desc' => __( 'Insert the html code of your form in the "HTML Code" field. Use the WordPress Editor to add another type of content.', 'masterpopups'),
	));
	$xbox->add_field( array(
		'id' => 'html-code',
		'name' => __( 'HTML Code', 'masterpopups' ),
		'type' => 'code_editor',
		'options' => array(
			'language' => 'html',
			'theme' => 'tomorrow_night',
			'height' => '200px',
		),
		'insert_after_name' => '<div class="xbox-field-description">'.__( 'Add here the HTML code of your form provided by your CRM Software like Mailchimp', 'masterpopups' ) . '</div>',
	));
	$xbox->add_field( array(
		'id' => 'wp-editor',
		'name' => __( 'WordPress Editor', 'masterpopups' ),
		'type' => 'wp_editor',
		'options' => array(
			'editor_height' => 200,
			//'show_name' => false,
		),
	));
	$xbox->add_field(array(
		'id' => 'wp-editor-auto-height',
		'name' => __( 'Auto height', 'masterpopups' ),
		'desc' => __( 'The height of the popup will automatically adjust to the content', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'on',
		'options' => array(
			//'desc_tooltip' => true,
		)
	));
	$xbox->add_field(array(
		'id' => 'wp-editor-padding',
		'name' => __( 'Padding', 'masterpopups' ),
		'type' => 'text',
		'default' => '20px 36px',
		'grid' => '3-of-8'
	));
	$xbox->open_mixed_field(array('name' => 'Font color'));
		$xbox->add_field(array(
			'id' => 'wp-editor-enable-font-color',
			'type' => 'switcher',
			'default' => 'off',
			'options' => array(
				'desc_tooltip' => true,
				'show_name' => false,
			)
		));
		$xbox->add_field(array(
			'id' => 'wp-editor-font-color',
			'type' => 'colorpicker',
			'default' => 'rgba(68, 68, 68, 1)',
			'options' => array(
				'format' => 'rgba',
				'opacity' => 1,
				'show_name' => false,
				'show_if' => array('wp-editor-enable-font-color', '=', 'on'),
			),
		));
	$xbox->close_mixed_field();

	$xbox->open_mixed_field(array('name' => 'Font size'));
		$xbox->add_field(array(
			'id' => 'wp-editor-enable-font-size',
			'type' => 'switcher',
			'default' => 'off',
			'options' => array(
				'desc_tooltip' => true,
				'show_name' => false,
			)
		));
		$xbox->add_field(array(
			'id' => 'wp-editor-font-size',
			'type' => 'number',
			'default' => '15',
			'options' => array(
				'show_spinner' => true,
				'unit' => 'px',
				'show_name' => false,
				'show_if' => array('wp-editor-enable-font-size', '=', 'on'),
			),
			'attributes' => array(
				'min' => 0,
			),
		));
	$xbox->close_mixed_field();


	$close_icon = $xbox->add_section( array(
		'name' => __( 'Close button', 'masterpopups' ),
		'options' => array(
			'toggle' => true,
		),
	));
	$close_icon->add_field(array(
		'id' => 'close-icon-enable',
		'name' => __( 'Show close button?', 'masterpopups' ),
		'type' => 'switcher',
		'default' => 'on',
	));

	$close_icon->add_field(array(
		'id' => 'close-icon',
		'type' => 'icon_selector',
		'default' => 'mppfic-close-cancel-circular-2',
		'items' => Assets::close_icons(),
		'options' => array(
			'show_name' => false,
			//'load_with_ajax' => true,
			//'ajax_data' => array('class_name' => 'MasterPopups\Includes\Assets', 'function_name' => 'close_icons'),
			'size' => '40px',
			'wrap_height' => '150px',
		)
	));
	$close_icon->open_mixed_field(array(
		'options' => array(
			'show_name' => false,
		)
	));
		$close_icon->add_field(array(
			'id' => 'close-icon-size',
			'name' => __( 'Size', 'masterpopups' ),
			'type' => 'number',
			'default' => '21',
			'options' => array(
				'show_spinner' => true,
				'unit' => 'px',
			),
			'attributes' => array(
				'min' => 0,
			),
		));
		$close_icon->add_field(array(
			'id' => 'close-icon-color',
			'name' => __( 'Color', 'masterpopups' ),
			'type' => 'colorpicker',
			'default' => 'rgba(0,0,0,0.8)',
			'options' => array(
				'format' => 'rgba',
				'opacity' => 1,
			),
		));
		$close_icon->add_field(array(
			'id' => 'close-icon-color-hover',
			'name' => __( 'Color on hover', 'masterpopups' ),
			'type' => 'colorpicker',
			'default' => 'rgba(0,0,0,1)',
			'options' => array(
				'format' => 'rgba',
				'opacity' => 1,
			),
		));
	$close_icon->close_mixed_field();

//$xbox->add_field(array(
//	'id' => 'wp-editor-end',
//	'type' => 'html',
//	'insert_before_row' => '</div><!--#ampp-wrap-wp-editor-->',
//));
$xbox->add_html(array(
    'content' => '</div><!--#ampp-wrap-wp-editor-->',
));