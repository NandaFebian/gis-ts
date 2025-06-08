import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { RuasJalanTable } from "@/components/RuasJalanTable";
import { useState } from "react";
import { AddRuasJalanForm } from "@/components/AddRuasJalanForm"; // import komponen form baru
import { EditRuasJalanForm } from "@/components/EditRuasJalanForm";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    // State untuk menyimpan ID ruas jalan yang sedang diedit
    const [editId, setEditId] = useState<string | null>(null);
    const closeEditForm = () => {
        setEditId(null);
        setIsEditFormOpen(false);
    };
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

    const openPanel = () => {
        setIsAddFormOpen(false);
        setIsPanelOpen(true);
    };

    const openAddForm = () => {
        setIsPanelOpen(false);
        setIsAddFormOpen(true);
    };

    const closePanel = () => setIsPanelOpen(false);
    const closeAddForm = () => setIsAddFormOpen(false);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">
                {/* Sidebar kiri */}
                <div className="flex-shrink-0">
                    <AppSidebar onOpenPanel={openPanel} onOpenAddForm={openAddForm} />
                </div>

                {/* Kontainer utama */}
                <div className="flex flex-1 overflow-hidden relative px-1">
                    {/* Panel Tabel Ruas Jalan */}
                    {isPanelOpen && (
                        <div className="absolute top-0 left-0 h-full w-[800px] bg-white border-r shadow-md z-10 transition-all flex">
                            {/* Kontainer Flex untuk Tabel dan Form */}
                            <div className="flex w-full h-full">
                                {/* Tabel */}
                                <div
                                    className={`h-full p-5 overflow-y-auto transition-all duration-300 ${isEditFormOpen ? "w-1/2 border-r" : "w-full"
                                        }`}
                                >
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={closePanel}
                                            className="text-gray-500 hover:text-red-500 text-xl font-bold"
                                            aria-label="Tutup panel"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <RuasJalanTable
                                        onDeleteSuccess={(msg) => console.log(msg)}
                                        onError={(err) => console.error(err)}
                                        onEdit={(id) => {
                                            setEditId(id);
                                            setIsEditFormOpen(true);
                                        }}
                                    />
                                </div>

                                {/* Form Edit */}
                                {editId && isEditFormOpen && (
                                    <div className="w-1/2 h-full p-5 overflow-y-auto transition-all duration-300">
                                        <div className="flex justify-end mb-4">
                                            <button
                                                onClick={closeEditForm}
                                                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                                                aria-label="Tutup form edit"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <EditRuasJalanForm id={editId} onSuccess={closeEditForm} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Panel Form Tambah Ruas Jalan */}
                    {isAddFormOpen && (
                        <div className="absolute top-0 left-0 h-full w-[400px] bg-white border-r shadow-md z-10 transition-all px-1">
                            <div className="p-5 h-full overflow-y-auto">
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={closeAddForm}
                                        className="text-gray-500 hover:text-red-500 text-xl font-bold"
                                        aria-label="Tutup form"
                                    >
                                        ×
                                    </button>
                                </div>
                                <AddRuasJalanForm onSuccess={closeAddForm} />
                            </div>
                        </div>
                    )}
                    {/* Konten utama */}
                    <main
                        className={`transition-all duration-300 ease-in-out flex-1 p-4 mt-6 ${isAddFormOpen
                            ? "ml-[400px]"
                            : isPanelOpen
                                ? "ml-[800px]"
                                : "ml-0"
                            }`}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
