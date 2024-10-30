<?php
$xbox->add_field(array(
    'type' => 'title',
    'name' => 'Earn money by promoting our plugin.',
    'desc' => 'You just have to enable the following option and add your Envato username. <a href="https://codecanyon.net/affiliate_program" target="_blank"><strong>More info</strong></a>.',
));

$xbox->add_field( array(
    'id' => 'link-powered-by-enabled',
    'name' => __( 'Link Powered by', 'mpp-cookieplus' ),
    'type' => 'switcher',
    'default' => 'off',
));
$xbox->add_field( array(
    'id' => 'link-powered-by-username',
    'name' => __( 'Envato username', 'mpp-cookieplus' ),
    'type' => 'text',
    'default' => '',
    'grid' => '3-of-8',
) );