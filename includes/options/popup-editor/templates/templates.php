<?php

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'How do you want to import your popup?', 'masterpopups' ),
));

$xbox->add_import_field(array(
	'name' => 'Templates',
	'default' => 'from-templates',
	'items' => array(
		'from-templates' => __( 'From popup template', 'masterpopups' ),
	),
	'options' => array(
		'show_name' => false,
		'import_from_file' => true,
		'import_from_url' => true,
		'width' => '280px'
	),
));

$xbox->add_field(array(
	'type' => 'title',
	'name' => __( 'Popup templates', 'masterpopups' ),
	'desc' => __( 'Choose a popup template, and then click on the import button.', 'masterpopups'),
));

$popup_templates = include MPP_DIR .'includes/data/popup-templates.php';
$user_popup_templates = (array) apply_filters( 'mpp_add_popup_templates', array(), $class->plugin->arg( 'version' ) );
$popup_templates = array_merge( $popup_templates, $user_popup_templates );
$data = array();
$all_types = array();
$all_categories = array();
$all_tags = array();

foreach( $popup_templates as $index => $template ){
	$type = isset( $template['type'] ) ? trim( $template['type'], ',' ) : '';
	$type = array_filter( array_map( 'trim', explode( ',', $type ) ) );

	$category = isset( $template['category'] ) ? trim( $template['category'], ',' ) : '';
	$category = array_filter( array_map( 'trim', explode( ',', $category ) ) );

	$tags = isset( $template['tags'] ) ? trim( $template['tags'], ',' ) : '';
	$tags = array_filter( array_map( 'trim', explode( ',', $tags ) ) );

	$data[$index]['type'] = array_unique( $type );
	$data[$index]['category'] = array_unique( $category );
	$data[$index]['tags'] = array_unique( $tags );

	$all_types = array_merge( $all_types, $type );
	$all_categories = array_merge( $all_categories, $category );
	$all_tags = array_merge( $all_tags, $tags );
}
$all_types = array_values( array_unique( $all_types ) );
$all_categories = array_values( array_unique( $all_categories ) );
$all_tags = array_values( array_unique( $all_tags ) );

//Menu popup templates
$control = "<div class='ampp-control-popup-templates'>";
	$control .= "<ul class='ampp-categories-popup-templates xbox-clearfix'>";
		$control .= "<li class='ampp-active' data-filter='all'>All</li>";
		$all_categories = array_merge( $all_categories, $all_types );
		foreach( $all_categories as $cat ){
			$control .= "<li data-filter='$cat'>".ucfirst( str_replace('-', ' ', $cat ) )."</li>";
		}
	$control .= "</ul><!--.ampp-categories-popup-templates-->";

	$control .= "<ul class='ampp-tags-popup-templates xbox-clearfix'>";
		$control .= "<li class='ampp-active' data-filter='all'>All</li>";
		foreach( $all_tags as $tag ){
			$control .= "<li data-filter='$tag'>".ucfirst( str_replace('-', ' ', $tag ) )."</li>";
		}
	$control .= "</ul><!--.ampp-tags-popup-templates-->";
$control .= "</div><!--.ampp-control-popup-templates-->";

//All popup templates
$content = '';
$content .= "<div class='ampp-wrap-popup-templates xbox-clearfix'>";
foreach( $popup_templates as $index => $template ){
	$category = implode( ',', array_merge( $data[$index]['category'], $data[$index]['type'] ) );
	$tags = implode( ',', $data[$index]['tags'] );

	if( isset( $template['template'] ) ){
		$content .= "<div class='ampp-item-popup-template ampp-scale-1' data-category='all,$category' data-tags='all,$tags' data-url='{$template['template']}'>";
			$image = isset( $template['image'] ) ? $template['image'] : MPP_URL . 'assets/admin/images/default-popup-template.jpg';
			$content .= "<img src='$image'>";
		$content .= "</div><!--.ampp-item-popup-template-->";
	}
}
$content .= "</div><!--.ampp-wrap-popup-templates-->";


$xbox->add_field(array(
	'id' => 'filter-popup-templates',
	'type' => 'html',
	'options' => array(
		'show_name' => false,
	),
	'content' => $control.$content,
	'grid' => '8-of-8',
));