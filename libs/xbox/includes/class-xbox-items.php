<?php

use Xbox\Includes\Functions;
use Xbox\Includes\GoogleFonts;

class XboxItems {
    private static $instance = null;
    public static $google_fonts = array();


    /*
    |---------------------------------------------------------------------------------------------------
    | Lista de términos de taxonomias
    |---------------------------------------------------------------------------------------------------
    */
    public static function terms( $taxonomy = '', $args = array(), $more_items = array() ){
        $args = wp_parse_args( $args, array(
            'hide_empty' => false,
        ) );
        $terms = get_terms( $taxonomy, $args );
        if( is_wp_error( $terms ) ){
            return array();
        }
        $items = array();
        foreach( $terms as $term ){
            $items[$term->slug] = $term->name;
        }
        return array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Lista de tipos de post
    |---------------------------------------------------------------------------------------------------
    */
    public static function post_types( $args = array(), $operator = 'and', $more_items = array() ){
        $post_types = get_post_types( $args, 'objects', $operator );
        $items = array();
        foreach( $post_types as $post_type ){
            $items[$post_type->name] = $post_type->label;
        }
        return array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Lista de posts de un tipos de post
    |---------------------------------------------------------------------------------------------------
    */
    public static function posts_by_post_type( $post_type = 'post', $args = array(), $more_items = array() ){
        $args = wp_parse_args( $args, array(
            'post_type' => $post_type,
            'posts_per_page' => 5,//=numberposts
        ) );
        $posts = get_posts( $args );
        $items = array();
        foreach( $posts as $post ){
            $items[$post->ID] = $post->post_title;
        }
        return Functions::nice_array_merge( $more_items, $items );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Google fonts
    |---------------------------------------------------------------------------------------------------
    */
    public static function google_fonts( $more_items = array() ){
        if( ! empty( self::$google_fonts ) ){
            return Functions::nice_array_merge( $more_items, self::$google_fonts );
        }
        $items = array();
        $gf = new GoogleFonts();
        $google_fonts = $gf->get_fonts();
        foreach( $google_fonts as $font ){
            $items[$font->family] = $font->family;
        }
        self::$google_fonts = $items;
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Web safe fonts
    |---------------------------------------------------------------------------------------------------
    */
    public static function web_safe_fonts( $more_items = array() ){
        $web_safe_fonts = include XBOX_DIR . 'includes/data/web-safe-fonts.php';
        $items = array();
        foreach( $web_safe_fonts as $font ){
            $items[$font] = $font;
        }
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Border style
    |---------------------------------------------------------------------------------------------------
    */
    public static function border_style( $more_items = array() ){
        $items = array(
            'solid' => 'Solid',
            'none' => 'None',
            'dotted' => 'Dotted',
            'dashed' => 'Dashed',
            'double' => 'Double',
            'groove' => 'Groove',
            //'ridge'  => 'Ridge',
            //'inset'  => 'Inset',
            //'outset' => 'Outset',
            //'hidden' => 'Hidden',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Opacity
    |---------------------------------------------------------------------------------------------------
    */
    public static function opacity( $more_items = array() ){
        $items = array(
            '1' => '1',
            '0.9' => '0.9',
            '0.8' => '0.8',
            '0.7' => '0.7',
            '0.6' => '0.6',
            '0.5' => '0.5',
            '0.4' => '0.4',
            '0.3' => '0.3',
            '0.2' => '0.2',
            '0.1' => '0.1',
            '0' => '0',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Text align
    |---------------------------------------------------------------------------------------------------
    */
    public static function text_align( $more_items = array() ){
        $items = array(
            'left' => 'Left',
            'right' => 'Right',
            'center' => 'Center',
            'justify' => 'Justify',
            //'initial' => 'Initial',
            //'inherit' => 'Inherit',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Font style
    |---------------------------------------------------------------------------------------------------
    */
    public static function font_style( $more_items = array() ){
        $items = array(
            'normal' => 'Normal',
            'italic' => 'Italic',
            'oblique' => 'Oblique',
            //'initial' => 'Initial',
            //'inherit' => 'Inherit',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Text align
    |---------------------------------------------------------------------------------------------------
    */
    public static function font_weight( $more_items = array() ){
        $items = array(
            '300' => 'Light 300',
            '400' => 'Regular 400',
            '500' => 'Medium 500',
            '600' => 'Semi bold 600',
            '700' => 'Bold 700',
            '800' => 'Extra bold 800',
            '900' => 'Black 900',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Text transform
    |---------------------------------------------------------------------------------------------------
    */
    public static function text_transform( $more_items = array() ){
        $items = array(
            'none' => 'None',
            'uppercase' => 'Uppercase',
            'lowercase' => 'Lowercase',
            'capitalize' => 'Capitalize',
        );
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Countries
    |---------------------------------------------------------------------------------------------------
    */
    public static function countries_icons( $more_items = array() ){
        $countries = include XBOX_DIR . 'includes/data/countries-icons.php';
        $items = array();
        foreach( $countries as $country ){
            $value = $country['value'];
            $option = $country['option'];
            if( isset( $country['icon'] ) ){
                $icon = $country['icon'];
                $option = "<i class='{$icon}'></i>" . $option;
            }
            $items[$value] = $option;
        }
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Font Awesome Icons with text
    |---------------------------------------------------------------------------------------------------
    */
    public static function icons( $more_items = array() ){
        if( Functions::is_fontawesome_version( '5.x' ) ){
            $icons = include XBOX_DIR . 'includes/data/icons-font-awesome-5.6.3.php';
        } else{
            $icons = include XBOX_DIR . 'includes/data/icons-font-awesome.php';
        }
        $items = array();
        foreach( $icons as $icon ){
            $items[$icon] = "<i class='$icon'></i>$icon";
        }
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Font Awesome Icons
    |---------------------------------------------------------------------------------------------------
    */
    public static function icon_fonts( $more_items = array() ){
        if( Functions::is_fontawesome_version( '5.x' ) ){
            $icons = include XBOX_DIR . 'includes/data/icons-font-awesome-5.6.3.php';
        } else{
            $icons = include XBOX_DIR . 'includes/data/icons-font-awesome.php';
        }
        $items = array();
        foreach( $icons as $icon ){
            $items[$icon] = "<i class='$icon'></i>";
        }
        return Functions::nice_array_merge( $more_items, $items );
    }

    /*
	|---------------------------------------------------------------------------------------------------
	| All countries
	|---------------------------------------------------------------------------------------------------
	*/
    public static function countries( $more_items = array() ){
        $countries = include XBOX_DIR . 'includes/data/countries.php';
        return Functions::nice_array_merge( $more_items, $countries );
    }

    /*
	|---------------------------------------------------------------------------------------------------
	| EU (European Union) Countries
	|---------------------------------------------------------------------------------------------------
	*/
    public static function eu_countries( $more_items = array() ){
        $eu_countries = include XBOX_DIR . 'includes/data/eu-countries.php';
        return Functions::nice_array_merge( $more_items, $eu_countries );
    }
}