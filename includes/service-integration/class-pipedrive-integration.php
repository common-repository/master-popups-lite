<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\Benhawker\Pipedrive\Pipedrive;

class PipedriveIntegration extends ServiceIntegration {

    /*
      |---------------------------------------------------------------------------------------------------
      | Constructor
      |---------------------------------------------------------------------------------------------------
      */
    public function __construct( $token = '' ){
        $this->token = $token;
        $this->service = new Pipedrive( $this->token );
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
            $response = $this->service->curl()->get( '/users' );
            return $response['success'];
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
        $lists = $this->service->organizations()->getAll()['data'];
        if( $lists ){
            foreach( $lists as $list ){
                $items[$list['id']] = $list['name'];
            }
        }
        return $items;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verificar si el contacto está en la lista indicada
    |---------------------------------------------------------------------------------------------------
    */
    public function subscriber_exists( $email_user ){
        $result = $this->service->curl()->get( "/organizations/$this->list_id/persons" )['data'];
        if( $result ){
            foreach( $result as $user ){
                foreach( $user['email'] as $email ){
                    if( $email['value'] == $email_user ){
                        return true;
                    }
                }
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
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'last_name';


        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $name = trim( $first_name['value'] . ' ' . $last_name['value'] );
        $params[$first_name['name']] = empty( $name ) ? '--' : $name;

        $custom_fields = $this->get_custom_fields();
        if( ! empty( $data['custom_fields'] ) ){
            foreach( $data['custom_fields'] as $key => $custom_field ){
                if( in_array( $key, $custom_fields ) ){
                    $params[$key] = $custom_field;
                }
            }
        }

        $params['org_id'] = $this->list_id; // Aqui se le añade el id de la organización o lista

        //Suscribir nuevo usuario
        $result = $this->service->persons()->add( $params );
        return $result['success'];
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $fields = $this->service->curl()->get( '/personFields' )['data'];
        $real_fields = array();
        if( $fields ){
            foreach( $fields as $field ){
                $real_fields[$field['id']] = $field['key'];
            }
        }
        return $real_fields;
    }

}