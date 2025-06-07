import { useEffect, useState } from 'react';
import { getAllRuasJalan, deleteRuasJalanByID } from '@/api/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface RuasJalanData {
    id: string; // atau number jika dari API berupa angka
    paths: string;
    desa_id: string;
    kode_ruas: string;
    nama_ruas: string;
    panjang: string;
    lebar: string;
    eksisting_id: string;
    kondisi_id: string;
    jenisjalan_id: string;
    keterangan: string;
}

/**
 * Props:
 * ─ onDeleteSuccess  → dipanggil jika hapus berhasil
 * ─ onError          → dipanggil jika fetch / delete gagal
 */
interface RuasJalanTableProps {
    onDeleteSuccess?: (msg: string) => void;
    onError?: (msg: string) => void;
}

export const RuasJalanTable = ({
    onDeleteSuccess,
    onError,
}: RuasJalanTableProps) => {
    const [data, setData] = useState<RuasJalanData[]>([]);
    const [filteredData, setFilteredData] = useState<RuasJalanData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<boolean>(true);

    /** Ambil data dari API */
    const fetchData = async () => {
        try {
            const response = await getAllRuasJalan();
            const ruas = response.data.ruasjalan;
            setData(ruas);
            setFilteredData(ruas); // awalnya semua
        } catch (_) {
            onError?.('Gagal memuat data ruas jalan');
        } finally {
            setLoading(false);
        }
    };

    /** Hapus satu ruas jalan */
    const handleDelete = async (id: string) => {
        try {
            await deleteRuasJalanByID(id);
            onDeleteSuccess?.('Data berhasil dihapus');
            fetchData(); // refresh list
        } catch (_) {
            onError?.('Gagal menghapus data');
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = data.filter((item) =>
            item.nama_ruas.toLowerCase().includes(term.toLowerCase()) ||
            item.kode_ruas.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="mt-4">
            <CardContent className="p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold">Data Ruas Jalan</h2>
                </div>
                <div className='mb-2 flex'>
                    <Input
                        type="text"
                        placeholder="Cari kode atau nama ruas…"
                        className="w-64"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Memuat data…</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Ruas</TableHead>
                                <TableHead>Panjang</TableHead>
                                <TableHead>Lebar</TableHead>
                                <TableHead>Eksisting</TableHead>
                                <TableHead>Kondisi</TableHead>
                                <TableHead>Jenis Jalan</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredData.map((ruas) => (
                                <TableRow key={ruas.kode_ruas}>
                                    <TableCell>{ruas.kode_ruas}</TableCell>
                                    <TableCell>{ruas.nama_ruas}</TableCell>
                                    <TableCell>{ruas.panjang}</TableCell>
                                    <TableCell>{ruas.lebar}</TableCell>
                                    <TableCell>{ruas.eksisting_id}</TableCell>
                                    <TableCell>{ruas.kondisi_id}</TableCell>
                                    <TableCell>{ruas.jenisjalan_id}</TableCell>
                                    <TableCell>{ruas.keterangan}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => alert("Fitur edit belum diimplementasikan")}
                                        >
                                            Edit
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">
                                                    Hapus
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin menghapus ruas jalan ini?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={() => handleDelete(ruas.id.toString())}
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
