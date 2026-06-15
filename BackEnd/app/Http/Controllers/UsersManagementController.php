<?php
// Controller handling CRUD operations for regular users (patients).

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UsersManagementController extends Controller
{

  // Updates a user's profile fields and optionally their avatar image.
  public function update(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'firstname' => 'required',
      'lastname' => 'required',
      'cin' => 'required',
      'email' => 'required|email',
      'phoneNumber' => 'nullable',
      'id' => 'required|exists:users,id'
    ]);

    $this->validateWith($validator, $request);

    $data = $validator->validated();

    // Handle avatar upload and store in storage/app/public/images/users.
    if ($request->hasFile('user_avatar')) {
      $image = $request->file('user_avatar');
      $path = $image->store('public/images/users');
      $imageName = basename($path);
      $user_img = User::find($data['id']);
      $user_img->user_avatar = $imageName ;
      $user_img->save();
    };

    $user = User::find($data['id']);

    $user->firstname = $data['firstname'];
    $user->lastname = $data['lastname'];
    $user->cin = $data['cin'];
    $user->email = $data['email'];
    $user->phoneNumber = $data['phoneNumber'] ?? $user->phoneNumber;

    $user->save();

    return response([
      'updated' => 'success',
      'user' => $user
    ], 200);
  }


  // Deletes a user account and revokes all their Sanctum tokens.
  public function delete(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'id' => 'required|exists:users,id'
    ]);

    $this->validateWith($validator, $request);

    $data = $validator->validated();

    $user = User::find($data['id']);
    $user->tokens()->delete();
    $user->delete();

    return response([
      'deleted' => 'succes',
    ], 200);
  }
}
