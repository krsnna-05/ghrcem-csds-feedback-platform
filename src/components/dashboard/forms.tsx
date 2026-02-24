import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import FormCard from "./formcard";
import { databases, account } from "@/handlers/appwrite";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/context/Auth";
import { toast } from "sonner"; // ✅ lightweight notifications

type Faculty = {
  facultyName: string;
  subject: string;
};

type DefaultRow = {
  Name: string;
  Type: string;
  Branch: string;
  Faculties: Faculty[];
  $id: string;
  createdAt: string;
};

const FormsList = () => {
  const [forms, setForms] = useState<DefaultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuth, setAuth } = useAuth();
  const navigate = useNavigate();

  /** 🔒 Verify user session */
  const verifyAuth = useCallback(async () => {
    try {
      const session = await account.get();
      if (!session?.$id) {
        setAuth("", "", "", false);
        navigate("/auth");
        toast.error("Session expired. Please log in again.");
        return false;
      }
      setAuth(session.$id, session.email, session.name, true);
      return true;
    } catch {
      setAuth("", "", "", false);
      navigate("/auth");
      toast.error("Authentication failed. Please log in.");
      return false;
    }
  }, [navigate, setAuth]);

  /** 📄 Fetch forms from DB */
  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Using Database ID:", import.meta.env.VITE_DATABASE_ID);

      const res = await databases.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: "forms",
      });

      const sanitized = res.rows.map((row: any) => ({
        $id: row.$id,
        Name: row.Name || "Untitled",
        Type: row.Type || "N/A",
        Branch: row.Branch || "N/A",
        Faculties: safeParseJSON(row.Faculties, []),
        createdAt: row.$createdAt || "",
      }));

      sanitized.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setForms(sanitized);
    } catch (err) {
      console.error("❌ Error fetching forms:", err);
      toast.error("Failed to load forms. Please try again.");
      setForms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🛡 Safe JSON parse helper */
  const safeParseJSON = (str: string | null, fallback: any) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch {
      return fallback;
    }
  };

  /** ⏳ Initial load + auth check */
  useEffect(() => {
    (async () => {
      const ok = await verifyAuth();
      if (ok) fetchForms();
    })();
  }, []);

  return (
    <div className="mt-4 w-full">
      {isAuth == false ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-600 text-lg font-medium">
            Invalid access. Redirecting...
          </p>
        </div>
      ) : isAuth == null ? (
        <div className="flex justify-center items-center h-32">
          <p className="text- text-lg font-medium">
            Verifying session.., Please wait...
          </p>
        </div>
      ) : (
        <>
          {/* Header with Refresh Button */}
          <div className="flex justify-end items-center mb-4">
            <Button
              onClick={fetchForms}
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="flex flex-wrap gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full sm:w-72 bg-card border border-border rounded-xl shadow-md animate-pulse"
                >
                  <div className="p-6 flex flex-col gap-4">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-5 w-full rounded-md" />
                    <div className="border-t border-border my-2"></div>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <div className="flex justify-center mt-8">
              <p className="text-muted-foreground text-lg font-medium">
                No forms available.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {forms.map((form) => (
                <FormCard
                  key={form.$id}
                  id={form.$id}
                  name={form.Name}
                  branch={form.Branch}
                  type={form.Type}
                  createdAt={form.createdAt}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormsList;
