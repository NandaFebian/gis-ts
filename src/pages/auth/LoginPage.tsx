import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { loginUser } from "@/api/apiService"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser({ email, password });
            // Ambil token dari data.meta.token sesuai struktur response API
            localStorage.setItem("token", data.meta.token);
            // Jika ada data user, sesuaikan penempatan data user juga
            // localStorage.setItem("user", JSON.stringify(data.user)); // jika ada user di response

            navigate("/home"); // arahkan ke halaman dashboard
        } catch (err: any) {
            setError(err.message || "Gagal login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Masuk ke Akun Anda</CardTitle>
                    <CardDescription>Silakan masukkan email dan kata sandi Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                        {loading ? "Memproses..." : "Masuk"}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/register")} className="w-full">Belum punya akun? Daftar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
