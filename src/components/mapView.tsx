import React, { useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    useMap,
    Polyline,
    Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { getAllRuasJalan } from "@/api/apiService";

interface MapViewProps {
    onPathChange?: (path: string) => void;
}

const centerBali: [number, number] = [-8.409518, 115.188919];

const ForceMapResize = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);
    return null;
};

const ShowAllPolylines = () => {
    const [ruasJalanList, setRuasJalanList] = useState<any[]>([]);
    const map = useMap();

    const colors = [
        "red", "blue", "green", "orange", "purple", "brown", "black", "teal", "maroon", "cyan"
    ];

    const getLineStyleByJenisJalan = (jenisId: number) => {
        switch (jenisId) {
            case 1: return { dashArray: "5, 10" };        // Jalan Desa
            case 2: return { dashArray: "5, 5, 10" };     // Jalan Kabupaten
            case 3: return {};                            // Jalan Provinsi (solid)
            default: return { dashArray: "1, 5" };        // Unknown type
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllRuasJalan();
                const ruas = response?.data?.ruasjalan ?? [];
                setRuasJalanList(ruas);

                const allCoords: [number, number][] = ruas
                    .flatMap((ruas: any) => polyline.decode(ruas.paths));
                if (allCoords.length > 0) {
                    const bounds = L.latLngBounds(allCoords);
                    map.fitBounds(bounds);
                }
            } catch (err) {
                console.error("Gagal memuat data ruas jalan:", err);
            }
        };
        fetchData();
    }, [map]);

    return (
        <>
            {ruasJalanList.map((ruas, index) => {
                const decoded = polyline.decode(ruas.paths);
                const color = colors[index % colors.length];
                const lineStyle = getLineStyleByJenisJalan(ruas.jenisjalan_id);

                return (
                    <Polyline
                        key={ruas.id}
                        positions={decoded}
                        pathOptions={{
                            color,
                            ...lineStyle,
                        }}
                    >
                        <Tooltip direction="top" sticky>
                            <div>
                                <strong>{ruas.nama_ruas}</strong>
                                <br />
                                Kode: {ruas.kode_ruas}
                                <br />
                                Jenis: {ruas.jenisjalan_id === 1 ? "Desa" :
                                    ruas.jenisjalan_id === 2 ? "Kabupaten" :
                                        ruas.jenisjalan_id === 3 ? "Provinsi" : "Lainnya"}
                                <br />
                                Panjang: {ruas.panjang} m
                                <br />
                                Lebar: {ruas.lebar} m
                                <br />
                                Ket: {ruas.keterangan}
                            </div>
                        </Tooltip>
                    </Polyline>
                );
            })}
        </>
    );
};

const MapView: React.FC<MapViewProps> = ({ onPathChange }) => {
    const mapRef = useRef<L.Map | null>(null);
    const drawnLayerRef = useRef<L.Layer | null>(null);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

    useEffect(() => {
        if (!mapInstance) return;

        if (!(mapInstance as any).pm) {
            console.error("[Leaflet-Geoman] Plugin pm tidak tersedia");
            return;
        }

        const map = mapInstance;

        map.pm.addControls({
            position: "topright",
            drawMarker: false,
            drawPolygon: false,
            drawRectangle: false,
            drawCircle: false,
            drawCircleMarker: false,
            drawText: false,
            drawPolyline: true,
        });

        const onCreate = (e: any) => {
            if (drawnLayerRef.current) {
                map.removeLayer(drawnLayerRef.current);
            }
            drawnLayerRef.current = e.layer;

            try {
                const geojson = e.layer.toGeoJSON();
                const coords = geojson.geometry.coordinates.map(
                    (c: number[]) => [c[1], c[0]]
                );
                const encodedPath = polyline.encode(coords);
                if (onPathChange) {
                    onPathChange(encodedPath);
                }
            } catch (error) {
                console.error("Error mengkonversi layer ke polyline:", error);
            }
        };

        const onRemove = () => {
            drawnLayerRef.current = null;
            if (onPathChange) {
                onPathChange("");
            }
        };

        map.on("pm:create", onCreate);
        map.on("pm:remove", onRemove);

        return () => {
            if ((map as any).pm) {
                map.pm.removeControls();
                map.off("pm:create", onCreate);
                map.off("pm:remove", onRemove);
            }
        };
    }, [mapInstance, onPathChange]);

    useEffect(() => {
        if (mapRef.current && !mapInstance) {
            setMapInstance(mapRef.current);
        }
    }, [mapRef.current]);

    return (
        <div className="h-full w-full">
            <MapContainer
                center={centerBali}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg z-0"
                ref={(ref) => {
                    if (ref && !mapRef.current) {
                        mapRef.current = ref;
                        setMapInstance(ref);
                    }
                }}
            >
                <ForceMapResize />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ShowAllPolylines />
            </MapContainer>
        </div>
    );
};

export default MapView;
