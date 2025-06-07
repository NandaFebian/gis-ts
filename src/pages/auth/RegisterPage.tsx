import { useState } from "react"
import { useNavigate } from "react-router-dom"  // ganti useRouter dengan useNavigate
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/api/apiService" // sesuaikan path jika perlu

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()  // gunakan useNavigate

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Pastikan variabel name juga tersedia dari form input Anda
            await registerUser({ name, email, password });

            console.log("Pendaftaran berhasil");
            navigate("/login"); // redirect ke halaman login
        } catch (err: any) {
            setError(err.message || "Gagal mendaftar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Buat Akun Baru</CardTitle>
                    <CardDescription>Silakan masukkan email, nama, dan kata sandi Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nama Anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" onClick={handleSubmit} className="w-full" disabled={loading}>
                        {loading ? "Memproses..." : "Daftar"}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                        Sudah punya akun? Masuk
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
