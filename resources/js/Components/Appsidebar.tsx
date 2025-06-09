import { LayoutDashboard, UserPen, FolderKanban } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

// Add type for user
interface User {
    role?: string;
}

interface PageProps {
    auth: {
        user: User;
    };
}

const items = [
    {
        title: "Dashboard",
        url: "dashboard",
        icon: LayoutDashboard,
        requireAdmin: false,
    },
    {
        title: "Manage Users",
        url: "users",
        icon: UserPen,
        requireAdmin: true,
    },
    {
        title: "Projects",
        url: "projects.index",
        icon: FolderKanban,
        requireAdmin: false,
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === "Admin";

    const filteredItems = items.filter(
        (item) => !item.requireAdmin || (item.requireAdmin && isAdmin)
    );

    return (
        <Sidebar>
            <SidebarContent className="bg-gradient-to-b from-slate-700 to-gray-900">
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-4">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <img
                                    src="/images/logo.png"
                                    alt="TIMSAR Logo"
                                    className="w-8 h-8 cursor-pointer"
                                />
                            </Link>
                            <span className="text-2xl text-white font-bold font-bebas tracking-wide">
                                TIMSAR
                            </span>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-slate-700 active:bg-slate-700"
                                    >
                                        <Link
                                            href={
                                                item.url ? route(item.url) : "#"
                                            }
                                        >
                                            <item.icon className="text-white" />
                                            <span className="text-white">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
