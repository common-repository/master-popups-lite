<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\Includes\IronDev;

class TuNewsletterIntegration extends ServiceIntegration {
    private $user_key = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key = '', $url = 'http://app.tuservidor.net/api/2.0' ){
        $this->user_key = $api_key;
        $this->service = new IronDev( $url );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Request
    |---------------------------------------------------------------------------------------------------
    */
    public function request( $action, $args = array() ){
        $data = array(
            'user_key' => $this->user_key
        );
        $args = array_merge( $data, $args );
        $this->response = $this->service->post( $action, $args );
        if( ! $this->service->success() ){
            $this->error = $this->service->get_error();
            return false;
        }
        $this->response = json_decode( $this->response, true );
        if( $this->response['status'] == 'success' ){
            return true;
        }
        $this->error = isset( $this->response['message'] ) ? $this->response['message'] : '';
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si la conexión con el servicio es exitosa
    |---------------------------------------------------------------------------------------------------
    */
    public function is_connect(){
        if( ! $this->service ){
            return false;
        }
        return $this->request( 'list/list' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists(){
        $items = array();
        if( ! $this->request( 'list/list' ) ){
            return array();
        }
        $lists = (array) $this->response['lists'];
        foreach( $lists as $list ){
            $items[$list['list_id']] = $list['name'];
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
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : '';

        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params[$first_name['name']] = $first_name['value'];
        $params['custom_fields'] = array();

        if( ! empty( $data['custom_fields'] ) ){
            foreach( $data['custom_fields'] as $cf_name => $cf_value ){
                $params['custom_fields'][] = array(
                    'name' => $cf_name,
                    'value' => $cf_value,
                );
            }
        }

        $params['list_id'] = $this->list_id;
        $params['update'] = true;//Indica si se debe actualizar los datos de un suscriptor existente o suscribir uno nuevo. Si ‘update’ es TRUE y la dirección de email no existe, se suscribirá. (opcional).
        $params['subscribed'] = true;//Al suscribir un email, puede enviarle el email de confirmación para que se valide la dirección, o suscribirlo de forma directa. TRUE suscribirá de forma directa.(Opcional).

        $response = $this->request( 'subscriber/subscribe', $params );
        if( ! $response ){
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        if( ! $this->request( 'list/get', array( 'list_id' => $this->list_id ) ) ){
            return array();
        }
        $fields = (array) $this->response['list_info']['custom_fields'];
        foreach( $fields as $field ){
            $items[] = str_replace( array( '{{{$', '}}}' ), '', $field['name'] );
        }
        return $items;
    }


}
