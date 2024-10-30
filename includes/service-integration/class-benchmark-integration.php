<?php namespace MasterPopups\Includes\ServiceIntegration;

class BenchmarkIntegration extends ServiceIntegration {

    /*
      |---------------------------------------------------------------------------------------------------
      | Constructor
      |---------------------------------------------------------------------------------------------------
      */
    public function __construct( $email = '', $password = '' ){
        $this->service = new \MPP_BMEAPI( $email, $password, 'https://www.benchmarkemail.com/api/1.0' );
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
        if( $this->service->errorCode ){
            $this->error = $this->service->errorMessage;
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists(){
        $contactLists = $this->service->listGet( "", 1, 100, "", "" );
        if( ! $contactLists ){
            return array();
        }
        $lists = array();
        foreach( $contactLists as $rec ){
            $lists[$rec['id']] = $rec['listname'];
        }
        return $lists;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verificar si el contacto está en la lista indicada
    |---------------------------------------------------------------------------------------------------
    */
    public function subscriber_exists( $email ){
        $result = $this->service->listGetContacts( $this->list_id, "", 1, 1, "", "" );
        if( $result ){
            foreach( $result as $user ){
                if( $user['email'] == $email ){
                    return true;
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
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'firstname';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'lastname';


        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params[$first_name['name']] = $first_name['value'];
        $params[$last_name['name']] = $last_name['value'];

        if( ! empty( $data['custom_fields'] ) ){
            foreach( $data['custom_fields'] as $key => $value ){
                $params[$key] = $value;
            }
        }

        //Suscribir nuevo usuario
        $result = $this->service->listAddContacts( $this->list_id, array( $params ) );
        if( $result ){
            return true;
        }
        return false;
    }

    /*
      |---------------------------------------------------------------------------------------------------
      | Retorna todos los campos por defecto
      |---------------------------------------------------------------------------------------------------
      */
    public function get_default_fields(){
        return array( 'email', 'firstname', 'lastname', 'middlename' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        $response = $this->service->listGetContactFields( $this->list_id );
        if( ! $response ){
            return array();
        }
        foreach( $response as $key => $field ){
            $field = html_entity_decode( $field );
            $items[$key] = $field;
        }
        return $items;
    }
}

