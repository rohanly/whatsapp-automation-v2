import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pb } from "@/lib/pocketbase";
import { formatTimestamp, getImageURL } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardMessageList() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["getMessages"],
    queryFn: () =>
      pb.collection("messages").getList(1, 10, {
        sort: "-created",
        expand: "receipt, template",
      }),
  });

  return (
    <Card className="w-full lg:w-1/3 h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Messages</CardTitle>
          <CardDescription>Recently sent messages</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/messages">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className=" h-full overflow-auto">
        {isLoading ? (
          <p>loading...</p>
        ) : (
          messages?.items?.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardMessageList;

const MessageItem: React.FC<any> = ({ message }) => {
  return (
    <div className="w-full p-4 border-y border-grey-200">
      <div className="flex gap-4 items-center ">
        <img
          src={getImageURL(
            message?.expand?.receipt,
            message?.expand?.receipt?.image
          )}
          alt={message?.expand?.receipt?.name}
          className="w-12 h-12 object-contain rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold text-base">
            {message?.expand?.receipt?.name}
          </p>
          <div
            className="w-full line-clamp-1 font-normal text-sm text-black/40"
            dangerouslySetInnerHTML={{
              __html: message?.message,
            }}
          />
        </div>
        <div className="h-10 flex flex-col justify-start">
          <p className="w-full line-clamp-1 font-semibold text-xs text-black/40">
            {formatTimestamp(message?.created)}
          </p>
        </div>
      </div>
    </div>
  );
};
