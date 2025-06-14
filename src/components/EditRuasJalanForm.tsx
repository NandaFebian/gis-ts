import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MapView from "@/components/mapView";

import {
    getMasterEksistingJalan,
    getMasterJenisJalan,
    getMasterKondisiJalan,
    getDesaByKecamatanID,
    editRuasJalanByID,
} from "@/api/apiService";
import { useSelectedRuasStore } from "@/stores/useSelectedRuasStore";

type Props = {
    id: string;
    onSuccess?: () => void;
    onError?: (msg: string) => void;
};

export const EditRuasJalanForm: React.FC<Props> = ({ id, onSuccess, onError }) => {
    const selectedRuas = useSelectedRuasStore((state) => state.selectedRuas);

    const [formData, setFormData] = useState({
        paths: "",
        desa_id: "",
        kode_ruas: "",
        nama_ruas: "",
        panjang: "",
        lebar: "",
        eksisting_id: "",
        kondisi_id: "",
        jenisjalan_id: "",
        keterangan: "",
    });

    const [desaOptions, setDesaOptions] = useState<any[]>([]);
    const [eksistingOptions, setEksistingOptions] = useState<any[]>([]);
    const [kondisiOptions, setKondisiOptions] = useState<any[]>([]);
    const [jenisJalanOptions, setJenisJalanOptions] = useState<any[]>([]);
    const [showMap, setShowMap] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePathChange = (geojsonPath: string) => {
        setFormData((prev) => ({ ...prev, paths: geojsonPath }));
        setShowMap(false);
    };

    const fetchDropdowns = async () => {
        try {
            const [eks, jenis, kondisi] = await Promise.all([
                getMasterEksistingJalan(),
                getMasterJenisJalan(),
                getMasterKondisiJalan(),
            ]);
            setEksistingOptions(eks.data.eksisting);
            setJenisJalanOptions(jenis.data.eksisting);
            setKondisiOptions(kondisi.data.eksisting);

            const desaRes = await getDesaByKecamatanID("1");
            setDesaOptions(desaRes.data.desa);
        } catch (err) {
            console.error("Error fetching dropdown data:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editRuasJalanByID(id, formData);
            alert("Berhasil mengubah data!");
            onSuccess?.();
        } catch (error) {
            console.error(error);
            alert("Gagal mengubah data.");
            onError?.("Gagal mengupdate data ruas jalan.");
        }
    };

    // Ambil data dari store saat form pertama dibuka
    useEffect(() => {
        if (selectedRuas) {
            setFormData({
                paths: selectedRuas.paths || "",
                desa_id: selectedRuas.desa_id || "",
                kode_ruas: selectedRuas.kode_ruas || "",
                nama_ruas: selectedRuas.nama_ruas || "",
                panjang: selectedRuas.panjang || "",
                lebar: selectedRuas.lebar || "",
                eksisting_id: selectedRuas.eksisting_id || "",
                kondisi_id: selectedRuas.kondisi_id || "",
                jenisjalan_id: selectedRuas.jenisjalan_id || "",
                keterangan: selectedRuas.keterangan || "",
            });
        }
    }, [selectedRuas]);

    useEffect(() => {
        fetchDropdowns();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Edit Ruas Jalan</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                    <Label>Path</Label>
                    <Button type="button" variant="outline" onClick={() => setShowMap(true)}>
                        {formData.paths ? "Ubah Polyline" : "Tambah Polyline"}
                    </Button>
                </div>
                {showMap && (
                    <div className="h-[400px] mt-4">
                        <MapView onPathChange={handlePathChange} />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <Label>Kode Ruas</Label>
                    <Input
                        value={formData.kode_ruas}
                        onChange={(e) => handleChange("kode_ruas", e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Nama Ruas</Label>
                    <Input
                        value={formData.nama_ruas}
                        onChange={(e) => handleChange("nama_ruas", e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Panjang</Label>
                    <Input
                        value={formData.panjang}
                        onChange={(e) => handleChange("panjang", e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Lebar</Label>
                    <Input
                        value={formData.lebar}
                        onChange={(e) => handleChange("lebar", e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Keterangan</Label>
                    <Input
                        value={formData.keterangan}
                        onChange={(e) => handleChange("keterangan", e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Desa</Label>
                    <Select
                        value={formData.desa_id}
                        onValueChange={(val) => handleChange("desa_id", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Desa" />
                        </SelectTrigger>
                        <SelectContent>
                            {desaOptions.map((desa) => (
                                <SelectItem key={desa.id} value={desa.id.toString()}>
                                    {desa.value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Eksisting Jalan</Label>
                    <Select
                        value={formData.eksisting_id}
                        onValueChange={(val) => handleChange("eksisting_id", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Eksisting Jalan" />
                        </SelectTrigger>
                        <SelectContent>
                            {eksistingOptions.map((eks) => (
                                <SelectItem key={eks.id} value={eks.id.toString()}>
                                    {eks.eksisting}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Kondisi Jalan</Label>
                    <Select
                        value={formData.kondisi_id}
                        onValueChange={(val) => handleChange("kondisi_id", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Kondisi Jalan" />
                        </SelectTrigger>
                        <SelectContent>
                            {kondisiOptions.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>
                                    {k.kondisi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Jenis Jalan</Label>
                    <Select
                        value={formData.jenisjalan_id}
                        onValueChange={(val) => handleChange("jenisjalan_id", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Jalan" />
                        </SelectTrigger>
                        <SelectContent>
                            {jenisJalanOptions.map((jj) => (
                                <SelectItem key={jj.id} value={jj.id.toString()}>
                                    {jj.jenisjalan}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full">
                    Simpan Perubahan
                </Button>
            </form>
        </div>
    );
};

export default EditRuasJalanForm;
