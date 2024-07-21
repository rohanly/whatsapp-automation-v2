import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { CommandEmpty, CommandList, Command as CommandPrimitive } from "cmdk";
import { pb } from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import { getRelationTypeList } from "@/api/relation-types.service";

export function MultiSelect({
  selected,
  setSelected,
}: {
  selected: any[];
  setSelected: (...event: any[]) => void;
}) {
  console.log("SELECTED: ", selected);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (framework) => {
      setSelected(selected.filter((s: any) => s.id !== framework.id));
    },
    [selected]
  );

  const { data: options, isLoading } = useQuery({
    queryKey: ["getRelationTypeList"],
    queryFn: getRelationTypeList,
  });

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
    (option: any) => !selected?.includes(option)
  );

  if (isLoading) return <div>loading...</div>;

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent col-span-4"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected?.map((option: any) => {
            return (
              <Badge key={option.id} variant="secondary">
                {option.name}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
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
                {selectables?.map((option) => {
                  return (
                    <CommandItem
                      key={option.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected([...new Set([...selected, option])]);
                      }}
                      className={"cursor-pointer"}
                      data-disabled={"false"}
                    >
                      {option.name}
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
