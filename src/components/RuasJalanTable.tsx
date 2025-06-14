import { useEffect, useState } from 'react';
import {
    getAllRuasJalan,
    deleteRuasJalanByID,
    getMasterKondisiJalan,
    getMasterJenisJalan,
    getMasterEksistingJalan,
} from '@/api/apiService';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
} from '@/components/ui/alert-dialog';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

import type { RuasJalanData } from '@/types/RuasJalan';
import { useSelectedRuasStore } from '@/stores/useSelectedRuasStore';

interface RuasJalanTableProps {
    onDeleteSuccess?: (msg: string) => void;
    onError?: (msg: string) => void;
    onEdit?: (id: string) => void;
}

export const RuasJalanTable = ({
    onDeleteSuccess,
    onError,
    onEdit,
}: RuasJalanTableProps) => {
    const [data, setData] = useState<RuasJalanData[]>([]);
    const [filteredData, setFilteredData] = useState<RuasJalanData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [kondisiList, setKondisiList] = useState<{ id: number; kondisi: string }[]>([]);
    const [jenisJalanList, setJenisJalanList] = useState<{ id: number; jenisjalan: string }[]>([]);
    const [eksistingList, setEksistingList] = useState<{ id: number; eksisting: string }[]>([]);
    const [selectedKondisi, setSelectedKondisi] = useState('all');
    const [selectedJenis, setSelectedJenis] = useState('all');
    const [selectedEksisting, setSelectedEksisting] = useState('all');

    const kondisiMap: Record<string, string> = {
        "1": "Baik",
        "2": "Sedang",
        "3": "Rusak",
    };

    const jenisJalanMap: Record<string, string> = {
        "1": "Desa",
        "2": "Kabupaten",
        "3": "Provinsi",
    };

    const eksistingMap: Record<string, string> = {
        "1": "Tanah",
        "2": "Tanah/Beton",
        "3": "Perkerasan",
        "4": "Koral",
        "5": "Lapen",
        "6": "Paving",
        "7": "Hotmix",
        "8": "Beton",
        "9": "Beton/Lapen",
    };

    const fetchData = async () => {
        try {
            const [ruasResponse, kondisiResponse, jenisResponse, eksistingResponse] = await Promise.all([
                getAllRuasJalan(),
                getMasterKondisiJalan(),
                getMasterJenisJalan(),
                getMasterEksistingJalan(),
            ]);

            const ruas = ruasResponse.data.ruasjalan;
            setData(ruas);
            setFilteredData(ruas);
            setKondisiList(kondisiResponse.data.eksisting);
            setJenisJalanList(jenisResponse.data.eksisting);
            setEksistingList(eksistingResponse.data.eksisting);
        } catch (_) {
            onError?.('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteRuasJalanByID(id);
            onDeleteSuccess?.('Data berhasil dihapus');
            fetchData();
        } catch (_) {
            onError?.('Gagal menghapus data');
        }
    };

    const handleSearch = (
        term: string,
        kondisiFilter = selectedKondisi,
        jenisFilter = selectedJenis,
        eksistingFilter = selectedEksisting
    ) => {
        setSearchTerm(term);
        const filtered = data.filter((item) => {
            const matchTerm =
                item.nama_ruas.toLowerCase().includes(term.toLowerCase()) ||
                item.kode_ruas.toLowerCase().includes(term.toLowerCase());

            const matchKondisi = kondisiFilter !== 'all' ? item.kondisi_id.toString() === kondisiFilter : true;
            const matchJenis = jenisFilter !== 'all' ? item.jenisjalan_id.toString() === jenisFilter : true;
            const matchEksisting = eksistingFilter !== 'all' ? item.eksisting_id.toString() === eksistingFilter : true;

            return matchTerm && matchKondisi && matchJenis && matchEksisting;
        });

        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="mt-4">
            <CardContent className="p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Data Ruas Jalan</h2>
                </div>
                <div className="mb-2 flex gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Cari kode atau nama ruas…"
                            className="w-full"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex gap-4 mb-4'>
                    <Select
                        value={selectedKondisi}
                        onValueChange={(value) => {
                            setSelectedKondisi(value);
                            handleSearch(searchTerm, value, selectedJenis);
                        }}
                    >
                        <SelectTrigger className="w-90">
                            <SelectValue placeholder="Filter Kondisi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kondisi</SelectItem>
                            {kondisiList.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>
                                    {k.kondisi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedJenis}
                        onValueChange={(value) => {
                            setSelectedJenis(value);
                            handleSearch(searchTerm, selectedKondisi, value);
                        }}
                    >
                        <SelectTrigger className="w-90">
                            <SelectValue placeholder="Filter Jenis Jalan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            {jenisJalanList.map((j) => (
                                <SelectItem key={j.id} value={j.id.toString()}>
                                    {j.jenisjalan}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedEksisting}
                        onValueChange={(value) => {
                            setSelectedEksisting(value);
                            handleSearch(searchTerm, selectedKondisi, selectedJenis, value);
                        }}
                    >
                        <SelectTrigger className="w-90">
                            <SelectValue placeholder="Filter Eksisting Jalan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Eksisting</SelectItem>
                            {eksistingList.map((e) => (
                                <SelectItem key={e.id} value={e.id.toString()}>
                                    {e.eksisting}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                <TableRow
                                    key={ruas.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => useSelectedRuasStore.getState().setSelectedRuas(ruas)} //menyimpan state ruas yang dipilih
                                >
                                    <TableCell>{ruas.kode_ruas}</TableCell>
                                    <TableCell>{ruas.nama_ruas}</TableCell>
                                    <TableCell>{ruas.panjang ? `${ruas.panjang} m` : '-'}</TableCell>
                                    <TableCell>{ruas.lebar ? `${ruas.lebar} m` : '-'}</TableCell>
                                    <TableCell>
                                        {eksistingMap[ruas.eksisting_id?.toString()] || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {kondisiMap[ruas.kondisi_id?.toString()] || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {jenisJalanMap[ruas.jenisjalan_id?.toString()] || '-'}
                                    </TableCell>
                                    <TableCell>{ruas.keterangan}</TableCell>
                                    <TableCell className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                useSelectedRuasStore.getState().setSelectedRuas(ruas); // simpan ke store
                                                onEdit?.(ruas.id); // buka form edit
                                            }}
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

                            {filteredData.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-gray-500">
                                        Tidak ada data yang cocok.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
