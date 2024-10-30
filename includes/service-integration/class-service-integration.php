<?php namespace MasterPopups\Includes\ServiceIntegration;

abstract class ServiceIntegration {
    public $service = null;
    protected $ironman = null;
    protected $api_key = '';
    protected $list_id = '';
    public $error = '';
    public $response = null;
    public $messages = array(
        'subscription_ok' => 'Thank you, you have been added to our mailing list',
        'subscriber_exists' => 'Sorry, user already registered',
    );
    public $debug = array();


    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna el api key
    |---------------------------------------------------------------------------------------------------
    */
    public function get_api_key(){
        return $this->api_key;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Establece el id de una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function set_list_id( $list_id, $allow_get_lists = true, $args = array() ){
        $list_id = trim( $list_id );
        if( ! $allow_get_lists ){
            $this->list_id = $list_id;
            return true;
        }
        if( $this->is_valid_list_id( $list_id, $args ) ){
            $this->list_id = $list_id;
            return true;
        } else{
            $this->error = "List ID '$list_id' is not valid.";
            return false;
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna el id de la lista establecida
    |---------------------------------------------------------------------------------------------------
    */
    public function get_list_id(){
        return $this->list_id;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si un id de lista es válida
    |---------------------------------------------------------------------------------------------------
    */
    public function is_valid_list_id( $list_id, $args = array() ){
        return in_array( $list_id, array_keys( $this->get_lists( $args ) ) );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si un email es válido
    |---------------------------------------------------------------------------------------------------
    */
    public function is_valid_email( $email ){
        return filter_var( $email, FILTER_VALIDATE_EMAIL );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si la conexión con el servicio es exitosa
    |---------------------------------------------------------------------------------------------------
    */
    abstract public function is_connect();

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    abstract public function get_lists();

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    abstract public function add_subscriber( $email, $data = array() );

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos por defecto
    |---------------------------------------------------------------------------------------------------
    */
    public function get_default_fields(){
        return array();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        return array();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Realiza una nueva petición usando IronMan HTTP Client
    |---------------------------------------------------------------------------------------------------
    */
    public function new_request( $method, $url, $body = array(), $headers = array(), $options = array() ){
        if( ! $this->ironman ){
            return false;
        }
        $this->response = $this->ironman->request( $method, $url, $headers, $body, $options );
        if( ! $this->ironman->success() ){
            $this->error = $this->ironman->get_error_message();
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get response body
    |---------------------------------------------------------------------------------------------------
    */
    public function get_response_body( $array = true ){
        return json_decode( $this->ironman->get_response_body(), $array );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verifica si un valor existe en un array
    |---------------------------------------------------------------------------------------------------
    */
    public function isset_field( $field, $array, $case_sensitive = false ){
        $array = array_values( $array );
        if( $case_sensitive ){
            return in_array( $field, $array );
        }
        $field = strtolower( $field );
        $array = array_map( 'strtolower', $array );
        return in_array( $field, $array );
    }


}
