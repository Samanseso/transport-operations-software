<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessStep1Request extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pickup_address' => ['required', 'string', 'max:500'],
            'pickup_latlng' => ['required', 'string', 'max:100'],
            'waypoints' => ['required', 'array', 'min:1'],
            'waypoints.*.address' => ['required', 'string', 'max:500'],
            'waypoints.*.latlng' => ['required', 'string', 'max:100'],
        ];
    }
}
