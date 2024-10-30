<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\Includes\IronDev;

class CustomerIoIntegration extends ServiceIntegration {
    private $site_id = '';
    private $url = 'https://track.customer.io';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key, $site_id ){
        $this->api_key = $api_key;
        $this->site_id = $site_id;
        $this->service = new IronDev( $this->url );

        $basic_auth = base64_encode( $this->site_id . ':' . $this->api_key );
        $this->service->set_option( 'headers', array(
            'Authorization' => "Basic $basic_auth"
        ) );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si la conexión con el servicio es exitosa
    |---------------------------------------------------------------------------------------------------
    */
    public function is_connect(){
        $response = $this->service->get( 'auth' );
        if( ! $this->service->success() ){
            $this->error = $this->service->get_error();
            return false;
        }
        $response = json_decode( $response );
        if( isset( $response->meta->error ) ){
            $this->error = $response->meta->error;
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Request
    |---------------------------------------------------------------------------------------------------
    */
    public function request( $action, $args = array() ){
        $this->response = $this->service->post( $action, $args );
        if( ! $this->service->success() ){
            $this->error = $this->service->get_error();
            return false;
        }
        $this->response = json_decode( $this->response );
        if( ! isset( $this->response->meta->error ) ){
            return true;
        }
        $this->error = isset( $this->response->meta->error ) ? $this->response->meta->error : '';
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists(){
        return array();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function add_subscriber( $email, $data = array() ){
        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'last_name';

        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params[$first_name['name']] = $first_name['value'];
        $params[$last_name['name']] = $last_name['value'];
        $params['created_at'] = time();
        if( isset( $data['custom_fields'] ) ){
            $params = array_merge( $params, $data['custom_fields'] );
        }

        $this->service->set_option( 'method', 'PUT' );//Cambiamos el método a PUT xq la API así lo trabaja
        $response = $this->request( 'api/v1/customers/' . urlencode( $email ), $params );
        return $response;
    }
}
