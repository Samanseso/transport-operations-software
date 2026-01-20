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
            'customer_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:150'],
            'contact' => ['required', 'string', 'max:150'],
            'service_type' => ['required', 'string', 'max:150'],
            'time' => ['required', 'string', 'max:150'],
            'cargo_details' => ['nullable', 'string', 'max:255'],
            'special_instructions' => ['nullable', 'string', 'max:255'],
        ];
    }

    
}
