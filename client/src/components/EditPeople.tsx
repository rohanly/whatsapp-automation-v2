import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  editPersonFormSchema,
  FormFields,
  personFormSchema,
} from "@/schemas/people";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "./ui/use-toast";
import {
  createPeopleRelation,
  deletePeopleRelation,
  editPersonById,
  getPersonById,
} from "@/api/people.service";
import { convertToFormData } from "@/utils";

export function EditPeople({ id }: { id: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState(null);

  const { data: person } = useQuery({
    queryKey: ["getPersonById", id],
    queryFn: () => getPersonById(id),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
    setValue,
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(editPersonFormSchema),
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationKey: ["people"],
    mutationFn: async (data: FormFields) => {
      const { relation, dateOfBirth, ...rest } = data;
      const formData = convertToFormData({
        ...rest,
        dateOfBirth: dateOfBirth?.toISOString(),
      });

      const person = await editPersonById(id, formData);

      await deletePeopleRelation(id);

      if (relation.length) {
        for (let relationId of relation) {
          await createPeopleRelation({
            personId: id,
            relationTypeId: relationId,
          });
        }
      }

      return person;
    },
    onSuccess: (resp) => {
      console.log(resp);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["getPersonById"],
      });
      toast({
        title: "Edited Successfully",
      });
    },
    onError: (err) => console.log(err),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutation.mutate(data);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    if (!person) return;
    reset({
      additionalInfo: person?.additionalInfo,
      company: person?.company,
      dateOfBirth: new Date(person?.dateOfBirth),
      gender: person?.gender,
      email: person?.email,
      ex: person?.ex,
      extendedFamily: person?.extendedFamily,
      image: person?.image,
      metaData: person?.metaData,
      mobile: person?.mobile,
      name: person?.name,
      salutation: person?.name,
      socialLink: person?.socialLink,
      relation: person?.relations?.map((r) => r?.relationType),
    });
  }, [person]);

  return (
    <div className="h-full">
      <section className=" flex flex-col h-[500px] pb-10 overflow-y-auto">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salutation" className="text-left">
              Image
            </Label>

            <Controller
              name="image"
              control={control}
              render={({ field }) =>
                field.value ? (
                  <div className="col-span-4 flex justify-start items-center">
                    <div className="relative">
                      <img
                        src={preview || field.value}
                        className=" w-[60px] rounded-lg object-contain"
                      />
                      <div
                        onClick={() => setValue("image", "")}
                        className="absolute -right-2 -top-2  opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-slate-100  p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Input
                    id="picture"
                    type="file"
                    multiple={false}
                    value={field.value}
                    onChange={(e) => {
                      handleImageChange(e);
                      field.onChange(e.target.files[0]);
                    }}
                    accept="image/png, image/jpeg"
                    className="col-span-4 "
                    error={errors?.image?.message}
                  />
                )
              }
            />
          </div>

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
              id="social_link"
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
      </section>
      <div className="mt-auto w-full flex justify-end bg-slate-50 p-2">
        <Button
          // disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          size="lg"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

const getFileFromUrl = async (
  url: string,
  name: string,
  defaultType = "image/jpeg"
) => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
};

const isValidHttpUrl = (str: string) => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
