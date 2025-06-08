import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function AlertError({ message }: { message: string }) {
    return (
        <Alert variant="destructive" className="bg-red-50 border-red-500 text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
