import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";

import { useToast } from "./ui/use-toast";
import { TemplateSchema, templateSchema } from "@/schemas/template";

export function AddTemplate({ id }: { id?: string }) {
  const { toast } = useToast();
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
    setValue,
    watch,
  } = useForm<TemplateSchema>({
    resolver: zodResolver(templateSchema),
    reValidateMode: "onChange",
  });
  const [preview, setPreview] = useState<any>(null);

  const { data: template, refetch: refetchTemplate } = useQuery({
    queryKey: ["getTemplateById", id],
    queryFn: () => {
      if (!id || id === "new") return null;
      return pb.collection("templates").getOne(id, {
        expand: "type",
      });
    },
  });

  const { data: eventTypes, isLoading } = useQuery({
    queryKey: ["getEventTypes"],
    queryFn: () => pb.collection("event_types").getFullList(),
  });

  useEffect(() => {
    if (!template) return;
    (async () => {
      setValue("type", template.expand?.type.id);
      setValue("message", template.message);

      const url = pb.files.getUrl(template, template.image);
      setValue("image", url);
    })();
  }, [template]);

  const mutation = useMutation({
    mutationKey: ["people"],
    mutationFn: (data: TemplateSchema) => {
      const formData = new FormData();
      for (const key in data) {
        if (key == "image") {
          if (typeof data.image !== "string") formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
      if (!id || id == "new") {
        return pb.collection("templates").create(formData);
      }
      return pb.collection("templates").update(id, formData);
    },
    onSuccess: (resp) => {
      console.log(resp);
      reset();
      toast({
        title: "Edited Successfully",
      });
      refetchTemplate();
    },
    onError: (err) => console.log(err),
  });

  const onSubmit: SubmitHandler<TemplateSchema> = (data) => {
    mutation.mutate(data);
  };

  const handleImageChange = (event: any) => {
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

  return (
    <div className="flex-1 overflow-auto w-full max-w-md mx-auto">
      <section className=" flex flex-col pb-10 px-4">
        <div className="grid  gap-4 lg:gap-8 py-4">
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
                        src={
                          isValidHttpUrl(field.value) ? field.value : preview
                        }
                        className=" w-[180px] rounded-lg object-contain"
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
                      console.log("--->", e.target.files);
                      field.onChange(e.target.files[0]);
                      handleImageChange(e);
                    }}
                    accept="image/png, image/jpeg"
                    className="col-span-4 "
                    error={errors?.image?.message}
                  />
                )
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="type" className="text-left">
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
            <Label htmlFor="message" className="text-left">
              Message
            </Label>
            <div className="flex flex-col gap-1 col-span-4">
              <Textarea id="message" {...register("message")} />
              {errors.message?.message && (
                <p className="text-xs text-red-500 col-span-4">
                  {errors.message?.message}
                </p>
              )}
            </div>
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

const isValidHttpUrl = (str: string) => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
