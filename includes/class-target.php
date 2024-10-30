<?php namespace MasterPopups\Includes;


class Target {
    private $display = false;
    private $plugin = null;
    private $popup = null;
    private $prefix = '';

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $plugin = null, $popup = null ){
        $this->plugin = $plugin;
        $this->popup = $popup;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup
    |---------------------------------------------------------------------------------------------------
    */
    public function should_display_popup(){
        $display = false;
        global $post;

        if( is_admin() ){
            return $this->display_on_admin();
        }

        //Display Target
        $display = $this->display_on_all_site();

        if( is_archive() ){
            $display = $this->display_on_archive();
            if( is_category() ){
                $display = $this->display_on_category();
            } else if( is_tag() ){
                $display = $this->display_on_post_tag();
            }
        }

        if( Functions::is_homepage() ){
            $display = $this->display_on_homepage();
        } else if( is_single() ){
            if( is_singular( array( 'post' ) ) ){
                $display = $this->display_on_posts();
            } else{
                $post_types = $this->popup->options_manager->get_not_builtin_post_types();
                if( is_singular( array_keys( $post_types ) ) ){
                    $display = $this->display_on_post_types();
                }
            }
        } else if( is_page() ){
            $display = $this->display_on_pages();
        }

        //Display Conditions
        if( $display ){
            $display_on_devices = $this->display_on_devices();
            if( ! $display_on_devices ){
                $display = false;
            }
        }

        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en el admin
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_admin(){
        $display = false;
        if( is_admin() ){
            $display = true;
        }
        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en todo el sitio
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_all_site(){
        return 'on' == $this->popup->option( 'display-on-all-site' ) ? true : false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en la página principal
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_homepage(){
        return 'on' == $this->popup->option( 'display-on-homepage' ) ? true : false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en páginas de archivos.
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_archive(){
        return 'on' == $this->popup->option( 'display-on-archive' ) ? true : false;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en categorías
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_category(){
        $display = false;
        if( 'on' == $this->popup->option( 'display-on-taxonomy-category' ) ){
            $display = true;
        }
        $term = get_queried_object();
        if( in_array( $term->slug, $this->popup->option( 'display-on-taxonomy-category-terms' ) ) ){
            $display = true;
        }
        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en etiquetas
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_post_tag(){
        $display = false;
        if( 'on' == $this->popup->option( 'display-on-taxonomy-post_tag' ) ){
            $display = true;
        }
        $term = get_queried_object();
        if( in_array( $term->slug, $this->popup->option( 'display-on-taxonomy-post_tag-terms' ) ) ){
            $display = true;
        }
        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en un post
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_posts(){
        $display = false;
        global $post;

        if( 'on' == $this->popup->option( 'display-on-post' ) ){
            $display = true;
        } else if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-post-include' ) ) ) ){
            $display = true;
        }
        if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-post-exclude' ) ) ) ){
            $display = false;
        }
        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en una página
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_pages(){
        $display = false;
        global $post;

        if( 'on' == $this->popup->option( 'display-on-page' ) ){
            $display = true;
        } else if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-page-include' ) ) ) ){
            $display = true;
        }
        if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-page-exclude' ) ) ) ){
            $display = false;
        }
        return $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si se debe mostrar el popup en un post type
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_post_types(){
        $display = false;
        global $post;
        if( ! $post ){
            return false;
        }
        $name = $post->post_type;
        if( 'on' == $this->popup->option( 'display-on-' . $name ) ){
            $display = true;
        } else if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-' . $name . '-include' ) ) ) ){
            $display = true;
        }
        if( in_array( $post->ID, wp_parse_id_list( $this->popup->option( 'display-on-' . $name . '-exclude' ) ) ) ){
            $display = false;
        }
        return $display;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Comrpueba si se debe mostrar el popup en ciertos dispositivos
    |---------------------------------------------------------------------------------------------------
    */
    public function display_on_devices(){
        $display = false;
        $display_on_devices = (array) $this->popup->option( 'display-on-devices' );
        $mobile_delect = new \Mobile_Detect_Popup_Master();
        if( $mobile_delect->isMobile() && ! $mobile_delect->isTablet() ){
            $display = in_array( 'mobile', $display_on_devices );
        } else if( $mobile_delect->isTablet() ){
            $display = in_array( 'tablet', $display_on_devices );
        } else{
            $display = in_array( 'desktop', $display_on_devices );
        }
        return $display;
    }


}
