<?php

$xbox->add_field(array(
	'id' => 'display-on-all-site',
	'name' => __( 'Display on All Site', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on',
));
$xbox->add_field(array(
	'id' => 'display-on-homepage',
	'name' => __( 'Display on Homepage', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on'
));
$xbox->add_field(array(
	'id' => 'display-on-archive',
	'name' => __( 'Display on Archives', 'masterpopups' ),
	'type' => 'switcher',
	'default' => 'on'
));


// $wp_post_types = get_post_types( array('public' => true, '_builtin' => true ), 'objects' );
// unset( $wp_post_types['attachment'] );
// $wp_post_types = array_reverse( $wp_post_types );

$wp_post_types = array(
	'page' => 'Pages',
	'post' => 'Posts',
);

foreach( $wp_post_types as $post_type_name => $post_type_label ) {
	$xbox->open_mixed_field(array('name' => sprintf(__( 'Display on %s', 'masterpopups' ) , $post_type_label)));
		$xbox->add_field(array(
			'id' => 'display-on-'.$post_type_name,
            'name' => 'Enable to show in all',
            'type' => 'switcher',
            'default' => 'on',
			'options' => array(
				//'show_name' => false
			),
		));
		$xbox->add_field(array(
			'id' => 'display-on-'.$post_type_name.'-include',
			'name' => __( 'Include IDs', 'masterpopups' ),
			'type' => 'text',
			'desc' => __( 'Enter the IDs where you want to display the popup. e.g: 7, 18', 'masterpopups' ),
			'grid' => '3-of-8',
			'options' => array(
				'desc_tooltip' => true
			),
			'attributes' => array(
				'placeholder' => '7, 18'
			)
		));
		$xbox->add_field(array(
			'id' => 'display-on-'.$post_type_name.'-exclude',
			'name' => __( 'Exclude IDs', 'masterpopups' ),
			'type' => 'text',
			'desc' => __( "Enter the IDs where you do not want to display the popup. e.g: 5, 9, 23", 'masterpopups' ),
			'grid' => '3-of-8',
			'options' => array(
				'desc_tooltip' => true
			),
			'attributes' => array(
				'placeholder' => '5, 9, 23'
			)
		));
	$xbox->close_mixed_field();


// $wp_taxonomies = get_taxonomies(array(
// 	'public' => true,
// 	'_builtin' => true,
// 	'object_type' => array( $post_type->name )
// 	),'objects' );
// unset( $wp_taxonomies['post_format'] );

	$wp_taxonomies = array();
	if( $post_type_name == 'post' ){
		$wp_taxonomies = array(
			'category' => 'Categories',
			'post_tag' => 'Tags',
		);
	}

	//Taxonomies
	foreach( $wp_taxonomies as $taxonomy_name => $taxonomy_label ){
		$xbox->open_mixed_field(array('name' => sprintf(__( 'Display on %s', 'masterpopups' ) , $taxonomy_label)));
		$xbox->add_field(array(
			'id' => 'display-on-taxonomy-'.$taxonomy_name,
            'name' => 'Enable to show in all',
			'type' => 'switcher',
			'default' => 'on',
			'options' => array(
				//'show_name' => false
			),
		));

		if( $taxonomy_name == 'category' ){//Para excluir tags porque pueden ser muchos y relentiza la carga
			$xbox->add_field(array(
				'id' => 'display-on-taxonomy-'.$taxonomy_name.'-terms',
				'name' => $taxonomy_label,
				'type' => 'checkbox',
				'items' => XboxItems::terms( $taxonomy_name ),
			));
		}

		$xbox->close_mixed_field();
	}
}


use MasterPopups\Includes\Settings;

$xbox->add_field(array(
    'type' => 'html',
    'content' => Settings::pro_version_field_message().'<img src="'.MPP_URL.'/assets/admin/images/pro/display-urls.png">',
    'options' => array(
        'show_name' => false
    )
));