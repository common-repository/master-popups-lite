<?php namespace MasterPopups;

class Loader {
    protected static $instance = null;
    private static $plugins = array();
    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    private function __construct( $plugins = array() ){
        self::$plugins = $plugins;
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

    public static function get_instance( $plugins = array() ){
        if( null === self::$instance ){
            self::$instance = new self( $plugins );
        }
        return self::$instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | On Activate
    |---------------------------------------------------------------------------------------------------
    */
    public static function on_activate(){
        $plugin_data = self::get_plugin_data();
        if( empty( $plugin_data ) ){
            return;
        }
        deactivate_plugins( $plugin_data['basename'] );
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
    | Plugin data
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_plugin_data( $plugins = array() ){
        self::$plugins = ! empty( $plugins ) ? $plugins : self::$plugins;
        if( ! function_exists( 'is_plugin_active' ) || ! function_exists( 'get_plugin_data' ) ){
            include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        }

        $plugin_data = array();
        foreach( (array) self::$plugins as $plugin ){
            if( $path = self::is_plugin_active( $plugin ) ){
                $plugin_data = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $path );
                $plugin_data = array_merge( $plugin_data, array( 'basename' => $path ) );
            }
        }
        return $plugin_data;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verifica si un plugin está activo
    |---------------------------------------------------------------------------------------------------
    */
    public static function is_plugin_active( $plugin, $ignore = '' ){
        $active_plugins = (array) get_option( 'active_plugins', array() );
        $path = self::get_plugin_path( $active_plugins, $plugin, $ignore );
        if( $path ){
            return $path;
        }
        return self::is_plugin_active_for_network( $plugin, $ignore );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Verifica si un plugin está activo en multisitio
    |---------------------------------------------------------------------------------------------------
    */
    public static function is_plugin_active_for_network( $plugin, $ignore = '' ){
        if( ! is_multisite() ){
            return '';
        }
        $network_plugins = (array) get_site_option( 'active_sitewide_plugins', array() );
        $active_plugins = array_keys( $network_plugins );
        return self::get_plugin_path( $active_plugins, $plugin, $ignore );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Devuelve el path de un plugin activo (plugin-folder-name/plugin-main-file.php)
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_plugin_path( $active_plugins = array(), $plugin, $ignore = '' ){
        list( $folder, $file ) = explode( '/', $plugin );
        $path = '';
        $strict = true;
        if( strpos( $folder, '*', strlen( $folder ) - 1 ) !== false ){
            $folder = str_replace( '*', '', $folder );
            $strict = false;
        }
        if( $strict ){
            return isset( $active_plugins[$plugin] ) ? $active_plugins[$plugin] : '';
        }
        foreach( $active_plugins as $plugin_active ){
            //array_pad para evitar Undefined offset: 1, en plugin Hello Dolly "hello.php"
            list( $dir_name, $file_name ) = array_pad( explode( '/', $plugin_active ), 2, null );
            if( $file !== $file_name ){
                continue;
            }
            if( strpos( $dir_name, $folder ) !== false && ( ! $ignore || strpos( $dir_name, $ignore ) === false ) ){
                $path = $plugin_active;
            }
            if( $path ){
                break;
            }
        }
        return $path;
    }


}