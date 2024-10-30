<?php namespace MasterPopups\Includes;

use Xbox\Includes\CSS;

class Element extends ElementOptions {
    public $id = 0;
    public $type = 'close-icon';
    public $index = 0;
    public $z_index = 1;
    public $device = 'desktop';

    public $plugin = null;
    public $popup = null;

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    public function __construct( $options, $popup, $plugin = null ){
        $this->plugin = $plugin;
        $this->popup = $popup;
        self::$prefix = $this->plugin->arg( 'prefix' );
        $this->set_options( $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acceso a cualquier método, evita errores al llamar a métodos inexistentes
    |---------------------------------------------------------------------------------------------------
    */
    public function __call( $name, $arguments ){
        if( Functions::starts_with( 'set_', $name ) && strlen( $name ) > 4 ){
            $property = substr( $name, 4 );
            if( property_exists( $this, $property ) && isset( $arguments[0] ) ){
                $this->$property = $arguments[0];
                return $this->$property;
            }
            return null;
        } else if( Functions::starts_with( 'get_', $name ) && strlen( $name ) > 4 ){
            $property = substr( $name, 4 );
            if( property_exists( $this, $property ) ){
                return $this->$property;
            }
            return null;
        } else if( property_exists( $this, $name ) ){
            return $this->$name;
        } else{
            return $this->option( $name );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Tab index
    |---------------------------------------------------------------------------------------------------
    */
    public function get_tabindex(){
        $total_elements = 30;//más o menos la cantidad de elementos que tiene un popup
        return $this->popup->unique_id * $total_elements + $this->index + 1;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Construye el elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function build(){
        $return = '';
        $attributes = $this->get_attributes_options();
        $element_class = array();
        $element_class[] = esc_attr( $attributes['class'] );
        $element_class[] = "mpp-element";
        $element_class[] = "mpp-element-{$this->type}";
        //$index = $this->index + 1;
        $index = $this->index;
        $element_class[] = "mpp-{$this->device}-element-$index";
        $element_class[] = in_array( $this->type, $this->all_form_elements() ) ? 'mpp-form-element' : '';
        if( $this->type == 'close-icon' ){
            $element_class[] = 'on' == $this->option( 'e-position-top-right-page' ) ? 'mpp-on-top-right-page' : '';
        }
        $element_class = trim( implode( ' ', $element_class ) );

        $element_data = htmlentities( $this->get_element_data( 'html' ) );
        $element_content_data = htmlentities( $this->get_element_content_data( 'html' ) );
        $element_id = ! empty( $attributes['id'] ) ? 'id="' . esc_attr( $attributes['id'] ) . '"' : '';
        $tabindex = $this->type == 'field_submit' ? 'tabindex="' . ( $this->get_tabindex() ) . '"' : '';

        $return .= "<div $element_id class='$element_class' title='{$attributes['title']}' $tabindex $element_data>";
        $return .= "<div class='mpp-element-content' $element_content_data>";
        $return .= $this->get_content( 'public' );
        $return .= "</div>";//.mpp-el-content
        $return .= "</div>";//.mpp-element
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna attributos data del elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function get_element_data( $return = 'html' ){
        $element_data = array(
            'index' => $this->index,
            'type' => $this->type,
            'device' => $this->device,
            'position' => json_encode( $this->get_position_options() ),
            'size' => json_encode( $this->get_size_options() ),
            'animation' => json_encode( $this->get_animation_options() ),
            'required' => $this->option( 'e-field-required' ),
            'actions' => json_encode( $this->get_actions_options() ),
        );
        $element_data = apply_filters( 'mpp_element_data', $element_data, $this );
        if( $return == 'html' ){
            $html = '';
            foreach( $element_data as $data => $value ){
                $html .= " data-$data='$value'";
            }
            return $html;
        }
        return $element_data;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna attributos data del elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function get_element_content_data( $return = 'html' ){
        $content_data = array(
            'font' => json_encode( $this->get_font_options() ),
            'padding' => json_encode( $this->get_padding_options() ),
            'border' => json_encode( $this->get_border_options() ),
        );
        if( $return == 'html' ){
            $html = '';
            foreach( $content_data as $data => $value ){
                $html .= " data-$data='$value'";
            }
            return $html;
        }
        return $content_data;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content( $scope = 'public' ){
        $content = '';
        switch( $this->type ){
            case 'close-icon':
                $content = $this->get_content_type_object( $scope, 'e-content-close-icon' );
                break;

            case 'object':
                $content = $this->get_content_type_object( $scope, 'e-content-object' );
                break;

            case 'close-icon':
                $value = $this->option( 'e-content-close-icon' );
                if( Functions::ends_with( '.svg', $value ) ){
                    $content = "<img src='$value'>";
                } else{
                    $content = "<i class='$value'></i>";
                }
                break;

            case 'text-html':
                $content = $this->get_content_type_text_html( $scope );
                break;

            case 'image':
                $content = "<img src='{$this->option('e-content-image')}'>";
                break;

            case 'video':
                $content = $this->get_content_type_video( $scope );
                break;

            case 'button':
                $content = $this->get_content_type_button( $scope );
                break;

            case 'shape':
                $content = $this->get_content_type_shape( $scope );
                break;

            case 'shortcode':
                $content = $this->get_content_type_shortcode( $scope );
                break;

            case 'field_first_name':
            case 'field_last_name':
            case 'field_email':
            case 'field_phone':
            case 'field_message':
            case 'custom_field_input_text':
            case 'custom_field_input_hidden':
            case 'custom_field_input_checkbox':
            case 'custom_field_input_checkbox_gdpr':
            case 'field_submit':
                $content = $this->get_content_form_fields( $scope );
                break;

            default:
                $content = 'field';
        }
        return $content;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo close_icon and object
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_object( $scope = 'public', $field_name = 'e-content-object' ){
        $value = $this->option( $field_name );
        if( Functions::ends_with( '.svg', $value ) ){
            $content = "<img src='$value'>";
        } else{
            $content = "<i class='$value'></i>";
        }
        return $content;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo text_html
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_text_html( $scope = 'public' ){
        return $this->option( 'e-content-textarea' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo button
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_button( $scope = 'public' ){
        return $this->option( 'e-content-textarea' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo shape
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_shape( $scope = 'public' ){
        return $this->option( 'e-content-textarea' );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo shortcode
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_shortcode( $scope = 'public' ){
        if( $scope == 'admin' ){
            return $this->option( 'e-content-shortcode' );
        }
        return do_shortcode( $this->option( 'e-content-shortcode' ) );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de un elemento tipo video
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_type_video( $scope = 'public' ){
        $content = '';
        $video = __( 'Video not found', 'masterpopups' );
        $video_poster = $this->option( 'e-video-poster' );
        $play_icon = $this->option( 'e-play-icon' );
        $video_type = $this->option( 'e-video-type' );

        switch( $video_type ){
            case 'youtube':
                $video_url = $this->option( 'e-content-video' );
                parse_str( $this->option( 'e-video-' . $video_type . '-parameters' ), $parameters );
                $parameters['autoplay'] = '1';
                $player = new Player( $video_url, true, $parameters );
                $video_poster = $video_poster ? $video_poster : $player->image;

                if( $video_url && $player->provider && $player->provider != 'html5' ){
                    $video = $player->player;
                }
                break;
        }

        $provider = $player->provider ? $player->provider : __( 'Unknown', 'masterpopups' );

        if( $scope == 'admin' ){
            $content = "<div class='mpp-video-poster' style='background-image: url($video_poster)'>";
            $content .= "<div class='mpp-video-caption'>$provider video</div>";
            $content .= "<div class='mpp-play-icon'><i class='$play_icon'></i></div>";
            $content .= "</div>";
        } else{
            $content = "<div class='mpp-video-poster' style='background-image: url($video_poster)'>";
            $content .= "<div class='mpp-play-icon'><i class='$play_icon'></i></div>";
            $content .= "</div>";
            $content .= "<div class='mpp-wrap-video' data-video-type='$player->provider'>";
            $content .= $video;
            $content .= "</div>";
        }
        return $content;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el contenido de los elementos de formulario
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_form_fields( $scope = 'public' ){
        $content = '';
        $placeholder = $this->option( 'e-field-placeholder' );
        $name = $this->option( 'e-field-name' );
        $value = $this->option( 'e-field-value' );
        $options = $this->option( 'e-field-options' );
        $checked = $this->option( 'e-field-checked' ) == 'on' ? 'checked' : '';
        $required = $this->option( 'e-field-required' ) == 'on' ? 'required' : '';
        $tabindex = $this->get_tabindex();

        //Inputs
        if( in_array( $this->type, self::form_elements()['input'] ) ){
            if( $this->type == 'custom_field_input_checkbox' || $this->type == 'custom_field_input_checkbox_gdpr' ){
                $required = $scope == 'admin' ? '' : $required;
                $content = "<label><input type='checkbox' name='$name' class='mpp-checkbox' value='$value' tabindex='$tabindex' $required $checked><i class='mpp-icon mpp-icon-check'></i></label>";
            } else{
                if( $scope == 'admin' ){
                    $content = "<span>$placeholder</span>";
                } else{
                    $input_type = $this->option( 'e-input-type' );
                    if( $this->type == 'field_email' ){
                        $input_type = 'email';
                    } else if( $this->type == 'field_phone' ){
                        $input_type = 'tel';
                    } else if( $this->type == 'custom_field_input_hidden' ){
                        $input_type = 'hidden';
                    }

                    $hidden_field = '';
                    if( $this->type == 'field_email' ){
                        $hidden_field = "<input type='hidden' name='mpp_field_email' value='$name'>";
                        $name = 'email';
                    } else if( $this->type == 'field_first_name' ){
                        $hidden_field = "<input type='hidden' name='mpp_field_first_name' value='$name'>";
                        $name = 'first_name';
                    } else if( $this->type == 'field_last_name' ){
                        $hidden_field = "<input type='hidden' name='mpp_field_last_name' value='$name'>";
                        $name = 'last_name';
                    }
                    $valid_characters = $this->option( 'e-valid-characters' );
                    $min_characters = $this->option( 'e-min-characters' );
                    $content = "<input type='$input_type' name='$name' class='mpp-input' value='$value' placeholder='$placeholder' tabindex='$tabindex' data-valid-characters='$valid_characters' data-min-characters='$min_characters'   $required >";
                    $content .= $hidden_field;

                }
            }
        } //Dropdown
        else if( in_array( $this->type, self::form_elements()['dropdown'] ) ){
            if( $scope == 'admin' ){
                $content = "<span>$placeholder<i class='mpp-icon mpp-icon-chevron-down'></i></span>";
            } else{
                $options = explode( "\n", $options );
                $options = array_map( 'trim', $options );
                $options = array_filter( $options );//remove empty options
                $content = "<select name='$name' class='mpp-select' tabindex='$tabindex' $required>";
                $content .= "<option value=''>$placeholder</option>";
                if( is_array( $options ) && ! empty( $options ) ){
                    foreach( $options as $option ){
                        $parts = explode( '|', $option );
                        $parts = array_map( 'trim', $parts );
                        if( count( $parts ) > 1 ){
                            $val = $parts[0];
                            $display = $parts[1];
                        } else{
                            $val = $option;
                            $display = $option;
                        }
                        $selected = $val == $value ? 'selected' : '';
                        $content .= "<option value='$val' $selected>$display</option>";
                    }
                }
                $content .= "</select>";
                $content .= "<i class='mpp-icon mpp-icon-chevron-down mpp-icon-dropdown'></i>";
            }
        } //Textarea
        else if( in_array( $this->type, self::form_elements()['textarea'] ) ){
            if( $scope == 'admin' ){
                $content = "<span>$placeholder</span>";
            } else{
                $content = "<textarea name='$name' class='mpp-textarea' placeholder='$placeholder' tabindex='$tabindex' $required>$value</textarea>";
            }
        } //Submit
        else if( $this->type == self::form_elements()['submit'] ){
            if( $scope == 'admin' ){
                $content = $this->option( 'e-content-textarea' );
            } else{
                $content = $this->option( 'e-content-textarea' );
            }
        }
        return $content;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Construye estilo del elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function build_style(){
        $style = '';
        //$index = $this->index + 1;
        $index = $this->index;
        $selector = ".mpp-wrap-{$this->popup->id} .mpp-{$this->device}-element-$index";
        $style .= $this->get_style( $selector );

        switch( $this->type ){
            case 'field_first_name':
            case 'field_last_name':
            case 'field_email':
            case 'field_phone':
            case 'field_message':
            case 'custom_field_input_text':
            case 'custom_field_input_hidden':
                $target = 'input';
                if( in_array( $this->type, self::form_elements()['textarea'] ) ){
                    $target = 'textarea';
                } else if( in_array( $this->type, self::form_elements()['dropdown'] ) ){
                    $target = 'select';
                }
                $style .= $this->get_content_style( "$selector .mpp-element-content $target" );
                $style .= $this->get_content_style( "$selector .mpp-element-content {$target}:hover", 'hover' );
                $style .= $this->get_content_style( "$selector .mpp-element-content {$target}:focus", 'focus' );
                break;

            case 'shortcode':
                $style .= '';
                break;
            default:
                $style .= $this->get_content_style( "$selector .mpp-element-content" );
                $style .= $this->get_content_style( "$selector .mpp-element-content:hover", 'hover' );
                $style .= $this->get_content_style( "$selector .mpp-element-content:focus", 'focus' );

                if( $this->type == 'custom_field_input_checkbox' || $this->type == 'custom_field_input_checkbox_gdpr' ){
                    $css = new CSS( "$selector .mpp-element-content input[type=checkbox]:checked + i" );
                    $css->prop( 'color', $this->option( 'e-field-checked-color' ) );
                    $style .= $css->build_css();
                }
                break;
        }
        return $style;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Estilo del elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function get_style( $selector = null, $type = 'css' ){
        $css = new CSS( $selector );

        $css->prop( 'z-index', $this->z_index );
        $css->prop( 'visibility', $this->option( 'visibility' ) );

        //Size & Position
        $position = $this->get_position_options();
        $size = $this->get_size_options();
        $css->prop( 'width', $size['width'] );
        $css->prop( 'height', $size['height'] );
        $css->prop( 'top', $position['top'] );
        $css->prop( 'left', $position['left'] );

        //Advanced
        $advanced = $this->get_advanced_options();
        $css->prop( 'cursor', $advanced['cursor'] );

        if( $type == 'json' ){
            return json_encode( $css->get_props() );
        }
        return $css->build_css();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Estilo del contenenido del elemento
    |---------------------------------------------------------------------------------------------------
    */
    public function get_content_style( $selector = null, $type = 'css' ){
        //Focus properties
        if( $type == 'focus' ){
            $focus_css = new CSS( $selector );
            $focus = $this->get_focus_options();
            if( $this->option( 'e-focus-border-enable' ) == 'on' ){
                $focus_css->prop( 'border-color', $focus['border-color'] );
            }
            return $focus_css->build_css();
        }

        $css = new CSS();
        $normal_css = new CSS( $selector );
        $admin_selector = ".ampp-{$this->device}-content .ampp-element-{$this->index}";

        //Hover properties
        if( $type == 'hover' || $type == 'json' ){
            $hover_css = new CSS( $selector );
            $hover = $this->get_hover_options();
            if( $type == 'json' || $this->option( 'e-hover-bg-enable' ) == 'on' ){
                $hover_css->prop( 'background', $hover['background-color'] );
            }
            if( $type == 'json' || $this->option( 'e-hover-font-enable' ) == 'on' ){
                $hover_css->prop( 'color', $hover['font-color'] );
            }
            if( $type == 'json' || $this->option( 'e-hover-border-enable' ) == 'on' ){
                $hover_css->prop( 'border-color', $hover['border-color'] . ' !important' );
            }
            if( $type == 'hover' ){
                return $hover_css->build_css();
            }
        }

        //Size & Position
        $padding = $this->get_padding_options();
        $padding_css = new CSS();

        $padding_css->prop( 'padding-top', $padding['top'] );
        $padding_css->prop( 'padding-right', $padding['right'] );
        $padding_css->prop( 'padding-bottom', $padding['bottom'] );
        $padding_css->prop( 'padding-left', $padding['left'] );

        //Font
        $font = $this->get_font_options();
        $font_css = new CSS();
        $normal_css->prop( 'line-height', $font['line-height'] );
        $font_css->prop( 'font-family', $font['font-family'] );
        $font_css->prop( 'font-size', $font['font-size'] );
        $font_css->prop( 'font-weight', $font['font-weight'] );
        $font_css->prop( 'font-style', $font['font-style'] );
        $font_css->prop( 'color', $font['color'] );
        $font_css->prop( 'text-align', $font['text-align'] );
        $font_css->prop( 'white-space', $font['white-space'] );
        $font_css->prop( 'text-transform', $font['text-transform'] );
        $font_css->prop( 'text-decoration', $font['text-decoration'] );
        $font_css->prop( 'letter-spacing', $font['letter-spacing'] );
        $font_css->prop( 'text-shadow', $font['text-shadow'] );

        //Background
        $bg = $this->get_background_options();
        $bg_css = new CSS();
        if( $bg['enable-gradient'] == 'on' ){
            $bg_css->prop( 'background', "linear-gradient({$bg['angle-gradient']}, {$bg['color']}, {$bg['color-gradient']} )" );
        } else{
            $bg_css->prop( 'background-color', $bg['color'] );
            $bg_css->prop( 'background-repeat', $bg['repeat'] );
            $bg_css->prop( 'background-size', $bg['size'] );
            $bg_css->prop( 'background-position', $bg['position'] );
            $bg_css->prop( 'background-image', 'url(' . $bg['image'] . ')' );
        }

        //Border
        $border = $this->get_border_options();
        $border_css = new CSS();
        $border_css->prop( 'border-color', $border['color'] . ' !important' );
        $border_css->prop( 'border-style', $border['style'] . ' !important' );
        $border_css->prop( 'border-top-width', $border['top-width'] );
        $border_css->prop( 'border-right-width', $border['right-width'] );
        $border_css->prop( 'border-bottom-width', $border['bottom-width'] );
        $border_css->prop( 'border-left-width', $border['left-width'] );
        $border_css->prop( 'border-radius', $border['radius'] );

        //Advanced
        $advanced = $this->get_advanced_options();
        $normal_css->prop( 'opacity', $advanced['opacity'] );
        $normal_css->prop( 'overflow', $advanced['overflow'] );
        $css->prop( 'box-shadow', $advanced['box-shadow'] );


        $normal_css->merge_props( $css->get_props() );
        $normal_css->merge_props( $font_css->get_props() );
        $normal_css->merge_props( $padding_css->get_props() );
        $normal_css->merge_props( $bg_css->get_props() );
        $normal_css->merge_props( $border_css->get_props() );

        if( $type == 'css' ){
            if( $selector == '.ampp-el-content' ){//inline style for visual editor
                return $normal_css->get_inline_style();
            } else {
                $return = '';
                $return .= $normal_css->build_css();
                return $return;
            }
        } else if( $type == 'json' ){
            $style['normal'] = $normal_css->get_props();
            $style['hover'] = $hover_css->get_props();
            return json_encode( $style );
        }
        return '';
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Elementos de formulario
    |---------------------------------------------------------------------------------------------------
    */
    public static function form_elements(){
        return array(
            'input' => array(
                'field_first_name',
                'field_last_name',
                'field_email',
                'field_phone',
                'custom_field_input_text',
                'custom_field_input_hidden',
                'custom_field_input_checkbox',
                'custom_field_input_checkbox_gdpr',
            ),
            'dropdown' => array(
                'custom_field_dropdown',
            ),
            'textarea' => array(
                'field_message',
            ),
            'submit' => 'field_submit',
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Todos los elementos de formulario
    |---------------------------------------------------------------------------------------------------
    */
    public function all_form_elements(){
        $all = array();
        foreach( $this->form_elements() as $key => $value ){
            if( is_array( $value ) ){
                foreach( $value as $type ){
                    $all[] = $type;
                }
            } else{
                $all[] = $value;
            }
        }
        return $all;
    }


}
