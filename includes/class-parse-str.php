<?php namespace MasterPopups\Includes;

/**
 * Class ParseStr
 * @author https://gist.github.com/rubo77/6821632
 */
class ParseStr {
	/**
	* @param $string
	* @return array|bool
	*/
	public static function parse($string) {
	  if($string==='') {
	    return false;
	  }

	  $result = array();
	  // find the pairs "name=value"
	  $pairs = explode('&', $string);
	  foreach ($pairs as $pair) {
	    $dynamicKey = (false !== strpos($pair, '[]=')) || (false !== strpos($pair, '%5B%5D='));
	    // use the original parse_str() on each element
	    parse_str($pair, $params);
	    $k = key($params);
	    if (!isset($result[$k])) {
	      $result += $params;
	    } else {
	      $result[$k] = self::arrayMergeRecursiveDistinct($result[$k], $params[$k], $dynamicKey);
	    }
	  }
	  return $result;
	}

	/**
	* @param array $array1
	* @param array $array2
	* @param $dynamicKey
	* @return array
	*/
	private static function arrayMergeRecursiveDistinct(array &$array1, array &$array2, $dynamicKey) {
	  $merged = $array1;
	  foreach ($array2 as $key => &$value) {
	    if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
	      $merged[$key] = self::arrayMergeRecursiveDistinct($merged[$key], $value, $dynamicKey);
	    } else {
	      if ($dynamicKey) {
	        if ( ! isset( $merged[$key] ) ) {
	          $merged[$key] = $value;
	        } else {
	          if ( is_array( $merged[$key] ) ) {
	            $merged[$key] = array_merge_recursive( $merged[$key], $value );
	          } else {
	            $merged[] = $value;
	          }
	        }
	      } else {
	        $merged[$key] = $value;
	      }
	    }
	  }
	  return $merged;
	}
}


/*
|---------------------------------------------------------------------------------------------------
| Esta función también funciona bien. No usada por ahora
|---------------------------------------------------------------------------------------------------
*/
/**
* https://gist.github.com/joshbmarshall/6517321
 * do the same than parse_str without max_input_vars limitation
 * @param $string array string to parse
 * @return  array query parsed
 **/

/*function my_parse_str($string) {
	$result = array();
	// find the pairs "name=value"
	$pairs = explode('&', $string);
	$toEvaluate = ''; // we will do a big eval() at the end not pretty but simplier
	foreach ($pairs as $pair) {
		list($name, $value) = explode('=', $pair, 2);
		$name = urldecode($name);
		$value = urldecode($value);
		// If the value is a number, set as a number, otherwise escape double quotes and surround in double quotes
		if (!is_numeric($value)) {
			$value = '"' . str_replace('"', '\"', $value) . '"';
		}
		if (strpos($name, '[') !== false) { // name is an array
			$name = preg_replace('|\[|', '][', $name, 1);
			$name = str_replace(array('\'', '[', ']'), array('\\\'', '[\'', '\']'), $name);
			$toEvaluate .= '$result[\'' . $name . ' = ' . $value . '; '; // $result['na']['me'] = 'value';
		} else {
			$name = str_replace('\'', '\\\'', $name);
			$toEvaluate .= '$result[\'' . $name . '\'] = ' . $value . '; '; // $result['name'] = 'value';
		}
	}
	eval($toEvaluate);
	return $result;
}*/