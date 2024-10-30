<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\FreshMail\FmRestApi;

class FreshmailIntegration extends ServiceIntegration {

    /*
      |---------------------------------------------------------------------------------------------------
      | Constructor
      |---------------------------------------------------------------------------------------------------
      */
    public function __construct( $api_key, $api_secret ){
        $this->api_key = $api_key;
        $this->api_secret = $api_secret;

        $this->service = new FmRestApi();
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
        try{
            $this->service->setApiKey( $this->api_key );
            $this->service->setApiSecret( $this->api_secret );
            $response = $this->service->doRequest( 'ping' );
            return true;
        } catch( \Exception $e ){
            $this->error = $e->getMessage();
            return false;
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists(){
        $items = array();
        $lists = $this->service->doRequest( 'subscribers_list/lists' )['lists'];
        if( $lists ){
            foreach( $lists as $list ){
                $items[$list['subscriberListHash']] = $list['name'];
            }
        }
        return $items;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function add_subscriber( $email, $data = array() ){
        // Comprobamos si el usuario ya está registrado
        // Ya no hay necesidad de sacar los usuarios y verificar que si existen en la lista
        // ya que la misma api me da error a la hora de crear un usuario repetido en la misma lista

        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : '';//no hay este campo

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : '';//no hay este campo

        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params['custom_fields'] = array();

        $data['custom_fields'][$first_name['name']] = $first_name['value'];
        $data['custom_fields'][$last_name['name']] = $last_name['value'];
        if( ! empty( $data['custom_fields'] ) ){//Da error cuando se agregan campos inexistentes
            $custom_fields = $this->get_custom_fields();
            foreach( $data['custom_fields'] as $cf_name => $cf_value ){
                if( in_array( $cf_name, $custom_fields ) ){
                    $params['custom_fields'][$cf_name] = $cf_value;
                }
            }
        }

        $params['list'] = $this->list_id;

        //Suscribir nuevo usuario
        try{
            $result = $this->service->doRequest( 'subscriber/add', $params );
            if( isset( $result['status'] ) ){
                return $result['status'] === 'OK';
            } else{
                return false;
            }
        } catch( \Exception $e ){
            $this->error = $e->getMessage();
            return false;
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $real_fields = array();
        $fields = $this->service->doRequest( 'subscribers_list/getFields', array( 'hash' => $this->list_id ) )['fields'];
        if( $fields ){
            foreach( $fields as $field ){
                $real_fields[$field['hash']] = $field['tag'];
            }
        }
        return $real_fields;
    }

}