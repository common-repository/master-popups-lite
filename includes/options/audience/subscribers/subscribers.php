<?php

$xbox->add_field(array(
	'id' => 'subscribers-table',
	'name' => __( 'Subscribers list', 'masterpopups' ),
	'type' => 'html',
	'options' => array(
		'show_name' => false
	),
	'grid' => '8-of-8',
	'content' => $this->get_subscribers_list(),
));

$xbox->add_field(array(
	'id' => 'subscribers-info-table',
	'type' => 'title',
	'desc' => __( 'Only subscribers stored in MasterPopups will be displayed in the table.', 'masterpopups' ),
	'options' => array(
		'show_name' => false
	),
));
