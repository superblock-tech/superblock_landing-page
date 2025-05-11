<?php

namespace App\Http\Resources\API;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WhitelistResource extends JsonResource
{
    protected $holdersCount;

    public function __construct($resource, $holdersCount = 0)
    {
        parent::__construct($resource);
        $this->holdersCount = $holdersCount;
    }

    public function toArray($request)
    {
        return [
            'usdtRaised' => $this->usdtRaised,
            'sbxPrice' => $this->sbxPrice,
            'name' => $this->name,
            'nameNext' => $this->name_next,
            'sbxPriceNext' => $this->sbx_price_next,
            'totalTokens' => $this->sbx_tokens,
            'holders' => $this->holdersCount,
            'sbxAllocated' => $this->sbx_allocated,
            'sbxTotal' => $this->totalTokens,
            'startedAt' => Carbon::parse($this->started_at)->format('U'),
            'finishedAt' => Carbon::parse($this->finished_at)->format('U'),
        ];
    }
}
