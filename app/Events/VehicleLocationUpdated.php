<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VehicleLocationUpdated implements ShouldBroadcastNow 
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $vehicle_id; 
    public $lat; 
    public $lng;

    public function __construct($vehicle_id, $lat, $lng)
    {
        $this->vehicle_id = $vehicle_id; 
        $this->lat = $lat; 
        $this->lng = $lng;
    }

    
    
    public function broadcastOn()
    {
        return new Channel('vehicles');
    }

    public function broadcastAs() { 
        return 'VehicleLocationUpdated'; 
    }
}
