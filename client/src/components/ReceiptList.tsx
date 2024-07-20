import { cn, formatTimestamp, getImageURL } from "@/lib/utils";
import React from "react";
import { CardDescription, CardTitle } from "./ui/card";
import { useRecoilState } from "recoil";
import { activeChatState } from "@/atoms/chatAtom";

import { pb } from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ReceiptProps {}

const ReceiptList: React.FC<ReceiptProps> = ({}) => {
  const { data: receipts, isLoading } = useQuery({
    queryKey: ["getPeople"],
    queryFn: () =>
      pb.collection("people").getFullList({
        expand: "last_message",
      }),
  });

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="grid gap-2 p-4 shadow">
        <CardTitle>Messages</CardTitle>
        <CardDescription>Recently sent messages</CardDescription>
      </div>
      <div className="flex-1 h-full overflow-auto">
        {receipts?.map((receipt) => (
          <ReceiptItem key={receipt.id} receipt={receipt} />
        ))}
      </div>
    </div>
  );
};

export default ReceiptList;

const ReceiptItem: React.FC<any> = ({ receipt }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/messages?id=" + receipt.id)}
      className={cn(
        "w-full p-4 border-y border-grey-200 cursor-pointer",
        searchParams.get("id") === receipt.id && "bg-gray-200"
      )}
    >
      <div className="flex gap-4 items-center ">
        <img
          src={getImageURL(receipt, receipt.image)}
          alt={receipt.name}
          className="w-12 h-12 object-contain rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold text-base">{receipt.name}</p>
          <div
            className="w-full line-clamp-1 font-normal text-sm text-black/40"
            dangerouslySetInnerHTML={{
              __html: receipt.expand?.last_message?.message,
            }}
          />
        </div>
        <div className="h-10 flex flex-col justify-start">
          <p className="w-full line-clamp-1 font-semibold text-xs text-black/40">
            {receipt.expand?.last_message?.created
              ? formatTimestamp(receipt.expand?.last_message?.created)
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
