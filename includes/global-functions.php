<?php

/*
|---------------------------------------------------------------------------------------------------
| Funciones generales
|---------------------------------------------------------------------------------------------------
*/
//Para hacer debug en determinados tipos de usuarios
function d_mpp( $arg, $user_id = null ){
	if( $user_id != null && $user_id != get_current_user_id() ){
		return;
	}
	if( is_admin() && function_exists( 'd' ) ){
		d( $arg );
	}
}
function dd_mpp( $arg, $user_id = null ){
	if( $user_id != null && $user_id != get_current_user_id() ){
		return;
	}
	if( is_admin() && function_exists( 'ddd' ) ){
		ddd( $arg );
	}
}