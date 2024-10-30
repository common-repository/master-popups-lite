<?php namespace MasterPopups\Includes\ServiceIntegration;

use MaxLopez\HTTPClientWP\IronMan;
use MasterPopups\Includes\Functions as Functions;

class NewsmanIntegration extends ServiceIntegration {
    private $api_endpoint = 'https://ssl.newsman.app/api/1.2/rest/';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key, $user_id ){
        $this->api_key = trim( $api_key );
        $this->user_id = trim( $user_id );

        $this->ironman = new IronMan( $this->api_endpoint.$this->user_id.'/'.$this->api_key );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Make Request
    |---------------------------------------------------------------------------------------------------
    */
    public function new_request( $method, $url, $body = array(), $headers = array(), $options = array() ){
        $success = parent::new_request( $method, $url, $body, $headers, $options );
        if( $this->ironman->response_code != 200 ){
            $body = $this->get_response_body( true );
            $this->error = isset( $body['message'] ) ? $this->error . '. Error: '.$body['message'] : $this->error;
        }
        return $success && $this->ironman->response_code == 200;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si la conexión con el servicio es exitosa
    |---------------------------------------------------------------------------------------------------
    */
    public function is_connect(){
        $success = $this->new_request( "POST", "list.all.json" );
        return $success;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get segments
    |---------------------------------------------------------------------------------------------------
    */
    public function get_segments( $list_id ){
        $items = array();
        $success = $this->new_request("POST", "segment.all.json", array(  'list_id' => $list_id ) );
        if( ! $success ){
            return array();
        }
        $segments = $this->get_response_body( true );
        foreach( $segments as $segment){
            $items[$segment['segment_id']] = $segment['segment_name'];
        }
        return $items;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists( $args = array() ){
        $items = array();
        $success = $this->new_request( "POST", "list.all.json" );
        if( ! $success ){
            return array();
        }
        $body = $this->get_response_body( true );
        foreach( $body as $list ){
            $items[$list['list_id']] = $list['list_name'];
        }
        return $items;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function add_subscriber( $email, $data = array() ){
        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'first_name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'last_name';

        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params['firstname'] = $first_name['value'];
        $params['lastname'] = $last_name['value'];
        $params['ip'] = $_SERVER['REMOTE_ADDR'];
        $params['list_id'] = $this->list_id;
        //Props == Custom fields
        $params['props'] = $data['custom_fields'];

        $double_optin = isset( $data['double-opt-in'] ) ? $data['double-opt-in'] : 'off';
        $segment_id = isset( $data['segment-id'] ) ? $data['segment-id'] : '';

        //Suscribir nuevo usuario
        $this->ironman->set_option( 'encode_body', true );//set json to body
        if( $double_optin == 'on' ){
            $params['options'] = array(
                'segments' => array( $segment_id )
            );
            $success = $this->new_request( "POST", "subscriber.initSubscribe.json", $params);
        } else {
            $success = $this->new_request( "POST", "subscriber.saveSubscribe.json", $params);
            if( $success && $segment_id ){
                $status = $this->new_request( "POST", "subscriber.getByEmail.json", array(
                    'list_id' => $this->list_id,
                    'email' => $email
                ));
                if( $status ){
                    $user = $this->get_response_body( true );
                    $user_id = isset( $user['subscriber_id'] ) ? $user['subscriber_id'] : null;
                    if( $user_id ){
                        $this->new_request( "POST", "subscriber.addToSegment.json", array(
                            'subscriber_id' => $user_id,
                            'segment_id' => $segment_id
                        ));
                    }
                }
            }
        }
        return $success;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        return $items;
    }

}
