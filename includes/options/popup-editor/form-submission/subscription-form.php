<?php

use MasterPopups\Includes\Functions as Functions;

$xbox->add_field(array(
	'id' => 'audience-list',
	'name' => 'Audience List',
	'type' => 'select',
	'items' => $class->get_items_audience_lists(),
	'desc' => sprintf( __( 'Choose the list where subscribed users will be stored. You can create a new list from %shere%s.', 'masterpopups' ), '<a href="'.Functions::post_type_url( $class->plugin->post_types['lists'], 'new' ).'" target="_blank">', '</a>' )
));

$xbox->add_field(array(
	'id' => 'subscription-ok-message',
	'name' => __( 'Message after success', 'masterpopups' ),
	'type' => 'textarea',
	'default' => __( 'Thank you for subscribing!', 'masterpopups' ),
	'attributes' => array(
		'rows' => '2'
	),
));

$xbox->open_mixed_field(array(
    'name' => __( 'Message after failed', 'masterpopups' ),
));
$xbox->add_field(array(
	'id' => 'subscription-error-message',
	'type' => 'textarea',
	'default' => __( "Sorry, it's not possible to subscribe, you may have already subscribed to our list or there are problems connecting to the service.", 'masterpopups' ),
	'attributes' => array(
		'rows' => '2'
	),
    'options' => array(
        'show_name' => false
    )
));
$xbox->close_mixed_field(array());


$admin_notification = $xbox->add_section( array(
	'name' => __( 'Email Notification to Admin', 'masterpopups' ),
	'options' => array(
		'toggle' => true,
	),
));
$admin_notification->add_field(array(
	'id' => 'subscription-admin-notif',
	'name' => __( 'Send Notification', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'off',
	'desc' => __( 'Enable to send an email notification to the website administrator.', 'masterpopups' ),
));
$admin_notification->add_field(array(
    'id' => 'subscription-admin-notif-from',
    'name' => __( 'From', 'masterpopups' ),
    'type' => 'text',
    'default' => 'Wordpress <'.get_option('admin_email').'>',
    'sanitize_callback' => false,
    'desc' => 'E.g: Name &lt;email@gmail.com&gt; or email@gmail.com. '.__( 'Tip: You can use mail tags.', 'masterpopups' ) .' E.g: {render=field_first_name}, {render=field_email}',
));
$admin_notification->add_field(array(
	'id' => 'subscription-admin-notif-to',
	'name' => __( 'To', 'masterpopups' ),
	'type' => 'text',
	'default' => get_option('admin_email'),
	'desc' => __( 'Enter the email address that will receive the notification message. e.g: admin@gmail.com, editor@gmail.com', 'masterpopups' ),
));
$admin_notification->add_field(array(
	'id' => 'subscription-admin-notif-subject',
	'name' => __( 'Subject', 'masterpopups' ),
	'type' => 'text',
	'default' => __( 'New user subscription', 'masterpopups' ),
	'desc' => __( 'This value is subject field of the message.', 'masterpopups' ),
));
$admin_notification->add_field(array(
	'id' => 'subscription-admin-notif-message',
	'name' => __( 'Message body', 'masterpopups' ),
	'type' => 'textarea',
	'desc' => sprintf( __( 'This message will be sent to an administrator after a new subscription. %s', 'masterpopups' ) . __( 'Tip: {render=%s} e.g: %s', 'masterpopups' ) , '<br/>', __('This value is exactly the "field name" you want to render', 'masterpopups'), '{render=field_email}, {render=popup_title}, {render=ip}, {render=origin_url}' ),
	'attributes' => array(
		'rows' => '10'
	),
	'default' => '
New User Subscription

<strong>User data:</strong>
<strong>Email: </strong>{render=field_email}
<strong>First Name: </strong>{render=field_first_name}
<strong>Last Name: </strong>{render=field_last_name}

<strong>Additional Information:</strong>
<strong>Popup: </strong>{render=popup_title}
<strong>List: </strong>{render=list_title}
<strong>URL: </strong>{render=origin_url}
<strong>IP: </strong>{render=ip}

Powered by <strong>'.$class->plugin->arg( 'short_name' ). '</strong> WP Plugin',
));

/*
|---------------------------------------------------------------------------------------------------
| User Notification
|---------------------------------------------------------------------------------------------------
*/
$subscriber_notification = $xbox->add_section( array(
	'name' => __( 'Email Notification to New Subscriber', 'masterpopups' ),
	'desc' => __( 'Use this option to send welcome messages, discount coupons, download links, etc.', 'masterpopups' ),
	'options' => array(
		'toggle' => true,
	),
));
$subscriber_notification->add_field(array(
	'id' => 'subscription-user-notif',
	'name' => __( 'Send Notification', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'off',
	'desc' => __( 'Enable to send an email notification to the new subscriber.', 'masterpopups' ),
));
$subscriber_notification->add_field(array(
	'id' => 'subscription-user-notif-from',
	'name' => __( 'From', 'masterpopups' ),
	'type' => 'text',
    'default' => 'Wordpress <'.Functions::from_email( 'noreply' ).'>',
    'sanitize_callback' => false,
    'desc' => 'E.g: WordPress &lt;email@gmail.com&gt; or email@gmail.com. ',
));
$subscriber_notification->add_field(array(
	'id' => 'subscription-user-notif-subject',
	'name' => __( 'Subject', 'masterpopups' ),
	'type' => 'text',
	'default' => __( 'Thank you for subscribing. This is your discount coupon', 'masterpopups' ),
	'desc' => __( 'This value is subject field of the message.', 'masterpopups' ),
));
$subscriber_notification->add_field(array(
	'id' => 'subscription-user-notif-message',
	'name' => __( 'Message body', 'masterpopups' ),
	'type' => 'textarea',
	'desc' => sprintf( __( 'This message will be sent to the new subscriber. %s', 'masterpopups' ) . __( 'Tip: {render=%s} e.g: %s', 'masterpopups' ) , '<br/>', __('This value is exactly the "field name" you want to render', 'masterpopups'), '{render=field_email}, {render=popup_title}, {render=ip}, {render=origin_url}' ),
	'attributes' => array(
		'rows' => '5'
	),
	'default' => '
Hi {render=field_first_name}

Thank you for subscribing.

Powered by <strong>'.$class->plugin->arg( 'short_name' ). '</strong> WP Plugin',
));


