<?php namespace MaxLopez\HTTPClientWP;

/*
|---------------------------------------------------------------------------------------------------
| HTTP Client for WordPress
| Autor: Max López
| Version: 1.2
|---------------------------------------------------------------------------------------------------
*/

class IronMan {

    /**
     *
     * Current version
     * @var string
     */
    const VERSION = '1.2';

    /**
     *
     * Method
     * @var string
     */
    private $method = '';

    /**
     *
     * URL for requests
     * @var string
     */
    public $url = '';

    /**
     *
     * URL base for requests
     * @var string
     */
    private $api_endpoint = '';


    /**
     *
     * Headers
     * @var array
     */
    public $headers = array();

    /**
     *
     * Body
     * @var string|array
     */
    public $body = null;

    /**
     *
     * Options
     * @var array
     */
    public $options = array(
        'encode_body' => false,
        'reset_body_after_request' => false,

        'timeout' => 10,
        'redirection' => 5,
        'httpversion' => '1.0',
        'user-agent' => '',
        'blocking' => true,
        'headers' => array(),
        'cookies' => array(),
        'body' => null,
        'compress' => false,
        'decompress' => true,
        'sslverify' => true,
        'stream' => false,
        'filename' => null
    );

    /**
     *
     * Response
     * @var WP_Error|array
     */
    public $response = array();

    /**
     *
     * Response headers
     * @var array
     */
    public $response_headers = array();

    /**
     *
     * Response body
     * @var string
     */
    public $response_body = '';

    /**
     *
     * Response code
     * @var integer
     */
    public $response_code = null;

    /**
     *
     * Success
     * @var boolean
     */
    public $success = false;

    /**
     *
     * Response message
     * @var string
     */
    public $message = '';

    /**
     *
     * Check if response has WP_Error
     * @var boolean
     */
    public $has_error = false;

    /**
     *
     * Response error
     * @var string
     */
    public $error = '';

