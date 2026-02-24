import FeedbackForm from "@/components/formsubmit/form";
import Navbar from "@/components/formsubmit/navbar";
import { useFeedbackFormData } from "@/context/Form";
import { useEffect, useState } from "react";
import { databases } from "@/handlers/appwrite";
import { Query } from "appwrite";
import { useLocation } from "react-router";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const CACHE_PREFIX = "form_"; // keep consistent key prefix

const FormSubmit = () => {
  const { setFaculties, setName, setBranch, setType, setFormType, setId } =
    useFeedbackFormData();
  const { search } = useLocation();
  const [validFormId, setValidFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(search);
  const formId = queryParams.get("formId");

  if (!formId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 shadow-md rounded-2xl">
          <p className="text-red-500 text-lg">Form ID is missing in the URL.</p>
        </Card>
      </div>
    );
  }

  const fetchFaculty = async () => {
    try {
      const cacheKey = `${CACHE_PREFIX}${formId}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached === "Invalid") {
        setValidFormId(null);
        setLoading(false);
        return;
      }

      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();

        if (parsed.ts && now - parsed.ts < CACHE_TTL) {
          setFaculties(parsed.faculties || []);
          setValidFormId(formId);
          setLoading(false);

          setName(parsed.Name || "");
          setBranch(parsed.Branch || "");
          setType(parsed.Type || "");
          setFormType(parsed.Type || "");
          setId(formId || "");

          return;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }

      // Fetch from Appwrite
      const res = await databases.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: "forms",
        queries: [
          Query.equal("$id", formId),
          Query.limit(1),
          Query.select(["$id", "Faculties", "Type", "Name", "Branch"]),
        ],
      });

      if (res.total === 0) {
        localStorage.setItem(cacheKey, "Invalid");
        setValidFormId(null);
        setLoading(false);
        return;
      }

      const row = res.rows[0];
      const faculties = JSON.parse(row.Faculties || "[]");

      // Save to context + localStorage
      setFaculties(faculties);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          Name: row.Name,
          Branch: row.Branch,
          Type: row.Type,
          faculties,
          ts: Date.now(),
        }),
      );

      setName(row.Name || "");
      setBranch(row.Branch || "");
      setType(row.Type || "");
      setFormType(row.Type || "");
      setId(formId || "");

      setValidFormId(formId);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form:", error);
      setValidFormId(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [formId]);

  // Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  // Invalid formId
  if (validFormId === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 shadow-md rounded-2xl">
          <p className="text-red-500 text-lg">
            Invalid Form ID or form not found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <FeedbackForm />
    </div>
  );
};

export default FormSubmit;
