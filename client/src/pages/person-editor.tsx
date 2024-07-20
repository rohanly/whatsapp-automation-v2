import DashboardLayout from "@/components/DashboardLayout";
import { EditPeople } from "@/components/EditPeople";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

function PersonEditorPage() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-start">
        <Link to="/people">
          <ArrowLeftIcon className="w-5 h-5 mr-3" />
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">
          Edit Person Details
        </h1>
      </div>
      <EditPeople id={id} />
    </DashboardLayout>
  );
}

export default PersonEditorPage;
