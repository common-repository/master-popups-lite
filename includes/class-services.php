<?php namespace MasterPopups\Includes;

use MasterPopups\Includes\ServiceIntegration\MailsterIntegration;
use MasterPopups\Includes\ServiceIntegration\MailchimpIntegration;
use MasterPopups\Includes\ServiceIntegration\GetresponseIntegration;
use MasterPopups\Includes\ServiceIntegration\SendinblueIntegration;
use MasterPopups\Includes\ServiceIntegration\MailerLiteIntegration;
use MasterPopups\Includes\ServiceIntegration\AutopilotIntegration;
use MasterPopups\Includes\ServiceIntegration\ConstantContactIntegration;
use MasterPopups\Includes\ServiceIntegration\HubspotIntegration;
use MasterPopups\Includes\ServiceIntegration\ActiveCampaignIntegration;
use MasterPopups\Includes\ServiceIntegration\MadMimiIntegration;
use MasterPopups\Includes\ServiceIntegration\MauticIntegration;
use MasterPopups\Includes\ServiceIntegration\MailgunIntegration;
use MasterPopups\Includes\ServiceIntegration\BenchmarkIntegration;
use MasterPopups\Includes\ServiceIntegration\PipedriveIntegration;
use MasterPopups\Includes\ServiceIntegration\FreshmailIntegration;
use MasterPopups\Includes\ServiceIntegration\TuNewsletterIntegration;
use MasterPopups\Includes\ServiceIntegration\SimplyCastIntegration;
use MasterPopups\Includes\ServiceIntegration\InfusionsoftIntegration;
use MasterPopups\Includes\ServiceIntegration\CustomerIoIntegration;
use MasterPopups\Includes\ServiceIntegration\AweberIntegration;
use MasterPopups\Includes\ServiceIntegration\CampaignMonitorIntegration;
use MasterPopups\Includes\ServiceIntegration\ZohoCampaignsIntegration;
use MasterPopups\Includes\ServiceIntegration\DripIntegration;
use MasterPopups\Includes\ServiceIntegration\NewsmanIntegration;
use MasterPopups\Includes\ServiceIntegration\iContactIntegration;


class Services {
    private static $pro = array(
        //Pro
        'mailster',
        'mailchimp',
        'hubspot',
        'getresponse',
        'sendinblue',
        'mailer_lite',
        'active_campaign',
        'mautic',//No tienen listas, los contactos son asociados a un "Contact Owner"
        'infusionsoft',
        'aweber',
        'campaign_monitor',
        'drip',
    );

    private static $free = array(
        //Free
        'constant_contact',//Los custom fields deben ser del tipo 'customfieldX', X desde 1 hasta 15
        'zoho_campaigns',
        'benchmark',
        'icontact',
        'autopilot',//No permite obtener sus custom fields
        'pipedrive',
        'mad_mimi',//No permite obtener sus custom fields, pero tiene campos por defecto visibles en su web
        'freshmail',//La api falla para custom fields inexistentes. first_name y last_name son custom fields
        'simply_cast',
        'customer_io',//No tiene listas, //IronMan
        'mailgun',
        'newsman',
        'tunewsletter',//IronMan
    );

