<?php namespace MasterPopups\Includes;

class Assets {

	/*
	|---------------------------------------------------------------------------------------------------
	| Local Fonts
	|---------------------------------------------------------------------------------------------------
	*/
	public static function local_fonts( $more_items = array() ){
		return Functions::nice_array_merge( $more_items, \XboxItems::web_safe_fonts() );
	}

    /*
    |---------------------------------------------------------------------------------------------------
    | Google Fonts
    |---------------------------------------------------------------------------------------------------
    */
    public static function google_fonts( $more_items = array() ){
        return Functions::nice_array_merge( $more_items, \XboxItems::google_fonts() );
    }

	/*
	|---------------------------------------------------------------------------------------------------
	| Font Awesome for Select
	|---------------------------------------------------------------------------------------------------
	*/
	public static function font_awesome_icons_for_select( $more_items = array() ){
		$icons = include MPP_DIR.'includes/data/icons-font-awesome.php';
		$items = array();
	  foreach( $icons as $icon ){
	  	$icon_value = str_replace( 'fa-', 'mpp-icon-', $icon);
	    $items[$icon_value] = "<i class='$icon_value'></i>$icon";
	  }
	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Font Awesome
	|---------------------------------------------------------------------------------------------------
	*/
	public static function font_awesome_icons( $more_items = array() ){
		$icons = include MPP_DIR.'includes/data/icons-font-awesome.php';
		$items = array();
	  foreach( $icons as $icon ){
	  	$icon_value = str_replace( 'fa-', 'mpp-icon-', $icon);
	    $items[$icon_value] = "<i class='$icon_value'></i>";
	  }
	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Svg icons
	|---------------------------------------------------------------------------------------------------
	*/
	public static function svg_icons( $more_items = array() ){
		$icons = include MPP_DIR.'includes/data/icons-svg.php';
		$items = array();
	  foreach( $icons as $icon ){
	  	$icon_value = MPP_URL .'assets/svg/'.$icon;
	    $items[$icon_value] = "<img src='$icon_value'>";
	  }
	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| All icons. Svg and icon fonts
	|---------------------------------------------------------------------------------------------------
	*/
	public static function all_icons( $more_items = array() ){
	  return Functions::nice_array_merge( self::svg_icons(), self::font_awesome_icons() );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Close icons
	|---------------------------------------------------------------------------------------------------
	*/
	public static function close_icons( $more_items = array() ){
		$close_svg = array(
		  'close-blue.svg',
		  'close-green.svg',
		  'close-red.svg',
		  'close-red-1.svg',
		  //'close-red-2.svg',
		  //'close-red-radius.svg',
		  'close-yellow.svg'
		);
		$items = array();
	  foreach( $close_svg as $icon ){
	  	$icon_value = MPP_URL .'assets/svg/'.$icon;
	    $items[$icon_value] = "<img src='$icon_value'>";
	  }

	  $close_fonts = array(
		  'mppfic-close',
			'mppfic-close-1',
			'mppfic-close-2',
			'mppfic-close-cancel-circular',
			'mppfic-close-cancel-circular-1',
			'mppfic-close-cancel-circular-2',
			'mppfic-close-cancel-circular-3',
			'mppfic-close-cancel-circular-4',
			'mppfic-close-clean',
			'mppfic-close-remove',
			'mppfic-close-square',
			'mppfic-close-square-1',
			'mppfic-close-square-2',
		);
	  foreach( $close_fonts as $icon ){
	    $items[$icon] = "<i class='{$icon}'></i>";
	  }

	  $items = Functions::nice_array_merge( $items, self::arrow_icons() );

	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Play icons
	|---------------------------------------------------------------------------------------------------
	*/
	public static function play_icons( $more_items = array() ){
		$items = array();
	  $play_fonts = array(
			'mppfip-play',
			'mppfip-play-arrow',
			'mppfip-play-movie',
			'mppfip-play-outline',
			'mppfip-play-outline-2',
			'mppfip-play-radius',
			'mppfip-play-square',
			//'mppfip-play-next',
			//'mppfip-play-next-2',
			//'mppfip-play-prev',
			//'mppfip-play-double',
			//'mppfip-play-circle',
			//'mppfip-pause',
			//'mppfip-stop',
		);
	  foreach( $play_fonts as $icon ){
	    $items[$icon] = "<i class='{$icon}'></i>";
	  }

	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Arrow icons
	|---------------------------------------------------------------------------------------------------
	*/
	public static function arrow_icons( $more_items = array() ){
		$items = array();
	  $play_fonts = array(
			'mpp-icon-chevron-up',
			'mpp-icon-chevron-right',
			'mpp-icon-chevron-down',
			'mpp-icon-chevron-left',
			'mpp-icon-chevron-circle-up',
			'mpp-icon-chevron-circle-right',
			'mpp-icon-chevron-circle-down',
			'mpp-icon-chevron-circle-left',
			// 'mpp-icon-arrow-circle-up',
			// 'mpp-icon-arrow-circle-right',
			// 'mpp-icon-arrow-circle-down',
			// 'mpp-icon-arrow-circle-left',
		);
	  foreach( $play_fonts as $icon ){
	    $items[$icon] = "<i class='{$icon}'></i>";
	  }
	  return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Animations
	|---------------------------------------------------------------------------------------------------
	*/
	public static function animations( $more_items = array()  ){
		$items = array(
			'Attention Seekers' => array(
				'mpp-bounce' => 'Bounce',
				'mpp-flash' => 'flash',
				'mpp-pulse' => 'pulse',
				'mpp-rubberBand' => 'rubberBand',
				'mpp-shake' => 'shake',
				'mpp-swing' => 'swing',
				'mpp-tada' => 'tada',
				'mpp-wobble' => 'wobble',
			),
			'Bouncing Entrances' => array(
				'mpp-bounceIn' => 'bounceIn',
				'mpp-bounceInDown' => 'bounceInDown',
				'mpp-bounceInLeft' => 'bounceInLeft',
				'mpp-bounceInRight' => 'bounceInRight',
				'mpp-bounceInUp' => 'bounceInUp',
			),
			'Bouncing Exits' => array(
				'mpp-bounceOut' => 'bounceOut',
				'mpp-bounceOutDown' => 'bounceOutDown',
				'mpp-bounceOutLeft' => 'bounceOutLeft',
				'mpp-bounceOutRight' => 'bounceOutRight',
				'mpp-bounceOutUp' => 'bounceOutUp',
			),
			'Fading Entrances' => array(
				'mpp-fadeIn' => 'fadeIn',
				'mpp-fadeInDown' => 'fadeInDown',
				'mpp-fadeInDownBig' => 'fadeInDownBig',
				'mpp-fadeInLeft' => 'fadeInLeft',
				'mpp-fadeInLeftBig' => 'fadeInLeftBig',
				'mpp-fadeInRight' => 'fadeInRight',
				'mpp-fadeInRightBig' => 'fadeInRightBig',
				'mpp-fadeInUp' => 'fadeInUp',
				'mpp-fadeInUpBig' => 'fadeInUpBig',
			),
			'Fading Exits' => array(
				'mpp-fadeOut' => 'fadeOut',
				'mpp-fadeOutDown' => 'fadeOutDown',
				'mpp-fadeOutDownBig' => 'fadeOutDownBig',
				'mpp-fadeOutLeft' => 'fadeOutLeft',
				'mpp-fadeOutLeftBig' => 'fadeOutLeftBig',
				'mpp-fadeOutRight' => 'fadeOutRight',
				'mpp-fadeOutRightBig' => 'fadeOutRightBig',
				'mpp-fadeOutUp' => 'fadeOutUp',
				'mpp-fadeOutUpBig' => 'fadeOutUpBig',
			),
			'Flippers' => array(
				'mpp-flip' => 'flip',
				'mpp-flipInX' => 'flipInX',
				'mpp-flipInY' => 'flipInY',
				'mpp-flipOutX' => 'flipOutX',
				'mpp-flipOutY' => 'flipOutY',
			),
			'Lightspeed' => array(
				'mpp-lightSpeedIn' => 'lightSpeedIn',
				'mpp-lightSpeedOut' => 'lightSpeedOut',
			),
			'Rotating Entrances' => array(
				'mpp-rotateIn' => 'rotateIn',
				'mpp-rotateInDownLeft' => 'rotateInDownLeft',
				'mpp-rotateInDownRight' => 'rotateInDownRight',
				'mpp-rotateInUpLeft' => 'rotateInUpLeft',
				'mpp-rotateInUpRight' => 'rotateInUpRight',
			),
			'Rotating Exits' => array(
				'mpp-rotateOut' => 'rotateOut',
				'mpp-rotateOutDownLeft' => 'rotateOutDownLeft',
				'mpp-rotateOutDownRight' => 'rotateOutDownRight',
				'mpp-rotateOutUpLeft' => 'rotateOutUpLeft',
				'mpp-rotateOutUpRight' => 'rotateOutUpRight',
			),
			'Slide Entrances' => array(
				'mpp-slideInDown' => 'slideInDown',
				'mpp-slideInLeft' => 'slideInLeft',
				'mpp-slideInRight' => 'slideInRight',
				'mpp-slideInUp' => 'slideInUp',
			),
			'Slide Exits' => array(
				'mpp-slideOutDown' => 'slideOutDown',
				'mpp-slideOutLeft' => 'slideOutLeft',
				'mpp-slideOutRight' => 'slideOutRight',
				'mpp-slideOutUp' => 'slideOutUp',
			),
			'Zoom Entrances' => array(
				'mpp-zoomIn' => 'zoomIn',
				'mpp-zoomInDown' => 'zoomInDown',
				'mpp-zoomInLeft' => 'zoomInLeft',
				'mpp-zoomInRight' => 'zoomInRight',
				'mpp-zoomInUp' => 'zoomInUp',
			),
			'Zoom Exits' => array(
				'mpp-zoomOut' => 'zoomOut',
				'mpp-zoomOutDown' => 'zoomOutDown',
				'mpp-zoomOutLeft' => 'zoomOutLeft',
				'mpp-zoomOutRight' => 'zoomOutRight',
				'mpp-zoomOutUp' => 'zoomOutUp',
			),
			'Specials' => array(
				'mpp-rollIn' => 'rollIn',
				'mpp-rollOut' => 'rollOut',
			),
		);
		return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Animations
	|---------------------------------------------------------------------------------------------------
	*/
	public static function animations_in( $more_items = array() ){
		$items = array(
			'Attention Seekers' => array(
				'mpp-bounce' => 'Bounce',
				'mpp-flash' => 'flash',
				'mpp-pulse' => 'pulse',
				'mpp-rubberBand' => 'rubberBand',
				'mpp-shake' => 'shake',
				'mpp-swing' => 'swing',
				'mpp-tada' => 'tada',
				'mpp-wobble' => 'wobble',
			),
			'Bouncing' => array(
				'mpp-bounceIn' => 'bounceIn',
				'mpp-bounceInDown' => 'bounceInDown',
				'mpp-bounceInLeft' => 'bounceInLeft',
				'mpp-bounceInRight' => 'bounceInRight',
				'mpp-bounceInUp' => 'bounceInUp',
			),
			'Fading' => array(
				'mpp-fadeIn' => 'fadeIn',
				'mpp-fadeInDown' => 'fadeInDown',
				'mpp-fadeInDownBig' => 'fadeInDownBig',
				'mpp-fadeInLeft' => 'fadeInLeft',
				'mpp-fadeInLeftBig' => 'fadeInLeftBig',
				'mpp-fadeInRight' => 'fadeInRight',
				'mpp-fadeInRightBig' => 'fadeInRightBig',
				'mpp-fadeInUp' => 'fadeInUp',
				'mpp-fadeInUpBig' => 'fadeInUpBig',
			),
			'Rotating' => array(
				'mpp-rotateIn' => 'rotateIn',
				'mpp-rotateInDownLeft' => 'rotateInDownLeft',
				'mpp-rotateInDownRight' => 'rotateInDownRight',
				'mpp-rotateInUpLeft' => 'rotateInUpLeft',
				'mpp-rotateInUpRight' => 'rotateInUpRight',
			),
			'Slide' => array(
				'mpp-slideInDown' => 'slideInDown',
				'mpp-slideInLeft' => 'slideInLeft',
				'mpp-slideInRight' => 'slideInRight',
				'mpp-slideInUp' => 'slideInUp',
			),
			'Zoom' => array(
				'mpp-zoomIn' => 'zoomIn',
				'mpp-zoomInDown' => 'zoomInDown',
				'mpp-zoomInLeft' => 'zoomInLeft',
				'mpp-zoomInRight' => 'zoomInRight',
				'mpp-zoomInUp' => 'zoomInUp',
			),
			'Other' => array(
				'mpp-rollIn' => 'rollIn',
				'mpp-flipInX' => 'flipInX',
				'mpp-flipInY' => 'flipInY',
				'mpp-lightSpeedIn' => 'lightSpeedIn',
			),
		);
		return Functions::nice_array_merge( $more_items, $items );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Animations Out
	|---------------------------------------------------------------------------------------------------
	*/
	public static function animations_out( $more_items = array() ){
		$items = array(
			'Bouncing' => array(
				'mpp-bounceOut' => 'bounceOut',
				'mpp-bounceOutDown' => 'bounceOutDown',
				'mpp-bounceOutLeft' => 'bounceOutLeft',
				'mpp-bounceOutRight' => 'bounceOutRight',
				'mpp-bounceOutUp' => 'bounceOutUp',
			),
			'Fading' => array(
				'mpp-fadeOut' => 'fadeOut',
				'mpp-fadeOutDown' => 'fadeOutDown',
				'mpp-fadeOutDownBig' => 'fadeOutDownBig',
				'mpp-fadeOutLeft' => 'fadeOutLeft',
				'mpp-fadeOutLeftBig' => 'fadeOutLeftBig',
				'mpp-fadeOutRight' => 'fadeOutRight',
				'mpp-fadeOutRightBig' => 'fadeOutRightBig',
				'mpp-fadeOutUp' => 'fadeOutUp',
				'mpp-fadeOutUpBig' => 'fadeOutUpBig',
			),
			'Rotating' => array(
				'mpp-rotateOut' => 'rotateOut',
				'mpp-rotateOutDownLeft' => 'rotateOutDownLeft',
				'mpp-rotateOutDownRight' => 'rotateOutDownRight',
				'mpp-rotateOutUpLeft' => 'rotateOutUpLeft',
				'mpp-rotateOutUpRight' => 'rotateOutUpRight',
			),
			'Slide' => array(
				'mpp-slideOutDown' => 'slideOutDown',
				'mpp-slideOutLeft' => 'slideOutLeft',
				'mpp-slideOutRight' => 'slideOutRight',
				'mpp-slideOutUp' => 'slideOutUp',
			),
			'Zoom' => array(
				'mpp-zoomOut' => 'zoomOut',
				'mpp-zoomOutDown' => 'zoomOutDown',
				'mpp-zoomOutLeft' => 'zoomOutLeft',
				'mpp-zoomOutRight' => 'zoomOutRight',
				'mpp-zoomOutUp' => 'zoomOutUp',
			),
			'Other' => array(
				'mpp-rollOut' => 'rollOut',
				'mpp-flipOutX' => 'flipOutX',
				'mpp-flipOutY' => 'flipOutY',
				'mpp-lightSpeedOut' => 'lightSpeedOut',
			),
		);
		return Functions::nice_array_merge( $more_items, $items );
	}






}

