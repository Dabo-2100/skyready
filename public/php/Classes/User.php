<?php
class Car
{
    // Properties / Fields
    public $brand;
    private $color;
    private $name;
    // Constructor
    public function __construct($name)
    {
        $this->brand  = $name;
    }
}

$myCar = new Car("Dabo");
print_r($myCar->brand);
