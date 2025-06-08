import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function AlertSuccess({ message }: { message: string }) {
    return (
        <Alert variant="default" className="bg-green-50 border-green-500 text-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle>Berhasil</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
