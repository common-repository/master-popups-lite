<?php
namespace ConstantContactAPI2;

use ConstantContactAPI2\Services\AccountService;
use ConstantContactAPI2\Services\ContactService;
use ConstantContactAPI2\Services\LibraryService;
use ConstantContactAPI2\Services\ListService;
use ConstantContactAPI2\Services\EmailMarketingService;
use ConstantContactAPI2\Services\CampaignScheduleService;
use ConstantContactAPI2\Services\CampaignTrackingService;
use ConstantContactAPI2\Services\ContactTrackingService;
use ConstantContactAPI2\Services\ActivityService;

/**
 * Exposes all implemented Constant Contact API functionality
 *
 * @package ConstantContactAPI2
 * @version 2.0.0
 * @author Constant Contact
 * @link https://developer.constantcontact.com
 */
class ConstantContact
{
    /**
     * Handles interaction with contact management
     * @var ContactService
     */
    public $contactService;

    /**
     * Handles interaction with email marketing
     * @var EmailMarketingService
     */
    public $emailMarketingService;

    /**
     * Handles interaction with contact list management
     * @var ListService
     */
    public $listService;

    /**
     * ActivityService for handling interaction with bulk activities
     * @var ActivityService
     */
    public $activityService;

    /**
     * Handles interaction with email marketing tracking
     * @var CampaignTrackingService
     */
    public $campaignTrackingService;

    /**
     * Handles interaction with contact tracking
     * @var ContactTrackingService
     */
    public $contactTrackingService;

    /**
     * Handles interaction with email marketing campaign scheduling
     * @var CampaignScheduleService
     */
    public $campaignScheduleService;

    /**
     * Handles interaction with account management
     * @var AccountService
     */
    public $accountService;

    /**
     * Handles interaction with Library management
     * @var LibraryService
     */
    public $libraryService;

    /**
     * Class constructor
     * Registers the API key with the ConstantContact class that will be used for all API calls.
     * @param string $apiKey - Constant Contact API Key
     */
    public function __construct($apiKey)
    {
        $this->contactService = new ContactService($apiKey);
        $this->emailMarketingService = new EmailMarketingService($apiKey);
        $this->activityService = new ActivityService($apiKey);
        $this->campaignTrackingService = new CampaignTrackingService($apiKey);
        $this->contactTrackingService = new ContactTrackingService($apiKey);
        $this->campaignScheduleService = new CampaignScheduleService($apiKey);
        $this->listService = new ListService($apiKey);
        $this->accountService = new AccountService($apiKey);
        $this->libraryService = new LibraryService($apiKey);
    }
}
