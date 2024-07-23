import { pb } from "@/lib/pocketbase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { deleteTemplate, getTemplateList } from "@/api/templates.service";

function TemplateList() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["getTemplateList"],
    queryFn: getTemplateList,
  });

  if (isLoading) return <p>Loading...</p>;

  if (templates?.data?.length === 0) return <NoTemplates />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates?.data?.map((template) => (
        <TemplateItem key={template.id} template={template} />
      ))}
    </div>
  );
}

export default TemplateList;

const TemplateItem = ({ template }: any) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDialog, setShowDialog] = useState(false);

  const mutation = useMutation({
    mutationFn: () => deleteTemplate(template.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTemplateList"],
      });
    },
  });

  return (
    <>
      <Card className="group">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Badge>{template.eventType?.name}</Badge>

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
                    onClick={() => navigate("/templates/" + template.id)}
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
          <img className="w-full h-[250px] object-cover" src={template.image} />
          <p
            dangerouslySetInnerHTML={{
              __html: template?.message,
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
