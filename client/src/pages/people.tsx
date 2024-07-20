import { AddPeople } from "@/components/AddPeople";
import DashboardLayout from "@/components/DashboardLayout";
import { PeopleList } from "@/components/PeopleList";
import { UsersIcon } from "lucide-react";

function PeoplePage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
          <UsersIcon className="w-6 h-6" />
          People
        </h1>

        <AddPeople />
      </div>
      <PeopleList />
    </DashboardLayout>
  );
}

export default PeoplePage;
