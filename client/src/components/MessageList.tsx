import { activeChatState } from "@/atoms/chatAtom";
import { pb } from "@/lib/pocketbase";
import { formatTimestamp, getImageURL } from "@/lib/utils";
import { IMessage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "./ui/use-toast";

const MessageList: React.FC = () => {
  const [searchParams, _] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const id = searchParams.get("id");

  const { data: messages, isLoading } = useQuery({
    queryKey: ["getMessages", id],
    queryFn: () =>
      pb.collection("messages").getFullList({
        filter: `receipt="${id}"`,
        expand: "receipt, template",
      }),
  });

  const { data: person, ...personQuery } = useQuery({
    queryKey: ["getPersonById", id],
    queryFn: () => {
      if (!id) return null;
      return pb.collection("people").getOne(id);
    },
  });

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, isLoading]);

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className=" bg-gray-200 rounded-t">
        {personQuery.isLoading ? (
          <p>loading...</p>
        ) : (
          person && (
            <div className="w-fit mx-auto flex flex-col p-2 justify-center items-center ">
              <img
                src={getImageURL(person, person?.image)}
                alt={person?.name}
                className="w-12 h-12 object-contain rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-base">{person?.name}</p>
              </div>
            </div>
          )
        )}
      </div>
      <div className="flex-1 overflow-auto rounded-b p-4">
        {isLoading ? (
          <p>loading...</p>
        ) : (
          messages?.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={containerRef} className=""></div>
      </div>
    </div>
  );
};

export default MessageList;

export const MessageItem = ({ message }: any) => {
  const url = getImageURL(
    message.expand?.template,
    message.expand?.template.image
  );

  const copyToClipboard = async (
    htmlContent: string = message.message,
    imageSrc: string = url
  ) => {
    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const data = [
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          [blob.type]: blob,
        }),
      ];
      await navigator.clipboard.write(data);
      toast({
        title: "Content copied to clipboard successfully!",
      });
      console.log("Content copied to clipboard successfully!");
    } catch (error) {
      toast({
        title: "Failed to copy content",
        variant: "destructive",
      });
      console.error("Failed to copy content: ", error);
    }
  };

  const handleCopy = () => {
    copyToClipboard();
  };

  return (
    <div key={message.id} className="flex group">
      <div className="hidden group-hover:flex flex-1 justify-end items-center m-4">
        <div className="">
          <Button onClick={handleCopy} variant="outline" size="icon">
            <CopyIcon />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md ml-auto m-3 bg-white/80 p-3 border-y shadow rounded">
        <div className="space-y-4 items-center">
          <img
            src={url}
            alt={message.expand?.receipt.name}
            className="object-contain rounded border max-h-[400px] mx-auto"
          />
          <div className="">
            <div
              className="w-full  font-normal text-sm text-black"
              dangerouslySetInnerHTML={{ __html: message.message }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-end text-right w-full ">
            <p className="w-full line-clamp-1 font-semibold text-sm text-black/40">
              {formatTimestamp(message.created)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoMessage = () => {
  return (
    <div className="flex-1 h-full flex justify-center items-center ">
      <img src="/no-message.jpg" className="w-1/2 object-contain" />
    </div>
  );
};
