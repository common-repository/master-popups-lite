<?php namespace MasterPopups\Includes;

class Types {
	private static $prefix = 'mpp_';
	private static $all = array(
		'close-icon',
		'text-html',
		'image',
		'video',
		'button',
		'shortcode',
		'object',
		'shape',
		'iframe',
		'countdown',

		'field_first_name',
		'field_last_name',
		'field_email',
		'field_phone',
		'custom_field_input_text',
		'custom_field_input_hidden',
		'custom_field_input_checkbox',
		'custom_field_input_checkbox_gdpr',
		'custom_field_dropdown',

		'field_message',
		'field_submit',
	);

	/*
	|---------------------------------------------------------------------------------------------------
	| Retorna los tipos de elementos
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_all(){
		$types = array();
		foreach( self::$all as $type ){
			$method = str_replace( '-', '_', $type );
			if( method_exists( __CLASS__, $method ) ){
				$types[$type] = self::$method();
			}
		}
		return $types;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "close-icon"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function close_icon(){
		return array(
			'icon' => 'xbox-icon xbox-icon-window-close',
			'text' => 'Close icon',
			'field_values' => array(
				//Size & Position
				array(
					'name' => 'e-size-width',
					'value' => '22',
				),
				array(
					'name' => 'e-size-height',
					'value' => '22',
				),
				//Font
				array(
					'name' => 'e-font-size',
					'value' => '22',
				),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo texto html
	|---------------------------------------------------------------------------------------------------
	*/
	public static function text_html(){
		return array(
			'icon' => 'xbox-icon xbox-icon-font',
			'text' => 'Text / HTML',
			'field_values' => array(
				//Content
				array(
					'name' => 'e-content-textarea',
					'value' => __( 'Custom text', 'masterpopups' ),
				),
				//Font
				array(
					'name' => 'e-line-height',
					'value' => '1.5',
				),
                array(
                    'name' => 'e-letter-spacing',
                    'value' => 'normal',
                ),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "image"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function image(){
		return array(
			'icon' => 'xbox-icon xbox-icon-image',
			'text' => 'Image',
			'field_values' => array(
				//Content
				array(
					'name' => 'e-content-image',
					'value' => MPP_URL.'assets/admin/images/default-image.png',
				),
				//Size & Position
				array(
					'name' => 'e-size-width',
					'value' => '100',
				),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "video"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function video(){
		return array(
			'icon' => 'xbox-icon xbox-icon-youtube-play',
			'text' => 'Video',
			'field_values' => array(
				//Content
				array(
					'name' => 'e-video-poster',
					'value' => MPP_URL.'assets/admin/images/default-video.png',
				),
				//Size &Position
				array(
					'name' => 'e-size-width',
					'value' => '300',
				),
				array(
					'name' => 'e-size-height',
					'value' => '170',
				),
				array(
					'name' => 'e-position-top',
					'value' => '0',
				),
				array(
					'name' => 'e-position-left',
					'value' => '0',
				),
				//Font
				array(
					'name' => 'e-font-size',
					'value' => '50',
				),
				array(
					'name' => 'e-font-color',
					'value' => 'rgba(255,255,255,1)',
				),
				//Background
				array(
					'name' => 'e-bg-color',
					'value' => 'rgba(0,0,0,1)',
				),

			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Campos personalizados para los botones
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_values_for_button_elements(){
		return array(
			//Size & Position
			array(
				'name' => 'e-padding-top',
				'value' => '12',
			),
			array(
				'name' => 'e-padding-right',
				'value' => '25',
			),
			array(
				'name' => 'e-padding-bottom',
				'value' => '12',
			),
			array(
				'name' => 'e-padding-left',
				'value' => '25',
			),
			//Font
			array(
				'name' => 'e-font-color',
				'value' => 'rgba(255,255,255,1)',
			),
			array(
				'name' => 'e-text-align',
				'value' => 'center',
			),
            array(
                'name' => 'e-letter-spacing',
                'value' => 'normal',
            ),
			//Background
			array(
				'name' => 'e-bg-color',
				'value' => '#05B489',
			),
			//Border
			array(
				'name' => 'e-border-radius',
				'value' => '50',
                'unit' => 'px'
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "button"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function button(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-toggle-on',
			'text' => 'Button',
		);
		$field_values = self::field_values_for_button_elements();
		$field_values[] = array(
			'name' => 'e-content-textarea',
			'value' => __( 'Download', 'masterpopups' ),
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo shortcode
	|---------------------------------------------------------------------------------------------------
	*/
	public static function shortcode(){
		return array(
			'icon' => 'xbox-icon xbox-icon-magic',
			'text' => 'Shortcode',
			'field_values' => array(
				//Size & Position
				array(
					'name' => 'e-size-width',
					'value' => '250',
				),
				array(
					'name' => 'e-size-height',
					'value' => '100',
				),
				//Font
				array(
					'name' => 'e-font-color',
					'value' => 'rgba(20,20,20,1)',
				),
                array(
                    'name' => 'e-letter-spacing',
                    'value' => 'normal',
                ),
				//Background
				array(
					'name' => 'e-bg-color',
					'value' => 'rgba(238,238,238,1)',
				),

				//Advanced
				array(
					'name' => 'e-overflow',
					'value' => 'auto',
				),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "object"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function object(){
		return array(
			'icon' => 'xbox-icon xbox-icon-cube',
			'text' => 'Object',
			'field_values' => array(
				//Size & Position
				array(
					'name' => 'e-size-width',
					'value' => '40',
				),
				array(
					'name' => 'e-size-height',
					'value' => '40',
				),
				//Font
				array(
					'name' => 'e-font-size',
					'value' => '40',
				),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "shape"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function shape(){
		return array(
			'icon' => 'xbox-icon xbox-icon-square',
			'text' => 'Shape',
			'field_values' => array(
				//Size & Position
				array(
					'name' => 'e-size-width',
					'value' => '100',
				),
				array(
					'name' => 'e-size-height',
					'value' => '100',
				),
				//Font
				array(
					'name' => 'e-font-color',
					'value' => 'rgba(255,255,255,1)',
				),
				//Background
				array(
					'name' => 'e-bg-color',
					'value' => 'rgba(0,0,0,0.8)',
				),
				// array(
				// 	'name' => 'e-hover-bg-color',
				// 	'value' => 'rgba(100,0,0,0.8)',
				// ),
			)
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "iframe"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function iframe(){
		return array(
			'icon' => 'xbox-icon xbox-icon-link',
			'text' => 'Iframe',
			'field_values' => array(
			)
		);
	}

    /*
    |---------------------------------------------------------------------------------------------------
    | Tipo "countdown"
    |---------------------------------------------------------------------------------------------------
    */
    public static function countdown(){
        return array(
            'icon' => 'xbox-icon xbox-icon-clock-o',
            'text' => 'Countdown',
            'field_values' => array(
            )
        );
    }


	/*
	|---------------------------------------------------------------------------------------------------
	| Plantilla para tipos de elementos de formulario
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_values_for_form_elements(){
		return array(
			//Size & Position
			array(
				'name' => 'e-size-width',
				'value' => '300',
			),
			array(
				'name' => 'e-padding-left',
				'value' => '15',
			),
			array(
				'name' => 'e-padding-right',
				'value' => '15',
			),
			//Font
			array(
				'name' => 'e-line-height',
				'value' => '1.5',
			),
            array(
                'name' => 'e-letter-spacing',
                'value' => 'normal',
            ),
			//Background
			array(
				'name' => 'e-bg-color',
				'value' => 'rgba(255,255,255,1)',
			),
			//Border
			array(
				'name' => 'e-border-style',
				'value' => 'solid',
			),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_first_name"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_first_name(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-user',
			'text' => 'Name',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => __( 'Name', 'masterpopups' ),
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_first_name',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '38',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_last_name"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_last_name(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-user-plus',
			'text' => 'Last Name',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => __( 'Last name', 'masterpopups' ),
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_last_name',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '38',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_email"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_email(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-envelope',
			'text' => 'Email',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => 'Email',
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_email',
		);
		$field_values[] = array(
			'name' => 'e-field-required',
			'value' => 'on',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '38',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_phone"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_phone(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-phone',
			'text' => 'Phone',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => __( 'Phone', 'masterpopups' ),
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_phone',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '38',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_message"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_message(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-newspaper-o',
			'text' => 'Message',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => __( 'Message', 'masterpopups' ),
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_message',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '80',
		);
		$field_values[] = array(
			'name' => 'e-padding-top',
			'value' => '10',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "field_submit"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_submit(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-send',
			'text' => 'Submit Button',
		);
		$field_values = self::field_values_for_button_elements();
		$field_values[] = array(
			'name' => 'e-content-textarea',
			'value' => __( 'Subscribe', 'masterpopups' ),
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "custom_field_input_text"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function custom_field_input_text(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-text-height',
			'text' => 'Input text',
		);
		$field_values = self::field_values_for_form_elements();
		$field_values[] = array(
			'name' => 'e-field-placeholder',
			'value' => __( 'Custom field', 'masterpopups' ),
		);
		$field_values[] = array(
			'name' => 'e-field-name',
			'value' => 'field_subject',
		);
		$field_values[] = array(
			'name' => 'e-size-height',
			'value' => '38',
		);
		$data['field_values'] = $field_values;
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "custom_field_input_hidden"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function custom_field_input_hidden(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-question',
			'text' => 'Input hidden',
		);
		$data['field_values'] = array();
		return $data;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Plantilla para tipos de elementos de formulario
	|---------------------------------------------------------------------------------------------------
	*/
	public static function field_values_for_radiochecks(){
		return array(
			//Size & Position
			array(
				'name' => 'e-size-width',
				'value' => '22',
			),
			array(
				'name' => 'e-size-height',
				'value' => '22',
			),
			//Font
			array(
				'name' => 'e-text-align',
				'value' => 'center',
			),
			array(
				'name' => 'e-font-color',
				'value' => 'rgba(210,210,210,1)',
			),
			//Background
			array(
				'name' => 'e-bg-color',
				'value' => 'rgba(255,255,255,1)',
			),
			//Border
			array(
				'name' => 'e-border-style',
				'value' => 'solid',
			),
		);
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "custom_field_input_checkbox"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function custom_field_input_checkbox(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-check-square',
			'text' => 'Checkbox',
		);
		$data['field_values'] = self::field_values_for_radiochecks();
		return $data;
	}

    /*
    |---------------------------------------------------------------------------------------------------
    | Tipo "custom_field_input_checkbox_gdpr"
    |---------------------------------------------------------------------------------------------------
    */
    public static function custom_field_input_checkbox_gdpr(){
        $data = array(
            'icon' => 'xbox-icon xbox-icon-check-square',
            'text' => 'GDPR',
        );
        $field_values = self::field_values_for_radiochecks();
        $field_values[] = array(
            'name' => 'e-field-value',
            'value' => '1',
        );
        $field_values[] = array(
            'name' => 'e-field-required',
            'value' => 'on',
        );
        $data['field_values'] = $field_values;
        return $data;
    }

	/*
	|---------------------------------------------------------------------------------------------------
	| Tipo "custom_field_dropdown"
	|---------------------------------------------------------------------------------------------------
	*/
	public static function custom_field_dropdown(){
		$data = array(
			'icon' => 'xbox-icon xbox-icon-list',
			'text' => 'Dropdown',
		);
		$data['field_values'] = array();
		return $data;
	}



}

