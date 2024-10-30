<?php namespace MasterPopups\Includes;

class Subscription extends FormSubmission {
    public $storage = 'master_popups';
    public $audience = null;

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $plugin, $post_data = array() ){
        parent::__construct( $plugin, $post_data, 'Subscription' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Realiza la suscripción
    |---------------------------------------------------------------------------------------------------
    */
    public function execute(){
        if( ! parent::validate_email() ){
            return $this->result;
        }

        $this->audience = get_post( $this->popup->option( 'audience-list' ) );
        if( ! $this->audience || get_post_status( $this->audience->ID ) != 'publish' ){
            $this->result['message'] = $this->cannot . __( '"Audience List" is empty or has been deleted.', 'masterpopups' );
            return $this->result;
        }

        $this->storage = get_post_meta( $this->audience->ID, $this->prefix . 'service', true );
        if( $this->storage == 'master_popups' ){
            $this->save_in_masterpopups();
        } else{
            $this->save_in_third_party_service();
        }

        return $this->result;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Suscribe un usuario en wordpress
    |---------------------------------------------------------------------------------------------------
    */
    public function save_in_masterpopups(){
        $this->saved_data = array();
        $this->saved_data['first_name'] = isset( $this->fields['first_name'] ) ? $this->fields['first_name']['value'] : '';
        $this->saved_data['last_name'] = isset( $this->fields['last_name'] ) ? $this->fields['last_name']['value'] : '';
        $this->saved_data['custom_fields'] = $this->custom_fields;

        $subscribers = get_post_meta( $this->audience->ID, $this->prefix . 'subscribers', true );
        if( empty( $subscribers ) ){
            $subscribers = array();
        }
        $this->result['error'] = false;

        $action = 'created';
        $allow_data_update = get_post_meta( $this->audience->ID, $this->prefix . 'allow-data-update', true );
        if( isset( $subscribers[$this->email] ) && $allow_data_update == 'on' ){
            $action = 'updated';
        }

        if( $allow_data_update == 'on' || ! isset( $subscribers[$this->email] ) ){
            //Datos adicionales
            $this->set_additional_data_to_save();
            $this->saved_data['list_id'] = $this->audience->ID;
            $this->saved_data['list_title'] = $this->audience->post_title;
            $this->saved_data['status'] = 'subscribed';
            $this->saved_data['action'] = $action;

            if( $action == 'updated' ){
                $old_data = (array) $subscribers[$this->email];
                $this->saved_data = array_replace_recursive( $old_data, $this->saved_data );
            }

            $subscribers[$this->email] = $this->saved_data;
            update_post_meta( $this->audience->ID, $this->prefix . 'subscribers', $subscribers );

            if( $action == 'created' ){
                //Actualizar total de suscriptores
                $total_subscribers = (int) get_post_meta( $this->audience->ID, $this->prefix . 'total-subscribers', true );
                update_post_meta( $this->audience->ID, $this->prefix . 'total-subscribers', ++$total_subscribers );
            }
            $this->actions_on_success();
        } else{
            $this->actions_on_error();
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Suscribe un usuario en otro servicio
    |---------------------------------------------------------------------------------------------------
    */
    public function save_in_third_party_service(){
        $services = $this->plugin->options_manager->get_integrated_services( true, true );
        if( empty( $services ) || ! isset( $services[$this->storage] ) ){
            $this->result['message'] = $this->cannot . __( 'The service is not yet connected.', 'masterpopups' );
            return $this->result;
        }
        $service = Services::get_instance( $this->storage, array(
            'api_key' => $services[$this->storage]['service-api-key'],
            'token' => $services[$this->storage]['service-token'],
            'url' => $services[$this->storage]['service-url'],
            'email' => $services[$this->storage]['service-email'],
            'password' => $services[$this->storage]['service-password'],
        ) );
        if( ! is_object( $service ) ){
            $this->result['message'] = $service;
            return $this->result;
        }
        if( ! $service->is_connect() ){
            $this->result['message'] = $this->cannot . __( 'We could not connect with the service. Try again.', 'masterpopups' );
            return $this->result;
        }

        $list_id = get_post_meta( $this->audience->ID, $this->prefix . 'list-id', true );
        $account_id = get_post_meta( $this->audience->ID, $this->prefix . 'account-id', true );
        $all_services = Services::get_all();
        $allow_get_lists = $all_services[$this->storage]['allow']['get_lists'];
        if( ! $service->set_list_id( $list_id, $allow_get_lists, array( 'account_id' => $account_id ) ) ){
            $this->result['message'] = $this->cannot . __( 'The list no longer exists in the chosen service.', 'masterpopups' );
            return $this->result;
        }

        $data = array();
        $data['double-opt-in'] = get_post_meta( $this->audience->ID, $this->prefix . 'double-opt-in', true );
        $data['segment-id'] = get_post_meta( $this->audience->ID, $this->prefix . 'segment-id', true );
        $data['overwrite'] = get_post_meta( $this->audience->ID, $this->prefix . 'allow-data-update', true );
        $data['custom_fields'] = $this->custom_fields;
        $this->saved_data['custom_fields'] = $this->custom_fields;//Necesario para renderizar los campos
        $data['first_name'] = array(
            'name' => '',
            'value' => isset( $this->fields['first_name'] ) ? $this->fields['first_name']['value'] : '',
        );
        if( isset( $this->post_data['mpp_field_first_name'] ) && $this->post_data['mpp_field_first_name'] != 'field_first_name' ){
            $data['first_name']['name'] = $this->post_data['mpp_field_first_name'];
        }
        $data['last_name'] = array(
            'name' => '',
            'value' => isset( $this->fields['last_name'] ) ? $this->fields['last_name']['value'] : '',
        );
        if( isset( $this->post_data['mpp_field_last_name'] ) && $this->post_data['mpp_field_last_name'] != 'field_last_name' ){
            $data['last_name']['name'] = $this->post_data['mpp_field_last_name'];
        }

        $this->result['error'] = false;
        if( $service->add_subscriber( $this->email, $data ) ){
            //Datos adicionales
            $this->set_additional_data_to_save();
            $this->saved_data['list_id'] = $this->audience->ID;
            $this->saved_data['list_title'] = $this->audience->post_title;

            //Actualizar total de suscriptores
            $total_subscribers = (int) get_post_meta( $this->audience->ID, $this->prefix . 'total-subscribers', true );
            update_post_meta( $this->audience->ID, $this->prefix . 'total-subscribers', ++$total_subscribers );

            $this->actions_on_success();
        } else{
            $this->actions_on_error( $service );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acciones cuando la suscripción fue exitosa
    |---------------------------------------------------------------------------------------------------
    */
    private function actions_on_success(){
        $this->result['success'] = true;
        $this->result['actions'] = $this->get_actions_on_success();

        $this->set_render_fields();
        $this->send_email_notification_to_admin();
        $this->send_email_notification_to_subscriber();

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acciones cuando la suscripción tuvo algún error
    |---------------------------------------------------------------------------------------------------
    */
    private function actions_on_error( $service = null ){
        $this->result['success'] = false;
        $this->result['actions']['message'] = $this->popup->option( 'subscription-error-message' );
        if( Settings::option( 'attach-error-on-form-failed' ) === 'on' ){
            $error_message = $this->result['message'];
            $error_message .= ' ' . ( isset( $service->error ) ? $service->error : '' );
            $this->result['actions']['error'] = trim( $error_message );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Envía una notificación por email a un administrador después de la suscripción
    |---------------------------------------------------------------------------------------------------
    */
    public function send_email_notification_to_admin(){
        if( $this->popup->option( 'subscription-admin-notif' ) == 'off' ){
            return;
        }
        $from = $this->popup->option( 'subscription-admin-notif-from' );
        $to = $this->popup->option( 'subscription-admin-notif-to' );
        $subject = $this->popup->option( 'subscription-admin-notif-subject' );
        $message = $this->popup->option( 'subscription-admin-notif-message' );

        $this->send_email( $from, $to, $subject, $message, true );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Envía una notificación por email al nuevo suscriptor después de la suscripción
    |---------------------------------------------------------------------------------------------------
    */
    public function send_email_notification_to_subscriber(){
        if( $this->popup->option( 'subscription-user-notif' ) == 'off' ){
            return;
        }
        $to = $this->email;
        $from = $this->popup->option( 'subscription-user-notif-from' );
        $subject = $this->popup->option( 'subscription-user-notif-subject' );
        $message = $this->popup->option( 'subscription-user-notif-message' );

        $this->send_email( $from, $to, $subject, $message, false );
    }


}
