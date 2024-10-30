<?php
use MasterPopups\Includes\Element;

function mpp_add_fields_popup_editor( $xbox, $class ){
    $element_defaults = Element::default_options();
    include MPP_DIR . 'includes/options/popup-editor/popup-editor.php';
}

function mpp_add_fields_tab_elements( $xbox, $class, $device ){
    $element_defaults = Element::default_options();
    $elements = $xbox->add_group(array(
        'id' => $device.'-elements',
        'name' => __( 'Elements', 'masterpopups' ),
        'options' => array(
            'add_item_class' => 'default-add-new-element'
        ),
        'controls' => array(
            'name' => 'Close icon',
            'default_type' => 'close-icon',
            'readonly_name' => false,
            'position' => 'left',
            'width' => '254px',
            'height' => '',
            'left_actions' => array(
                'xbox-info-order-item' => '#',
                'xbox-sort-group-item' => '<i class="xbox-icon xbox-icon-sort"></i>',
            ),
            'right_actions' => array(
                'xbox-duplicate-group-item' => '<i class="dashicons dashicons-admin-page"></i>',
                'xbox-visibility-group-item' => '<i class="xbox-icon xbox-icon-eye"></i>',
                'xbox-remove-group-item' => '<i class="xbox-icon xbox-icon-trash"></i>',
            ),
        ),
        'insert_after_name' => $class->get_html_type_elements('all')
    ));
    $items_elements_tab = array(
        $device.'-elements-content' => __( 'Content', 'masterpopups' ),
        $device.'-elements-size-position' => __( 'Size & Position', 'masterpopups' ),
        $device.'-elements-font' => __( 'Font', 'masterpopups' ),
        $device.'-elements-background' => __( 'Background', 'masterpopups' ),
        $device.'-elements-border' => __( 'Border', 'masterpopups' ),
        $device.'-elements-animation' => __( 'Animation', 'masterpopups' ),
        $device.'-elements-advanced' => __( 'Advanced', 'masterpopups' ),
        $device.'-elements-actions' => __( 'Actions', 'masterpopups' ),
        $device.'-elements-attributes' => __( 'Attributes', 'masterpopups' ),
    );
    $items_elements_tab = apply_filters('mpp_elements_tab_items', $items_elements_tab, $device.'-tab-elements', $device );
    $elements->add_tab(array(
        'id' => $device.'-tab-elements',
        'items' => $items_elements_tab,
    ));
    $elements->open_tab_item($device.'-elements-content');
    include MPP_DIR . 'includes/options/popup-editor/elements/content.php';
    $elements->close_tab_item($device.'-elements-content');

    $elements->open_tab_item($device.'-elements-size-position');
    include MPP_DIR . 'includes/options/popup-editor/elements/size-position.php';
    $elements->close_tab_item($device.'-elements-size-position');

    $elements->open_tab_item($device.'-elements-font');
    include MPP_DIR . 'includes/options/popup-editor/elements/font.php';
    $elements->close_tab_item($device.'-elements-font');

    $elements->open_tab_item($device.'-elements-background');
    include MPP_DIR . 'includes/options/popup-editor/elements/background.php';
    $elements->close_tab_item($device.'-elements-background');

    $elements->open_tab_item($device.'-elements-border');
    include MPP_DIR . 'includes/options/popup-editor/elements/border.php';
    $elements->close_tab_item($device.'-elements-border');

    $elements->open_tab_item($device.'-elements-animation');
    include MPP_DIR . 'includes/options/popup-editor/elements/animation.php';
    $elements->close_tab_item($device.'-elements-animation');

    $elements->open_tab_item($device.'-elements-advanced');
    include MPP_DIR . 'includes/options/popup-editor/elements/advanced.php';
    $elements->close_tab_item($device.'-elements-advanced');

    $elements->open_tab_item($device.'-elements-actions');
    include MPP_DIR . 'includes/options/popup-editor/elements/actions.php';
    $elements->close_tab_item($device.'-elements-actions');

    $elements->open_tab_item($device.'-elements-attributes');
    include MPP_DIR . 'includes/options/popup-editor/elements/attributes.php';
    $elements->close_tab_item($device.'-elements-attributes');

    $elements = apply_filters( 'mpp_elements_tab_fields', $elements, $device );

    $elements->close_tab($device.'-tab-elements');
}