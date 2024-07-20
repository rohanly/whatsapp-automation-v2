import DashboardLayout from "@/components/DashboardLayout";
import MessageList from "@/components/MessageList";
import ReceiptList from "@/components/ReceiptList";

function MessagePage() {
  return (
    <DashboardLayout showHeader={false} className="p-0 lg:p-0">
      <main className="flex h-full ">
        <div className="w-1/3 h-full ">
          <ReceiptList />
        </div>
        <div className="flex-1 bg-neutral-100 rounded-lg flex flex-col justify-end">
          <MessageList />
          {/* <MessageGenerator /> */}
        </div>
      </main>
    </DashboardLayout>
  );
}

export default MessagePage;
