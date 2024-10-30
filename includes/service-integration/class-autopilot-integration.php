<?php namespace MasterPopups\Includes\ServiceIntegration;

use MasterPopups\Autopilot\AutopilotManager;
use MasterPopups\Autopilot\AutopilotContact;

class AutopilotIntegration extends ServiceIntegration {

	/*
	|---------------------------------------------------------------------------------------------------
	| Constructor
	|---------------------------------------------------------------------------------------------------
	*/
	public function __construct( $api_key = '' ){
		$this->api_key = $api_key;
    $this->service = new AutopilotManager( $this->api_key );
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
    try {
      $this->service->getAllLists();
    } catch( \Exception $e){
			$this->error = $e->getMessage();
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
		try {
    	return $this->service->getAllLists();
		} catch( \Exception $e ){
			$this->error = $e->getMessage();
			return array();
		}
	}

  /*
	|---------------------------------------------------------------------------------------------------
	| Verifica si un suscriptor está en la lista actual
	|---------------------------------------------------------------------------------------------------
	*/
  private function subscriber_exists( $email ){
    $contacts = $this->service->getAllContactsInList( $this->list_id )['contacts'];
    foreach( $contacts as $contact ){
      if( $contact->getFieldValue('Email') == $email ){
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
		$first_name = $data['first_name'];
		$first_name['value'] = ! empty( $first_name['value'] ) ? $first_name['value'] : '';
		$first_name['name'] = ! empty( $first_name['name'] ) ? $first_name['name'] : 'FirstName';

		$last_name = $data['last_name'];
		$last_name['value'] = ! empty( $last_name['value'] ) ? $last_name['value'] : '';
		$last_name['name'] = ! empty( $last_name['name'] ) ? $last_name['name'] : 'LastName';

		try {
			if( $this->subscriber_exists( $email ) ){
				$this->error = $this->messages['subscriber_exists'];
				return false;
			}

			//Datos necesarios para la suscripción
			$params = array();
			$params['Email'] = $email;
			$params[$first_name['name']] = $first_name['value'];
			$params[$last_name['name']] = $last_name['value'];

			if( ! empty( $data['custom_fields'] ) ){
				$default_fields = array_map('strtolower', $this->get_default_fields() );
				foreach( $data['custom_fields'] as $cf_name => $cf_value ){
					if( in_array( strtolower( $cf_name ), $default_fields ) ){
						$params[$cf_name] = $cf_value;
					} else {
						$params['custom'][$cf_name] = $cf_value;//Autopilot acepta cualquier campo personalizado
					}
				}
			}
			$params['custom'] = json_encode( $params['custom'] );//'custom' se debe enviar como json

			//Suscribir nuevo usuario
			$contact = new AutopilotContact( $params );
			$newContact = $this->service->saveContact( $contact );
			$this->response = $this->service->addContactToList( $this->list_id , $newContact->getFieldValue('contact_id') );
			return true;

		} catch( \Exception $e ){
			$this->error = $e->getMessage();
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
			'FirstName',
			'LastName',


			'Salutation',
      'Company',
      'NumberOfEmployees',
      'Title',
      'Industry',
      'Phone',
      'MobilePhone',
      'Fax',
      'Website',
      'MailingStreet',
      'MailingCity',
      'MailingState',
      'MailingPostalCode',
      'MailingCountry',
      'owner_name',
      'LeadSource',
      'Status',
      'LinkedIn',
		);
	}



}

