<?php namespace MasterPopups\Includes\ServiceIntegration;

use MaxLopez\HTTPClientWP\IronMan;
use MasterPopups\Includes\Functions as Functions;

class iContactIntegration extends ServiceIntegration {
    private $api_url = null;
    private $accountId = null;
    private $clientFolderId = null;
    private $api_endpoint = 'https://app.icontact.com/icp/a';
    private $api_username = null;
    private $api_password = null;
    private $lists = array();

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key, $api_username, $api_password ){
        $this->api_key = trim( $api_key );
        $this->api_username = trim( $api_username );
        $this->api_password = trim( $api_password );

        $this->ironman = new IronMan( $this->api_endpoint );
        $this->ironman->set_headers( array(
            'API-AppId' => $this->api_key,
            'API-Username' => $api_username,
            'API-Password' => $api_password,
            'API-Version' => '2.0',
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ) );
        $this->ironman->set_api_endpoint( $this->set_api_url() );

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Set api url
    |---------------------------------------------------------------------------------------------------
    */
    public function set_api_url(){
        $this->new_request( 'GET', $this->api_endpoint );
        if( $this->ironman->response_code == 200 ){
            $body = $this->get_response_body( true );
            if( isset( $body['accounts'][0]['accountId'] ) ){
                $this->accountId = $body['accounts'][0]['accountId'];
                $this->new_request( 'GET', $this->api_endpoint . "/$this->accountId/c" );
                if( $this->ironman->response_code == 200 ){
                    $body = $this->get_response_body( true );
                    if( isset( $body['clientfolders'][0]['clientFolderId'] ) ){
                        $this->clientFolderId = $body['clientfolders'][0]['clientFolderId'];
                    }
                }
            }
        }

        if( $this->accountId && $this->clientFolderId ){
            $this->api_url = "{$this->api_endpoint}/{$this->accountId}/c/$this->clientFolderId";
        }
        return $this->api_url;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si la conexión con el servicio es exitosa
    |---------------------------------------------------------------------------------------------------
    */
    public function is_connect(){
        $this->get_lists();
        return $this->ironman->response_code == 200;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las listas
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists( $args = array() ){
        $items = array();
        if( ! empty( $this->lists ) ){
            return $this->lists;
        }
        $success = $this->new_request( "GET", "/lists" );
        if( ! $success ){
            return array();
        }
        $body = $this->get_response_body( true );
        $lists = isset( $body['lists'] ) ? $body['lists'] : array();
        foreach( $lists as $list ){
            $items[$list['listId']] = $list['name'];
        }
        $this->lists = $items;
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
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'firstName';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'lastName';

        //Datos necesarios para la suscripción
        $params = array();
        $params['email'] = $email;
        $params[$first_name['name']] = $first_name['value'];
        $params[$last_name['name']] = $last_name['value'];
        $params['status'] = 'normal';//normal,bounced,donotcontact,pending,invitable,deleted

        if( ! empty( $data['custom_fields'] ) ){
            $default_fields = $this->get_default_fields();
            $custom_fields = $this->get_custom_fields();
            foreach( $data['custom_fields'] as $cf_name => $cf_value ){
                //los nombres deben ser iguales para que los registre.
                //si los nombres son diferentes no los registra, sin embargo no da error
                if( in_array( $cf_name, $default_fields ) || in_array( $cf_name, $custom_fields ) ){
                    $params[$cf_name] = $cf_value;
                }
            }
        }

        //Suscribir nuevo usuario
        $this->ironman->set_option( 'encode_body', true );//La petición requiere datos en formato json
        $success = $this->new_request( "POST", "/contacts", array( $params ) );
        $body = $this->get_response_body( true );
        if( $success && isset( $body['contacts'] ) && is_array( $body['contacts'] ) ){
            $contactId = $body['contacts'][0]['contactId'];
            $success = $this->new_request( "POST", "/subscriptions", array(
                array(
                    'contactId' => $contactId,
                    'listId' => $this->list_id,
                    'status' => 'normal',//'normal', 'pending', 'unsubscribed'. Define si un contacto recibirá o no correos electrónicos enviados a esta lista
                )
            ));
            return $success;
        }
        return false;
    }

    /*
	|---------------------------------------------------------------------------------------------------
	| Retorna todos los campos por defecto
	|---------------------------------------------------------------------------------------------------
	*/
    public function get_default_fields(){
        //los nombres deben ser iguales para que los registre, sino no da error pero no los registra
        return array(
            'prefix',
            'suffix',
            'street',
            'street2',
            'city',
            'state',
            'postalCode',
            'phone',
            'fax',
            'business',
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todos los campos personalizados
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields(){
        $items = array();
        $success = $this->new_request( "GET", "/customfields" );
        if( ! $success ){
            return array();
        }
        $body = $this->get_response_body( true );
        $fields = isset( $body['customfields'] ) ? $body['customfields'] : array();
        foreach( $fields as $field ){
            $items[] = $field['customFieldId'];
        }
        return $items;
    }

}
