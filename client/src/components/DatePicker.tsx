import React, { useEffect, useState } from "react";
import { addDays, addMonths, addYears, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePicker({ value, onChange }: any) {
  const [date, setDate] = React.useState<Date>(value);

  const selectedDate = date ? format(date, "PPP") : "Pick a date";
  const selectedYear = date ? format(date, "yyyy") : "Pick Year";
  const selectMonth = date ? format(date, "MMMM") : "Pick Year";

  useEffect(() => {
    onChange(date);
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="flex space-x-2">
          <Select
            onValueChange={(value) => {
              setDate(addYears(new Date(), parseInt(value)));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year">{selectedYear}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              {[...Array(100).reverse().keys()].map((year) => (
                <SelectItem key={year} value={(-1 * year).toString()}>
                  {new Date().getFullYear() - year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setDate(addMonths(new Date(), parseInt(value)))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Month">{selectMonth}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 12 }, (_, index) => index).map((month) => (
                <SelectItem key={month} value={(month + 1).toString()}>
                  {format(new Date(2000, month), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
