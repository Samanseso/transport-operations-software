<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{role_id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
