<?php namespace MasterPopups\Includes;

class AssetsLoader {
    public $plugin;
    public $admin_url = '';
    public $public_url = '';
    protected static $instance = null;

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    private function __construct( $plugin ){
        $this->plugin = $plugin;
        $this->admin_url = MPP_URL . 'assets/admin/';
        $this->public_url = MPP_URL . 'assets/public/';
        $this->libs_url = MPP_URL . 'libs/';

        add_action( 'admin_enqueue_scripts', array( $this, 'add_admin_scripts' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'add_admin_styles' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_public_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_public_styles' ) );

        add_filter( "autoptimize_filter_js_exclude", array( $this, 'autoptimize_filter_js_exclude' ), 10, 1 );
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
    | Add admin scripts
    |---------------------------------------------------------------------------------------------------
    */
    public function add_admin_scripts( $hook ){
        if( ! $this->should_add() ){
            return;
        }

        //Wordpress scripts
        $deps_scripts = array( 'xbox', 'jquery', 'jquery-ui-core', 'jquery-ui-sortable', 'jquery-ui-resizable', 'jquery-ui-draggable' );
        if( function_exists( 'wp_enqueue_media' ) ){
            wp_enqueue_media();
        } else{
            wp_enqueue_script( 'media-upload' );
        }


        //Plugin scripts
        wp_register_script( 'mpp-admin', $this->admin_url . 'js/mpp-admin.js', $deps_scripts, MPP_VERSION );
        wp_enqueue_script( 'mpp-admin' );

        wp_register_script( 'mc-editor', $this->admin_url . 'js/mc-editor.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mc-editor' );

        wp_register_script( 'mpp-element-content', $this->admin_url . 'js/mpp-element-content.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-element-content' );

        wp_register_script( 'mpp-popup-editor', $this->admin_url . 'js/mpp-popup-editor.js', array( 'mpp-admin', 'mc-editor', 'mpp-element-content' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-popup-editor' );

        wp_register_script( 'mpp-onchange', $this->admin_url . 'js/mpp-onchange.js', array( 'mpp-admin', 'mpp-element-content' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-onchange' );

        wp_register_script( 'mpp-integrations', $this->admin_url . 'js/mpp-integrations.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-integrations' );

        wp_register_script( 'mpp-audience-lists', $this->admin_url . 'js/mpp-audience-lists.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-audience-lists' );

        wp_register_script( 'mpp-datatable', $this->libs_url . 'dataTables/dataTables.all.min.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-datatable' );

        wp_register_script( 'mpp-filter', $this->libs_url . 'Filterizr/jquery.filterizr.min.js', array( 'mpp-admin' ), MPP_VERSION );
        wp_enqueue_script( 'mpp-filter' );

        wp_localize_script( 'mpp-admin', 'MPP_ADMIN_JS', $this->admin_localization() );

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Add admin styles
    |---------------------------------------------------------------------------------------------------
    */
    public function add_admin_styles( $hook ){
        wp_register_style( 'ampp-general', $this->admin_url . 'css/ampp-general.css', array(), MPP_VERSION );
        wp_enqueue_style( 'ampp-general' );

        if( ! $this->should_add() ){
            return;
        }

        wp_register_style( 'ampp', $this->admin_url . 'css/ampp.css', array(), MPP_VERSION );
        wp_enqueue_style( 'ampp' );

        wp_register_style( 'mpp-datatable', $this->libs_url . 'dataTables/css/jquery.dataTables.min.css', array(), MPP_VERSION );
        wp_enqueue_style( 'mpp-datatable' );

        $this->add_public_styles();
        $this->add_public_scripts();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe agregar scripts y estilos
    |---------------------------------------------------------------------------------------------------
    */
    private function should_add(){
        global $current_screen;
        if( in_array( $current_screen->post_type, $this->plugin->post_types ) ){
            return true;
        }
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Add public scripts
    |---------------------------------------------------------------------------------------------------
    */
    public function add_public_scripts(){
        //Plugin scripts
        wp_register_script( 'master-popups', $this->public_url . 'js/master-popups.min.js', array( 'jquery' ), MPP_VERSION );
        wp_enqueue_script( 'master-popups' );

        wp_localize_script( 'master-popups', 'MPP_PUBLIC_JS', $this->public_localization() );

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Add public styles
    |---------------------------------------------------------------------------------------------------
    */
    public function add_public_styles(){
        wp_register_style( 'master-popups', $this->public_url . 'css/master-popups.min.css', array(), MPP_VERSION );
        wp_enqueue_style( 'master-popups' );

        if( 'on' == Settings::option( 'load-font-awesome' ) ){
            wp_register_style( 'mpp-font-awesome', $this->public_url . 'css/font-awesome.css', array(), MPP_VERSION );
            wp_enqueue_style( 'mpp-font-awesome' );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | WP admin_Localization
    |---------------------------------------------------------------------------------------------------
    */
    public function admin_localization(){
        $l10n = array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'ajax_nonce' => wp_create_nonce( 'mpp_admin_ajax_nonce' ),
            'local_fonts' => array_values( Assets::local_fonts() ),
            'google_fonts' => array_values( Assets::google_fonts() ),
            'text' => array(
                'proversion' => Settings::pro_version_text_message(),
                'saving_changes' => __( 'Saving changes', 'masterpopups' ),
                'please_wait' => __( 'Please wait a moment', 'masterpopups' ),
                'replacing_styles' => __( 'Replacing Styles', 'masterpopups' ),
                'styles_copied' => __( 'Styles copied successfully', 'masterpopups' ),
                'object_library' => __( 'Object Library', 'masterpopups' ),
                'service_status' => array(
                    'on' => __( 'Connected', 'masterpopups' ),
                    'off' => __( 'Disconnected', 'masterpopups' ),
                ),
                'service' => array(
                    'please_connect' => __( 'Please connect with the service', 'masterpopups' ),
                    'integrated' => __( 'Integrated', 'masterpopups' ),
                    'integrate' => __( 'Integrate', 'masterpopups' ),
                    'status_on' => __( 'Connected', 'masterpopups' ),
                    'status_off' => __( 'Disconnected', 'masterpopups' ),
                    'disconnect_title' => __( 'Disconnect Service', 'masterpopups' ),
                    'disconnect_content' => __( 'Are you sure you want to disconnect account? If you disconnect, your previous campaigns syncing will be disconnected as well.', 'masterpopups' ),
                    'title_popup_get_lists' => _x( 'Lists', 'On search service lists', 'masterpopups' ),
                ),
            )
        );
        return $l10n;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | WP public_Localization
    |---------------------------------------------------------------------------------------------------
    */
    public function public_localization(){
        $l10n = array(
            'version' => MPP_VERSION,
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'ajax_nonce' => wp_create_nonce( 'mpp_ajax_nonce' ),
            'plugin_url' => MPP_URL,
            'is_admin' => is_admin(),
            'debug_mode' => Settings::option('debug-mode'),
            'integrated_services' => Settings::get_status_integrated_services(),
            'popups_z_index' => Settings::option('popups-z-index'),
            'enable_enqueue_popups' => Settings::option('enable-enqueue-popups'),
            'strings' => array(
                'back_to_form' => Settings::option('form-submission-back-to-form-text'),
                'close_popup' => Settings::option('form-submission-close-popup-text'),
                'validation' => array(
                    'general' => Settings::option('validation-msg-general'),
                    'email' => Settings::option('validation-msg-email'),
                    'checkbox' => Settings::option('validation-msg-checkbox'),
                    'dropdown' => Settings::option('validation-msg-dropdown'),
                ),

            )
        );
        return $l10n;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Exclude js files for Autoptimize plugin
    |---------------------------------------------------------------------------------------------------
    */
    public function autoptimize_filter_js_exclude( $exclude ){
        return $exclude.", js/master-popups.js, js/master-popups.min.js";
    }

}
