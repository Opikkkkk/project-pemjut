import { LayoutDashboard, UserPen, Zap, FolderKanban } from "lucide-react";
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
        requireAdmin: true, // Add this flag for admin-only items
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
    const isAdmin = auth.user?.role === 'Admin';

    // Filter items based on user role
    const filteredItems = items.filter(item =>
        !item.requireAdmin || (item.requireAdmin && isAdmin)
    );

    return (
        <Sidebar>
            <SidebarContent className="bg-gradient-to-b from-slate-800 to-gray-900">
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-4">
                        <div className="flex items-center gap-4">
                            <Zap className="text-white cursor-pointer" />
                            <span className="text-xl text-white font-bold">
                                Laravel TSX
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
