<?php
use MasterPopups\Includes\Functions as Functions;

$xbox->add_field(array(
	'id' => 'contact-form-ok-message',
	'name' => __( 'Message after success', 'masterpopups' ),
	'type' => 'textarea',
	'default' => __( 'Thank you. We will contact you as soon as possible.', 'masterpopups' ),
	'attributes' => array(
		'rows' => '2'
	),
));

$xbox->add_field(array(
	'id' => 'contact-form-error-message',
	'name' => __( 'Message after failed', 'masterpopups' ),
	'type' => 'textarea',
	'default' => __( "There was an error trying to send your message. Please try again later.", 'masterpopups' ),
	'attributes' => array(
		'rows' => '2'
	),
));

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Mail', 'masterpopups' ),
));
$xbox->add_field(array(
    'id' => 'contact-form-admin-notif',
    'name' => __( 'Send Notification', 'masterpopups' ),
    'type' => 'switcher',
    'default' => 'on',
    'desc' => __( 'Enable to send an email notification to the website administrator.', 'masterpopups' ),
));
$xbox->add_field(array(
    'id' => 'contact-form-mail-from',
    'name' => __( 'From', 'masterpopups' ),
    'type' => 'text',
    'default' => 'Wordpress <'.get_option('admin_email').'>',
    'sanitize_callback' => false,
    'desc' => 'E.g: Name &lt;email@gmail.com&gt; or email@gmail.com. '.__( 'Tip: You can use mail tags.', 'masterpopups' ) .' E.g: {render=field_first_name}, {render=field_email}',
));
$xbox->add_field(array(
	'id' => 'contact-form-mail-to',
	'name' => __( 'To', 'masterpopups' ),
	'type' => 'text',
	'default' => get_option('admin_email'),
	'desc' => __( 'Enter the email address that will receive the message. e.g: admin@gmail.com, editor@gmail.com', 'masterpopups' ),
));
$xbox->add_field(array(
	'id' => 'contact-form-mail-subject',
	'name' => __( 'Subject', 'masterpopups' ),
	'type' => 'text',
	'default' => __( 'New contact form submission', 'masterpopups' ),
	'desc' => __( 'This value is subject field of the message.', 'masterpopups' ),
));
$xbox->add_field(array(
	'id' => 'contact-form-mail-message',
	'name' => __( 'Message body', 'masterpopups' ),
	'type' => 'textarea',
	'desc' => sprintf( __( 'Tip: {render=%s} e.g: %s', 'masterpopups' ), __('This value is exactly the "field name" you want to render', 'masterpopups'), '{render=field_email}, {render=popup_title}, {render=ip}, {render=origin_url}' ),
	'attributes' => array(
		'rows' => '10'
	),
	'default' => '
New contact form submission

<strong>From: </strong>{render=field_first_name} {render=field_last_name}
<strong>Email: </strong>{render=field_email}

<strong>Subject: </strong>{render=field_subject}

<strong>Message: </strong>
{render=field_message}

<strong>Additional Information:</strong>
<strong>Popup: </strong>{render=popup_title}
<strong>URL: </strong>{render=origin_url}
<strong>IP: </strong>{render=ip}

Powered by '.$class->plugin->arg('name'),
));