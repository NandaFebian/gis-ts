import { MapIcon, ListBulletIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
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
import { logoutUser } from "@/api/apiService";

const items = [
    { title: "Map", key: "home", icon: MapIcon },
    { title: "Daftar Ruas Jalan", key: "ruasjalan", icon: ListBulletIcon },
    { title: "Tambah Ruas Jalan", key: "tambah", icon: PlusIcon },
];

type AppSidebarProps = {
    style?: React.CSSProperties;
    onOpenPanel?: () => void;
    onOpenAddForm?: () => void;
};

export function AppSidebar({ style, onOpenPanel, onOpenAddForm }: AppSidebarProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser(); // Panggil API logout
        } catch (error) {
            console.error("Logout API error:", error);
            // Optional: bisa tampilkan toast atau alert
        } finally {
            // Bersihkan localStorage dan arahkan ke login, tetap dilakukan meskipun logout gagal
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            navigate("/login", { replace: true });
        }
    };

    return (
        <Sidebar style={style} className="w-64 h-full flex flex-col">
            {/* Header */}
            <SidebarHeader className="px-4 py-3 border-b">
                <div className="text-xl font-semibold">Aplikasi GIS</div>
            </SidebarHeader>
            {/* Konten utama */}
            <SidebarContent style={{ flexGrow: 1 }}>
                <SidebarGroup>
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

            {/* Footer Logout */}
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
