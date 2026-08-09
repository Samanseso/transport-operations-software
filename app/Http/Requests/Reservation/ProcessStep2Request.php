<?php

namespace App\Http\Requests\Reservation;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessStep2Request extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'time' => ['required', 'string', 'max:50'],
            'cargo_type' => ['required', 'string', 'max:100'],
            'cargo_weight_kg' => ['required', 'numeric', 'min:1'],
            'vehicle_id' => ['required', 'string', 'max:50', Rule::exists('vehicles', 'vehicle_id')],
        ];
    }
}
