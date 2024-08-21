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
import { IoIosCloseCircle } from "react-icons/io";

interface FilterProps {
  onFilter: (brand: string, model: string) => void;
  allAvailableBrands: string[];
  onCloseFilter: () => void;
}

export const Filter: React.FC<FilterProps> = ({onFilter, allAvailableBrands, onCloseFilter}) => {
  
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [filterModeOn, setFilterModeOn] = useState<boolean>(false)


  return (
    <ul className="flex space-x-5">
      <li>
        <Select
          value={brand}
          onValueChange={(value) => {
            setBrand(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {allAvailableBrands.map((brand, index) => (
                <SelectItem key={index} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </li>
      <li>
        <Input type="model" placeholder="Car model" value={model} onChange={(e) => setModel(e.target.value)}/>
      </li>
      {filterModeOn ? <li>
        <button onClick={() => {
          setFilterModeOn(false)
          onCloseFilter()
          }}><IoIosCloseCircle/></button>
      </li>: <li>
        <Button onClick={() => {
          onFilter(model, brand)
          setFilterModeOn(true)

          }}>Filter</Button>
      </li>}
      
    </ul>
  );
};
