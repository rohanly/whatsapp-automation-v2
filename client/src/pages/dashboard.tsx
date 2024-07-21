import DashboardEventList from "@/components/DashboardEventList";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardMessageList from "@/components/DashboardMessageList";
import Meteors from "@/components/ui/meteors";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <main className="h-full flex flex-col lg:flex-row gap-8">
        <DashboardEventList />
        {/* <DashboardMessageList /> */}
      </main>
    </DashboardLayout>
  );
}
