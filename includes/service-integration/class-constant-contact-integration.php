<?php namespace MasterPopups\Includes\ServiceIntegration;

use ConstantContactAPI2\ConstantContact;
use ConstantContactAPI2\Components\Contacts\Contact;
use ConstantContactAPI2\Exceptions\CtctException;


class ConstantContactIntegration extends ServiceIntegration {
    protected $access_token = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key = '', $access_token = '' ){
        $this->api_key = $api_key;
        $this->access_token = $access_token;
        $this->service = new ConstantContact( $this->api_key );
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
            $info = $this->service->accountService->getAccountInfo( $this->access_token );
            return true;
        } catch( CtctException $ex ){
            $this->set_error( $ex );
            return false;
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Set error
    |---------------------------------------------------------------------------------------------------
    */
    public function set_error( CtctException $ex ){
        $this->error = $ex->getMessage();
        if( is_array( $ex->getErrors() ) ){
            foreach( $ex->getErrors() as $error ){
                $this->error = isset( $error->error_message ) ? $error->error_message : '';
            }
        }
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists(){
        try{
            $lists = $this->service->listService->getLists( $this->access_token );
            $items = array();
            if( $lists ){
                foreach( $lists as $list ){
                    $items[$list->id] = $list->name;
                }
            }
            return $items;
        } catch( CtctException $ex ){
            $this->set_error( $ex );
            return array();
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega un suscriptor a una lista
    |---------------------------------------------------------------------------------------------------
    */
    public function add_subscriber( $email, $data = array() ){
        $first_name = $data['first_name'];
        $first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : '';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : '';

        try{
            $response = $this->service->contactService->getContacts( $this->access_token, array( 'email' => $email ) );
            if( ! empty( $response->results ) ){
                $this->error = $this->messages['subscriber_exists'];
                return false;
            }
            //Datos necesarios para la suscripción
            $contact = new Contact();
            $contact->addEmail( $email );
            $contact->addList( $this->list_id );
            $contact->first_name = $first_name['value'];
            $contact->last_name = $last_name['value'];

            if( ! empty( $data['custom_fields'] ) ){
                $default_fields = $this->get_default_fields();
                $custom_fields = $this->get_custom_fields();
                foreach( $data['custom_fields'] as $cf_name => $cf_value ){
                    if( in_array( strtolower( $cf_name ), $default_fields ) ){
                        $contact->{$cf_name} = $cf_value;
                    } else if( in_array( strtolower( $cf_name ), $custom_fields ) ){
                        $contact->custom_fields[] = array(
                            'name' => $cf_name,
                            'value' => $cf_value,
                        );
                    }
                }
            }

            //Suscribir nuevo usuario
            $this->response = $this->service->contactService->addContact( $this->access_token, $contact );
            return true;
        } catch( CtctException $ex ){
            $this->set_error( $ex );
        }
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos por defecto
    |---------------------------------------------------------------------------------------------------
    */
    public function get_default_fields(){
        return array(
            'first_name',
            'last_name',
            'company_name',
            'job_title',
            'home_phone',
            'work_phone',
            'cell_phone',
            'fax',
            'prefix_name'
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        for( $i = 1; $i < 16; $i++ ){
            $items[] = 'customfield' . $i;
        }
        return $items;
    }


}

