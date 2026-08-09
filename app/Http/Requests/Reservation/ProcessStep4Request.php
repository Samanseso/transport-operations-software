<?php

namespace App\Http\Requests\Reservation;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessStep4Request extends FormRequest
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
            'time' => ['required', 'string', 'max:150'],
            'cargo_details' => ['nullable', 'string', 'max:255'],
            'cargo_type' => ['nullable', 'string', 'max:100'],
            'cargo_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'special_instructions' => ['nullable', 'string', 'max:255'],
        ];
    }

    
}
