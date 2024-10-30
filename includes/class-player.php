<?php namespace MasterPopups\Includes;

use Xbox\Includes\CSS;

class Player {
	public $provider = '';
	public $image = '';
	public $id = null;
	public $player = '';

	/*
	|---------------------------------------------------------------------------------------------------
	| Constructor
	|---------------------------------------------------------------------------------------------------
	*/
	public function __construct( $url = '', $lazy_load = false, $parameters = array(), $css = array() ){
		$this->id = self::get_id( $url );
		$this->provider = self::get_player_provider( $url );
		$this->image = self::get_image( $url );
		$this->player = self::get_player( $url, $lazy_load, $parameters, $css );
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el id de un video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_id( $url = '' ){
		if( self::is_youtube_url( $url ) ){
			return self::get_youtube_id( $url );
		}
		else if( self::is_vimeo_url( $url ) ){
			return self::get_vimeo_id( $url );
		}
		else if( self::is_dailymotion_url( $url ) ){
			return self::get_dailymotion_id( $url );
		}
		return null;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el proveedor del video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_player_provider( $url = '' ){
		$provider = '';
		if( self::is_youtube_url( $url )){
			$provider = 'youtube';
		}
		else if( self::is_vimeo_url( $url )){
			$provider = 'vimeo';
		}
		else if( self::is_dailymotion_url( $url )){
			$provider = 'dailymotion';
		}
		else if( self::is_html5_player( $url ) ){
			$provider = 'html5';
		}
		return $provider;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene una imagen de un video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_image( $url = '', $args = array() ){
		if( self::is_youtube_url( $url )){
			return self::get_youtube_image( self::get_youtube_id( $url ) );
		}
		else if( self::is_vimeo_url( $url )){
			return self::get_vimeo_image( self::get_vimeo_id( $url ) );
		}
		else if( self::is_dailymotion_url( $url )){
			return self::get_dailymotion_image( self::get_dailymotion_id( $url ) );
		}
		return '';
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el iframe de un video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_player( $url, $lazy_load = false, $parameters = array(), $css = array() ){
		$iframe = '';

		if( self::is_youtube_url( $url ) ){
			$iframe = self::get_youtube_player( $url, $lazy_load, $parameters, $css );
		}
		else if( self::is_vimeo_url( $url ) ){
			$iframe = self::get_vimeo_player( $url, $lazy_load, $parameters, $css );
		}
		else if( self::is_dailymotion_url( $url ) ){
			$iframe = self::get_dailymotion_player( $url, $lazy_load, $parameters, $css );
		}
		else if( self::is_soundcloud_url( $url ) ){
			$parameters = "url=$url&format=js&iframe=true";
			$args = array();
			if ( $args['autoplay'] == 1 ){
				$parameters .= "&auto_play=true";
			}
			//Get the JSON data of song details with embed code from SoundCloud oEmbed
			//https://developers.soundcloud.com/docs/api/reference#oembed
			$data = file_get_contents("http://soundcloud.com/oembed?$parameters");
			if( $data !== false ){
				//Clean the Json to decode, remove: ( and );
				$decode_iframe = substr( $data, 1, -2 );
				//json decode to convert it as an array
				$json_obj = json_decode( $decode_iframe, true );
				if( isset( $json_obj['html'] ) ){
					$iframe = $json_obj['html'];
				}
			}
		}
		return $iframe;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Get youtube video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_youtube_player( $url, $lazy_load = false, $parameters = array(), $css = array() ){
		$unique_id = self::random_player_id();
		$defaults = array(
			'origin' => get_home_url(),
			'version' => '3',
			'enablejsapi' => '1',
			'html5' => '1',
			'wmode' => 'opaque',
			'theme' => 'dark',
			'modestbranding' => '1',
			'hd' => '1',
			'rel' => '0',
			'showinfo' => '0',
			'start' => '0',
			'volume' => '100',
			'loop' => '0',
			'autoplay' => '0',
		);
		$parameters = wp_parse_args( $parameters, $defaults );
		$parameters = http_build_query( $parameters );
		$player_id = self::get_youtube_id( $url );
		$player_url = "//www.youtube.com/embed/{$player_id}?{$parameters}";
		$src = $lazy_load ? 'about:blank' : $player_url;
		$style = new CSS();
		$style = ! empty( $css ) ? "style='{$style->build_css( $css )}'" : '';

		$iframe = "<iframe id='{$unique_id}' src='{$src}' data-src='{$player_url}' frameborder='0' allowfullscreen {$style}></iframe>";
	  return $iframe;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Get vimeo video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_vimeo_player( $url, $lazy_load = false, $parameters = array(), $css = array() ){
		$unique_id = self::random_player_id();
		$defaults = array(
			'player_id' => $unique_id,
			'api' => '1',
			'byline' => '0',
			'portrait' => '0',
			'badge' => '0',
			'title' => '0',
			'autoplay' => '0',
		);
		$parameters = wp_parse_args( $parameters, $defaults );
		$parameters = http_build_query( $parameters );
		$player_id = self::get_vimeo_id( $url );
		$player_url = "//player.vimeo.com/video/{$player_id}?{$parameters}";
		$src = $lazy_load ? 'about:blank' : $player_url;
		$style = new CSS();
		$style = ! empty( $css ) ? "style='{$style->build_css( $css )}'" : '';

		$iframe = "<iframe id='{$unique_id}' src='{$src}' data-src='{$player_url}' frameborder='0' allowfullscreen {$style}></iframe>";
	  return $iframe;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Get daylimotion video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_dailymotion_player( $url, $lazy_load = false, $parameters = array(), $css = array() ){
		$unique_id = self::random_player_id();
		$defaults = array(
			'sharing-enable' => '0',
			'ui-logo' => '0',
			'autoplay' => '0',
		);
		$parameters = wp_parse_args( $parameters, $defaults );
		$parameters = http_build_query( $parameters );
		$player_id = self::get_dailymotion_id( $url );
		$player_url = "//www.dailymotion.com/embed/video/{$player_id}?{$parameters}";
		$src = $lazy_load ? 'about:blank' : $player_url;
		$style = new CSS();
		$style = ! empty( $css ) ? "style='{$style->build_css( $css )}'" : '';

		$iframe = "<iframe id='{$unique_id}' src='{$src}' data-src='{$player_url}' frameborder='0' allowfullscreen {$style}></iframe>";
	  return $iframe;
	}


	/*
	|---------------------------------------------------------------------------------------------------
	| Comprueba si una url es un video de youtube
	|---------------------------------------------------------------------------------------------------
	*/
	public static function is_youtube_url( $url ){
		// $pattern = '~(?:https?://)?(?:www.)?(?:youtube.com|youtu.be)/(?:watch\?v=)?([^\s]+)~';
	  // if( preg_match($pattern, $url) ){
	  //   return true;
	  // }
	  if( false !== self::get_youtube_id( $url ) ){
	    return true;
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Comprueba si una url es un video de vimeo
	|---------------------------------------------------------------------------------------------------
	*/
	public static function is_vimeo_url( $url ){
	  // $pattern = '~(?:https?://)?(?:www.)?(?:vimeo.com|player.vimeo.com)/([^\s]+)?([0-9]+)~';
	  // if( preg_match($pattern, $url) ){
	  //   return true;
	  // }
	  if( false !== self::get_vimeo_id( $url ) ){
	    return true;
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Comprueba si una url es un video de dailymotion
	|---------------------------------------------------------------------------------------------------
	*/
	public static function is_dailymotion_url( $url ){
	  if( false !== self::get_dailymotion_id( $url ) ){
	    return true;
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Comprueba si una url es un audio de soundcloud
	|---------------------------------------------------------------------------------------------------
	*/
	public static function is_soundcloud_url( $url ){
		$pattern = '/^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/';
	  $result = preg_match($pattern, $url, $matches);
	  if ( $result ) {
	  	return true;
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Comprueba si es un video html5
	|---------------------------------------------------------------------------------------------------
	*/
	public static function is_html5_player( $url = '' ){
		$extension = Functions::get_file_extension( $url );
		if( $extension && in_array( $extension, array( 'mp4', 'webm', 'ogv', 'ogg', 'vp8' ) ) ){
			return true;
		}
		return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el id de un video de youtube
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_youtube_id( $url = '' ) {
	  $pattern =
	    '~(?#!js YouTubeId Rev:20160125_1800)
	    # Match non-linked youtube URL in the wild. (Rev:20130823)
	    https?://          # Required scheme. Either http or https.
	    (?:[0-9A-Z-]+\.)?  # Optional subdomain.
	    (?:                # Group host alternatives.
	      youtu\.be/       # Either youtu.be,
	    | youtube          # or youtube.com or
	      (?:-nocookie)?   # youtube-nocookie.com
	      \.com            # followed by
	      \S*?             # Allow anything up to VIDEO ID,
	      [^\w\s-]         # but char before ID is non-ID char.
	    )                  # End host alternatives.
	    ([\w-]{11})        # $1: VIDEO ID is exactly 11 chars.
	    (?=[^\w-]|$)       # Assert next char is non-ID or EOS.
	    (?!                # Assert URL is not pre-linked.
	      [?=&+%\w.-]*     # Allow URL (query) remainder.
	      (?:              # Group pre-linked alternatives.
	        [\'"][^<>]*>   # Either inside a start tag,
	      | </a>           # or inside <a> element text contents.
	      )                # End recognized pre-linked alts.
	    )                  # End negative lookahead assertion.
	    [?=&+%\w.-]*       # Consume any URL (query) remainder.
	    ~ix'
	    ;
	  $result = preg_match($pattern, $url, $matches);
	  if ( $result && isset( $matches[1] ) ) {
	    return $matches[1];
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el id de un video de vimeo
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_vimeo_id( $url ){
	  $pattern = '/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/';
	  $result = preg_match($pattern, $url, $matches);
	  if ( $result && isset( $matches[5] ) ) {
	    return $matches[5];
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene el id de un video de dailymotion
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_dailymotion_id( $url ){
	  $pattern = '!^.+dailymotion\.com/(video|hub)/([^_]+)[^#]*(#video=([^_&]+))?|(dai\.ly/([^_]+))!';
	  $result = preg_match($pattern, $url, $matches);
	  if ( $result ) {
	    if ( isset($matches[6]) ) {
	      return $matches[6];
	    }
	    if ( isset($matches[4]) ) {
	      return $matches[4];
	    }
	    return $matches[2];
	  }
	  return false;
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene la imagen de un video de youtube
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_youtube_image( $player_id ){
		$player_id = trim( $player_id );
	  if( empty( $player_id ) ){
	    return '';
	  }
		return "//img.youtube.com/vi/$player_id/sddefault.jpg";
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene la imagen de un video de Vimeo
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_vimeo_image( $player_id ){
	  $player_id = trim( $player_id );
	  if( empty( $player_id ) ){
	    return '';
	  }
	  //$data = file_get_contents( "http://vimeo.com/api/v2/video/{$player_id}.php" );//Genera warning cuando $payer_id no existe. failed to open stream: HTTP request failed! HTTP/1.1 404 Not Found
	  $irondev = new IronDev("http://vimeo.com/api/v2/video/{$player_id}.php");
	  $data = $irondev->get('');
	  if( $irondev->success() ){
	  	if( $data !== false ){
		    if( is_serialized( $data ) ){
		      $data = unserialize( $data );
		    }
		    if( isset( $data[0]['thumbnail_large'] ) ){
		      return $data[0]['thumbnail_large'];
		    }
		  }
	  }
	  return '';
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Obtiene la imagen de un video de dailymotion
	|---------------------------------------------------------------------------------------------------
	*/
	public static function get_dailymotion_image( $player_id ){
	  $player_id = trim( $player_id );
	  if( empty( $player_id ) ){
	    return '';
	  }
	  $data = file_get_contents( "https://api.dailymotion.com/video/{$player_id}?fields=thumbnail_720_url" );
	  if( $data !== false ){
	    $data = json_decode( $data, true );
	    if( isset( $data['thumbnail_720_url'] ) ){
	      return $data['thumbnail_720_url'];
	    }
	  }
	  return '';
	}

	/*
	|---------------------------------------------------------------------------------------------------
	| Id aleatorio para cada video
	|---------------------------------------------------------------------------------------------------
	*/
	public static function random_player_id( $length = 10, $numbers = true ){
		return Functions::random_string( $length, $numbers );
	}

}
