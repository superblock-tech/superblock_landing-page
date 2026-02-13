<?php

if (!function_exists('short_address')) {
    /**
     * Shorten an address/hash for display (e.g. 0x1234...5678).
     *
     * @param string|null $address
     * @param int $startChars
     * @param int $endChars
     * @return string
     */
    function short_address(?string $address, int $startChars = 6, int $endChars = 4): string
    {
        if (empty($address)) {
            return '';
        }
        $minLength = $startChars + $endChars + 3; // +3 for "..."
        if (strlen($address) <= $minLength) {
            return $address;
        }
        return substr($address, 0, $startChars) . '...' . substr($address, -$endChars);
    }
}

if (!function_exists('blockscan_address_url')) {
    /**
     * Generate Blockscan multichain explorer URL for an address.
     *
     * @param string|null $address
     * @return string
     */
    function blockscan_address_url(?string $address): string
    {
        if (empty($address) || trim($address) === '' || strtolower(trim($address)) === 'unknown') {
            return '';
        }
        $address = trim($address);
        return 'https://blockscan.com/address/' . $address;
    }
}

if (!function_exists('format_decimal')) {
    /**
     * Format a number to 5 decimal places for display.
     *
     * @param float|string|null $value
     * @param int $decimals
     * @return string
     */
    function format_decimal($value, int $decimals = 5): string
    {
        if ($value === null || $value === '') {
            return '0';
        }
        return number_format((float) $value, $decimals, '.', '');
    }
}
