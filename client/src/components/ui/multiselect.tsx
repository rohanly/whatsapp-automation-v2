import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { CommandEmpty, CommandList, Command as CommandPrimitive } from "cmdk";
import { pb } from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";

type OptionType = Record<"value" | "label", string>;

export function MultiSelect({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (...event: any[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  // const [options, setOptions] = React.useState<OptionType[]>([]);

  const handleUnselect = React.useCallback(
    (framework: OptionType) => {
      setSelected(selected.filter((s: any) => s.value !== framework.value));
    },
    [selected]
  );

  const { data: options, isLoading } = useQuery({
    queryKey: ["relation"],
    queryFn: () => pb.collection("relations").getFullList(),
  });

  const handleCreateOption = async () => {
    try {
      const record = await pb.collection("relations").create({
        label: inputValue,
        value: inputValue.toLowerCase().replace(/ /g, "_"),
      });
      console.log(record);
      setInputValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected.pop();
            setSelected(newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = options?.filter(
    (framework: any) => !selected.includes(framework)
  );

  if (isLoading) return <div>loading...</div>;

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent col-span-4"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected?.map((framework: any) => {
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select frameworks..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>

      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <CommandList className="">
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandEmpty>
                <button
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   console.log("clicked");
                  // }}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  No Relation found
                </button>
              </CommandEmpty>

              <CommandGroup className="h-full overflow-auto z-20 cursor-help">
                {selectables?.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected([...selected, framework]);
                      }}
                      className={"cursor-pointer"}
                      data-disabled={"false"}
                    >
                      {framework.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </CommandList>
        ) : null}
      </div>
    </Command>
  );
}
