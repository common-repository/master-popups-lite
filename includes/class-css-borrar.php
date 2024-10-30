<?php namespace MasterPopups\Includes;

class CSS {
	public $css = array();
	public $selector = null;

	/*
	|---------------------------------------------------------------------------------------------------
	| Constructor
	|---------------------------------------------------------------------------------------------------
	*/
	public function __construct( $selector = null ){
		$this->selector = $selector;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Agrega una propiedad css
	|---------------------------------------------------------------------------------------------------
	*/
	public function prop( $name, $value ){
		$this->css[$name] = $value;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Compila un array css (propiedad => valor) y devuelve css en string
	|---------------------------------------------------------------------------------------------------
	*/
	public function build_css( $css = array() ){
		$style = '';
		if( empty( $css ) || ! is_array( $css ) ){
			$css = $this->css;
		}
		foreach( $css as $prop => $value ){
			$style .= "{$prop}:{$value}; ";
		}
		if( $this->selector ){
			return $this->selector .'{'.$style.'}';
		}
		return $style;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Devuelve la propiedad $this->css
	|---------------------------------------------------------------------------------------------------
	*/
	public function get_css(){
		return $this->css;
	}


	/*
	|---------------------------------------------------------------------------------------------------
	| Retorna un número válido
	|---------------------------------------------------------------------------------------------------
	*/
	public static function number( $value, $unit = '' ){
		if( in_array( $value, array( 'auto', 'initial', 'inherit', 'normal' ) ) ){
			return $value;
		}
		$value = preg_replace("/[^0-9.\-]/", "", $value);
    if( is_numeric( $value ) ){
			return $value . $unit;
		}
		return 1;
	}







}

