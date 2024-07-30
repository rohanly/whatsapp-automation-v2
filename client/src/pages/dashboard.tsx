import DashboardEventList from "@/components/DashboardEventList";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardMessageList from "@/components/DashboardMessageList";
import Meteors from "@/components/ui/meteors";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="flex h-full  flex-col lg:flex-row gap-8 overflow-y-auto">
        <DashboardEventList />
        <DashboardMessageList />
      </section>
    </DashboardLayout>
  );
}
