<?php namespace MasterPopups\Includes;

class ContactForm extends FormSubmission {

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $plugin, $post_data = array() ){
        parent::__construct( $plugin, $post_data, 'ContactForm' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Realiza la suscripción
    |---------------------------------------------------------------------------------------------------
    */
    public function execute(){
        if( isset( $this->fields['email'] ) && $this->fields['email']['required'] == 'on' ){
            if( ! parent::validate_email() ){
                return $this->result;
            }
        }

        if( $this->popup->option( 'contact-form-admin-notif' ) == 'off' ){
            $this->actions_on_success();
            $this->result['error'] = false;
            return $this->result;
        }

        $to = $this->validate_emails( $this->popup->option( 'contact-form-mail-to' ) );
        if( empty( $to ) ){
            $this->result['message'] = $this->cannot . __( 'The recipient email has not been established.', 'masterpopups' );
            return $this->result;
        }

        $this->set_additional_data_to_save();
        $this->set_render_fields();
        $this->result['error'] = false;
        $this->send();

        return $this->result;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Envía el formulario de contacto
    |---------------------------------------------------------------------------------------------------
    */
    public function send(){
        $from = $this->popup->option( 'contact-form-mail-from' );
        $to = $this->popup->option( 'contact-form-mail-to' );
        $subject = $this->popup->option( 'contact-form-mail-subject' );
        $message = $this->popup->option( 'contact-form-mail-message' );

        if( $this->send_email( $from, $to, $subject, $message, true ) ){
            $this->actions_on_success();
        } else{
            $this->actions_on_error();
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acciones cuando el proceso se realizó con éxito
    |---------------------------------------------------------------------------------------------------
    */
    private function actions_on_success(){
        $this->result['success'] = true;
        $this->result['actions'] = $this->get_actions_on_success();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acciones cuando el email no fue enviado
    |---------------------------------------------------------------------------------------------------
    */
    private function actions_on_error(){
        $this->result['success'] = false;
        $message = $this->popup->option( 'contact-form-error-message' );
        if( ! mail( 'testing_email@example.com', '[WordPress] PHP Mail Test', 'This is a test to check the PHP Mail functionality' ) ){
            $this->result['message'] = '<strong>Error: PHP mail() functionality is OFF.</strong> Your wordpress installation does not allow sending emails, please contact to your Hosting.';
        }
        $this->result['actions']['message'] = $message;
        if( Settings::option('attach-error-on-form-failed') === 'on' ){
            $error_message = $this->result['message'];
            $this->result['actions']['error'] = trim( $error_message );
        }
    }


}
