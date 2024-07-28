import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function Filter() {
  const carBrands = ["Merceds", "Audi", "BMW"];
  const carNames = ["RS7", "Swith", "X5"];
  const [carBrand, setCarBrand] = useState<string>("");
  const [carName, setCarName] = useState<string>("");

  return (
    <ul className="flex space-x-5">
      <li>
        <Select
          value={carBrand}
          onValueChange={(value) => {
            setCarBrand(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {carBrands.map((brand, index) => (
                <SelectItem key={index} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
      <li>
        <Input type="carName" placeholder="Car Name" />
      </li>
      <li>
        <Button>Filter</Button>
      </li>
    </ul>
  );
}
