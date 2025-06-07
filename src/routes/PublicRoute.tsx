// src/routes/PublicRoute.tsx
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

type PublicRouteProps = {
    children: JSX.Element
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const token = localStorage.getItem("token")

    // Jika user sudah login, redirect ke /home
    if (token) {
        return <Navigate to="/home" replace />
    }

    // Jika belum login, tampilkan komponen public (Login/Register)
    return children
}

export default PublicRoute
