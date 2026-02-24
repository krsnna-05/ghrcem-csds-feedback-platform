import Navbar from "@/components/dashboard/navbar";
import FormInfo from "@/components/report/FormInfo";
import FormSummary from "@/components/report/FormSummary";
import { databases } from "@/handlers/appwrite";

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

type formDataType = {
  Name: string;
  Type: string;
  Branch: string;
  Faculties: { facultyName: string; subject: string }[];
};

const ReportPage = () => {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId");
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<formDataType | null>(null);

  const getformData = useCallback(async () => {
    // setLoading(true);

    // if (!formId) {
    //   navigate("/faculty/dashboard");
    //   return;
    // }

    try {
      const res = await databases.getRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: "forms",
        rowId: formId || "",
      });

      // if (!formData) {
      //   navigate("/faculty/dashboard");
      //   return;
      // }

      setFormData({
        Name: res.Name,
        Type: res.Type,
        Branch: res.Branch,
        Faculties: JSON.parse(res.Faculties || "[]"),
      });
    } catch (error) {
      console.log(error);
    }
  }, [formId, navigate]);

  useEffect(() => {
    getformData();
  }, [getformData]);

  return (
    <div className="flex flex-col h-screen gap-2.5">
      <Navbar />
      <FormInfo
        Name={formData?.Name || ""}
        Type={formData?.Type || ""}
        Branch={formData?.Branch || ""}
      />
      <FormSummary id={formId || ""} type={formData?.Type || ""} />
    </div>
  );
};

export default ReportPage;
