<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\SimplyCast\API as SimplyCastAPI;

class SimplyCastIntegration extends ServiceIntegration {

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $public_key = '', $private_key = '' ){
        $this->public_key = $public_key;
        $this->private_key = $private_key;
        try{
            $this->service = new SimplyCastAPI( $this->public_key, $this->private_key );
        } catch( \Exception $e ){
            $this->service = null;
        }
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
            $this->service->contactmanager->getLists();
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
        $lists = $this->service->contactmanager->getLists();
        if( $lists != null ){
            foreach( $lists['lists'] as $list ){
                $items[$list['id']] = $list['name'];
            }
        }

        return $items;
    }

    /*
      |---------------------------------------------------------------------------------------------------
      | Verifica si un suscriptor está en la lista actual
      |---------------------------------------------------------------------------------------------------
      */
    private function subscriber_exists( $email ){
        $subscribers = $this->service->contactmanager->getContactsFromList( $this->list_id );
        if( $subscribers != null ){
            foreach( $subscribers['contacts'] as $subscriber ){
                foreach( $subscriber['fields'] as $field ){
                    if( $field['name'] == 'email' && $field['value'] == $email ){
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
        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : '';

        //Comprobamos si el usuario ya está registrado
        if( $this->subscriber_exists( $email ) ){
            $this->error = $this->messages['subscriber_exists'];
            return false;
        }

        $contactId = $this->get_contact_id( $email );
        if( $contactId == null ){
            //Datos necesarios para la suscripción
            $params = array();
            $params['email'] = $email;
            $params[$first_name['name']] = $first_name['value'];
            $params[$last_name['name']] = $last_name['value'];
            $params = array_merge( $params, $data['custom_fields'] );
            $params = array_change_key_case( $params, CASE_LOWER );

            $custom_fields = array_map( 'strtolower', $this->get_custom_fields() );
            $contact = array();
            foreach( $custom_fields as $cf_id => $cf_name ){
                if( isset( $params[$cf_name] ) ){
                    $contact[] = array(
                        'id' => $cf_id,
                        'value' => $params[$cf_name],
                    );
                }
            }

            $createdContact = $this->service->contactmanager->createContact( $contact );

            if( ! $createdContact || ! isset( $createdContact['contact']['id'] ) ){
                return false;
            }
            $contactId = $createdContact['contact']['id'];
        }

        $this->service->contactmanager->addContactsToList( $this->list_id, array( $contactId ) );

        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna el id de un contacto o null si no existe
    |---------------------------------------------------------------------------------------------------
    */
    public function get_contact_id( $email ){
        $contacts = $this->service->contactmanager->getContacts();
        if( $contacts != null ){
            foreach( $contacts['contacts'] as $contact ){
                foreach( $contact['fields'] as $field ){
                    if( $field['name'] == 'email' && $field['value'] == $email ){
                        return $contact['id'];
                    }
                }
            }
        }
        return null;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        $fields = $this->service->contactmanager->getColumns();
        if( empty( $fields ) ){
            return array();
        }

        foreach( $fields['columns'] as $field ){
            $items[$field['id']] = $field['name'];
        }
        return $items;
    }

}