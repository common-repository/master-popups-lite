<?php namespace MasterPopups\Includes;

$id_main_tab = 'main-tab';
$items_main_tab = array(
    'general' => '<i class="xbox-icon xbox-icon-cog"></i>General',
    'publish' => '<i class="xbox-icon xbox-icon-calendar"></i>Publish',
    'triggers' => '<i class="xbox-icon xbox-icon-flash"></i>Triggers - '.__( 'When to display', 'masterpopups' ),
    'target' => '<i class="xbox-icon xbox-icon-home"></i>Target - '.__( 'Where to display', 'masterpopups' ),
    'form-submission' => '<i class="xbox-icon xbox-icon-send"></i>Form Submission',
    'notification-bar' => '<i class="xbox-icon xbox-icon-credit-card"></i>Notification Bar',
    'inline' => '<i class="xbox-icon xbox-icon-anchor"></i>Inline Popup',
    'advanced' => '<i class="xbox-icon xbox-icon-code"></i>'.__( 'Advanced', 'masterpopups' ),
    'templates' => '<i class="xbox-icon xbox-icon-paint-brush"></i>'.__( 'Popup templates', 'masterpopups' ),
    'export' => '<i class="xbox-icon xbox-icon-database"></i>'.__( 'Export your popup', 'masterpopups' ),
    'cookieplus' => '<img src="' . MPP_URL . 'assets/admin/images/icon-cookieplus-32.png">GDPR Cookie Plus',
);
$items_main_tab = apply_filters('mpp_popup_editor_tab_items', $items_main_tab, $id_main_tab );

$xbox->add_main_tab(array(
	'name' => 'Main tab',
	'id' => $id_main_tab,
	'items' => $items_main_tab,
));

$xbox->open_tab_item('general');
include MPP_DIR . 'includes/options/popup-editor/general/general.php';
$xbox->close_tab_item('general');

$xbox->open_tab_item('publish');
include MPP_DIR . 'includes/options/popup-editor/publish/publish.php';
$xbox->close_tab_item('publish');

$xbox->open_tab_item('triggers');
include MPP_DIR . 'includes/options/popup-editor/triggers/triggers.php';
$xbox->close_tab_item('triggers');

$xbox->open_tab_item('target');
include MPP_DIR . 'includes/options/popup-editor/target/target.php';
$xbox->close_tab_item('target');

$xbox->open_tab_item('form-submission');
include MPP_DIR . 'includes/options/popup-editor/form-submission/form-submission.php';
$xbox->close_tab_item('form-submission');

$xbox->open_tab_item('notification-bar');
include MPP_DIR . 'includes/options/popup-editor/notification-bar/notification-bar.php';
$xbox->close_tab_item('notification-bar');

$xbox->open_tab_item('inline');
include MPP_DIR . 'includes/options/popup-editor/inline/inline.php';
$xbox->close_tab_item('inline');

$xbox->open_tab_item('advanced');
include MPP_DIR . 'includes/options/popup-editor/advanced/advanced.php';
$xbox->close_tab_item('advanced');

$xbox->open_tab_item('templates');
include MPP_DIR . 'includes/options/popup-editor/templates/templates.php';
$xbox->close_tab_item('templates');

$xbox->open_tab_item('export');
include MPP_DIR . 'includes/options/popup-editor/export/export.php';
$xbox->close_tab_item('export');

$xbox->open_tab_item('cookieplus');
include MPP_DIR . 'includes/options/popup-editor/cookieplus/cookieplus.php';
$xbox->close_tab_item('cookieplus');

$xbox = apply_filters( 'mpp_popup_editor_tab_fields', $xbox );

$xbox->close_tab('main-tab');

$xbox->add_html(array(
    'content' => '<div id="ampp-wrap-powerful-editor">',
));
    $xbox->add_html(array(
        'content' => '<div id="row-mc-options">
<div id="mc-icon-devices">
    <span class="mc-name-op">Device: </span>
    <i class="xbox-icon xbox-icon-desktop ampp-active"></i><i class="xbox-icon xbox-icon-mobile"></i>
</div>
<div id="mc-width-devices"><span class="mc-name-op">'.__( 'Device width', 'masterpopups' ).':</span>'
    ));
    $xbox->add_field(array(
        'id' => 'browser-width',
        'type' => 'number',
        'default' => 1000,
        'row_class' => 'desktop-browser-width',
        'options' => array(
            'show_spinner' => true,
            'show_name' => false,
        ),
        'attributes' => array(
            'min' => 769,
            'max' => 1920,
        ),
    ));
    $xbox->add_field(array(
        'id' => 'mobile-browser-width',
        'type' => 'number',
        'default' => 600,
        'row_class' => 'mobile-browser-width',
        'options' => array(
            'show_spinner' => true,
            'show_name' => false,
        ),
        'attributes' => array(
            'min' => 320,
            'max' => 768,
        ),
    ));
    $xbox->add_html(array(
        'content' => '</div><!--#mc-width-devices--></div><!--#row-mc-options-->',
    ));

    //Popup editor
    $xbox->add_html(array(
        'content' => '<div id="row-mc">'.$class->build_popup_editor().'</div><!--#row-mc-->',
    ));
$xbox->add_html(array(
    'content' => '</div><!--#ampp-wrap-powerful-editor-->',
));

include MPP_DIR . 'includes/options/popup-editor/elements/main.php';

$xbox->add_field(array(
    'id' => 'status',
    'name' => __( 'Popup status', 'masterpopups' ),
    'desc' => __( 'If it is off, the popup will stop showing on your website.', 'masterpopups' ),
    'type' => 'switcher',
    'default' => 'on',
    'options' => array(
        'show_name' => false,
        'desc_tooltip' => true,
    ),
    'insert_before_field' => sprintf( '%s %s %s', '<span class="ampp-label-popup-status"><strong>', __( 'Status', 'masterpopups' ), '</strong></span>' ),
));