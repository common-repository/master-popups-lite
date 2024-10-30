<?php namespace MasterPopups\Includes;

class PopupOptions {
    public $options = array();
    protected static $prefix = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Acceso a cualquier opción
    |---------------------------------------------------------------------------------------------------
    */
    public function option( $option_name = '', $default_value = null ){
        $option_name = $this->get_option_name( $option_name );
        if( isset( $this->options[$option_name] ) ){
            return $this->options[$option_name];
        } else if( $default_value ){
            $this->options[$option_name] = $default_value;
            return $this->options[$option_name];
        }
        return null;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el nombre real de la opción
    |---------------------------------------------------------------------------------------------------
    */
    public function get_option_name( $name ){
        if( ! Functions::starts_with( self::$prefix, $name ) ){
            return self::$prefix . $name;
        }
        return $name;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get options
    |---------------------------------------------------------------------------------------------------
    */
    public function get_options(){
        return $this->options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Establece las opciones guardadas en la bd o sus valores por defecto
    |---------------------------------------------------------------------------------------------------
    */
    //Esta función se llama tres veces en admin
    //1.- class-options-manager.php -> build_popup_editor
    //2.- class-popups.php -> add_popups_to_admin_footer
    //3.- class-popups.php -> load_resources_in_footer

    //Esta función se llama dos veces en public
    //1.- class-popups.php -> add_popups
    //2.- class-popups.php -> load_resources_in_footer
    public function set_options( $options = array() ){
        $default_options = array(
            self::$prefix . 'id' => $this->id,
            self::$prefix . 'status' => 'on',
            self::$prefix . 'type' => 'modal',
        );

        //Set prefix
        foreach( $options as $key => $val ){
            $options[self::$prefix . $key] = $val;
            unset( $options[$key] );
        }

        $default_options = wp_parse_args( $options, $default_options );
        $default_options = wp_parse_args( $this->general_popup_options(), $default_options );
        $default_options = wp_parse_args( $this->overlay_options(), $default_options );
        $default_options = wp_parse_args( $this->trigger_options(), $default_options );
        $default_options = wp_parse_args( $this->target_options(), $default_options );
        $default_options = wp_parse_args( $this->form_submission_options(), $default_options );
        $default_options = wp_parse_args( $this->advanced_options(), $default_options );

        do_action( 'mpp_popup_before_set_options', $default_options, $this );
        $this->options = $default_options;
        $this->status = $this->option( 'status' );
        do_action( 'mpp_popup_after_set_options', $this->options, $this );

        $this->options = apply_filters( 'mpp_popup_options', $this->options, $this );

        return $this->options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega nuevas opciones
    |---------------------------------------------------------------------------------------------------
    */
    public function set_new_options( $options = array() ){
        foreach( $options as $name => $value ){
            $this->set_option_to( $this->options, $name, $value );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones generales del popup
    |---------------------------------------------------------------------------------------------------
    */
    public function general_popup_options(){
        $options = array();
        $this->set_option_to( $options, 'position', 'middle-center' );
        $this->set_option_to( $options, 'width', 640 );
        $this->set_option_to( $options, 'height', 360 );
        $this->set_option_to( $options, 'width_unit', 'px' );
        $this->set_option_to( $options, 'height_unit', 'px' );
        $this->set_option_to( $options, 'browser-width', 1000 );//1000
        $this->set_option_to( $options, 'browser-height', 580 );//480

        //Background
        $this->set_option_to( $options, 'bg-color', 'rgba(255,255,255,1)' );
        $this->set_option_to( $options, 'bg-repeat', 'no-repeat' );
        $this->set_option_to( $options, 'bg-size', 'cover' );
        $this->set_option_to( $options, 'bg-position', 'center center' );
        $this->set_option_to( $options, 'bg-image', '' );

        //Animations
        $this->set_option_to( $options, 'open-animation', 'mpp-zoomIn' );
        $this->set_option_to( $options, 'open-delay', '0' );
        $this->set_option_to( $options, 'open-duration', 800 );
        $this->set_option_to( $options, 'close-animation', 'mpp-zoomOut' );
        $this->set_option_to( $options, 'close-delay', '0' );
        $this->set_option_to( $options, 'close-duration', 700 );

        //Wordpress editor
        $this->set_option_to( $options, 'use-wp-editor', 'off' );
        $this->set_option_to( $options, 'html-code', '' );
        $this->set_option_to( $options, 'wp-editor', '' );
        $this->set_option_to( $options, 'wp-editor-auto-height', 'on' );
        $this->set_option_to( $options, 'wp-editor-padding', '20px 36px' );
        $this->set_option_to( $options, 'wp-editor-enable-font-color', 'off' );
        $this->set_option_to( $options, 'wp-editor-font-color', 'rgba(68, 68, 68, 1)' );
        $this->set_option_to( $options, 'wp-editor-enable-font-size', 'off' );
        $this->set_option_to( $options, 'wp-editor-font-size', '15' );

        $this->set_option_to( $options, 'close-icon-enable', 'on' );
        $this->set_option_to( $options, 'close-icon', 'mppfic-close-cancel-circular-2' );
        $this->set_option_to( $options, 'close-icon-size', '21' );
        $this->set_option_to( $options, 'close-icon-color', 'rgba(0,0,0,0.8)' );
        $this->set_option_to( $options, 'close-icon-color-hover', 'rgba(0,0,0,1)' );

        //Additional Settings
        $this->set_option_to( $options, 'placeholder-color', 'rgba(134,134,134,1)' );
        $this->set_option_to( $options, 'box-shadow', '0px 0px 16px 4px rgba(0,0,0,0.5)' );

        //Custom cookies
        $this->set_option_to( $options, 'custom-cookie-on-close', '' );
        $this->set_option_to( $options, 'custom-cookies', array() );


        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones de Overlay
    |---------------------------------------------------------------------------------------------------
    */
    public function overlay_options(){
        $options = array();
        $this->set_option_to( $options, 'overlay-show', 'on' );
        $this->set_option_to( $options, 'overlay-bg-color', 'rgba(0, 1, 5, 0.8)' );
        $this->set_option_to( $options, 'overlay-bg-repeat', 'no-repeat' );
        $this->set_option_to( $options, 'overlay-bg-size', 'cover' );
        $this->set_option_to( $options, 'overlay-bg-position', 'center center' );
        $this->set_option_to( $options, 'overlay-bg-image', '' );
        $this->set_option_to( $options, 'overlay-opacity', '1' );

        //Preloader
        $this->set_option_to( $options, 'preloader-show', 'on' );
        $this->set_option_to( $options, 'preloader-duration', 1000 );
        $this->set_option_to( $options, 'preloader-color-1', 'rgba(0,221,210,1)' );
        $this->set_option_to( $options, 'preloader-color-2', 'rgba(62,153,255,1)' );
        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones trigger
    |---------------------------------------------------------------------------------------------------
    */
    public function trigger_options(){
        $options = array();
        $this->set_option_to( $options, 'trigger-open-on-click-event', 'click' );
        $this->set_option_to( $options, 'trigger-open-on-click-custom-class', 'your-custom-class' );
        $this->set_option_to( $options, 'trigger-open-on-click-prevent-default', 'on' );

        $this->set_option_to( $options, 'trigger-open-on-load', 'off' );
        $this->set_option_to( $options, 'trigger-open-on-load-delay', 1 );
        $this->set_option_to( $options, 'cookie-on-load', 'off' );
        $this->set_option_to( $options, 'cookie-on-load-duration', 'days' );
        $this->set_option_to( $options, 'cookie-on-load-days', 7 );


        //Form submit cookies
        $this->set_option_to( $options, 'cookie-on-conversion', 'on' );
        $this->set_option_to( $options, 'cookie-on-conversion-duration', 'days' );
        $this->set_option_to( $options, 'cookie-on-conversion-days', 60 );

        //Close triggers
        $this->set_option_to( $options, 'trigger-close-on-click-overlay', 'on' );
        $this->set_option_to( $options, 'trigger-close-on-esc-keydown', 'on' );


        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones target
    |---------------------------------------------------------------------------------------------------
    */
    public function target_options(){
        $options = array();
        $this->set_option_to( $options, 'display-on-all-site', 'on' );
        $this->set_option_to( $options, 'display-on-homepage', 'on' );
        $this->set_option_to( $options, 'display-on-archive', 'on' );
        $this->set_option_to( $options, 'display-on-page', 'on' );
        $this->set_option_to( $options, 'display-on-page-include', '' );
        $this->set_option_to( $options, 'display-on-page-exclude', '' );
        $this->set_option_to( $options, 'display-on-post', 'on' );
        $this->set_option_to( $options, 'display-on-post-include', '' );
        $this->set_option_to( $options, 'display-on-post-exclude', '' );
        $this->set_option_to( $options, 'display-on-taxonomy-category', 'on' );
        $this->set_option_to( $options, 'display-on-taxonomy-category-terms', array() );
        $this->set_option_to( $options, 'display-on-taxonomy-post_tag', 'on' );
        $this->set_option_to( $options, 'display-on-taxonomy-post_tag-terms', array() );
        $this->set_option_to( $options, 'display-on-devices', array() );

        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones de envío de formulario
    |---------------------------------------------------------------------------------------------------
    */
    public function form_submission_options(){
        $options = array();
        $this->set_option_to( $options, 'form-submission-type', 'none' );
        //Formulario de suscripción
        $this->set_option_to( $options, 'audience-list', '' );
        $this->set_option_to( $options, 'subscription-ok-message', '' );
        $this->set_option_to( $options, 'subscription-error-message', '' );

        $this->set_option_to( $options, 'subscription-admin-notif', 'off' );
        $this->set_option_to( $options, 'subscription-admin-notif-from', 'Wordpress <' . get_option( 'admin_email' ) . '>' );
        $this->set_option_to( $options, 'subscription-admin-notif-to', '' );
        $this->set_option_to( $options, 'subscription-admin-notif-subject', 'New user subscription' );
        $this->set_option_to( $options, 'subscription-admin-notif-message', '' );

        $this->set_option_to( $options, 'subscription-user-notif', 'off' );
        $this->set_option_to( $options, 'subscription-user-notif-from', 'Wordpress <' . Functions::from_email( 'noreply' ) . '>' );
        $this->set_option_to( $options, 'subscription-user-notif-subject', 'Thank you for subscribing. This is your discount coupon' );
        $this->set_option_to( $options, 'subscription-user-notif-message', '' );

        //Formulario de contacto
        $this->set_option_to( $options, 'contact-form-ok-message', '' );
        $this->set_option_to( $options, 'contact-form-error-message', '' );

        $this->set_option_to( $options, 'contact-form-admin-notif', 'on' );
        $this->set_option_to( $options, 'contact-form-mail-from', 'Wordpress <' . get_option( 'admin_email' ) . '>' );
        $this->set_option_to( $options, 'contact-form-mail-to', '' );
        $this->set_option_to( $options, 'contact-form-mail-subject', 'New contact form submission' );
        $this->set_option_to( $options, 'contact-form-mail-message', '' );

        //Actions
        $this->set_option_to( $options, 'form-submission-ok-close-popup', 'on' );
        $this->set_option_to( $options, 'form-submission-ok-close-popup-delay', '3200' );
        $this->set_option_to( $options, 'form-submission-ok-open-popup-id', '' );
        $this->set_option_to( $options, 'form-submission-ok-download-file', 'off' );
        $this->set_option_to( $options, 'form-submission-ok-file', '' );
        $this->set_option_to( $options, 'form-submission-ok-redirect', 'off' );
        $this->set_option_to( $options, 'form-submission-ok-redirect-to', '' );
        $this->set_option_to( $options, 'form-redirections', array() );

        //Customize
        $this->set_option_to( $options, 'form-submission-font-size', 14 );
        $this->set_option_to( $options, 'form-submission-font-color', 'rgba(68, 68, 68, 1)' );
        $this->set_option_to( $options, 'form-submission-font-color-success', 'rgba(68, 68, 68, 1)' );
        $this->set_option_to( $options, 'form-submission-font-family', 'Roboto' );
        $this->set_option_to( $options, 'form-submission-border-width', 1 );
        $this->set_option_to( $options, 'form-submission-border-color', 'rgba(0, 181, 183, 1)' );
        $this->set_option_to( $options, 'form-submission-border-style', 'solid' );
        $this->set_option_to( $options, 'form-submission-bg-color', 'rgba(245, 245, 245, 1)' );
        $this->set_option_to( $options, 'form-submission-bg-image', '' );
        $this->set_option_to( $options, 'form-submission-footer-enable', 'on' );
        $this->set_option_to( $options, 'form-submission-footer-font-size', 13 );

        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opciones Avanzadas
    |---------------------------------------------------------------------------------------------------
    */
    public function advanced_options(){
        $options = array();
        $this->set_option_to( $options, 'status', 'on' );
        $this->set_option_to( $options, 'custom-css', '' );
        $this->set_option_to( $options, 'custom-javascript', '' );
        //$this->set_option_to( $options, 'callback-before-open', '' );
        $this->set_option_to( $options, 'callback-after-open', '' );
        //$this->set_option_to( $options, 'callback-before-close', '' );
        $this->set_option_to( $options, 'callback-after-close', '' );
        $this->set_option_to( $options, 'callback-after-form-submission', '' );
        return $options;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega opción al array de opciones
    |---------------------------------------------------------------------------------------------------
    */
    public function set_option_to( &$array = array(), $option_name, $default = '' ){
        //Prefijo es importante para que la importación funcione.
        $array[self::$prefix . $option_name] = $this->metabox->get_field_value( $option_name, $this->id, $default );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna las cookies creadas por el usuario
    |---------------------------------------------------------------------------------------------------
    */
    public function get_custom_cookies(){
        $saved_cookies = $this->option( 'custom-cookies' );
        $cookies = array();
        if( is_array( $saved_cookies ) ){
            foreach( $saved_cookies as $key => $value ){
                $cookies[$value[self::$prefix . 'name']] = array(
                    'name' => $value[self::$prefix . 'name'],
                    'enable' => $value[self::$prefix . 'enable'],
                    'duration' => $value[self::$prefix . 'duration'],
                    'days' => $value[self::$prefix . 'days'],
                    'days_unit' => $value[self::$prefix . 'days_unit'],
                    'behavior' => isset( $value[self::$prefix . 'behavior'] ) ? $value[self::$prefix . 'behavior'] : array(),
                );
            }
        }
        return $cookies;
    }

}
