import DashboardLayout from "@/components/DashboardLayout";
import { EditPeople } from "@/components/EditPeople";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { AddTemplate } from "@/components/AddTemplate";

function TemplateEditorPage() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-start">
        <Link to="/templates">
          <ArrowLeftIcon className="w-5 h-5 mr-3" />
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">Template Details</h1>
      </div>
      <AddTemplate id={id} />
    </DashboardLayout>
  );
}

export default TemplateEditorPage;
