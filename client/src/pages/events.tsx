import { AddEvent } from "@/components/AddEvent";
import DashboardLayout from "@/components/DashboardLayout";
import { EventList } from "@/components/EventList";
import { Calendar } from "lucide-react";
import React from "react";

function EventsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Events
        </h1>
        <AddEvent />
      </div>
      <EventList />
    </DashboardLayout>
  );
}

export default EventsPage;
