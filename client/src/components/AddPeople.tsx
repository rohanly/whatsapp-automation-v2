import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormFields, personFormSchema } from "@/schemas/people";
import { Calendar } from "@/components/ui/calendar";
import { MultiSelect } from "./ui/multiselect";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { formatDate } from "@/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddPeople() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(personFormSchema),
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationKey: ["people"],
    mutationFn: async (data: FormFields) => {
      const formData = new FormData();

      formData.append("image", data["image"][0]);
      const record = await pb.collection("people").create(data);

      const eventData = {
        name: "Birthday",
        // type: "gql6ruo847yyphd",
        type: "zyksbmdhsqkz5as",
        date: record.date,
        person: record.id,
      };

      const resp = await pb.collection("events").create(eventData);
      return pb.collection("people").update(record.id, formData);
    },
    onSuccess: (resp) => {
      console.log(resp);
      queryClient.invalidateQueries({
        queryKey: ["getPeopleList"],
      });
      reset();
      setOpen(false);
    },
    onError: (err) => console.log(err),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="w-4 h-4 mr-1" /> New Person
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg flex flex-col h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
          <DialogDescription>
            Add new person here. Click on submit when done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input id="name" className="col-span-4" {...register("name")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salutation" className="text-left">
              Salutation
            </Label>
            <Input
              id="salutation"
              className="col-span-4 "
              {...register("salutation")}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date_of_birth" className="text-left">
              Date of Birth
            </Label>
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <div className="col-span-4 ">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span>{formatDate(field.value)} </span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salutation" className="text-left">
              Image
            </Label>
            <Input
              id="picture"
              type="file"
              {...register("image")}
              accept="image/png, image/jpeg"
              className="col-span-4 "
              error={errors?.image?.message}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="gender" className="text-left">
              Gender
            </Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relation" className="text-left">
              Relation(s)
            </Label>
            <Controller
              name="relation"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  selected={field.value ?? []}
                  setSelected={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input
              id="email"
              className="col-span-4"
              {...register("email")}
              error={errors?.email?.message}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobile" className="text-left">
              Mobile
            </Label>
            <Input
              id="mobile"
              className="col-span-4 "
              {...register("mobile")}
              error={errors?.mobile?.message}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="social_link" className="text-left">
              Social link
            </Label>
            <Input
              id="social_link"
              className="col-span-4 "
              {...register("social_link")}
              error={errors?.social_link?.message}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-left">
              Company Name
            </Label>
            <Input
              id="company"
              className="col-span-4 "
              {...register("company")}
              error={errors?.company?.message}
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