    /**
     *
     * All response error messages
     * @var array
     */
    public $errors = array();

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $api_endpoint = '', $headers = array(), $body = null, $options = array() ){
        $this->api_endpoint = trailingslashit( $api_endpoint );
        $this->set_options( $options );
        $this->set_headers( $headers );
        $this->set_body( $body );
    }

    /*
    |-----------------------------------------------------------------------------------
    | For undefined methods
    |-----------------------------------------------------------------------------------
    */
    public function __call( $name, $arguments ){
        if( substr( $name, 0, 4 ) === 'set_' && strlen( $name ) > 4 ){
            $property = substr( $name, 4 );
            if( property_exists( $this, $property ) && isset( $arguments[0] ) ){
                $this->$property = $arguments[0];
                return $this->$property;
            }
        } else if( substr( $name, 0, 4 ) === 'get_' && strlen( $name ) > 4 ){
            $property = substr( $name, 4 );
            if( property_exists( $this, $property ) ){
                return $this->$property;
            }
        } else if( substr( $name, 0, 4 ) === 'add_' && strlen( $name ) > 4 ){
            $property = substr( $name, 4 );
            if( property_exists( $this, $property ) && isset( $arguments[0] ) ){
                $this->$property = $this->convert_to_array( $this->$property );
                $this->$property = array_replace_recursive( $this->$property, $arguments[0] );
                return $this->$property;
            }
        } else if( property_exists( $this, $name ) ){
            return $this->$name;
        }

        return null;
    }

    /*
    |-----------------------------------------------------------------------------------
    | Get an option's value
    |-----------------------------------------------------------------------------------
    */
    public function __get( $key ){
        return isset( $this->options[$key] ) ? $this->options[$key] : null;
    }

    /*
    |-----------------------------------------------------------------------------------
    | Set an option's value
    |-----------------------------------------------------------------------------------
    */
    public function __set( $key, $value ){
        $this->set_option( $key, $value );
    }

    /*
    |-----------------------------------------------------------------------------------
    | Set an option's value
    |-----------------------------------------------------------------------------------
    */
    public function set_option( $key, $value ){
        $this->options[$key] = $value;
        if( $key == 'useragent' ){
            $this->options['user-agent'] = $value;
        }
    }

    /*
    |-----------------------------------------------------------------------------------
    | Get error message
    |-----------------------------------------------------------------------------------
    */
    public function get_error_message(){
        return $this->has_error && $this->error != '' ? $this->error : $this->message;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | GET request
    |---------------------------------------------------------------------------------------------------
    */
    public function get( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'GET', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | HEAD request
    |---------------------------------------------------------------------------------------------------
    */
    public function head( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'HEAD', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | DELETE request
    |---------------------------------------------------------------------------------------------------
    */
    public function delete( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'DELETE', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | POST request
    |---------------------------------------------------------------------------------------------------
    */
    public function post( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'POST', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | PUT request
    |---------------------------------------------------------------------------------------------------
    */
    public function put( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'PUT', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | PATCH request
    |---------------------------------------------------------------------------------------------------
    */
    public function patch( $url, $headers = array(), $body = array(), $options = array() ){
        return $this->request( 'PATCH', $url, $headers, $body, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Main request method
    |---------------------------------------------------------------------------------------------------
    */
    public function request( $method, $url = '', $headers = array(), $body = array(), $options = array() ){
        $this->method = strtoupper( $method );
        $this->options['method'] = $this->method;
        $this->set_options( $options );
        $this->set_headers( $headers );
        $this->set_body( $body );
        $this->make_url( $url );

        switch( $this->method ){
            case 'GET':
            case 'DELETE':
                $this->response = wp_remote_get( $this->url, $this->options );
                break;
            case 'HEAD':
                $this->response = wp_remote_head( $this->url, $this->options );
                break;
            case 'POST':
            case 'PUT':
            case 'PATCH':
                $this->response = wp_remote_post( $this->url, $this->options );
                break;
        }

        $this->update_request_response_properties();

        return $this->response;
    }

    /*
    |-----------------------------------------------------------------------------------
    | Set options for request
    |-----------------------------------------------------------------------------------
    */
    public function set_options( $options ){
        $this->options = array_replace_recursive( $this->options, $options );
    }

    /*
    |-----------------------------------------------------------------------------------
    | Set headers for request
    |-----------------------------------------------------------------------------------
    */
    public function set_headers( $headers = array() ){
        $this->headers = array_replace_recursive( $this->headers, $headers );
        $this->options['headers'] = $this->headers;
    }

    /*
    |-----------------------------------------------------------------------------------
    | Set body for request
    |-----------------------------------------------------------------------------------
    */
    public function set_body( $body ){
        // If $body is a json string, force encode
        if( $this->is_json_string( $body ) ){
            $this->options['encode_body'] = true;
        }

        $body = $this->convert_to_array( $body );
        $this->body = $this->convert_to_array( $this->body );
        $this->body = array_replace_recursive( $this->body, $body );

        //Encode body
        if( $this->options['encode_body'] && ! in_array( $this->method, $this->methods_no_encode_body() ) ){
            $this->body = json_encode( $this->body );
        }
        $this->options['body'] = $this->body;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Builds the url for the new request
    |---------------------------------------------------------------------------------------------------
    */
    private function make_url( $url = '' ){
        $this->url = '';// Reset url
        if( filter_var( $url, FILTER_VALIDATE_URL ) !== false ){
            $this->url = $url;
        } else if( filter_var( $this->api_endpoint, FILTER_VALIDATE_URL ) !== false ){
            $this->url = trailingslashit( $this->api_endpoint ) . ltrim( $url, '/' );
        }

        if( in_array( $this->method, $this->methods_no_encode_body() ) ){//GET, DELETE, HEAD
            $body = $this->convert_to_array( $this->body );
            $this->url = $this->url_format_get( $this->url, $body );
            $this->options['body'] = null;
        }

        return $this->url;
    }

    /*
    |-----------------------------------------------------------------------------------
    | Format an URL with $body to build an URL with query string
    |-----------------------------------------------------------------------------------
    */
    private function url_format_get( $url, $body = array() ){
        if( empty( $body ) || ! is_array( $body ) ){
            return $url;
        }
        $url_parts = parse_url( $url );
        if( empty ( $url_parts['query'] ) ){
            $url = rtrim( $url, '?' ) . '?' . http_build_query( $body, '', '&' );
        } else{
            $url = str_replace( $url_parts['query'], '', $url );
            parse_str( $url_parts['query'], $old_query );
            $params = array_merge( $old_query, $body );
            $url = rtrim( $url, '?' ) . '?' . http_build_query( $params, '', '&' );
        }
        return $url;
    }


    /*
    |-----------------------------------------------------------------------------------
    | Reset response properties
    |-----------------------------------------------------------------------------------
    */
    public function reset_response(){
        $this->success = false;
        $this->message = '';
        $this->response_code = null;
        $this->response_headers = array();
        $this->response_body = '';
        $this->has_error = false;
        $this->errors = array();
        $this->error = '';
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Update request & response properties
    |---------------------------------------------------------------------------------------------------
    */
    private function update_request_response_properties(){
        $this->reset_response();
        if( $this->options['reset_body_after_request'] ){
            $this->body = null;
        }
        if( is_wp_error( $this->response ) ){
            $this->has_error = true;
            $this->errors = $this->response->get_error_messages();
            $this->error = $this->response->get_error_message();
        } else{
            $this->response_code = wp_remote_retrieve_response_code( $this->response );
            $this->message = wp_remote_retrieve_response_message( $this->response );
            $this->response_headers = wp_remote_retrieve_headers( $this->response )->getAll();
            $this->response_body = wp_remote_retrieve_body( $this->response );
            if( $this->response_code >= 200 && $this->response_code < 300 ){
                $this->success = true;
            } else{
                $this->success = false;
            }
        }
    }

    /*
    |-----------------------------------------------------------------------------------
    | Get array body
    |-----------------------------------------------------------------------------------
    */
    private function convert_to_array( $arg ){
        if( ! is_array( $arg ) ){
            if( $this->is_json_string( $arg ) ){
                $arg = json_decode( $arg, true );
            } else{
                $arg = array();
            }
        }
        return $arg;
    }

    /*
    |-----------------------------------------------------------------------------------
    | HTTP methods that must be excluded for json_encode body
    |-----------------------------------------------------------------------------------
    */
    private function methods_no_encode_body(){
        return array( 'GET', 'DELETE', 'HEAD' );
    }

    /*
    |-----------------------------------------------------------------------------------
    | Check json string
    |-----------------------------------------------------------------------------------
    */
    private function is_json_string( $string ){
        if( ! is_string( $string ) ){
            return false;
        }
        $string = trim( $string );
        if( substr( $string, 0, 1 ) == '{' ){
            $string = json_decode( $string, true );
            if( $string === null ){
                return false;
            }
            return true;
        }
        return false;

    }


}

?>
