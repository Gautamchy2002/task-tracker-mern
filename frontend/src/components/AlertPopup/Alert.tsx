import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AlertPopupProps {
  message: string;
  alertPopupopen: boolean;
  setAlertPopupopen: (open: boolean) => void;
  type: "success" | "error";
}

const AlertPopup = ({
  message,
  alertPopupopen,
  setAlertPopupopen,
  type,
}: AlertPopupProps) => {
  useEffect(() => {
    if (!alertPopupopen || type !== "success") return;

    const timer = window.setTimeout(() => setAlertPopupopen(false), 2500);
    return () => window.clearTimeout(timer);
  }, [alertPopupopen, setAlertPopupopen, type]);

  if (!alertPopupopen) return null;

  return (
    <div className="fixed right-4 top-4 z-[200] w-[calc(100%-2rem)] max-w-sm">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl",
          type === "success" ? "border-emerald-200" : "border-red-200",
        )}
      >
        {type === "success" ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        <button
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          onClick={() => setAlertPopupopen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertPopup;
