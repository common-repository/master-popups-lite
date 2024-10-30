<?php namespace MasterPopups\Includes;

/*
|---------------------------------------------------------------------------------------------------
| HTTP Client for WordPress
| Autor: Max López
| Version: 1.0
|---------------------------------------------------------------------------------------------------
*/

class IronDev {
    public $api_endpoint = '';
    public $response = array();
    protected $error_message = '';
    protected $has_error = false;
    public $options = array(
        'timeout' => 5,
        'headers' => array(),
        'cookies' => array(),
        'body' => null,
        'sslverify' => true,
    );

    /*
    |---------------------------------------------------------------------------------------------------
    | Contructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_endpoint = '' ){
        $this->api_endpoint = trailingslashit( $api_endpoint );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Establece valor a una opción
    |---------------------------------------------------------------------------------------------------
    */
    public function set_option( $option, $value ){
        $this->options[$option] = $value;
        return true;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Solicitud GET
    |---------------------------------------------------------------------------------------------------
    */
    public function get( $url, $args = array() ){
        return $this->make_request( 'get', $url, $args );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Solicitud POST
    |---------------------------------------------------------------------------------------------------
    */
    public function post( $url, $args = array() ){
        return $this->make_request( 'post', $url, $args );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Define si hubo o no error en la última solicitud
    |---------------------------------------------------------------------------------------------------
    */
    public function success(){
        return ! $this->has_error;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna el error de una solicitud
    |---------------------------------------------------------------------------------------------------
    */
    public function get_error(){
        return $this->error_message;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna el código de respuesta
    |---------------------------------------------------------------------------------------------------
    */
    public function get_response_code(){
        return wp_remote_retrieve_response_code( $this->response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Realiza la solicitud
    |---------------------------------------------------------------------------------------------------
    */
    private function make_request( $method, $url, $args = array() ){
        $url = $this->make_url( $url );
        if( ! $url ){
            return false;
        }
        switch( $method ){
            case 'get':
                if( ! empty( $args ) ){
                    $url = $url . '?' . http_build_query( $args );
                }
                $this->response = wp_remote_get( $url, $this->options );
                break;
            case 'post':
                $this->options['body'] = (array) $args;
                $this->response = wp_remote_post( $url, $this->options );
                break;
        }

        //Comprobamos los errores
        $this->check_errors();

        return wp_remote_retrieve_body( $this->response );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba los errores
    |---------------------------------------------------------------------------------------------------
    */
    private function check_errors(){
        $this->has_error = false;
        $this->error_message = '';

        if( is_wp_error( $this->response ) ){
            $this->has_error = true;
            $this->error_message = $this->response->get_error_message();
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Construye la url para la nueva consulta
    |---------------------------------------------------------------------------------------------------
    */
    private function make_url( $url = '' ){
        if( filter_var( $url, FILTER_VALIDATE_URL ) !== false ){
            return $url;
        } else if( filter_var( $this->api_endpoint, FILTER_VALIDATE_URL ) !== false ){
            return $this->api_endpoint . $url;
        } else{
            $this->has_error = true;
            $this->error_message = 'The url provided is not a valid url';
        }
        return false;
    }

}

?>
