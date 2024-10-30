<?php namespace Xbox\Includes;

class Ajax {

	public function __construct(  ) {
		//Ajax oembed
		add_action( 'wp_ajax_xbox_get_oembed', array( $this, 'get_oembed_ajax' ) );
		add_action( 'wp_ajax_nopriv_xbox_get_oembed', array( $this, 'get_oembed_ajax' ) );

		add_action( 'wp_ajax_xbox_get_items', array( $this, 'get_items_ajax' ) );
		add_action( 'wp_ajax_nopriv_xbox_get_items', array( $this, 'get_items_ajax' ) );

	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Get oembed ajax
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_oembed_ajax(){
        if ( ! current_user_can( 'manage_options' ) ) {
            die();
        }
		if( ! isset( $_POST['ajax_nonce'] ) || ! isset( $_POST['oembed_url'] ) ) {
			die();
		}
		if( ! wp_verify_nonce( $_POST['ajax_nonce'], 'xbox_ajax_nonce' ) ){
			die();
		}

		$oembed_url = esc_url( $_POST['oembed_url'] );
		$preview_size = isset( $_POST['preview_size'] ) ? json_decode( json_encode( $_POST['preview_size'] ), true ) : array();
		$oembed = Functions::get_oembed( $oembed_url, $preview_size );
		wp_send_json( $oembed );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Get items ajax
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_items_ajax(){
        if ( ! current_user_can( 'manage_options' ) ) {
            die();
        }
		if( ! isset( $_POST['ajax_nonce'] ) ) {
			die();
		}
		if( ! wp_verify_nonce( $_POST['ajax_nonce'], 'xbox_ajax_nonce' ) ){
			die();
		}
		$response = array();
		$response['success'] = false;
		$function_name = sanitize_text_field( $_POST['function_name'] );
		if( empty( $_POST['class_name'] ) ){
			$items = call_user_func($function_name);
		} else{
			$class_name = stripslashes( $_POST['class_name'] );
			//$items = call_user_func("$class_name::$function_name");//También funciona
			$items = call_user_func( array( $class_name, $function_name ) );
		}
		if( $items ){
			$response['success'] = true;
			$response['items'] = $items;
		}
		$response['class_name'] = $class_name;
		$response['function_name'] = $function_name;

		wp_send_json( $response );
	}


}