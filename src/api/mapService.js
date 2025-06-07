import axios from 'axios';

const API_BASE_URL = 'https://gisapis.manpits.xyz/api'; // Ganti dengan base URL API Anda

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem('token');

// Wilayah dan Region
export const getAllRegion = () => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/mregion`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getProvinsiByProvinsiID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/provinsi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getKabupatenByProvinsiID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/kabupaten/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getKecamatanByKabupatenID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/kecamatan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getDesaByKecamatanID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/desa/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getKabupatenByKecamatanID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/kabupatenbykecamatanid/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getProvinsiByKabupatenID = (id) => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/provinsibykabupatenid/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Master Data Jalan
export const getMasterEksistingJalan = () => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/meksisting`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getMasterJenisJalan = () => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/mjenisjalan`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getMasterKondisiJalan = () => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/mkondisi`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Ruas Jalan
export const getAllRuasJalan = () => {
    const token = getToken();
    return axios.get(`${API_BASE_URL}/ruasjalan`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// POST - Tambah Ruas Jalan Baru
export const addNewRuasJalan = (data) => {
    const token = getToken();
    const params = new URLSearchParams();
    params.append('paths', data.paths);
    params.append('desa_id', data.desa_id);
    params.append('kode_ruas', data.kode_ruas);
    params.append('nama_ruas', data.nama_ruas);
    params.append('panjang', data.panjang);
    params.append('lebar', data.lebar);
    params.append('eksisting_id', data.eksisting_id);
    params.append('kondisi_id', data.kondisi_id);
    params.append('jenisjalan_id', data.jenisjalan_id);
    params.append('keterangan', data.keterangan);

    return axios.post(`${API_BASE_URL}/ruasjalan`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
        },
    });
};

// PUT - Edit Ruas Jalan Berdasarkan ID
export const editRuasJalanByID = (id, data) => {
    const token = getToken();
    const params = new URLSearchParams();
    params.append('paths', data.paths);
    params.append('desa_id', data.desa_id);
    params.append('kode_ruas', data.kode_ruas);
    params.append('nama_ruas', data.nama_ruas);
    params.append('panjang', data.panjang);
    params.append('lebar', data.lebar);
    params.append('eksisting_id', data.eksisting_id);
    params.append('kondisi_id', data.kondisi_id);
    params.append('jenisjalan_id', data.jenisjalan_id);
    params.append('keterangan', data.keterangan);

    return axios.put(`${API_BASE_URL}/ruasjalan/${id}`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
        },
    });
};

// DELETE - Hapus Ruas Jalan Berdasarkan ID
export const deleteRuasJalanByID = (id, data) => {
    const token = getToken();
    const params = new URLSearchParams();
    params.append('paths', data.paths);
    params.append('desa_id', data.desa_id);
    params.append('kode_ruas', data.kode_ruas);
    params.append('nama_ruas', data.nama_ruas);
    params.append('panjang', data.panjang);
    params.append('lebar', data.lebar);
    params.append('eksisting_id', data.eksisting_id);
    params.append('kondisi_id', data.kondisi_id);
    params.append('jenisjalan_id', data.jenisjalan_id);
    params.append('keterangan', data.keterangan);

    return axios.delete(`${API_BASE_URL}/ruasjalan/${id}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
        },
        data: params,
    });
};
