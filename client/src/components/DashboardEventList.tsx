import { ArrowUpRight, MoreHorizontal } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { pb } from "@/lib/pocketbase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/date";
import { type Relation } from "@/types";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { generateMessageForEvent, getEventList } from "@/api/events.service";

export default function DashboardEventList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["getEventList"],
    queryFn: () => getEventList(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="flex-1 h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center bgh">
        <div className="grid gap-2">
          <CardTitle>Events</CardTitle>
          <CardDescription>All the today' s events.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/events">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 h-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Event</TableHead>
              <TableHead className="hidden md:table-cell">Relation</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.data?.map((event) => (
              <EventTableRow key={event.id} event={event} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        {/* <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div> */}
      </CardFooter>
    </Card>
  );
}

export const EventTableRow = ({ event }: any) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["generatedMessage", event?.id],

    mutationFn: () => generateMessageForEvent(event?.id),
    onSuccess: () => {
      toast({
        title: "Message generated Successfully",
        action: (
          <ToastAction
            onClick={() => navigate("/messages?id=" + event.person)}
            altText="show"
          >
            show
          </ToastAction>
        ),
      });
    },
  });
  return (
    <TableRow key={event.id}>
      <TableCell className="font-medium">{event?.person?.name}</TableCell>

      <TableCell className="hidden md:table-cell">
        <Badge variant="outline">{event?.eventType?.name}</Badge>
      </TableCell>
      {/* TODO: Add people relations */}
      <TableCell>
        {event?.person?.relations?.map((relation: any) => (
          <Badge key={relation.id} variant="outline">
            {relation?.relationType?.name}
          </Badge>
        ))}
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {formatDate(event?.date)}
      </TableCell>
      <TableCell>
        {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
        <Button
          onClick={() => mutation.mutate()}
          variant="secondary"
          disabled={mutation.isPending}
        >
          Generate
        </Button>
      </TableCell>
    </TableRow>
  );
};
