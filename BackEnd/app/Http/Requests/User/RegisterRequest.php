<?php

/**
 * User Registration Request
 *
 * Handles validation for new user (patient) registration.
 * Ensures required personal details are provided and that email is unique
 * among existing users if provided (email is nullable).
 */

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
   */
  public function rules(): array
  {
    return [
      'firstname' => 'required|string',
      'lastname' => 'required|string',
      'cin' => 'required|string',
      'phoneNumber' => 'required|string',
      'email' => 'nullable|email|string|unique:users,email',
      'password' => [
        'required',
        // 'confirmed'
      ]
    ];
  }
}
