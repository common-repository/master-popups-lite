<?php namespace MasterPopups\Includes\ServiceIntegration;

use MPP_Mailgun\Mailgun;

class MailgunIntegration extends ServiceIntegration {


    /*
      |---------------------------------------------------------------------------------------------------
      | Constructor
      |---------------------------------------------------------------------------------------------------
      */
    public function __construct( $api_key = '' ){
        $this->api_key = $api_key;
        $this->service = new Mailgun( $this->api_key );
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
            $this->service->get( 'lists' );
            return true;
        } catch( \Exception $e ){
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
        $lists = $this->service->get( 'lists' )->http_response_body->items;

        foreach( $lists as $list ){
            $items[$list->address] = $list->name;
        }

        return $items;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verificar si el contacto está en la lista indicada
    |---------------------------------------------------------------------------------------------------
    */
    public function subscriber_exists( $email ){
        $result = $this->service->get( "lists/$this->list_id/members/pages", array(
            'subscribed' => 'yes',
            'limit' => 300
        ) )->http_response_body->items;

        foreach( $result as $user ){
            if( $user->address == $email ){
                return true;
            }
        }

        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function add_subscriber( $email, $data = array() ){
        // Comprobamos si el usuario ya está registrado
        if( $this->subscriber_exists( $email ) ){
            $this->error = $this->messages['subscriber_exists'];
            return false;
        }

        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : '';


        //Datos necesarios para la suscripción
        $params = array();
        $params['subscribed'] = true;
        $params['address'] = $email;
        $params[$first_name['name']] = trim( $first_name['value'] . ' ' . $last_name['value'] );

        if( ! empty( $data['custom_fields'] ) ){
            $params['vars'] = json_encode( $data['custom_fields'] ); // Asi de facil
        }
        //Suscribir nuevo usuario
        $result = $this->service->post( "lists/$this->list_id/members", $params ); // imprimer una cadena de error si da error por eso está la verificación si el correo está repetido arriba
        if( $result !== 'Error' ){ // verifico que es diferente de error
            return true;
        } else{
            $this->error = $result;
        }
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos por defecto
    |---------------------------------------------------------------------------------------------------
    */
    public function get_default_fields(){
        return array( 'name', 'address' );
    }

}