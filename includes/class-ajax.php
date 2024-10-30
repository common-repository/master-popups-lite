<?php namespace MasterPopups\Includes;

class Ajax {
    public $plugin;
    protected static $instance = null;

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    private function __construct( $plugin ){
        $this->plugin = $plugin;

        add_action( 'wp_ajax_mpp_get_video_thumbnail', array( $this, 'get_video_thumbnail' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_video_thumbnail', array( $this, 'get_video_thumbnail' ) );

        add_action( 'wp_ajax_mpp_get_icons_library', array( $this, 'get_icons_library' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_icons_library', array( $this, 'get_icons_library' ) );

        add_action( 'wp_ajax_mpp_connect_service', array( $this, 'connect_service' ) );
        add_action( 'wp_ajax_nopriv_mpp_connect_service', array( $this, 'connect_service' ) );

        add_action( 'wp_ajax_mpp_get_custom_fields_service', array( $this, 'get_custom_fields_service' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_custom_fields_service', array( $this, 'get_custom_fields_service' ) );

        add_action( 'wp_ajax_mpp_get_lists_service', array( $this, 'get_lists_service' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_lists_service', array( $this, 'get_lists_service' ) );

        add_action( 'wp_ajax_mpp_check_list_id_service', array( $this, 'check_list_id_service' ) );
        add_action( 'wp_ajax_nopriv_mpp_check_list_id_service', array( $this, 'check_list_id_service' ) );

        add_action( 'wp_ajax_mpp_get_drip_accounts', array( $this, 'get_drip_accounts' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_drip_accounts', array( $this, 'get_drip_accounts' ) );

        add_action( 'wp_ajax_mpp_get_newsman_segments', array( $this, 'get_newsman_segments' ) );
        add_action( 'wp_ajax_nopriv_mpp_get_newsman_segments', array( $this, 'get_newsman_segments' ) );

        add_action( 'wp_ajax_mpp_delete_subscriber', array( $this, 'mpp_delete_subscriber' ) );
        add_action( 'wp_ajax_nopriv_mpp_delete_subscriber', array( $this, 'mpp_delete_subscriber' ) );

        add_action( 'wp_ajax_mpp_user-subscription', array( $this, 'subscribe_user' ) );
        add_action( 'wp_ajax_nopriv_mpp_user-subscription', array( $this, 'subscribe_user' ) );

        add_action( 'wp_ajax_mpp_contact-form', array( $this, 'send_contact_form' ) );
        add_action( 'wp_ajax_nopriv_mpp_contact-form', array( $this, 'send_contact_form' ) );

        add_action( 'wp_ajax_mpp_update_impressions', array( $this, 'update_impressions' ) );
        add_action( 'wp_ajax_nopriv_mpp_update_impressions', array( $this, 'update_impressions' ) );

        add_action( 'wp_ajax_mpp_update_submits', array( $this, 'update_submits' ) );
        add_action( 'wp_ajax_nopriv_mpp_update_submits', array( $this, 'update_submits' ) );

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Singleton
    |---------------------------------------------------------------------------------------------------
    */
    private function __clone(){
    }//Stopping Clonning of Object

    private function __wakeup(){
    }//Stopping unserialize of object

    public static function get_instance( $plugin = null ){
        if( null === self::$instance ){
            self::$instance = new self( $plugin );
        }
        return self::$instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Valida Plugin Nonce Ajax
    |---------------------------------------------------------------------------------------------------
    */
    public function is_valid_nonce( $nonce = 'mpp_ajax_nonce' ){
        if( ! isset( $_POST['ajax_nonce'] ) || ! wp_verify_nonce( $_POST['ajax_nonce'], $nonce ) ){
            return false;
        }
        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get video thumbnail
    |---------------------------------------------------------------------------------------------------
    */
    public function get_video_thumbnail(){
        $response = array();
        $response['success'] = false;
        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        $thumbnail = '';
        if( isset( $_POST['values'] ) ){
            $video_type = isset( $_POST['values']['e-video-type'] ) ? sanitize_text_field( $_POST['values']['e-video-type'] ) : 'html5';
            if( $video_type == 'youtube' || $video_type == 'vimeo' ){
                $video_url = isset( $_POST['values']['e-content-video'] ) ? esc_url( $_POST['values']['e-content-video'] ) : '';
                $thumbnail = Player::get_image( $video_url );
            }
        }
        $thumbnail = empty( $thumbnail ) ? MPP_URL . 'assets/admin/images/default-video.png' : $thumbnail;
        $response['success'] = true;
        $response['thumbnail'] = $thumbnail;
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna la biblioteca de íconos
    |---------------------------------------------------------------------------------------------------
    */
    public function get_icons_library(){
        $response = array();
        $response['success'] = false;
        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }
        $items = array();
        $use_icon_fonts = true;
        $use_svg = true;
        if( isset( $_POST['icon_font'] ) && ( $_POST['icon_font'] == false || $_POST['icon_font'] == 'false' ) ){
            $use_icon_fonts = false;
        }
        if( isset( $_POST['svg'] ) && ( $_POST['svg'] == false || $_POST['svg'] == 'false' ) ){
            $use_svg = false;
        }

        if( $use_icon_fonts ){
            $items = Assets::font_awesome_icons();
        }
        if( $use_svg ){
            $items = array_merge( Assets::svg_icons(), $items );
        }
        $group_index = -1;
        if( isset( $_POST['index'] ) ){
            $group_index = sanitize_text_field( $_POST['index'] );
        }

        $return = '<div class="xbox-row xbox-clearfix xbox-type-icon_selector" data-group-index="' . $group_index . '">';
        $return .= '<div class="xbox-content xbox-clearfix">';
        $return .= '<div class="xbox-field">';
        $return .= "<div class='xbox-icon-actions xbox-clearfix'>";
        $return .= "<div class='xbox-icon-active xbox-item-icon-selector'>";
        $return .= "</div>";
        $return .= "<input type='text' class='xbox-search-icon' placeholder='Search icon...'>";
        $return .= "<a class='xbox-btn xbox-btn-small xbox-btn-teal' data-search='all'>All</a>";
        if( $use_icon_fonts ){
            $return .= "<a class='xbox-btn xbox-btn-small xbox-btn-teal' data-search='font'>Icon font</a>";
        }
        if( $use_svg ){
            $return .= "<a class='xbox-btn xbox-btn-small xbox-btn-teal' data-search='.svg'>SVG</a>";
        }
        $return .= "</div>";//.xbox-icon-actions

        $data = json_encode( array(
            'active_class' => 'xbox-active'
        ) );
        $return .= "<div class='xbox-icons-wrap xbox-clearfix' data-options='{$data}'>";
        $icons_html = '';
        foreach( $items as $value => $icon ){
            $key = 'font ' . $value;
            $type = 'icon font';
            if( Functions::ends_with( '.svg', $value ) ){
                $type = 'svg';
                $key = explode( '/', $value );
                $key = end( $key );
                $font_size = 'inherit';
            } else{
                $font_size = ( 45 - 14 ) . 'px';//14 = padding vertical + border vertical
            }
            $icons_html .= "<div class='xbox-item-icon-selector' data-value='$value' data-key='$key' data-type='$type' style='width: 50px; height: 50px; font-size: {$font_size}'>";
            $icons_html .= $icon;
            $icons_html .= "</div>";
        }
        if( $icons_html ){
            $return .= $icons_html;
        } else{
            $return .= __( 'Not icons found', 'masterpopups' );
        }
        $return .= "</div>";//.xbox-icons-wrap
        $return .= "</div>";//.xbox-field
        $return .= "</div>";//.xbox-content
        $return .= "</div>";//.xbox-row

        echo $return;
        wp_die();
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba la integración con un servicio
    |---------------------------------------------------------------------------------------------------
    */
    public function connect_service(){
        $response = array();
        $response['success'] = false;
        $success_message = __( 'Service connected successfully, please save changes.', 'masterpopups' );
        $error_message = __( 'Invalid access data, please try again.', 'masterpopups' );

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'], $_POST['api_key'], $_POST['token'], $_POST['url'], $_POST['email'] ) ){
            $response['message'] = __( 'Data is missing to authenticate service', 'masterpopups' );
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );
        $service = Services::get_instance( $post_service, array(
            'api_key' => sanitize_text_field( $_POST['api_key'] ),
            'token' => sanitize_text_field( $_POST['token'] ),
            'url' => esc_url( $_POST['url'] ),
            'email' => sanitize_email( $_POST['email'] ),
            'password' => wp_unslash( $_POST['password'] ),
        ) );

        if( is_object( $service ) ){
            if( $service->is_connect() ){
                $response['success'] = true;
                $response['message'] = $success_message;
                Functions::send_message( 'Service integration = ' . $post_service );
            } else{
                $response['message'] = $error_message;
                if( $service->error && is_string( $service->error ) ){
                    $response['message'] = $response['message'] . "<br />" . $service->error;
                }
            }
        } else{
            $response['message'] = $service;
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene los campos personalizados de un servicio
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_fields_service(){
        $response = array();
        $response['success'] = false;
        $success_message = __( 'Successful process, the previous custom fields have been found.', 'masterpopups' );
        $error_message = __( 'No custom fields found, perhaps this service not have custom fields.', 'masterpopups' );

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'], $_POST['api_key'], $_POST['token'], $_POST['url'], $_POST['email'] ) ){
            $response['message'] = __( 'Data is missing to authenticate service', 'masterpopups' );
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );
        $service = Services::get_instance( $post_service, array(
            'api_key' => sanitize_text_field( $_POST['api_key'] ),
            'token' => sanitize_text_field( $_POST['token'] ),
            'url' => esc_url( $_POST['url'] ),
            'email' => sanitize_email( $_POST['email'] ),
            'password' => wp_unslash( $_POST['password'] ),
        ) );

        $list_id = isset( $_POST['list_id'] ) ? sanitize_text_field( $_POST['list_id'] ) : '';

        if( is_object( $service ) ){
            if( $service->is_connect() ){
                $response['success'] = true;
                $service->set_list_id( $list_id );//No verificar porque algunos servicios devuelven los campos sin id de lista
                $response['custom_fields'] = array_merge(
                    array_values( $service->get_default_fields() ),
                    array_values( $service->get_custom_fields() )
                );
                if( count( $response['custom_fields'] ) >= 1 ){
                    $response['message'] = $success_message;
                } else{
                    $response['success'] = false;
                    $response['message'] = $error_message;
                }
            } else{
                $response['message'] = __( 'Impossible to connect with the service, please try again.', 'masterpopups' );
            }
        } else{
            $response['message'] = $service;
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene las listas de un servicio
    |---------------------------------------------------------------------------------------------------
    */
    public function get_lists_service(){
        $response = array();
        $response['success'] = false;

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'] ) ){
            $response['message'] = __( 'Data is missing to get lists', 'masterpopups' );
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );
        $account_id = isset( $_POST['account_id'] ) ? sanitize_text_field( $_POST['account_id'] ) : '';

        //Account ID (Drip integration)
        if( $post_service == 'drip' && empty( $_POST['account_id'] ) ){
            $response['message'] = 'Please select Account ID';
            wp_send_json( $response );
        }


        $services = $this->plugin->options_manager->get_integrated_services( true, true );
        if( empty( $services ) ){
            $response['message'] = __( 'There are no services connected.', 'masterpopups' );
            wp_send_json( $response );
        }

        $service = Services::get_instance( $post_service, array(
            'api_key' => $services[$post_service]['service-api-key'],
            'token' => $services[$post_service]['service-token'],
            'url' => $services[$post_service]['service-url'],
            'email' => $services[$post_service]['service-email'],
            'password' => $services[$post_service]['service-password'],//no agregar wp_unslash
        ) );

        if( is_object( $service ) ){
            if( $service->is_connect() ){
                $response['success'] = true;
                $response['lists'] = $service->get_lists( array( 'account_id' => $account_id ) );
                if( count( $response['lists'] ) >= 1 ){
                    $response['message'] = __( 'Successful process, the following lists have been found:', 'masterpopups' );
                } else{
                    $response['message'] = __( 'Could not find lists, maybe this service does not have lists or does not allow to obtain them through its API. Please get your list id on the website of the service.', 'masterpopups' );
                }
            } else{
                $response['message'] = __( 'Unable to get the lists because we could not connect with the service, please try again.', 'masterpopups' );
            }
        } else{
            $response['message'] = $service;
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si una lista de un servicio es correcta
    |---------------------------------------------------------------------------------------------------
    */
    public function check_list_id_service(){
        $response = array();
        $response['success'] = false;
        $response['connected'] = false;

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'] ) || ! isset( $_POST['list_id'] ) ){
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );
        $list_id = sanitize_text_field( $_POST['list_id'] );
        $account_id = isset( $_POST['account_id'] ) ? sanitize_text_field( $_POST['account_id'] ) : '';

        $services = $this->plugin->options_manager->get_integrated_services( true, true );

        if( empty( $services ) ){
            wp_send_json( $response );
        }

        $service = Services::get_instance( $post_service, array(
            'api_key' => $services[$post_service]['service-api-key'],
            'token' => $services[$post_service]['service-token'],
            'url' => $services[$post_service]['service-url'],
            'email' => $services[$post_service]['service-email'],
            'password' => $services[$post_service]['service-password'],//no agregar wp_unslash
        ) );

        if( is_object( $service ) ){
            $all_services = Services::get_all();
            $allow_get_lists = $all_services[$post_service]['allow']['get_lists'];
            if( $allow_get_lists ){
                if( $service->is_connect() ){
                    $response['connected'] = true;
                    if( $service->set_list_id( $list_id, true, array( 'account_id' => $account_id ) ) ){
                        $response['success'] = true;
                    }
                }
            } else{
                $response['connected'] = true;
                $response['success'] = true;
            }
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Drip accounts
    |---------------------------------------------------------------------------------------------------
    */
    public function get_drip_accounts(){
        $response = array();
        $response['success'] = false;

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'] ) ){
            $response['message'] = 'Data is missing. Service is required';
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );

        $services = $this->plugin->options_manager->get_integrated_services( true, true );
        if( empty( $services ) ){
            $response['message'] = __( 'There are no services connected.', 'masterpopups' );
            wp_send_json( $response );
        }

        $service = Services::get_instance( sanitize_text_field( $post_service ), array(
            'api_key' => sanitize_text_field( $services[$post_service]['service-api-key'] ),
        ) );

        if( is_object( $service ) ){
            if( $service->is_connect() ){
                $response['success'] = true;
                $response['accounts'] = $service->get_accounts();
                if( count( $response['accounts'] ) >= 1 ){
                    $response['message'] = 'OK';
                } else{
                    $response['success'] = false;
                    $response['message'] = 'No accounts found';
                }
            } else{
                $response['message'] = __( 'Impossible to connect with the service, please try again.', 'masterpopups' );
            }
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Newsman segments
    |---------------------------------------------------------------------------------------------------
    */
    public function get_newsman_segments(){
        $response = array();
        $response['success'] = false;

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['service'] ) ){
            $response['message'] = 'Data is missing. Service is required';
            wp_send_json( $response );
        }
        $post_service = sanitize_text_field( $_POST['service'] );

        if( empty( $_POST['list_id'] ) ){
            $response['message'] = 'Data is missing. List ID is required';
            wp_send_json( $response );
        }
        $list_id = sanitize_text_field( $_POST['list_id'] );

        $services = $this->plugin->options_manager->get_integrated_services( true, true );
        if( empty( $services ) ){
            $response['message'] = __( 'There are no services connected.', 'masterpopups' );
            wp_send_json( $response );
        }

        $service = Services::get_instance( $post_service, array(
            'api_key' => $services[$post_service]['service-api-key'],
            'token' => $services[$post_service]['service-token'],//user id
        ) );

        if( is_object( $service ) ){
            if( $service->is_connect() ){
                $response['success'] = true;
                $response['segments'] = $service->get_segments( $list_id );
                if( count( $response['segments'] ) >= 1 ){
                    $response['message'] = 'OK';
                } else{
                    $response['success'] = false;
                    $response['message'] = 'No segments found';
                }
            } else{
                $response['message'] = __( 'Impossible to connect with the service, please try again.', 'masterpopups' );
            }
        }
        wp_send_json( $response );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si una lista de un servicio es correcta
    |---------------------------------------------------------------------------------------------------
    */
    public function mpp_delete_subscriber(){
        $response = array();
        $response['success'] = false;
        $response['message'] = __( 'Error: Unable to delete subscriber.', 'masterpopups' );

        if( ! $this->is_valid_nonce( 'xbox_ajax_nonce' ) ){
            die();
        }

        if( ! isset( $_POST['email'] ) || ! isset( $_POST['audience_id'] ) ){
            wp_send_json( $response );
        }
        $audience = get_post( sanitize_text_field( $_POST['audience_id'] ) );
        if( $audience ){
            $email = sanitize_email( $_POST['email'] );
            $subscribers = (array) get_post_meta( $audience->ID, 'mpp_subscribers', true );
            if( isset( $subscribers[$email] ) ){
                unset( $subscribers[$email] );
                update_post_meta( $audience->ID, 'mpp_subscribers', $subscribers );
                $total_subscribers = (int) get_post_meta( $audience->ID, 'mpp_total-subscribers', true );
                update_post_meta( $audience->ID, 'mpp_total-subscribers', --$total_subscribers );
                $response['success'] = true;
                $response['message'] = __( 'Subscriber successfully deleted.', 'masterpopups' );
                $response['total'] = $total_subscribers;
            }
        }
        wp_send_json( $response );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Suscribir usuario
    |---------------------------------------------------------------------------------------------------
    */
    public function subscribe_user(){
        if( ! $this->is_valid_nonce( 'mpp_ajax_nonce' ) ){
            die();
        }
        $subscription = new Subscription( $this->plugin, $_POST );
        if( $subscription->has_fields() ){
            $subscription->execute();
        }
        wp_send_json( $subscription->result );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Enviar formulario de contacto
    |---------------------------------------------------------------------------------------------------
    */
    public function send_contact_form(){
        if( ! $this->is_valid_nonce( 'mpp_ajax_nonce' ) ){
            die();
        }
        $contact_form = new ContactForm( $this->plugin, $_POST );
        if( $contact_form->has_fields() ){
            $contact_form->execute();
        }
        wp_send_json( $contact_form->result );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Actualiza las impresiones de un popup
    |---------------------------------------------------------------------------------------------------
    */
    public function update_impressions(){
        if( ! $this->is_valid_nonce( 'mpp_ajax_nonce' ) ){
            die();
        }
        if( ! isset( $_POST['popup_id'] ) || ! $this->plugin->is_published_popup( sanitize_text_field( $_POST['popup_id'] ) ) ){
            die();
        }
        $result = array();
        $result['success'] = false;
        $popup_id = sanitize_text_field( $_POST['popup_id'] );
        $restore = isset( $_POST['restore'] ) ? sanitize_text_field( $_POST['restore'] ) : false;

        if( $restore == '1' || $restore == 'true' || $restore === true ){
            $impressions = 0;
            update_post_meta( $popup_id, 'mpp_impressions', 0 );
        } else{
            $impressions = (int) get_post_meta( $popup_id, 'mpp_impressions', true );
            update_post_meta( $popup_id, 'mpp_impressions', ++$impressions );
        }
        $result['success'] = true;
        $result['impressions'] = $impressions;
        wp_send_json( $result );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Actualiza los envíos del formulario de un popup
    |---------------------------------------------------------------------------------------------------
    */
    public function update_submits(){
        if( ! $this->is_valid_nonce( 'mpp_ajax_nonce' ) ){
            die();
        }
        if( ! isset( $_POST['popup_id'] ) || ! $this->plugin->is_published_popup( sanitize_text_field( $_POST['popup_id'] ) ) ){
            die();
        }
        $result = array();
        $result['success'] = false;
        $popup_id = sanitize_text_field( $_POST['popup_id'] );

        $submits = (int) get_post_meta( $popup_id, 'mpp_submits', true );
        update_post_meta( $popup_id, 'mpp_submits', ++$submits );

        $result['success'] = true;
        $result['submits'] = $submits;
        wp_send_json( $result );
    }


}
