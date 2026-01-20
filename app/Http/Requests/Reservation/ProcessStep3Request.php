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
            'dropoff_address' => ['required', 'string', 'max:255'],
            'dropoff_latlng' => ['required', 'string', 'max:150'],
        ];
    }
}
