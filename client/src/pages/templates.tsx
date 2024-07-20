import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TemplateList from "@/components/TemplateList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LayoutPanelTop, PlusCircleIcon } from "lucide-react";

function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
          {" "}
          <LayoutPanelTop className="h-6 w-6" /> Templates
        </h1>
        <Link to="/templates/new">
          <Button>
            <PlusCircleIcon className="w-4 h-4 mr-1" /> New Template
          </Button>
        </Link>
      </div>
      <TemplateList />
    </DashboardLayout>
  );
}

export default TemplatesPage;
