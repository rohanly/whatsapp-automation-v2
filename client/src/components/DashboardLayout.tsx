import {
  Bell,
  Calendar,
  CircleUser,
  Home,
  LayoutPanelTop,
  LineChart,
  Menu,
  MessageCircle,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth-service";
import Logo from "./Logo";
import RetroGrid from "./ui/retro-grid";

const navLinks = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Events",
    link: "/events",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "People",
    link: "/people",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Templates",
    link: "/templates",
    icon: <LayoutPanelTop className="h-4 w-4" />,
  },
  {
    title: "Messages",
    link: "/messages",
    icon: <MessageCircle className="h-4 w-4" />,
  },
];

export default function DashboardLayout({
  children,
  className,
  showHeader = true,
}: {
  children?: React.ReactNode;
  className?: string;
  showHeader?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="">Lemon Yellow</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-black/90",
                    "/" + location.pathname.split("/")[1] == item.link &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen overflow-hidden">
        {showHeader && (
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  {navLinks.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        "/" + location.pathname.split("/")[1] == item.link &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upgrade to Pro</CardTitle>
                      <CardDescription>
                        Unlock all features and get unlimited access to our
                        support team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" className="w-full">
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form> */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
        )}
        <main
          className={cn(
            "relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full overflow-auto",
            className
          )}
        >
          {/* {showHeader && <RetroGrid className="h-[100px] w-[90%] -z-10" />} */}
          {children}
        </main>
      </div>
    </div>
  );
}
