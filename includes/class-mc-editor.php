<?php namespace MasterPopups\Includes;

use Xbox\Includes\CSS;

class McEditor {
    public $plugin = null;
    public $popup = null;
    public $metabox = null;
    protected static $instance = null;
    protected $google_fonts = array();

    /*
    |---------------------------------------------------------------------------------------------------
    | Constructor
    |---------------------------------------------------------------------------------------------------
    */
    private function __construct( $plugin = null, $options_manager = null ){
        $this->plugin = $plugin;
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

    public static function get_instance( $plugin = null, $options_manager = null ){
        if( null === self::$instance ){
            self::$instance = new self( $plugin, $options_manager );
        }
        return self::$instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Build popup editor
    |---------------------------------------------------------------------------------------------------
    */
    public function build( $popup ){
        if( ! $popup ){
            return '';
        }

        $this->popup = $popup;
        $this->metabox = $this->popup->metabox;

        $return = '';
        $return .= "<div id='mc-wrap'>";

        $return .= $this->build_header();
        $return .= "<div id='mc'>";
        $return .= $this->build_rule();
        $return .= $this->build_panels();
        $return .= "<div id='mc-viewport'>";
        $return .= $this->build_device();
        $return .= "</div>";//#mc-viewport
        $return .= "<div id='mc-resizable-handler' class='ui-resizable-handle ui-resizable-s'><i class='xbox-icon xbox-icon-ellipsis-h'></i></div>";
        $return .= "</div>";//#mc
        //$return .= $this->build_footer();
        $return .= "</div>";//#mc-wrap
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Rules
    |---------------------------------------------------------------------------------------------------
    */
    public function build_rule(){
        $return = '';
        $return .= "<div id='mc-x-rule' class='mc-rule xbox-noselect'>";
        for( $i = -15; $i < 30; $i++ ){
            $unit = $i * 100;
            $return .= "<li><span>{$unit}</span></li>";
        }
        $return .= "</div>";
        $return .= "<div id='mc-y-rule' class='mc-rule xbox-noselect'>";
        for( $i = -5; $i < 10; $i++ ){
            $unit = $i * 100;
            $return .= "<li><span>{$unit}</span></li>";
        }
        $return .= "</div>";
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Build panels
    |---------------------------------------------------------------------------------------------------
    */
    public function build_panels(){
        $return = '';
        $return .= "<span id='mc-open-settings' class='mc-open-panel'><i class='xbox-icon xbox-icon-wrench'></i></span>";
        $return .= "<span class='mc-open-types mc-open-types-top mc-open-panel'><i class='xbox-icon xbox-icon-backward'></i></span>";
        $return .= "<span class='mc-open-types mc-open-types-bottom mc-open-panel'><i class='xbox-icon xbox-icon-backward'></i></span>";

        $return .= "<div id='mc-types' class='mc-is-open mc-panel mc-panel-blue---'>";
        $return .= "<i class='mpp-icon mpp-icon-spinner mpp-icon-spin ampp-loader'></i>";
        $return .= "<div class='mc-section'>";
        $return .= "<h4><i class='xbox-icon xbox-icon-caret-right'></i>Basic elements</h4>";
        $return .= $this->plugin->options_manager->get_html_type_elements( 'basic' );
        $return .= "</div>";//.mc-section
        $return .= "<div class='mc-section'>";
        $return .= "<h4><i class='xbox-icon xbox-icon-caret-right'></i>Form elements</h4>";
        $return .= $this->plugin->options_manager->get_html_type_elements( 'form' );
        $return .= "</div>";//.mc-section
        $return .= "</div>";//#mc-settings

        $return .= "<div id='mc-settings' class='mc-panel mc-panel-blue---'>";
        $return .= "<div class='mc-section mc-section-guides'>";
        $return .= "<h4><i class='xbox-icon xbox-icon-caret-right'></i>Guides</h4>";
        // $return .= "<div class='mc-fieldset mc-has-icheck'>";
        // 	$return .= "<label class='mc-label'>Show guides</label>";
        // 	$return .= "<div class='mc-control'>";
        // 		$return .= "<label><input type='radio' class='mc-radio'  name='mc-show-guides' checked> Yes</label>";
        // 		$return .= "<label><input type='radio' class='mc-radio' name='mc-show-guides'> No</label>";
        // 	$return .= "</div>";
        // $return .= "</div>";//.mc-fieldset

        $return .= "<div class='mc-fieldset mc-has-icheck'>";
        // $return .= "<label class='mc-label'>";
        $return .= "<div class='mc-control'>";
        $return .= "<label><input type='checkbox' class='mc-checkbox' name='mc-show-guides' checked>Show guides</label>";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset

        $return .= "</div>";//.mc-section

        $return .= "<div class='mc-section mc-section-tools'>";
        $return .= "<h4><i class='xbox-icon xbox-icon-caret-right'></i>Tools</h4>";
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>Horizontal alignment</label>";
        $return .= "<div class='mc-control'>";
        $return .= "<span class='mc-icon-setting mc-alignment-left' title='" . esc_html__( 'Align left', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-alignment-center' title='" . esc_html__( 'Align center', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-alignment-right' title='" . esc_html__( 'Align right', 'masterpopups' ) . "'></span>";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>Vertical alignment</label>";
        $return .= "<div class='mc-control'>";
        $return .= "<span class='mc-icon-setting mc-alignment-top' title='" . esc_html__( 'Align top', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-alignment-middle' title='" . esc_html__( 'Align middle', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-alignment-bottom' title='" . esc_html__( 'Align bottom', 'masterpopups' ) . "'></span>";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>Size</label>";
        $return .= "<div class='mc-control'>";
        $return .= "<span class='mc-icon-setting mc-size-full-width' title='" . esc_html__( 'Full width', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-size-default-width mc-disabled' title='" . esc_html__( 'Previous width', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-size-full-height' title='" . esc_html__( 'Full height', 'masterpopups' ) . "'></span>";
        $return .= "<span class='mc-icon-setting mc-size-default-height mc-disabled' title='" . esc_html__( 'Previous height', 'masterpopups' ) . "'></span>";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset

        $return .= "</div>";//.mc-section

        $return .= "<div class='mc-section mc-section-shortcuts'>";
        $return .= "<h4><i class='xbox-icon xbox-icon-caret-right'></i>Keyboard Shortcuts</h4>";
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>" . __( 'Move Element', 'masterpopups' ) . ":</label>";
        $return .= "<div class='mc-control'>";
        $return .= "Shift + Arrow keys";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>" . __( 'Duplicate Element', 'masterpopups' ) . ":</label>";
        $return .= "<div class='mc-control'>";
        $return .= "(Ctrl | Command) + (D | J)";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset
        $return .= "<div class='mc-fieldset'>";
        $return .= "<label class='mc-label'>" . __( 'Remove Element', 'masterpopups' ) . ":</label>";
        $return .= "<div class='mc-control'>";
        $return .= "Backspace or Delete";
        $return .= "</div>";
        $return .= "</div>";//.mc-fieldset

        $return .= "</div>";//.mc-section

        $return .= "</div>";//#mc-settings
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Header
    |---------------------------------------------------------------------------------------------------
    */
    public function build_header(){
        $return = '';
        $return .= "<div id='mc-header'>";
        $return .= "</div>";
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Footer
    |---------------------------------------------------------------------------------------------------
    */
    public function build_footer(){
        $return = '';
        $return .= "<div id='mc-footer'>";
        $return .= "</div>";
        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Build Device
    |---------------------------------------------------------------------------------------------------
    */
    public function build_device(){
        $return = '';
        $css = new CSS();
        $css->prop( 'width', CSS::number( $this->popup->option( 'browser-width' ), 'px' ) );
        $css->prop( 'height', CSS::number( $this->popup->option( 'browser-height' ), 'px' ) );
        $device_style = $css->build_css();

        $return .= "<div id='mc-device' data-device='desktop' style='{$device_style}'>";
        $return .= "<div id='mc-device-caption' class='noselect'>" . __( 'Browser', 'masterpopups' ) . "</div>";
        $return .= "<div id='mc-device-resizable-handler' class='ui-resizable-handle ui-resizable-s'></div>";
        $return .= $this->build_popup();
        $return .= "</div>";
        return $return;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Build Popup
    |---------------------------------------------------------------------------------------------------
    */
    public function build_popup(){
        $return = '';
        $popup_class[] = 'ampp-popup';
        if( 'on' == $this->popup->option( 'full-screen' ) ){
            $popup_class[] = 'ampp-full-screen';
        }
        $popup_class[] = 'ampp-position-' . $this->popup->option( 'position' );
        $popup_class = implode( ' ', $popup_class );

        $css = new CSS();
        $style = $css->build_css( array(
            'width' => CSS::number( $this->popup->option( 'width' ), $this->popup->option( 'width_unit' ) ),
            'height' => CSS::number( $this->popup->option( 'height' ), $this->popup->option( 'height_unit' ) ),
            'margin-top' => CSS::number( $this->popup->option( 'margin-top' ), 'px' ),
            'margin-right' => CSS::number( $this->popup->option( 'margin-right' ), 'px' ),
            'margin-bottom' => CSS::number( $this->popup->option( 'margin-bottom' ), 'px' ),
            'margin-left' => CSS::number( $this->popup->option( 'margin-left' ), 'px' ),
        ) );
        $wrap_style = $this->popup->get_wrap_style();
        $content_style = $this->popup->get_content_style();
        $overflow = $this->popup->option( 'overflow' );

        $return .= "<div class='$popup_class' style='$style'>";
        $return .= "<div class='ampp-wrap' style='$wrap_style'>";
        $return .= "<div class='ampp-content ampp-desktop-content' style='$content_style; overflow: $overflow;'>";
        $return .= $this->build_elements( 'desktop' );
        $return .= "</div>";//.ampp-elements
        $return .= "<div class='ampp-content ampp-mobile-content' style='$content_style; overflow: $overflow;'>";
        $return .= $this->build_elements( 'mobile' );
        $return .= "</div>";//.ampp-elements
        $return .= "</div>";//ampp-wrap
        $return .= "</div>";//.ampp-popup
        $return .= $this->build_overlay();

        //Google fonts
        //$href = Functions::make_url_google_fonts( $this->google_fonts, array_values( Assets::local_fonts() ) );
        //$return .= '<link class="mpp-google-fonts" href="' . $href . '" rel="stylesheet" type="text/css">';

        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Build Overlay
    |---------------------------------------------------------------------------------------------------
    */
    public function build_overlay(){
        $return = '';
        $overlay_style = $this->popup->get_overlay_style();
        $return .= "<div class='ampp-overlay' style='{$overlay_style}'>";
        $return .= "</div>";//.ampp-popup
        return $return;
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Build Elements
    |---------------------------------------------------------------------------------------------------
    */
    public function build_elements( $device = 'desktop' ){
        $return = '';
        $elements = array();
        if( $device == 'desktop' ){
            $elements = $this->popup->desktop_elements;
        } else{
            $elements = $this->popup->mobile_elements;
        }

        foreach( $elements as $index => $element ){
            $content_style = str_replace( '!important', '', $element->get_content_style( '.ampp-el-content' ) );
            $data_style = str_replace( '!important', '', $element->get_content_style( '.ampp-el-content', 'json' ) );
            $return .= "<div class='ampp-element ampp-element-{$element->index} mpp-element-{$element->type} mc-element ' style='{$element->get_style()}' data-index='{$element->index}' data-type='{$element->type}' data-device='$device' tabindex='1'>";
            $return .= "<div class='ampp-el-content' style='$content_style' data-style='$data_style'>";
            $return .= $element->get_content( 'admin' );
            $return .= "</div>";//.ampp-el-content
            $return .= $this->get_controls();
            $return .= "</div>";//.ampp-element

            //Google fonts
            $this->google_fonts[] = $element->option( 'e-font-family' );
        }

        return $return;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Controles para los elementos
    |---------------------------------------------------------------------------------------------------
    */
    public function get_controls(){
        $return = '';
        $duplicate_text = esc_html__( 'Duplicate', 'masterpopups' );
        $remove_text = esc_html__( 'Remove', 'masterpopups' );
        $copy_style_text = esc_html__( 'Copy style', 'masterpopups' );
        $paste_style_text = esc_html__( 'Paste style', 'masterpopups' );
        $return .= "<div class='mc-controls'>";
        $return .= "<span class='mc-drag-element' title=''><i class='xbox-icon xbox-icon-arrows'></i></span>";

        $return .= "<div class='mc-position-element'>";
        $return .= "X: <span class='mc-position-element-left'></span>";
        $return .= "Y: <span class='mc-position-element-top'></span>";
        $return .= "</div>";

        $return .= "<span class='mc-duplicate-element' title='$duplicate_text'><i class='xbox-icon xbox-icon-clone'></i></span>";
        $return .= "<span class='mc-copy-style' title='$copy_style_text'><i class='xbox-icon xbox-icon-eyedropper'></i></span>";
        $return .= "<span class='mc-paste-style' title='$paste_style_text'><i class='xbox-icon xbox-icon-pencil-square-o'></i></span>";
        $return .= "<span class='mc-remove-element' title='$remove_text'><i class='xbox-icon xbox-icon-trash'></i></span>";
        $return .= "</div>";
        return $return;
    }


}