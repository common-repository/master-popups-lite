<?php namespace MasterPopups\Includes;

class Popups {
    public $version;
    public $plugin = null;
    private static $instance = null;
    public static $popups_loaded = false;
    public static $resources_loaded_in_footer = false;
    public static $resources_loaded_in_header = false;
    private static $popups = array();
    private $all_fonts = array();

    private function __construct( $plugin = null ){
        $this->plugin = $plugin;
        $this->hooks();
        $this->add_popups();
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

    public static function init( $plugin = null ){
        if( null === self::$instance ){
            self::$instance = new self( $plugin );
        }
        return self::$instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Hooks
    |---------------------------------------------------------------------------------------------------
    */
    private function hooks(){
        add_action( 'wp_head', array( $this, 'load_resources_in_header' ), 9 );
        add_action( 'wp_footer', array( $this, 'load_resources_in_footer' ), 9 );
        add_action( 'admin_head', array( $this, 'load_resources_in_header' ), 9 );
        add_action( 'admin_footer', array( $this, 'load_resources_in_footer' ), 9 );

        add_action( 'admin_footer', array( $this, 'add_popups_to_admin_footer' ), 10 );
        add_action( 'wp_footer', array( $this, 'add_popups_to_footer' ), 10 );


    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega una instancia de Popup
    |---------------------------------------------------------------------------------------------------
    */
    public static function add( $popup ){
        if( is_a( $popup, 'MasterPopups\Includes\Popup' ) ){
            self::$popups[$popup->id] = $popup;
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene una instancia de Popup
    |---------------------------------------------------------------------------------------------------
    */
    public static function get( $popup_id = 0 ){
        $plugin = \MasterPopups::get_instance();
        if( ! $plugin->is_valid_popup( $popup_id ) ){
            return null;
        }
        $popup = null;
        if( ! isset( self::$popups[$popup_id] ) ){
            $popup = new Popup( $plugin, array(
                'id' => $popup_id
            ) );
            self::add( $popup );
        }
        if( isset( self::$popups[$popup_id] ) ){
            return self::$popups[$popup_id];
        }
        return $popup;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene todos los popups creados
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_all_popups(){
        return self::$popups;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Agrega todos los popups
    |---------------------------------------------------------------------------------------------------
    */
    public function add_popups(){
        if( Functions::is_post_page() ){//not add on admin edit and new post
            return;
        }
        $posts = get_posts( array(
            'post_type' => $this->plugin->post_types['popups'],
            'post_status' => 'publish',
            'posts_per_page' => -1
        ) );
        foreach( $posts as $post ){
            $popup = new Popup( $this->plugin, array(
                'id' => $post->ID,
            ) );
            self::add( $popup );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Carga de recursos en header
    |---------------------------------------------------------------------------------------------------
    */
    public function load_resources_in_header(){
        if( self::$resources_loaded_in_header ){
            return;
        }
        self::$resources_loaded_in_header = true;

        $return = "";
        $version = $this->plugin->arg( 'version' );
        $return .= "\n\n<!-- MPP:MasterPopups v$version -->";
        $return .= "\n\n<!-- MPP:MasterPopups:Header -->";
        $return .= "\n<style>";
        $return .= "\n/* Custom CSS*/\n";
        $return .= Settings::option( 'custom-css' );
        $return .= "\n</style>";

        $return .= "\n<";
        $return .= "script type='text/javascript'>";
        $return .= "\n var MPP_POPUP_OPTIONS = {};";
        $return .= "\n var MPP_POPUP_DISPLAY_OPTIONS = {};";
        $return .= "\n</script>";
        $return .= "\n<!-- MPP:MasterPopups:Header End -->\n\n";
        echo $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Carga de recursos en footer
    |---------------------------------------------------------------------------------------------------
    */
    public function load_resources_in_footer(){
        if( self::$resources_loaded_in_footer ){
            return;
        }
        self::$resources_loaded_in_footer = true;

        $script_content = "";
        if( is_admin() ){
            if( Functions::is_post_page( 'edit' ) && $this->plugin->is_valid_popup( Functions::post_id() ) ){
                $popup = self::get( Functions::post_id() );
                $popups_to_load = array_merge( array( Functions::post_id() ), $popup->get_other_popups() );
                $popups_to_load = array_filter( array_unique( $popups_to_load ) );
                foreach( $popups_to_load as $popup_id ){
                    $popup = self::get( $popup_id );
                    if( $popup ){
                        $script_content .= $popup->get_display_options();
                        $script_content .= $popup->get_js_options();
                    }
                }
            }
        } else{
            foreach( self::$popups as $popup_id => $popup ){
                if( $popup->is_on() ){//Sólo mostrar cuando el status está en true
                    $script_content .= $popup->get_display_options();
                }
                if( $popup->is_on() && $popup->should_display() ){
                    $script_content .= $popup->get_js_options();
                }
            }
        }

        $script_content .= "\n\n/* Custom JS */\n";
        $script_content .= Settings::option( 'custom-javascript' );

        $return = "\n\n<!-- MPP:MasterPopups:Footer -->";
        $return .= "\n<";
        $return .= "script type='text/javascript'>";
        $return .= $script_content;
        $return .= "\n</script>";
        $return .= "\n<!-- MPP:MasterPopups:Footer End -->\n\n";
        echo $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Inserta popups al final de todas las páginas
    |---------------------------------------------------------------------------------------------------
    */
    public function add_popups_to_footer(){
        if( self::$popups_loaded ){
            return;
        }
        self::$popups_loaded = true;

        $print = '';
        $all_popups = '';
        foreach( self::$popups as $popup ){
            if( $popup->is_on() && $popup->should_display() ){
                $all_popups .= $popup->build();
                $this->all_fonts[$popup->id] = $popup->fonts;
            }
        }

        $print .= "\n\n<!-- MPP:MasterPopups:Popups -->\n";
        $print .= $all_popups;
        $print .= "\n\n" . $this->get_link_google_fonts();
        $print .= "\n\n<!-- MPP:MasterPopups:Popups End -->\n\n";

        echo $print;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Inserta popups al final de las páginas de edición
    |---------------------------------------------------------------------------------------------------
    */
    public function add_popups_to_admin_footer(){
        $print = '';
        $all_popups = '';

        if( Functions::is_post_page( 'edit' ) && $this->plugin->is_valid_popup( Functions::post_id() ) ){
            $popup = self::get( Functions::post_id() );
            $popups_to_load = array_merge( array( Functions::post_id() ), $popup->get_other_popups() );
            $popups_to_load = array_filter( array_unique( $popups_to_load ) );
            foreach( $popups_to_load as $popup_id ){
                $popup = self::get( $popup_id );
                if( $popup ){
                    $all_popups .= $popup->build();
                    $this->all_fonts[$popup_id] = $popup->fonts;
                }
            }

            $print .= "\n\n<!-- MPP:MasterPopups:Popups -->\n";
            $print .= $all_popups;
            $print .= $this->get_link_google_fonts();
            $print .= "\n\n<!-- MPP:MasterPopups:Popups End -->\n\n";
        }
        echo $print;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get link google fonts
    |---------------------------------------------------------------------------------------------------
    */
    public function get_link_google_fonts(){
        if( Functions::is_empty( $this->all_fonts ) || 'off' == Settings::option( 'load-google-fonts' ) ){
            return '';
        }

        $google_fonts = array();
        foreach( $this->all_fonts as $popup_id => $fonts ){
            $google_fonts = empty( $google_fonts ) ? $fonts : array_merge_recursive( $google_fonts, $fonts );
        }
        //Unique values
        foreach( $google_fonts as $font_family => $font_weights ){
            $google_fonts[$font_family] = array_values( array_unique( array_filter( $font_weights ) ) );
        }

        $href = Functions::url_google_fonts( $google_fonts, array_values( Assets::local_fonts() ) );
        return '<link class="mpp-google-fonts" href="' . $href . '" rel="stylesheet" type="text/css">';
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Link Powered by
    |---------------------------------------------------------------------------------------------------
    */
    public static function build_link_powered_by(){
        if( ! is_admin() && Settings::option( 'link-powered-by-enabled' ) == 'on' ){
            $return = '<div class="mpp-wrap-link-powered-by">';
            $username = Settings::option( 'link-powered-by-username' );
            if( empty( $username ) ){
                $username = 'codexhelp';
            }
            $link_powered_by = "https://codecanyon.net/item/masterpopups-multipurpose-popup-plugin-for-wordpress-with-easy-email-marketing-integration/20142807?ref=$username";
            $text_powered_by = "Powered by <span>Master Popups</span>";
            $return .= '<a href="' . $link_powered_by . '" target="_blank" class="mpp-link-powered-by">' . $text_powered_by . '</a>';
            return $return . '</div>';
        }
        return '';
    }

}
