import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { formatDate, toDate } from "@/utils/date";
import { useMutation, useQuery } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useState } from "react";
import { eventFormSchema, FormFields } from "@/schemas/event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { People } from "@/types";
import { Calendar } from "./ui/calendar";
import { DatePicker } from "./DatePicker";

export function AddEvent() {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(eventFormSchema),
  });

  const mutation = useMutation({
    mutationKey: ["events"],
    mutationFn: (data: FormFields) => {
      return pb.collection("events").create(data);
    },
    onSuccess: (resp) => {
      console.log(resp);
      reset();
      setOpen(false);
    },
    onError: (err) => console.log(err),
  });

  const { data: peopleList } = useQuery({
    queryKey: ["getPeopleList"],
    queryFn: (): Promise<People[]> =>
      pb.collection("people").getFullList({
        sort: "-created",
        expand: "relation",
      }),
  });

  const { data: eventTypes, ...eventTypeQuery } = useQuery({
    queryKey: ["getEventTypes"],
    queryFn: () => pb.collection("event_types").getFullList(),
  });

  const { data: templates, ...templateQuery } = useQuery({
    queryKey: ["getTemplates"],
    queryFn: () => {
      return pb.collection("templates").getFullList();
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutation.mutate(data);
  };

  console.log(watch("date"));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="w-4 h-4 mr-1" /> New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg flex flex-col  overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input id="name" className="col-span-4" {...register("name")} />
          </div>

          <div className="grid w-full items-center gap-4">
            <Label htmlFor="type" className="text-left ">
              Type
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.value
                            ? eventTypes?.find((ev) => ev.id == field.value)
                                ?.name
                            : "Select type"
                        }
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes?.map((eventType) => (
                        <SelectItem value={eventType.id}>
                          {eventType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type?.message && (
                    <p className="text-xs text-red-500 col-span-4">
                      {errors.type?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-left">
              Event Date
            </Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="col-span-4 ">
                  <DatePicker value={field.value} onChange={field.onChange} />
                </div>
              )}
            />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="person" className="text-left">
              Person
            </Label>
            <Controller
              name="person"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Person" />
                  </SelectTrigger>
                  <SelectContent>
                    {peopleList?.map((p, i) => (
                      <SelectItem key={i} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid w-full items-center gap-4">
            <Label htmlFor="template" className="text-left">
              Template
              <span className="italic ml-2">(optional)</span>
            </Label>
            <Controller
              name="template"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((p, i) => (
                      <SelectItem key={i} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Additional Info
            </Label>
            <Textarea
              className="col-span-4"
              placeholder="Type your message here."
              {...register("additional_info")}
            />
          </div>
        </div>
        <div className="mt-auto w-full flex justify-end ">
          <Button
            // disabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
            size="lg"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
