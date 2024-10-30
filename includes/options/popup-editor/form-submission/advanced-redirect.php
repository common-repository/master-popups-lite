<?php
$xbox->add_field(array(
    'type' => 'title',
    'name' => __( 'Advanced redirections', 'masterpopups' )
));

$redirects = $xbox->add_group(array(
    'id' => 'form-redirections',
    'name' => __( 'Redirections', 'masterpopups' ),
    'options' => array(
        'sortable' => false,
    ),
    'controls' => array(
        'name' => 'New redirect',
        'readonly_name' => false,
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
));
$redirects->open_mixed_field(array(
    'options' => array(
        'show_name' => false
    ),
));
$redirects->add_field(array(
    'id' => 'field-name',
    'name' => __( 'Field name', 'masterpopups' ),
    'type' => 'text',
    'grid' => '2-of-8',
));
$redirects->add_field(array(
    'id' => 'condition',
    'name' => __( 'Condition', 'masterpopups' ),
    'type' => 'select',
    'default' => 'equal',
    'items' => array(
        'equal' => '=',
        'not_equal' => '!=',
        'less' => '<',
        'less_equal' => '<=',
        'higher' => '>',
        'higher_equal' => '>=',
    ),
    'grid' => '2-of-8',
));
$redirects->add_field(array(
    'id' => 'field-value',
    'name' => __( 'Field value', 'masterpopups' ),
    'type' => 'text',
    'grid' => '2-of-8',
));
$redirects->add_field(array(
    'id' => 'redirect-to',
    'name' => __( 'Redirect to URL', 'masterpopups' ),
    'type' => 'text',
    'grid' => '2-of-8',
));
$redirects->close_mixed_field();