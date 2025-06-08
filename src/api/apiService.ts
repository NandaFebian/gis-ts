// src/apiService.ts
import axios from "axios";
import type { AxiosResponse } from "axios";

const API_BASE_URL = 'https://gisapis.manpits.xyz/api';

const getToken = (): string | null => localStorage.getItem("token");

// Tipe Data
interface UserData {
  email?: string;
  password?: string;
}

interface LoginResponse {
  meta: {
    code: number;
    message: string;
    token: string;
    "token-expired": number;
  };
}

interface Region {
  id: number;
  name: string;
}

interface RuasJalanData {
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

// Auth API
export const registerUser = async (userData: { name: string; email: string; password: string }): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (credentials: UserData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(credentials as Record<string, string>).toString(),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.meta.message || `HTTP error! status: ${response.status}`);
    }

    // Simpan token ke localStorage sesuai lokasi token yang sebenarnya di response
    localStorage.setItem("token", data.meta.token);

    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Master Data API
export const getAllRegion = (): Promise<AxiosResponse<Region[]>> => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get<Region[]>(`${API_BASE_URL}/mregion`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllRuasJalan = async (): Promise<AxiosResponse<any>> => {
  const token = getToken();

  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }

  return await axios.get(`${API_BASE_URL}/ruasjalan`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRuasJalanByID = async (id: string): Promise<AxiosResponse<RuasJalanData>> => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return await axios.get<RuasJalanData>(`${API_BASE_URL}/ruasjalan/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Ruas Jalan API
export const addNewRuasJalan = (data: RuasJalanData) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value);
  });

  return axios.post(`${API_BASE_URL}/ruasjalan`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editRuasJalanByID = (id: string, data: RuasJalanData) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value);
  });

  return axios.put(`${API_BASE_URL}/ruasjalan/${id}`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteRuasJalanByID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.delete(`${API_BASE_URL}/ruasjalan/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Tambahan Endpoint Sesuai Permintaan Anda
export const getProvinsiByProvinsiID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/provinsi/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getKabupatenByProvinsiID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/kabupaten/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getKecamatanByKabupatenID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/kecamatan/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getDesaByKecamatanID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/desa/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getKabupatenByKecamatanID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/kabupatenbykecamatanid/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getProvinsiByKabupatenID = (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/provinsibykabupatenid/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Master Data Jalan
export const getMasterEksistingJalan = () => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/meksisting`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMasterJenisJalan = () => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/mjenisjalan`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMasterKondisiJalan = () => {
  const token = getToken();
  if (!token) {
    throw new Error("Token tidak tersedia. User belum login?");
  }
  return axios.get(`${API_BASE_URL}/mkondisi`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
