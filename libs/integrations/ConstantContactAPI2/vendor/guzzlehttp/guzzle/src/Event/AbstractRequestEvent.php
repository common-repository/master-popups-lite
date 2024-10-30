<?php
namespace MasterPopups\ConstantContact\GuzzleHttp\Event;

use MasterPopups\ConstantContact\GuzzleHttp\Transaction;
use MasterPopups\ConstantContact\GuzzleHttp\ClientInterface;
use MasterPopups\ConstantContact\GuzzleHttp\Message\RequestInterface;

/**
 * Base class for request events, providing a request and client getter.
 */
abstract class AbstractRequestEvent extends AbstractEvent
{
    /** @var Transaction */
    protected $transaction;

    /**
     * @param Transaction $transaction
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the HTTP client associated with the event.
     *
     * @return ClientInterface
     */
    public function getClient()
    {
        return $this->transaction->client;
    }

    /**
     * Get the request object
     *
     * @return RequestInterface
     */
    public function getRequest()
    {
        return $this->transaction->request;
    }

    /**
     * Get the number of transaction retries.
     *
     * @return int
     */
    public function getRetryCount()
    {
        return $this->transaction->retries;
    }

    /**
     * @return Transaction
     */
    public function getTransaction()
    {
        return $this->transaction;
    }
}
