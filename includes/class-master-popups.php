<?php

use MasterPopups\Includes\ClassAutoloader;
use MasterPopups\Includes\PluginLoader;
use MasterPopups\Includes\OptionsManager;
use MasterPopups\Includes\Functions;
use MasterPopups\Includes\Popup;
use MasterPopups\Includes\Popups;
use MasterPopups\Includes\Settings;
use MasterPopups\Includes\Services;

class MasterPopups {
    public static $args = array();
    protected static $instance = null;
    public $plugin = null;
    public $options_manager = null;
    public $plugin_loader = null;
    public $post_types = array();
    public $xbox_ids = array();
    public $settings_url = '';
    public $main_menu_item = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    private function __construct( $args = array() ){
        self::$args = $args;
        $this->plugin = $this;
        $this->post_types = $this->arg( 'post_types' );
        $this->xbox_ids = $this->arg( 'xbox_ids' );
        $this->main_menu_item = 'edit.php?post_type=' . $this->post_types['popups'];
        $this->hooks();

        $this->plugin_loader();
        $this->settings_url = Functions::post_type_url( $this->post_types['popups'], 'edit', array( 'page' => 'settings-master-popups' ) );
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

    public static function get_instance( $args = array() ){
        if( null === self::$instance ){
            self::$instance = new self( $args );
        }
        return self::$instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Plugin arguments
    |---------------------------------------------------------------------------------------------------
    */
    public function arg( $name = '', $key = '' ){
        if( isset( self::$args[$name] ) ){
            if( $key ){
                if( isset( self::$args[$name][$key] ) ){
                    return self::$args[$name][$key];
                } else{
                    return null;
                }
            }
            return self::$args[$name];
        }
        return null;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Plugin loader
    |---------------------------------------------------------------------------------------------------
    */
    private function plugin_loader(){
        include dirname( __FILE__ ) . '/class-autoloader.php';
        ClassAutoloader::run();

        $this->plugin_loader = PluginLoader::get_instance( $this );
        $this->options_manager = $this->plugin_loader->options_manager;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Plugin hooks
    |---------------------------------------------------------------------------------------------------
    */
    private function hooks(){
        $popups = $this->post_types['popups'];
        $lists = $this->post_types['lists'];
        add_action( 'init', array( $this, 'create_post_types' ) );
        add_action( 'admin_menu', array( $this, 'add_submenu_pages' ), 10 );
        add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
        add_action( 'wp_loaded', array( $this, 'register_popups' ) );
        add_shortcode( 'mpp_popup', array( $this, 'trigger_popup' ) );
        add_shortcode( 'mpp_inline', array( $this, 'inline_popup' ) );
        add_action( 'admin_notices', array( $this, 'create_top_bar' ), 1 );
        add_action( 'admin_notices', array( $this, 'check_version' ) );

        add_filter( "manage_edit-{$popups}_columns", array( $this, 'set_columns_popups' ) );
        add_action( "manage_{$popups}_posts_custom_column", array( $this, 'set_content_columns_popups' ), 10, 2 );

        add_filter( "manage_edit-{$lists}_columns", array( $this, 'set_columns_audience' ) );
        add_action( "manage_{$lists}_posts_custom_column", array( $this, 'set_content_columns_audience' ), 10, 2 );

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Plugins loaded hook
    |---------------------------------------------------------------------------------------------------
    */
    public function plugins_loaded(){
        $plugin_rel_path = trailingslashit( plugin_basename( MPP_DIR ) );
        $loaded = load_plugin_textdomain( 'masterpopups', false, $plugin_rel_path . 'languages/' );

        if( ! $loaded ){
            load_textdomain( 'masterpopups', MPP_DIR . 'languages/masterpopups-' . get_locale() . '.mo' );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Register Popups
    |---------------------------------------------------------------------------------------------------
    */
    public function register_popups(){
        Settings::init( $this );
        Popups::init( $this );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Labels for custom post types
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_post_type_labels( $menu_name, $plural, $singular, $all_items ){
        return array(
            'singular_name' => $singular,
            'name' => $plural,
            'menu_name' => $menu_name,
            'add_new' => sprintf( __( 'New %s', 'masterpopups' ), $singular ),
            'name_admin_bar' => sprintf( '%s', $singular ) . ' (' . $menu_name . ')',
            'all_items' => $all_items,
            'add_new_item' => sprintf( __( 'Add %s', 'masterpopups' ), $singular ),
            'new_item' => sprintf( __( 'New %s', 'masterpopups' ), $singular ),
            'edit_item' => sprintf( __( 'Edit %s', 'masterpopups' ), $singular ),
            'update_item' => sprintf( __( 'Update %s', 'masterpopups' ), $singular ),
            'view_item' => sprintf( __( 'View %s', 'masterpopups' ), $singular ),
            'view_items' => sprintf( __( 'View %s', 'masterpopups' ), $plural ),
            'search_items' => sprintf( __( 'Search %s', 'masterpopups' ), $plural ),
            'not_found' => sprintf( __( 'No %s found', 'masterpopups' ), $plural ),
            'not_found_in_trash' => sprintf( __( 'No %s found in Trash', 'masterpopups' ), $plural ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Labels for custom post types
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_post_type_args( $args ){
        if( is_null( $args['show_ui'] ) ){
            $args['show_ui'] = true;
            $settings = get_option( 'settings-master-popups' );
            $disable_roles = isset( $settings['disable-user-roles'] ) ? (array) $settings['disable-user-roles'] : array();

            //Excluir roles de usuarios que no pueden gestionar el custom post type
            if( is_user_logged_in() ){
                $user = wp_get_current_user();
                $role = $user->roles ? $user->roles[0] : false;
                if( in_array( $role, $disable_roles ) ){
                    $args['show_ui'] = false;
                }
            }
        }

        return array(
            'labels' => $args['labels'],
            'description' => '',
            'supports' => $args['supports'],
            'hierarchical' => false,
            'capability_type' => 'post',

            'public' => false,//dejar como falso
            'publicly_queryable' => false,//Permite que sea visible en el front-end. url.com/post-type/popup-slug
            'exclude_from_search' => true,
            'show_in_nav_menus' => false,
            'show_ui' => $args['show_ui'],
            'show_in_menu' => isset( $args['show_in_menu'] ) ? $args['show_in_menu'] : $args['show_ui'],

            'menu_position' => isset( $args['menu_position'] ) ? $args['menu_position'] : null,
            'menu_icon' => isset( $args['menu_icon'] ) ? $args['menu_icon'] : null,
            'show_in_admin_bar' => true,
            'can_export' => true,
            'has_archive' => false,
            'rewrite' => false,//para ocultar permalink al editar
            'delete_with_user' => false
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Add submenu pages
    |---------------------------------------------------------------------------------------------------
    */
    public function add_submenu_pages(){
        $singular = __( 'List', 'masterpopups' );
        $page_title = sprintf( __( 'New %s', 'masterpopups' ), $singular );
        $menu_title = $page_title;
        $menu_slug = Functions::post_type_url( $this->post_types['lists'], 'new' );
        add_submenu_page( $this->plugin->main_menu_item, $page_title, $menu_title, 'manage_options', $menu_slug );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Create custom post types
    |---------------------------------------------------------------------------------------------------
    */
    public function create_post_types(){
        $this->create_post_type_popups();
        $this->create_post_type_lists();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Post Type: popups
    |---------------------------------------------------------------------------------------------------
    */
    public function create_post_type_popups(){
        if ( post_type_exists( $this->post_types['popups'] ) ) {
            return;
        }

        //Popups
        $singular = __( 'Popup', 'masterpopups' );
        $plural = __( 'Popups', 'masterpopups' );
        $all_items = sprintf( __( 'All %s', 'masterpopups' ), $plural );
        $labels = $this->get_post_type_labels( $this->arg( 'menu_name' ), $plural, $singular, $all_items );
        $args = $this->get_post_type_args( array(
            'labels' => $labels,
            'public' => false,
            'supports' => array( 'title' ),
            'show_ui' => null,
            'show_in_menu' => true,
            'menu_position' => 20,
            'menu_icon' => MPP_URL . 'assets/admin/images/icon-plugin2.png',
        ) );
        register_post_type( $this->post_types['popups'], $args );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Post Type: popups
    |---------------------------------------------------------------------------------------------------
    */
    public function create_post_type_lists(){
        if ( post_type_exists( $this->post_types['lists'] ) ) {
            return;
        }

        //Lists
        $singular = __( 'List', 'masterpopups' );
        $plural = __( 'Lists', 'masterpopups' );
        $all_items = sprintf( __( 'All %s', 'masterpopups' ), $plural );
        $labels = $this->get_post_type_labels( $this->arg( 'name' ), $plural, $singular, $all_items );
        $args = $this->get_post_type_args( array(
            'labels' => $labels,
            'public' => false,
            'supports' => array( 'title' ),
            'show_ui' => null,
            'show_in_menu' => $this->main_menu_item,
            'menu_position' => null,
            'menu_icon' => null,
        ) );
        register_post_type( $this->post_types['lists'], $args );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Toolbar Menu
    |---------------------------------------------------------------------------------------------------
    */
    public function create_top_bar(){
        $return = '';
        if( ! Functions::is_admin_post_type_page( $this->post_types['popups'] ) ){
            return;
        }

        $return .= "<div class='ampp-topbar'>";
        $return .= "<ul class='ampp-topbar-menu'>";
        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='" . Functions::post_type_url( $this->post_types['popups'] ) . "'><i class='xbox-icon xbox-icon-folder-open'></i>" . __( 'All Popups', 'masterpopups' ) . "</a>";
        $return .= "</li>";

        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='" . Functions::post_type_url( $this->post_types['popups'], 'new' ) . "'><i class='xbox-icon xbox-icon-plus'></i>" . __( 'New Popup', 'masterpopups' ) . "</a>";
        $return .= "</li>";

        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='" . Functions::post_type_url( $this->post_types['lists'], 'edit' ) . "'><i class='xbox-icon xbox-icon-address-book'></i>" . __( 'All Lists', 'masterpopups' ) . "</a>";
        $return .= "</li>";

        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='" . Functions::post_type_url( $this->post_types['lists'], 'new' ) . "'><i class='xbox-icon xbox-icon-list'></i>" . __( 'New List', 'masterpopups' ) . "</a>";
        $return .= "</li>";

        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='" . Functions::post_type_url( $this->post_types['popups'], 'edit', array( 'page' => 'settings-master-popups' ) ) . "'><i class='xbox-icon xbox-icon-cog'></i>" . __( 'General Settings', 'masterpopups' ) . "</a>";
        $return .= "</li>";

        $return .= "<li class='ampp-topbar-item'>";
        $return .= "<a href='http://masterpopups.com/knowledge-base/' target='_blank'><i class='xbox-icon xbox-icon-file-text'></i>" . __( 'Documentation', 'masterpopups' ) . "</a>";
        $return .= "</li>";
        $return .= "</ul>";
        $return .= "</div>";
        echo $return;
    }

    /*
	|---------------------------------------------------------------------------------------------------
	| Comprueba la version del plugin
	|---------------------------------------------------------------------------------------------------
	*/
    public function check_version(){
        if( version_compare( MPP_VERSION, '2.2.9', '>=' ) ){
            $link_powered_by = Settings::option( 'link-powered-by-enabled' );
            $option = get_option( 'mpp_version' );
            if( ! $option ){
                update_option( 'mpp_version', array(
                    'version' => MPP_VERSION,
                    'link_powered_by' => $link_powered_by
                ) );
            } else{
                if( $link_powered_by == 'off' && isset( $option['link_powered_by'] ) && $option['link_powered_by'] == 'on' ){
                    update_option( 'mpp_version', array(
                        'version' => MPP_VERSION,
                        'link_powered_by' => 'off'
                    ) );
                }
            }
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | On Activate
    |---------------------------------------------------------------------------------------------------
    */
    public static function on_activate(){

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | On Deactivate
    |---------------------------------------------------------------------------------------------------
    */
    public static function on_deactivate(){

    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Trigger Popup
    |---------------------------------------------------------------------------------------------------
    */
    public function trigger_popup( $atts = '', $content = null ){
        $atts = shortcode_atts( array(
            'id' => 0,
            'tag' => 'span',
            'class' => '',
        ), $atts );

        if( ! $this->is_published_popup( $atts['id'] ) ){
            return;
        }

        $popup = Popups::get( $atts['id'] );
        $trigger_content = '';
        if( $popup ){
            if( $popup->is_on() ){
                if( $popup->should_display() ){
                    $trigger_content = $popup->get_trigger_content( $content, $atts );
                }
            } else{
                //$trigger_content = __( 'Popup status is off', 'masterpopups' );
            }
        } else{
            $trigger_content = __( 'Popup not found', 'masterpopups' );
        }
        return $trigger_content;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Inline Popup
    |---------------------------------------------------------------------------------------------------
    */
    public function inline_popup( $atts = '', $content = null ){
        $atts = shortcode_atts( array(
            'id' => 0,
        ), $atts );
        $inline_popup = '';
        return $inline_popup;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si el popup es válido
    |---------------------------------------------------------------------------------------------------
    */
    public function is_valid_popup( $id = 0 ){
        $popup = get_post( $id );
        if( $popup && $popup->post_type == $this->post_types['popups'] ){
            return true;
        }
        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si el popup está publicado
    |---------------------------------------------------------------------------------------------------
    */
    public function is_published_popup( $id = 0 ){
        return $this->is_valid_popup( $id ) && get_post_status( $id ) == 'publish';
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Columnas para la lista de popups
    |---------------------------------------------------------------------------------------------------
    */
    public function set_columns_popups( $columns ){
        $columns = array(
            "cb" => "<input type=\"checkbox\" />",
            "title" => __( 'Title', 'masterpopups' ),
            "popup-shortcode" => "Popup Shortcode",
            "impressions" => __( 'Impressions', 'masterpopups' ),
            "submits" => __( 'Submits', 'masterpopups' ),
            "ctr" => __( 'Conversion (CTR)', 'masterpopups' ),
            "date" => 'Date',
        );
        return $columns;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Contenido para las columnas de la lista de popups
    |---------------------------------------------------------------------------------------------------
    */
    public function set_content_columns_popups( $column, $popup_id ){
        $impressions = (int) get_post_meta( $popup_id, 'mpp_impressions', true );
        $submits = (int) get_post_meta( $popup_id, 'mpp_submits', true );
        $ctr = 0;
        if( get_post_status( $popup_id ) != 'publish' ){
            switch( $column ){
                case 'popup-shortcode':
                    echo __( 'Please, publish popup', 'masterpopups' );
                    break;
            }
        } else{
            $popup = Popups::get( $popup_id );
            switch( $column ){
                case 'popup-shortcode':
                    $popup_shortcode = '[mpp_popup id="' . $popup_id . '"]Open popup[/mpp_popup]';
                    echo "<input type='text' class='ampp-input-popup-shortcode' value='$popup_shortcode' onfocus='this.select()' readonly>";
                    break;

                case 'impressions':
                    echo $impressions;
                    break;

                case 'submits':
                    echo $submits;
                    break;

                case 'ctr':
                    if( $popup && $popup->option( 'form-submission-type' ) != 'none' ){
                        if( $impressions >= 1 ){
                            $ctr = $submits * 100 / $impressions;
                        }
                        echo round( (float) $ctr, 2 ) . '%';
                    } else{
                        echo '-';
                    }
                    break;
            }
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Columnas para la lista de audiencia
    |---------------------------------------------------------------------------------------------------
    */
    public function set_columns_audience( $columns ){
        $columns = array(
            "cb" => "<input type=\"checkbox\" />",
            "title" => __( 'Title', 'masterpopups' ),
            "service" => __( 'Service', 'masterpopups' ),
            "subscribers" => __( 'Total Subscribers', 'masterpopups' ),
            "date" => 'Date',
        );
        return $columns;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Contenido para las columnas de la lista de audiencia
    |---------------------------------------------------------------------------------------------------
    */
    public function set_content_columns_audience( $column, $audience_id ){
        $service = get_post_meta( $audience_id, 'mpp_service', true );
        $subscribers = (int) get_post_meta( $audience_id, 'mpp_total-subscribers', true );
        $integrated_services = $this->options_manager->get_integrated_services( true, false );
        switch( $column ){
            case 'service':
                if( $service == 'master_popups' ){
                    echo "<img src='" . MPP_URL . "assets/admin/images/logo-short.png' class='ampp-service-logo'>";
                    echo 'MasterPopups';
                } else if( isset( $integrated_services[$service] ) ){
                    $services = Services::get_all();
                    if( isset( $services[$service]['image_url'] ) ){
                        echo "<img src='{$services[$service]['image_url']}' class='ampp-service-logo'>";
                    }
                    echo $integrated_services[$service];
                } else{
                    echo __( 'Service not defined', 'masterpopups' );
                }
                break;

            case 'subscribers':
                echo $subscribers;
                break;
        }
    }


}


