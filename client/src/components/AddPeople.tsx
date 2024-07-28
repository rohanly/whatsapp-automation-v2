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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertToFormData } from "@/utils";
import { createPeople, createPeopleRelation } from "@/api/people.service";
import { DatePicker } from "./DatePicker";

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
      const { relation, dateOfBirth, image, ...rest } = data;
      const formData = convertToFormData({
        ...rest,
        dateOfBirth: dateOfBirth?.toISOString(),
        image: image?.[0],
      });

      const person = await createPeople(formData);

      if (relation.length) {
        for (let relationId of relation) {
          await createPeopleRelation({
            personId: person?.id,
            relationTypeId: relationId,
          });
        }
      }

      return person;
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

  console.log("PEOPLE ERROR: ", errors);

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
            <Label htmlFor="dateOfBirth" className="text-left">
              Date of Birth
            </Label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <div className="col-span-4 ">
                  <DatePicker date={field.value} setDate={field.onChange} />
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
              multiple={false}
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
            <Label htmlFor="socialLink" className="text-left">
              Social link
            </Label>
            <Input
              id="socialLink"
              className="col-span-4 "
              {...register("socialLink")}
              error={errors?.socialLink?.message}
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
            <Label htmlFor="additionalInfo" className="text-left">
              Additional Info
            </Label>
            <Textarea
              className="col-span-4"
              placeholder="Type your message here."
              {...register("additionalInfo")}
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
