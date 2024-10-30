<?php namespace Xbox\Includes;

class Importer {
    private $xbox = null;
    private $data = array();
    private $update_uploads_url = false;
    private $update_plugins_url = true;

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor de la clase
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $xbox, $data = array(), $update_uploads_url = false, $update_plugins_url = true ){
        $this->xbox = $xbox;
        $this->data = $data;
        $this->update_uploads_url = $update_uploads_url;
        $this->update_plugins_url = $update_plugins_url;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene los datos a importar
    |---------------------------------------------------------------------------------------------------
    */
    public function get_import_xbox_data(){
        $import_xbox_data = false;
        $json_xbox_data = false;
        $data = $this->data;
        $prefix = $this->xbox->arg( 'fields_prefix' );

        switch( $data[$prefix . 'xbox-import-field'] ){
            case 'from_file':
                if( isset( $_FILES["xbox-import-file"] ) ){
                    $file_name = $_FILES['xbox-import-file']['name'];
                    if( Functions::ends_with( '.json', $file_name ) ){
                        $json_xbox_data = file_get_contents( $_FILES['xbox-import-file']['tmp_name'] );
                    }
                }
                break;

            case 'from_url':
                if( Functions::ends_with( '.json', $data['xbox-import-url'] ) ){
                    $json_xbox_data = $this->get_json_from_url( $data['xbox-import-url'] );
                }
                break;

            default:
                $import_source = $data[$prefix . 'xbox-import-field'];
                $import_xbox = $import_source;
                $import_wp_content = '';
                $import_wp_widget = '';
                $widget_cb = '';
                if( isset( $data['xbox-import-data'] ) ){
                    $sources = isset( $data['xbox-import-data'][$import_source] ) ? $data['xbox-import-data'][$import_source] : array();
                    $import_xbox = isset( $sources['import_xbox'] ) ? $sources['import_xbox'] : '';
                    $import_wp_content = isset( $sources['import_wp_content'] ) ? $sources['import_wp_content'] : '';
                    $import_wp_widget = isset( $sources['import_wp_widget'] ) ? $sources['import_wp_widget'] : '';
                    $widget_cb = isset( $sources['import_wp_widget_callback'] ) ? $sources['import_wp_widget_callback'] : '';
                }

                //Import xbox data
                //if( file_exists( $import_xbox ) || Functions::remote_file_exists( $import_xbox ) ){
                if( Functions::ends_with( '.json', $import_xbox ) ){//Remote file falla en sitios https
                    $json_xbox_data = $this->get_json_from_url( $import_xbox );
                }

                //Import Wp Content
                if( file_exists( $import_wp_content ) ){
                    echo '<h2>Importing wordpress data from local file, please wait ...</h2>';
                    $this->set_wp_content_data( $import_wp_content );
                } else if( Functions::remote_file_exists( $import_wp_content ) ){
                    $file_content = file_get_contents( $import_wp_content );
                    if( $file_content !== false ){
                        if( false !== file_put_contents( XBOX_DIR . 'wp-content-data.xml', $file_content ) ){
                            echo '<h2>Importing wordpress data from remote file, please wait ...</h2>';
                            //echo '<div class="wp-import-messages">';
                            $this->set_wp_content_data( XBOX_DIR . 'wp-content-data.xml' );
                            unlink( XBOX_DIR . 'wp-content-data.xml' );
                            //echo '</div>';
                        }
                    }
                }

                //Import Wp Widget
                if( file_exists( $import_wp_widget ) || Functions::remote_file_exists( $import_wp_widget ) ){
                    if( is_callable( $widget_cb ) ){
                        call_user_func( $widget_cb, $import_wp_widget );
                    }
                }
                break;
        }

        if( $json_xbox_data !== false ){
            $json_xbox_data = $this->update_urls_from_data( $json_xbox_data );
            $import_xbox_data = json_decode( $json_xbox_data, true );
        }

        if( is_array( $import_xbox_data ) && ! empty( $import_xbox_data ) ){
            return $import_xbox_data;
        }

        return false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Importa contenido de wordpres
    |---------------------------------------------------------------------------------------------------
    */
    public function set_wp_content_data( $file ){
        if( ! defined( 'WP_LOAD_IMPORTERS' ) ) define( 'WP_LOAD_IMPORTERS', true );

        $importer_error = false;
        if( ! class_exists( '\WP_Import' ) ){
            $class_wp_import = XBOX_DIR . 'libs/wordpress-importer/wordpress-importer.php';
            if( file_exists( $class_wp_import ) ){
                require_once $class_wp_import;
            } else{
                $importer_error = true;
            }
        }

        if( $importer_error ){
            die( "Error on import" );
        } else{
            if( is_file( $file ) && class_exists( '\WP_Import' ) ){
                $wp_import = new \WP_Import();
                $wp_import->fetch_attachments = true;
                $wp_import->import( $file );
            } else{
                echo "The XML file containing the dummy content is not available or could not be read .. You might want to try to set the file permission to chmod 755.<br/>If this doesn't work please use the Wordpress importer and import the XML file (should be located in your download .zip: Sample Content folder) manually";
            }
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Actualiza las urls de los datos
    |---------------------------------------------------------------------------------------------------
    */
    public function update_urls_from_data( $json_data ){
        // $this->data = $import_xbox_data;
        // array_walk_recursive( $import_xbox_data, array( $this, 'replace_urls') );

        $data = json_decode( $json_data, true );
        $json_data = str_replace( '\\/', '/', $json_data );
        if( $this->update_uploads_url && isset( $data['wp_upload_dir'] ) ){
            $json_data = str_replace( $data['wp_upload_dir'], wp_upload_dir(), $json_data );
        }
        if( $this->update_plugins_url && isset( $data['plugins_url'] ) ){
            $json_data = str_replace( $data['plugins_url'], plugins_url(), $json_data );
        }
        return $json_data;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna un string json desde una url
    |---------------------------------------------------------------------------------------------------
    */
    private function get_json_from_url( $url ){
        $json = file_get_contents( $url );
        $json_decode = json_decode( $json );
        if( $json_decode === null ){
            $response = wp_remote_get( $url );
            if( is_wp_error( $response ) ){
                $response = wp_remote_get( $url, array( 'sslverify' => false ) );
            }
            if( is_wp_error( $response ) ){
                return false;
            } else{
                $json = wp_remote_retrieve_body( $response );
            }
        }
        return $json;
    }

}