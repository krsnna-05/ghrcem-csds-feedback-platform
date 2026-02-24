"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { databases } from "@/handlers/appwrite";
import { Query } from "appwrite";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SubmissionsHeader from "@/components/submissions/SubmissionsHeader";
import SubmissionTable from "@/components/submissions/SubmissionTable";
import FacultySection from "@/components/submissions/FacultySection";

type formDataType = {
  Name: string;
  Type: string;
  Branch: string;
  Faculties: { facultyName: string; subject: string }[];
};

// ----------------------------
// Skeleton Components
// ----------------------------
function HeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/6" />
    </div>
  );
}

function FacultySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------
// Main Page
// ----------------------------
export default function SubmissionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<formDataType | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (!formId) {
      const timer = setTimeout(() => {
        navigate("/faculty/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formId, navigate]);

  if (!formId) {
    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <p className="text-red-500 font-bold">Form ID is required!</p>
          <p>Redirecting to the dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  const fetchForm = async () => {
    setLoading(true);
    try {
      const res = await databases.getRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: "forms",
        rowId: formId!,
        queries: [Query.select(["Faculties", "Type", "Name", "Branch"])],
      });

      const formData = res;

      if (!formData) {
        navigate("/faculty/dashboard");
        return;
      }

      setFormData({
        Name: formData.Name,
        Type: formData.Type,
        Branch: formData.Branch,
        Faculties: JSON.parse(formData.Faculties || "[]"),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await databases.getRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: "submissions",
        rowId: formId!,
        queries: [Query.select(["Submissions"])],
      });

      setSubmissions(JSON.parse(res.Submissions || "[]") || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchForm();
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <HeaderSkeleton />
          ) : (
            <SubmissionsHeader
              id={formId}
              Name={formData?.Name || ""}
              Branch={formData?.Branch || ""}
              Type={formData?.Type || ""}
              submissions={submissions.length}
            />
          )}
        </CardContent>
      </Card>

      {/* Faculty Info */}
      <Card>
        <CardTitle className="p-4 text-lg font-bold">
          Faculty Information
        </CardTitle>
        <CardContent className="p-4">
          {loading ? (
            <FacultySkeleton />
          ) : (
            <FacultySection facultyData={formData?.Faculties || []} />
          )}
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <TableSkeleton />
          ) : (
            <SubmissionTable
              submissions={submissions}
              Branch={formData?.Branch || ""}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
