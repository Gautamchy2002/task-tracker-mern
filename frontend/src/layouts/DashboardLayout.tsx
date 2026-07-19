import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, tenant, logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: ClipboardList,
      visible: true,
    },
    {
      label: "Users",
      path: "/users",
      icon: Users,
      visible: user?.role === "ADMIN",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col bg-slate-950 px-4 py-5 text-white transition-transform lg:translate-x-0",
          open && "translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-bold">
            TT
          </div>
          <div className="min-w-0">
            <p className="font-semibold">Task Tracker</p>
            <p className="truncate text-xs text-slate-400">{tenant?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1">
          {menuItems
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
                      isActive && "bg-primary text-white",
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>

        <Button
          variant="ghost"
          className="mt-auto justify-start text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </aside>

      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
