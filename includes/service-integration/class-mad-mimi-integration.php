<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\MadMimiAPI\MadMimi;

class MadMimiIntegration extends ServiceIntegration {

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key = '', $email = '' ){
        $this->api_key = $api_key;
        $this->service = new MadMimi( $email, $this->api_key );
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
        $lists = $this->service->Lists();
        if( $lists == 'Unable to authenticate' ){
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
        $items = array();
        $real_lists = $this->service->Lists();
        $xml = simplexml_load_string( $real_lists, "SimpleXMLElement" );
        $array = json_decode( json_encode( $xml ), true );
        $lists = isset( $array['list'] ) ? $array['list'] : null;
        if( isset( $lists['@attributes'] ) ){
            $items[$lists['@attributes']['id']] = $lists['@attributes']['name'];
            return $items;
        }
        if( count( $lists ) > 0 && $lists !== null ){
            foreach( $lists as $list ){
                $items[$list['@attributes']['id']] = $list['@attributes']['name'];
            }
        }
        return $items;
    }


    /*
      |---------------------------------------------------------------------------------------------------
      | Verificar si el contacto está en la lista indicada
      |---------------------------------------------------------------------------------------------------
      */
    private function subscriber_exists( $email ){
        $response = $this->service->Memberships( $email );
        $xml = simplexml_load_string( $response, "SimpleXMLElement" );
        $array = json_decode( json_encode( $xml ), true );
        if( ! isset( $array['list'] ) ){//email no encontrado en ninguna lista
            return false;
        }
        $lists = $array['list'];
        if( isset( $lists['@attributes'] ) ){ //cuando hay una sola lista
            return $lists['@attributes']['id'] == $this->list_id;
        } else{//cuando hay varias listas
            foreach( $lists as $list ){
                if( $list['@attributes']['id'] == $this->list_id ){
                    return true;
                }
            }
            return false;
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
        $first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'first_name';

        $last_name = $data['last_name'];
        $last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
        $last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'last_name';

        //Comprobamos si el usuario ya está registrado
        if( $this->subscriber_exists( $email ) ){
            $this->error = $this->messages['subscriber_exists'];
            return false;
        }

        //Datos necesarios para la suscripción
        $params = array();
        $params[$first_name['name']] = $first_name['value'];
        $params[$last_name['name']] = $last_name['value'];

        if( ! empty( $data['custom_fields'] ) ){//MadMimi acepta cualquier campo personalizado
            foreach( $data['custom_fields'] as $cf_name => $cf_value ){
                $params[$cf_name] = $cf_value;
            }
        }

        //Suscribir nuevo usuario
        $this->response = $this->service->AddMembership( $this->list_id, $email, $params, true );//true to return true xd

        return true;
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
            'title',
            'address',
            'city',
            'state',
            'zip',
            'company',
            'country'
        );
    }
}