    private static $all = array(
        // 'mailjet',
        // 'campayn',
        // 'total_send',
    );

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna servicios pro
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_pro(){
        return self::$pro;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna servicios free
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_free(){
        return self::$free;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retorna todas las integraciones con sus datos
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_all(){
        $services = array();
        $all = array_merge( self::$pro, self::$free );
        foreach( $all as $service ){
            if( method_exists( __CLASS__, $service ) ){
                $services[$service] = self::$service();
            }
        }
        return $services;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Retirna una instancia de un servicio
    |---------------------------------------------------------------------------------------------------
    */
    public static function get_instance( $service, $data = array() ){
        $all = array_merge( self::$pro, self::$free );
        if( ! in_array( $service, $all ) ){
            return __( 'Service not supported', 'masterpopups' );
        }
        $instance = null;
        switch( $service ){
            case 'autopilot':
                include MPP_DIR . 'libs/integrations/AutopilotAPI1/autoload.php';
                $instance = new AutopilotIntegration( $data['api_key'] );
                break;
            case 'constant_contact':
                include MPP_DIR . 'libs/integrations/ConstantContactAPI2/autoload.php';
                include MPP_DIR . 'libs/integrations/ConstantContactAPI2/vendor/autoload.php';
                $instance = new ConstantContactIntegration( $data['api_key'], $data['token'] );
                break;
            case 'mad_mimi':
                include MPP_DIR . 'libs/integrations/MadMimiAPI1/Spyc.class.php';
                include MPP_DIR . 'libs/integrations/MadMimiAPI1/MadMimi.class.php';
                $instance = new MadMimiIntegration( $data['api_key'], $data['email'] );
                break;
            case 'mailgun':
                include MPP_DIR . 'libs/integrations/MailgunAPI1/vendor/autoload.php';
                $instance = new MailgunIntegration( $data['api_key'] );
                break;
            case 'benchmark':
                include MPP_DIR . 'libs/integrations/BenchmarkAPI1/BMEAPI.class.php';
                $instance = new BenchmarkIntegration( $data['email'], $data['password'] );
                break;
            case 'pipedrive':
                include MPP_DIR . 'libs/integrations/PipedriveAPI1/vendor/autoload.php';
                $instance = new PipedriveIntegration( $data['token'] );
                break;
            case 'freshmail':
                include MPP_DIR . 'libs/integrations/FreshMailAPI1/class.rest.php';
                $instance = new FreshMailIntegration( $data['api_key'], $data['token'] );
                break;
            case 'tunewsletter':
                $instance = new TuNewsletterIntegration( $data['api_key'], $data['url'] );
                break;
            case 'simply_cast':
                include MPP_DIR . 'libs/integrations/SimplyCastAPI1/SimplyCastAPI.php';
                $instance = new SimplyCastIntegration( $data['api_key'], $data['token'] );
                break;
            case 'customer_io':
                $instance = new CustomerIoIntegration( $data['api_key'], $data['token'] );
                break;
            case 'zoho_campaigns':
                $instance = new ZohoCampaignsIntegration( $data['api_key'] );
                break;
            case 'newsman':
                $instance = new NewsmanIntegration( $data['api_key'], $data['token'] );
                break;
            case 'icontact':
                $instance = new iContactIntegration( $data['api_key'], $data['email'], $data['password'] );
                break;
        }
        return $instance;
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Mailster"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mailster(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mailster.png',
            'text' => 'Mailster',
            'access_data' => array(//'api_key' => true,
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "MailChimp"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mailchimp(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mailchimp.png',
            'text' => 'MailChimp',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'http://kb.mailchimp.com/integrations/api-integrations/about-api-keys',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "GetResponse"
    |---------------------------------------------------------------------------------------------------
    */
    public static function getresponse(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/getresponse.png',
            'text' => 'GetResponse',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://support.getresponse.com/videos/where-do-i-find-the-api-key',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "sendinblue"
    |---------------------------------------------------------------------------------------------------
    */
    public static function sendinblue(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/sendinblue.png',
            'text' => 'Sendinblue',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://my.sendinblue.com/advanced/apikey/',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "MailerLite"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mailer_lite(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mailer_lite.png',
            'text' => 'MailerLite',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://app.mailerlite.com/subscribe/api',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Autopilot"
    |---------------------------------------------------------------------------------------------------
    */
    public static function autopilot(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/autopilot.png',
            'text' => 'Autopilot',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'http://developers.autopilothq.com/getting-started/',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Constant contact"
    |---------------------------------------------------------------------------------------------------
    */
    public static function constant_contact(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/constant_contact.png',
            'text' => 'Constant contact',
            'access_data' => array(
                'api_key' => true,
                'token' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://developer.constantcontact.com/api-keys.html',
                'token' => 'https://developer.constantcontact.com/api-keys.html',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "hubspot"
    |---------------------------------------------------------------------------------------------------
    */
    public static function hubspot(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/hubspot.png',
            'text' => 'Hubspot',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://knowledge.hubspot.com/articles/kcs_article/integrations/how-do-i-get-my-hubspot-api-key',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Active Campaign"
    |---------------------------------------------------------------------------------------------------
    */
    public static function active_campaign(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/active_campaign.png',
            'text' => 'Active Campaign',
            'access_data' => array(
                'api_key' => true,
                'url' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API',
                'url' => 'https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Mad Mimi"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mad_mimi(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mad_mimi.png',
            'text' => 'Mad Mimi',
            'access_data' => array(
                'api_key' => true,
                'email' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://help.madmimi.com/where-can-i-find-my-api-key/',
                'email' => '',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Mailgun"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mailgun(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mailgun.png',
            'text' => 'Mailgun',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://help.mailgun.com/hc/en-us/articles/203380100-Where-can-I-find-my-API-key-and-SMTP-credentials-',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Benchmark"
    |---------------------------------------------------------------------------------------------------
    */
    public static function benchmark(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/benchmark.png',
            'text' => 'Benchmark',
            'access_data' => array(
                'email' => true,
                'password' => true,
            ),
            'help_url' => array(
                'email' => '',
                'password' => '',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Mautic"
    |---------------------------------------------------------------------------------------------------
    */
    public static function mautic(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/mautic.png',
            'text' => 'Mautic',
            'access_data' => array(
                'email' => true,
                'password' => true,
                'url' => true,
            ),
            'help_url' => array(
                'email' => '',
                'password' => '',
                'url' => 'E.g: https://your-site.mautic.net',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Pipedrive"
    |---------------------------------------------------------------------------------------------------
    */
    public static function pipedrive(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/pipedrive.png',
            'text' => 'Pipedrive',
            'access_data' => array(
                'token' => true,
            ),
            'help_url' => array(
                'token' => 'https://support.pipedrive.com/hc/en-us/articles/207344545',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "FreshMail"
    |---------------------------------------------------------------------------------------------------
    */
    public static function freshmail(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/freshmail.png',
            'text' => 'Freshmail',
            'access_data' => array(
                'api_key' => true,
                'token' => true
            ),
            'help_url' => array(
                'api_key' => 'https://freshmail.com/help-and-knowledge/help/account-settings/what-is-an-api-key-and-where-can-you-find-it/',
                'token' => 'https://freshmail.com/help-and-knowledge/help/account-settings/what-is-an-api-key-and-where-can-you-find-it/',
            ),
            'allow' => array(
                'get_lists' => true,
            )
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Tu Newsletter"
    |---------------------------------------------------------------------------------------------------
    */
    public static function tunewsletter(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/tunewsletter.png',
            'text' => 'Tu Newsletter',
            'access_data' => array(
                'api_key' => true,
                'url' => true
            ),
            'help_url' => array(
                'api_key' => '',
                'url' => 'E.g: http://app.tuservidor.net/api/2.0',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'api_key' => 'User Key',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "SimplyCast"
    |---------------------------------------------------------------------------------------------------
    */
    public static function simply_cast(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/simply_cast.png',
            'text' => 'SimplyCast',
            'access_data' => array(
                'api_key' => true,
                'token' => true
            ),
            'help_url' => array(
                'api_key' => '',
                'token' => '',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'api_key' => 'Public Key',
                'token' => 'Secret Key',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Infusionsoft"
    |---------------------------------------------------------------------------------------------------
    */
    public static function infusionsoft(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/infusionsoft.png',
            'text' => 'Infusionsoft',
            'access_data' => array(
                'api_key' => true,
                'token' => true
            ),
            'help_url' => array(
                'api_key' => 'http://help.infusionsoft.com/userguides/get-started/tips-and-tricks/api-key',
                'token' => 'http://help.infusionsoft.com/taxonomy/term/4/0',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'token' => 'App Name',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Customer.io"
    |---------------------------------------------------------------------------------------------------
    */
    public static function customer_io(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/customer_io.png',
            'text' => 'Customer.io',
            'access_data' => array(
                'api_key' => true,
                'token' => true
            ),
            'help_url' => array(
                'api_key' => 'https://learn.customer.io/documentation/finding-your-api-key.html',
                'token' => 'https://learn.customer.io/documentation/finding-your-api-key.html',
            ),
            'allow' => array(
                'get_lists' => false,
            ),
            'names_access_data' => array(
                'token' => 'Site ID',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Aweber"
    |---------------------------------------------------------------------------------------------------
    */
    public static function aweber(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/aweber.png',
            'text' => 'Aweber',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://auth.aweber.com/1.0/oauth/authorize_app/8e026577',
            ),
            'allow' => array(
                'get_lists' => false,
            ),
            'names_access_data' => array(
                'api_key' => 'Authorization code',
            ),
        );
    }


    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Campaign Monitor"
    |---------------------------------------------------------------------------------------------------
    */
    public static function campaign_monitor(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/campaign_monitor.png',
            'text' => 'Campaign Monitor',
            'access_data' => array(
                'api_key' => true,
                'token' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://auth.aweber.com/1.0/oauth/authorize_app/8e026577',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'token' => 'Client ID',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Zoho Campaigns"
    |---------------------------------------------------------------------------------------------------
    */
    public static function zoho_campaigns(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/zoho_campaigns.png',
            'text' => 'Zoho Campaigns',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://www.zoho.com/campaigns/help/api/authentication-token.html',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'api_key' => 'API Authentication Token',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Drip"
    |---------------------------------------------------------------------------------------------------
    */
    public static function drip(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/drip.png',
            'text' => 'Drip',
            'access_data' => array(
                'api_key' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://help.drip.com/hc/en-us/articles/115003738532-Your-API-Token',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'api_key' => 'API Token',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "Newsman"
    |---------------------------------------------------------------------------------------------------
    */
    public static function newsman(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/newsman.png',
            'text' => 'NewsMan',
            'access_data' => array(
                'api_key' => true,
                'token' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://kb.newsman.app/api/',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'token' => 'User ID',
            ),
        );
    }

    /*
    |---------------------------------------------------------------------------------------------------
    | Servicio "iContact"
    |---------------------------------------------------------------------------------------------------
    */
    public static function icontact(){
        return array(
            'image_url' => MPP_URL . 'assets/admin/images/integrations/icontact.png',
            'text' => 'iContact',
            'access_data' => array(
                'api_key' => true,
                'email' => true,
                'password' => true,
            ),
            'help_url' => array(
                'api_key' => 'https://kb.newsman.app/api/',
            ),
            'allow' => array(
                'get_lists' => true,
            ),
            'names_access_data' => array(
                'api_key' => 'iContact App Id',
                'email' => 'iContact App Username (email)',
                'password' => 'iContact App Password',
            ),
        );
    }


}
