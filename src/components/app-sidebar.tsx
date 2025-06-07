import { Calendar, Inbox, Search } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const items = [
    { title: "Map", key: "home", icon: Inbox },
    { title: "Daftar Ruas Jalan", key: "ruasjalan", icon: Calendar },
    { title: "Tambah Ruas Jalan", key: "tambah", icon: Search },
];

type AppSidebarProps = {
    style?: React.CSSProperties;
    onOpenPanel?: () => void;
    onOpenAddForm?: () => void;
};

export function AppSidebar({ style, onOpenPanel, onOpenAddForm }: AppSidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <Sidebar style={style} className="w-64 h-full flex flex-col">
            <SidebarContent style={{ flexGrow: 1 }}>
                <SidebarGroup>
                    <SidebarGroupLabel>GIS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <button
                                            className="w-full text-left flex items-center gap-2"
                                            onClick={() => {
                                                if (item.title === "Daftar Ruas Jalan") {
                                                    onOpenPanel?.();
                                                } else if (item.title === "Tambah Ruas Jalan") {
                                                    onOpenAddForm?.();
                                                } else if (item.title === "Map") {
                                                    navigate("/home"); // atau sesuaikan dengan rute yang benar
                                                }
                                            }}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer Logout dengan AlertDialog */}
            <SidebarFooter style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            Logout
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah anda yakin ingin keluar? Semua sesi akan diakhiri dan Anda harus masuk kembali untuk melanjutkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>
        </Sidebar>
    );
}
