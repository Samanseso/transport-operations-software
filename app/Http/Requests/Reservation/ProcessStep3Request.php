<?php

namespace App\Http\Requests\Reservation;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessStep3Request extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'string', 'max:255'],
            'service_type' => ['required', 'string', 'max:150'],
            'special_instructions' => ['nullable', 'string', 'max:500'],
            'waypoints' => ['required', 'array', 'min:1'],
            'waypoints.*.address' => ['required', 'string', 'max:500'],
            'waypoints.*.latlng' => ['required', 'string', 'max:100'],
            'waypoints.*.consignee_name' => ['nullable', 'string', 'max:150'],
            'waypoints.*.consignee_phone' => ['nullable', 'string', 'max:50'],
            'waypoints.*.instructions' => ['nullable', 'string', 'max:255'],
        ];
    }
}
