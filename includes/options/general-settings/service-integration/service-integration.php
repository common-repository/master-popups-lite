<?php

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Available Services', 'masterpopups' ),
	'desc' => __( 'From here you can integrate to MasterPopups your favorite email marketing software.', 'masterpopups'),
));
$xbox->add_field(array(
	'id' => 'services-list',
	'type' => 'html',
	'options' => array(
		'show_name' => false,
	),
	'content' => array( $this, 'get_html_services_list' ),
));

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Integrated services', 'masterpopups' ),
	'desc' => __( 'Once the service is integrated, you have to connect with your account to start creating campaigns.', 'masterpopups'),
));
$services = $xbox->add_group(array(
	'id' => 'integrated-services',
	'name' => __( 'Services', 'masterpopups' ),
	'options' => array(
		'sortable' => false,
		'add_item_class' => 'default-add-new-service'
	),
	'controls' => array(
		'left_actions' => array(
			'xbox-info-order-item' => '#',
			'xbox-sort-group-item' => '',
		),
		'right_actions' => array(
			'xbox-duplicate-group-item' => '',
			'xbox-visibility-group-item' => '',
			//'xbox-remove-group-item' => '',
		),
	),
	'insert_after_name' => $this->get_html_integration_buttons()
));

$services->add_field(array(
	'type' => 'title',
	'name' => __( 'Connect service', 'masterpopups' ),
	'desc' => __( 'Use the following options to connect to the service. all access data is required.', 'masterpopups'),
));
$services->add_field(array(
	'id' => 'service-status',
	'type' => 'hidden',
	'default' => 'off',
));

$services->add_field(array(
	'id' => 'service-status-info',
	'name' => __( 'Status', 'masterpopups' ),
	'type' => 'html',
	'content' => '<span class="ampp-service-status xbox-color-red">'.__( 'Disconnected', 'masterpopups').'</span><a class="xbox-btn xbox-btn-tiny ampp-logout-account"><i class="xbox-icon xbox-icon-sign-out"></i>'.__( 'Logout', 'masterpopups').'</a>',
));

$services->open_mixed_field(array(
	'name' => __( 'Access data', 'masterpopups' ),
));
	$services->add_field(array(
		'id' => 'service-api-key',
		'name' => 'API Key',
		'type' => 'text',
		'desc' => sprintf( __( 'Where do I find this? %sGo here%s', 'masterpopups' ), '<span><a href="#" target="_blank">', "</a></span>" ),
		'grid' => '3-of-8',
		'options' => array(
			'icon' => '<i class="xbox-icon xbox-icon-key"></i>',
		),
	));
	$services->add_field(array(
		'id' => 'service-token',
		'name' => 'Access token',
		'type' => 'text',
		'desc' => sprintf( __( 'Where do I find this? %sGo here%s', 'masterpopups' ), '<span><a href="#" target="_blank">', "</a></span>" ),
		'grid' => '3-of-8',
		'options' => array(
			'icon' => '<i class="xbox-icon xbox-icon-lock"></i>'
		),
	));
	$services->add_field(array(
		'id' => 'service-email',
		'name' => __( 'Email account or username', 'masterpopups' ),
		'type' => 'text',
		'desc' => '',
		'grid' => '3-of-8',
		'options' => array(
			'icon' => '<i class="xbox-icon xbox-icon-envelope"></i>'
		),
	));
	$services->add_field(array(
		'id' => 'service-password',
		'name' => __( 'Password', 'masterpopups' ),
		'type' => 'text',
		'desc' => '',
		'grid' => '3-of-8',
		'options' => array(
			'icon' => '<i class="xbox-icon xbox-icon-lock"></i>'
		),
		'attributes' => array(
			'type' => 'password',
		)
	));
	$services->add_field(array(
		'id' => 'service-url',
		'name' => 'URL',
		'type' => 'text',
		'desc' => sprintf( __( 'Where do I find this? %sGo here%s', 'masterpopups' ), '<span><a href="#" target="_blank">', "</a></span>" ),
		'grid' => '3-of-8',
		'options' => array(
			'icon' => '<i class="xbox-icon xbox-icon-link"></i>'
		),
	));
	$services->add_field(array(
		'id' => 'service-authenticate-action',
		'type' => 'html',
		'options' => array(
			'show_name' => false,
		),
		'content' => '<div class="xbox-btn xbox-btn-teal xbox-btn-small ampp-check-account">' . __( 'Connect service', 'masterpopups' ) . '</div>',
	));
$services->close_mixed_field();

$services->add_field(array(
	'type' => 'title',
	'name' => __( 'Explore custom fields', 'masterpopups' ),
	'desc' => __( 'The next option will allow you to obtain all the custom fields that this service has.', 'masterpopups'),
));

$services->open_mixed_field(array(
	'name' => __( 'Custom fields', 'masterpopups' ),
));
	$services->add_field(array(
		'name' => __( 'Custom fields', 'masterpopups' ),
		'id' => 'services-custom-fields',
		'type' => 'textarea',
		'default' => '',
		'attributes' => array(
			'rows' => '6'
		),
	));
	$services->add_field(array(
		'name' => __( 'List ID', 'masterpopups' ),
		'id' => 'services-list-id',
		'type' => 'text',
		'desc' => sprintf(__( 'Some services like %s require a list id to get the custom fields. Leave empty if you are not sure.', 'masterpopups' ), 'Mailchimp, Benchmark, Aweber, Campaign Monitor'),
	));
	$services->add_field(array(
		'id' => 'service-get-custom-fields',
		'type' => 'html',
		'options' => array(
			'show_name' => false,
		),
		'content' => '<div class="xbox-btn xbox-btn-teal xbox-btn-small ampp-get-custom-fields">' . __( 'Get custom fields', 'masterpopups' ) . '</div>',
	));
$services->close_mixed_field();
