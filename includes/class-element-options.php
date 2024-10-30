<?php namespace MasterPopups\Includes;

use Xbox\Includes\CSS;

class ElementOptions {
	public $options = array();
	protected static $prefix = '';


	/*
	|---------------------------------------------------------------------------------------------------
	| Acceso a cualquier opción
	|---------------------------------------------------------------------------------------------------
	*/
	public function option( $option_name = '', $default_value = null ) {
		$option_name = $this->get_option_name( $option_name );
		if( isset( $this->options[ $option_name ] ) ){
			return $this->options[$option_name];
		} else if( ! is_null( $default_value ) ){
			$this->options[ $option_name ] = $default_value;
			return $this->options[ $option_name ];
		}
		return null;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el nombre real de la opción
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_option_name( $name ){
		if( ! Functions::starts_with( self::$prefix, $name ) ){
			return self::$prefix.$name;
		}
		return $name;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Establece las opciones por defecto
	|---------------------------------------------------------------------------------------------------
	*/
	public static function default_options( $prefix = '' ){
		return array(
			$prefix.'index' => -1,
			$prefix.'type' => "close-icon",
			$prefix.'name' => "Close icon",
			$prefix.'visibility' => "visible",

			//Content
			$prefix.'e-content-textarea' => "",
			$prefix.'e-content-shortcode' => "[your-shortcode]",
			$prefix.'e-content-object' => "mpp-icon-heart",
			$prefix.'e-content-close-icon' => "mppfic-close-2",
			$prefix.'e-content-image' => "",
			$prefix.'e-content-url' => "",

			//Video
			$prefix.'e-video-type' => "youtube",
			$prefix.'e-content-video' => "",
			$prefix.'e-content-video-html5' => "",
			$prefix.'e-video-poster' => "",
			$prefix.'e-play-icon' => "mppfip-play",
			$prefix.'e-video-autoplay' => "off",
			$prefix.'e-video-youtube-parameters' => "hd=1&rel=0&showinfo=0&start=0&volume=100&loop=0",
			$prefix.'e-video-vimeo-parameters' =>  "api=1&byline=0&portrait=0&badge=0&title=0",


			//Form
			$prefix.'e-field-placeholder' => "",
			$prefix.'e-field-options' => "",
			$prefix.'e-field-name' => "",
			$prefix.'e-field-value' => "",
			$prefix.'e-field-required' => "off",
			$prefix.'e-field-checked' => "off",
			$prefix.'e-field-checked-color' => "rgba(0, 0, 0, 1)",
			$prefix.'e-input-type' => "text",


			//Size & Position
			$prefix.'e-position-top' => "30",
			$prefix.'e-position-top_unit' => "px",
			$prefix.'e-position-left' => "30",
			$prefix.'e-position-left_unit' => "px",
			$prefix.'e-position-top-right-page' => "off",
			$prefix.'e-size-width' => "auto",
			$prefix.'e-size-width_unit' => "px",
			$prefix.'e-size-height' => "auto",
			$prefix.'e-size-height_unit' => "px",
			$prefix.'e-full-screen' => "off",
			$prefix.'e-padding-top' => "0",
			$prefix.'e-padding-right' => "0",
			$prefix.'e-padding-bottom' => "0",
			$prefix.'e-padding-left' => "0",

			//Font
			$prefix.'e-font-family' => "Roboto",
			$prefix.'e-font-color' => "rgba(68, 68, 68, 1)",
			$prefix.'e-font-size' => "15",
			$prefix.'e-font-size_unit' => "px",
			$prefix.'e-font-weight' => "400",
			$prefix.'e-font-style' => "normal",
			$prefix.'e-text-align' => "left",
			$prefix.'e-line-height' => "1",
			$prefix.'e-line-height_unit' => "em",
			$prefix.'e-white-space' => "normal",
			$prefix.'e-text-transform' => "none",
			$prefix.'e-text-decoration' => "none",
			$prefix.'e-letter-spacing' => "normal",
			$prefix.'e-text-shadow' => "0px 0px 0px rgba(0,0,0,0)",
			//Font Hover
			$prefix.'e-hover-font-enable' => "off",
			$prefix.'e-hover-font-color' => "rgba(0,0,0,1)",

			//Background
			$prefix.'e-bg-color' => "rgba(0,0,0,0)",
			$prefix.'e-bg-repeat' => "no-repeat",
			$prefix.'e-bg-size' => "cover",
			$prefix.'e-bg-position' => "center center",
			$prefix.'e-bg-image' => "",
			$prefix.'e-bg-enable-gradient' => "off",
			$prefix.'e-bg-color-gradient' => "rgba(0,0,0,1)",
			$prefix.'e-bg-angle-gradient' => "180",
			$prefix.'e-bg-angle-gradient_unit' => "deg",
			//Background Hover
			$prefix.'e-hover-bg-enable' => "off",
			$prefix.'e-hover-bg-color' => "rgba(204,204,204,1)",

			//Border
			$prefix.'e-border-top-width' => "1",
			$prefix.'e-border-top-width_unit' => "px",
			$prefix.'e-border-right-width' => "1",
			$prefix.'e-border-right-width_unit' => "px",
			$prefix.'e-border-bottom-width' => "1",
			$prefix.'e-border-bottom-width_unit' => "px",
			$prefix.'e-border-left-width' => "1",
			$prefix.'e-border-left-width_unit' => "px",
			$prefix.'e-border-color' => "rgba(140, 140, 140, 1)",
			$prefix.'e-border-style' => "none",
			$prefix.'e-border-radius' => "0",
			$prefix.'e-border-radius_unit' => "px",

			//Focus
			$prefix.'e-hover-border-enable' => "off",
			$prefix.'e-hover-border-color' => "rgba(140, 140, 140, 1)",

			//Focus
			$prefix.'e-focus-border-enable' => "off",
			$prefix.'e-focus-border-color' => "rgba(140, 140, 140, 1)",

			//Animation
			$prefix.'e-animation-enable' => "off",
			$prefix.'e-open-animation' => "mpp-fadeIn",
			$prefix.'e-open-duration' => "1000",
			$prefix.'e-open-delay' => "200",
			$prefix.'e-close-animation' => "mpp-fadeOut",
			$prefix.'e-close-duration' => "1000",
			$prefix.'e-close-delay' => "200",

			//Advanced
			$prefix.'e-opacity' => "1",
			$prefix.'e-box-shadow' => "0px 0px 0px 0px rgba(0,0,0,0)",
			$prefix.'e-overflow' => "visible",
			$prefix.'e-cursor' => "default",
			$prefix.'e-valid-characters' => "all",
			$prefix.'e-min-characters' => '-1',

			//Actions
			$prefix.'e-onclick-action' => "default",
			$prefix.'e-onclick-popup-id' => "",
			$prefix.'e-onclick-url' => "http://",
			$prefix.'e-onclick-target' => "_self",
			$prefix.'e-onclick-cookie-name' => "",

			//Attributes
			$prefix.'e-attributes-id' => "",
			$prefix.'e-attributes-class' => "",
			$prefix.'e-attributes-title' => "",
		);
	}


	/*
	|---------------------------------------------------------------------------------------------------
	| Establece las opciones por defecto
	|---------------------------------------------------------------------------------------------------
	*/
	public function set_options( $options = array() ){
		$default_options = self::default_options( self::$prefix );
		$this->options = wp_parse_args( $options, $default_options );
		$this->index = (int) $this->option( self::$prefix.'index' );
		$this->z_index = $this->index + 1;
		$this->device = $this->option( self::$prefix.'device' );
		$this->type = $this->option( $this->device.'-elements_type' );
		$this->options[self::$prefix.'type'] = $this->type;
		$this->options[self::$prefix.'name'] = $this->option( $this->device.'-elements_name' );
		$this->options[self::$prefix.'visibility'] = $this->option( $this->device.'-elements_visibility');

		return $this->options;
	}


	/*
	|---------------------------------------------------------------------------------------------------
	| Position options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_position_options(){
		$position = array(
			'top'  => CSS::number( $this->option( 'e-position-top' ), 'px' ),
			'left' => CSS::number( $this->option( 'e-position-left' ), 'px' ),
		);
		return $position;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Size options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_size_options(){
		return array(
			'width'  => CSS::number( $this->option( 'e-size-width' ), $this->option( 'e-size-width_unit' ) ),
			'height' => CSS::number( $this->option( 'e-size-height' ), $this->option( 'e-size-height_unit' ) ),
			'full-screen' => $this->option( 'e-full-screen' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Padding options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_padding_options(){
		return array(
			'top'    => CSS::number( $this->option( 'e-padding-top' ), 'px' ),
			'right'  => CSS::number( $this->option( 'e-padding-right' ), 'px' ),
			'bottom' => CSS::number( $this->option( 'e-padding-bottom' ), 'px' ),
			'left'   => CSS::number( $this->option( 'e-padding-left' ), 'px' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Font options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_font_options(){
		return array(
			'font-family' => $this->option( 'e-font-family' ),
			'color'       => $this->option( 'e-font-color' ),
			'font-size'   => CSS::number( $this->option( 'e-font-size' ), $this->option( 'e-font-size_unit' ) ),
			'font-weight' => $this->option( 'e-font-weight' ),
			'font-style'  => $this->option( 'e-font-style' ),
			'text-align'  => $this->option( 'e-text-align' ),
			'line-height' => CSS::number( $this->option('e-line-height' ), $this->option( 'e-line-height_unit' ) ),
			'white-space' => $this->option( 'e-white-space' ),
			'text-transform' => $this->option( 'e-text-transform' ),
			'text-decoration' => $this->option( 'e-text-decoration' ),
            'letter-spacing' => $this->option( 'e-letter-spacing' ),
            'text-shadow' => $this->option( 'e-text-shadow' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Background options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_background_options(){
		return array(
			'color' => $this->option( 'e-bg-color' ),
			'repeat' => $this->option( 'e-bg-repeat' ),
			'size' => $this->option( 'e-bg-size' ),
			'position' => $this->option( 'e-bg-position' ),
			'image' => $this->option( 'e-bg-image' ),
			'enable-gradient' => $this->option( 'e-bg-enable-gradient' ),
			'color-gradient' => $this->option( 'e-bg-color-gradient' ),
			'angle-gradient' => CSS::number( $this->option( 'e-bg-angle-gradient' ), 'deg' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Border options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_border_options(){
		return array(
			'color'               => $this->option( 'e-border-color' ),
			'style'               => $this->option( 'e-border-style' ),
			'top-width'           => CSS::number( $this->option( 'e-border-top-width' ), 'px' ),
			'right-width'         => CSS::number( $this->option( 'e-border-right-width' ), 'px' ),
			'bottom-width'        => CSS::number( $this->option( 'e-border-bottom-width' ), 'px' ),
			'left-width'          => CSS::number( $this->option( 'e-border-left-width' ), 'px' ),
			'radius'              => CSS::number( $this->option( 'e-border-radius' ), 'px' ),
		);
	}


	/*
	|---------------------------------------------------------------------------------------------------
	| Animation options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_animation_options(){
		return array(
			'enable'   => $this->option( 'e-animation-enable' ),
			'effect'   => $this->option( 'e-open-animation' ),
			'duration' => CSS::number( $this->option( 'e-open-duration' ) ),
			'delay'    => CSS::number( $this->option( 'e-open-delay' ) )
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Advanced options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_advanced_options(){
		return array(
			'opacity'    => CSS::number( $this->option( 'e-opacity' ) ),
			'box-shadow' => $this->option( 'e-box-shadow' ),
			'overflow'   => $this->option( 'e-overflow' ),
			'cursor'   => $this->option( 'e-cursor' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Hover options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_hover_options(){
		return array(
			'font-color' => $this->option( 'e-hover-font-color' ),
			'background-color' => $this->option( 'e-hover-bg-color' ),
			'border-color' => $this->option( 'e-hover-border-color' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Focus options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_focus_options(){
		return array(
			'border-color' => $this->option( 'e-focus-border-color' ),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Linking options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_actions_options(){
		return array(
			'onclick' => array(
				'action' => $this->option( 'e-onclick-action' ),
				'popup_id' => (int) $this->option( 'e-onclick-popup-id' ),
				'url' => $this->option( 'e-onclick-url' ),
				'target' => $this->option( 'e-onclick-target' ),
                'cookie_name' => $this->option( 'e-onclick-cookie-name' ),
			),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Attributes options
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_attributes_options(){
		return array(
			'id' => $this->option( 'e-attributes-id' ),
			'class' => $this->option( 'e-attributes-class' ),
			'title' => $this->option( 'e-attributes-title' ),
		);
	}

    /*
    |---------------------------------------------------------------------------------------------------
    | Countdown options
    |---------------------------------------------------------------------------------------------------
    */
    public function get_countdown_options(){
        return array(
            'width' => CSS::number( $this->option( 'e-countdown-width' ), 'px' ) ,
            'height' => CSS::number( $this->option( 'e-countdown-height' ), 'px' ),
            'label-font-color' => $this->option( 'e-countdown-label-font-color' ),
            'label-font-size' => CSS::number( $this->option( 'e-countdown-label-font-size' ), 'px' ),
        );
    }




}
