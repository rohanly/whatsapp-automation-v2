import { pb } from "@/lib/pocketbase";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { NoTemplates } from "./NoTemplates";
import { useNavigate } from "react-router-dom";
import { getImageURL } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, PenBoxIcon, TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function TemplateList() {
  const { data, isLoading } = useQuery({
    queryKey: ["getTemplates"],
    queryFn: () => {
      return pb.collection("templates").getFullList({
        sort: "-created",
        expand: "type",
      });
    },
  });

  // if (isLoading) return <p>Loading...</p>;

  return data?.length ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((item) => (
        <TemplateItem key={item.id} data={item} />
      ))}
    </div>
  ) : (
    <NoTemplates />
  );
}

export default TemplateList;

const TemplateItem = ({ data }: any) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const mutation = useMutation({
    mutationKey: ["getTemplates"],
    mutationFn: () => {
      return pb.collection("templates").delete(data.id);
    },
  });

  return (
    <>
      <Card className="group">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Badge>{data.expand?.type.name}</Badge>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigate("/templates/" + data.id)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDialog(true)}
                    className="text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <div className="hidden group-hover:flex justify-center items-center gap-4">
              <button className="bg-slate-100 p-1.5 rounded-full">
                <PenBoxIcon className="w-4 h-4 text-blue-500" />
              </button>
              <button className="bg-slate-100 p-1.5 rounded-full">
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </div> */}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img
            className="w-full h-[250px] object-cover"
            src={getImageURL(data, data.image)}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: data?.message,
            }}
          ></p>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-400"
              onClick={() => {
                mutation.mutate();
              }}
              disabled={mutation.isPending}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
