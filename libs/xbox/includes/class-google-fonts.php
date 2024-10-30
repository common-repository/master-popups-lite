<?php namespace Xbox\Includes;

class GoogleFonts {
    private $api_key = 'AIzaSyCXXembGADcoCgo0-H5LzkWuCxLK2XVVjA';
    private $api_url = 'https://www.googleapis.com/webfonts/v1/webfonts';
    private $file_name = 'google-fonts.json';
    private $cache_time = 15552000;//6 meses
    private $file = null;
    public $json = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_key = '', $sort = 'popularity' ){
        $this->api_key = ! empty( $api_key ) ? $api_key : $this->api_key;
        $this->file = XBOX_DIR . 'includes/data/' . $this->file_name;
        $this->url = $this->api_url . '?key=' . urlencode( $this->api_key ) . '&sort=' . urlencode( $sort );

        //Download google fonts
        $this->json = $this->download();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Download google fonts
    |---------------------------------------------------------------------------------------------------
    */
    public function download( $url = '' ){
        $this->url = $url ? $url : $this->url;

        if( file_exists( $this->file ) && time() - $this->cache_time < filemtime( $this->file ) ){
            return file_get_contents( $this->file );
        }

        $req = wp_remote_get( $this->url, array( 'sslverify' => true ) );
        if( is_wp_error( $req ) || ! isset( $req['body'] ) || strpos( $req['body'], 'error' ) !== false ){
            if( file_exists( $this->file ) ){
                $this->json = file_get_contents( $this->file );
            }
        } else{
            $this->json = $req['body'];
            if( is_writable( XBOX_DIR . 'includes/data/' ) ){
                file_put_contents( $this->file, $this->json );
            }
        }
        return $this->json;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Get google fonts
    |---------------------------------------------------------------------------------------------------
    */
    public function get_fonts( $amount = 'all' ){
        if( ! $this->json ){
            return array();
        }
        $google_fonts = json_decode( $this->json );
        if( $amount == 'all' ){
            return $google_fonts->items;
        } else{
            return array_slice( $google_fonts->items, 0, (int) $amount );
        }
    }


}
