<?php namespace Xbox\Includes;

class AdminPage extends XboxCore {

    public function __construct( $args = array() ){

        if( ! is_array( $args ) || Functions::is_empty( $args ) || empty( $args['id'] ) ){
            return;
        }

        $args['id'] = sanitize_title( $args['id'] );

        $this->args = wp_parse_args( $args, array(
            'id' => '',
            'title' => __( 'Admin Page', 'xbox' ),
            'menu_title' => __( 'Xbox Page', 'xbox' ),
            'parent' => false,
            'capability' => 'manage_options',
            'position' => null,
            'icon' => '',
        ) );

        $this->object_type = 'admin-page';
        parent::__construct( $this->args );

        $this->set_object_id();

        $this->hooks();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Acceso al id del objecto actual, post id o page id
    |---------------------------------------------------------------------------------------------------
    */
    public function set_object_id( $object_id = 0 ){
        if( $object_id ){
            $this->object_id = $object_id;
        }
        if( $this->object_id ){
            return $this->object_id;
        }
        $this->object_id = $this->id;
        return $this->object_id;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Register Hooks
    |---------------------------------------------------------------------------------------------------
    */
    private function hooks(){
        add_action( 'admin_init', array( $this, 'init' ) );
        add_action( 'admin_menu', array( $this, 'add_admin_page' ), 101 );//101 para que se agrege después de otros items
        add_action( "admin_action_xbox_process_form_{$this->object_id}", array( $this, 'admin_action_xbox_process_form' ), 10 );
        add_action( "xbox_after_save_fields_admin-page_{$this->object_id}", array( $this, 'after_save_fields' ), 10, 3 );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Nombre para el aviso al guardar cambios
    |---------------------------------------------------------------------------------------------------
    */
    public function settings_notice_key(){
        return $this->get_object_id() . '-notices';
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Registramos las opciones
    |---------------------------------------------------------------------------------------------------
    */
    public function init(){
        register_setting( $this->id, $this->id );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Add menu page
    |---------------------------------------------------------------------------------------------------
    */
    public function add_admin_page(){
        if( $this->args['parent'] === false ){
            add_menu_page( $this->args['title'], $this->args['menu_title'], $this->args['capability'], $this->args['id'], array( $this, 'build_admin_page' ), $this->args['icon'], $this->args['position'] );
        } else{
            add_submenu_page( $this->args['parent'], $this->args['title'], $this->args['menu_title'], $this->args['capability'], $this->args['id'], array( $this, 'build_admin_page' ) );
        }
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Construye la página de opciones
    |---------------------------------------------------------------------------------------------------
    */
    public function build_admin_page(){
        $this->set_object_id( $this->id );//Set the object ID for the current admin page

        $display = "";
        $style = "
			<style>
			#setting-error-{$this->id} {
				margin-left: 1px;
				margin-right: 20px;
				margin-top: 10px;
			}
			</style>
		";

        //Check for settings notice
        $settings_error = get_settings_errors( $this->settings_notice_key() );
        if( $settings_error ){
            settings_errors( $this->settings_notice_key() );
        }

        $display .= "<div class='wrap xbox-wrap-admin-page'>";
        if( ! empty( $this->args['title'] ) && empty( $this->args['header'] ) ){
            $display .= "<h1 class='xbox-admin-page-title'>";
            $display .= "<i class='xbox-icon xbox-icon-cog'></i>";
            $display .= esc_html( get_admin_page_title() );
            $display .= "</h1>";
        }
        $display .= $this->get_form( $this->args['form_options'] );
        $display .= "</div>";
        echo $style . $display;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Nuevo formulario basado en Xbox
    |---------------------------------------------------------------------------------------------------
    */
    public function get_form( $form_options = array(), $echo = false ){
        $form = "";
        $args = wp_parse_args( $form_options, $this->arg( 'form_options' ) );

        //Form action
        $args['action'] = "admin.php?action=xbox_process_form_{$this->object_id}";

        $form .= $args['insert_before'];
        $form .= "<form id='{$args['id']}' class='xbox-form' action='{$args['action']}' method='{$args['method']}' enctype='multipart/form-data'>";
        $form .= wp_referer_field( false );
        $form .= "<input type='hidden' name='xbox_id' value='{$this->object_id}'>";
        $form .= $this->build_xbox( $this->get_object_id(), false );
        if( empty( $this->args['header'] ) ){
            $form .= $this->get_form_buttons( $args );
        }
        $form .= "</form>";
        $form .= $args['insert_after'];

        if( ! $echo ){
            return $form;
        }
        echo $form;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Guarda un campo
    |---------------------------------------------------------------------------------------------------
    */
    public function set_field_value( $field_id, $value = '' ){
        $field_id = $this->get_field_id( $field_id );
        $options = (array) get_option( $this->id );
        $options[$field_id] = $value;
        return update_option( $this->id, $options );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene el valor de un campo
    |---------------------------------------------------------------------------------------------------
    */
    public function get_field_value( $field_id, $default = '' ){
        $value = '';
        $field_id = $this->get_field_id( $field_id );
        $options = get_option( $this->id );
        if( isset( $options[$field_id] ) ){
            $value = $options[$field_id];
        }
        if( Functions::is_empty( $value ) ){
            return $default;
        }
        return $value;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Obtiene todos los campos con sus valores
    |---------------------------------------------------------------------------------------------------
    */
    public function get_options(){
        $options = get_option( $this->id );
        if( is_array( $options ) && ! empty( $options ) ){
            return $options;
        }
        return array();
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Save Options
    |---------------------------------------------------------------------------------------------------
    */
    public function admin_action_xbox_process_form(){
        if( $this->can_save_form() ){
            $this->save_fields( $this->get_object_id(), $_POST );
        }

        /**
         * Redirect back to the settings page that was submitted
         */
        $goback = add_query_arg( 'settings-updated', 'true', wp_get_referer() );
        wp_redirect( $goback );
        exit;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Comprueba si el formulario se debe guardar
    |---------------------------------------------------------------------------------------------------
    */
    private function can_save_form(){
        $args = $this->arg( 'form_options' );
        $save_button = $args['save_button_name'];

        if( ! isset( $_POST[$save_button] ) && ! isset( $_POST['xbox-reset'] ) && ! isset( $_POST['xbox-import'] ) ){
            return false;
        }

        //Verify nonce
        if( isset( $_POST[$this->get_nonce()] ) ){
            if( ! wp_verify_nonce( $_POST[$this->get_nonce()], $this->get_nonce() ) ){
                return false;
            }
        } else{
            return false;
        }

        return true;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Activa mensaje de campos actualizados y redirecciona
    |---------------------------------------------------------------------------------------------------
    */
    public function after_save_fields( $data, $object_id, $updated_fields = array() ){
        if( $this->id != $object_id ){
            return;
        }
        //Para evitar error cuando se está guardando campos automáticamente al activar un plugin o tema
        //$xbox->save_fields(0, array( 'display_message_on_save' => false ));
        if( isset( $data['display_message_on_save'] ) && $data['display_message_on_save'] == false ){
            return;
        }
        $type = 'updated';
        $this->update_message = $this->arg( 'saved_message' );
        if( $this->reset ){
            $this->update_message = $this->arg( 'reset_message' );
        }
        if( $this->import ){
            $this->update_message = $this->arg( 'import_message' );
            if( $this->update_error ){
                $this->update_message = $this->arg( 'import_message_error' );
                $type = 'error';
            }
        }

        //Add settings error
        add_settings_error( $this->settings_notice_key(), $this->id, $this->update_message, $type );
        set_transient( 'settings_errors', get_settings_errors(), 30 );
    }


}
