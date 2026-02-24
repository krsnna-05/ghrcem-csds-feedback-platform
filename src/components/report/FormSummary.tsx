import { databases } from "@/handlers/appwrite";
import { useState, useEffect } from "react";
import TheoryQuestion from "@/components/formsubmit/questionTemplate/theory.json";
import PracticalQuestion from "@/components/formsubmit/questionTemplate/practical.json";
import AvgFeedback from "./AvgFeedback";
import { Query } from "appwrite";

// shadcn/ui table imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TeacherWiseReport from "./TeacherWiseReport";

type FacultyFeedback = {
  facultyName: string;
  subject: string;
  averageFeedback: number;
  className?: string;
  questionRatings: number[];
};

type FormSummaryProps = {
  id: string;
  type: string;
};

const FormSummary = ({ id, type }: FormSummaryProps) => {
  const [noEntry, setNoEntry] = useState(false);
  const [facultyFeedback, setFacultyFeedback] = useState<FacultyFeedback[]>([]);
  const questions =
    type === "Theory"
      ? Object.values(TheoryQuestion)
      : Object.values(PracticalQuestion);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportData = await databases.getRow({
          databaseId: import.meta.env.VITE_DATABASE_ID,
          tableId: "report",
          rowId: id,
          queries: [Query.select(["report", "TotalSubmissions"])],
        });

        console.log(JSON.parse(reportData.report), " From Forms Summary.tsx");

        if (reportData.TotalSubmissions === 0) {
          setNoEntry(true);
          return;
        }

        const existingReport = reportData;

        const parsedReport: Record<string, number[]> = JSON.parse(
          existingReport.report || "{}",
        );
        const totalSubmissions = existingReport.TotalSubmissions;

        const dynamicFacultyFeedback: FacultyFeedback[] = Object.keys(
          parsedReport,
        ).map((facultyKey) => {
          console.log("Processing facultyKey:", facultyKey);

          const ratings = parsedReport[facultyKey].map(
            (val) => val / totalSubmissions,
          );
          const sum = ratings.reduce((acc, val) => acc + val, 0);
          const avg = sum / ratings.length;
          const [facultyName, subject] = facultyKey.split(" - ");

          // Extract subject name without code

          return {
            facultyName,
            subject, // Extract subject name without code
            questionRatings: ratings,
            averageFeedback: avg * 20,
            className: "Your Class Here",
          };
        });

        setFacultyFeedback(dynamicFacultyFeedback);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [id, type]);

  if (noEntry) {
    return (
      <div className="text-center mt-6 font-medium text-red-500">
        No feedback submitted yet.
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            body {
              margin: 10mm;
              font-size: 9px;
              zoom: 0.85;
            }

            .print-container {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            table {
              border-collapse: collapse;
              width: 100%;
              table-layout: fixed;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 4px !important;
              text-align: center;
              font-size: 9px !important;
              word-break: break-word;
            }

            th {
              
            }

            tr {
              page-break-inside: avoid;
            }

            .rotate-header {
              writing-mode: vertical-rl;
              transform: rotate(180deg);
              white-space: nowrap;
              vertical-align: middle;
              font-size: 9px !important;
              width: 24px;
              height: auto;
            }

            .name-header {
              width: 112px;
            }

            .subject-header {
              width: 36px;
            }

            canvas {
              max-width: 100% !important;
              height: auto !important;
            }
          }
            .rotate-header {
              writing-mode: vertical-rl;
              transform: rotate(180deg);
              white-space: nowrap;
              vertical-align: middle;
              font-size: 9px !important;
              width: 18px;
              height: auto;
            }

            .name-header {
              width: 112px;
            }

            .subject-header {
              width: 72px;
            }
        `}
      </style>

      <div className="print-container mt-6">
        <h2
          className="text-2xl text-primary font-bold mb-4 text-center
        "
        >
          Summary
        </h2>
        <Table className="table-auto border-border rounded-md shadow-sm overflow-hidden w-3/4 my-4 mx-auto">
          <TableHeader>
            <TableRow className="">
              <TableHead className="name-header border border-gray-300 px-2 py-1 text-center font-semibold">
                Name of Faculty
              </TableHead>
              <TableHead className="subject-header border border-gray-300 px-2 py-1 text-center font-semibold">
                Subject
              </TableHead>
              {questions.map((q, idx) => (
                <TableHead
                  key={idx}
                  className="rotate-header border border-gray-300 px-2 py-1 text-center font-semibold text-xl"
                >
                  {q}
                </TableHead>
              ))}
              <TableHead className="rotate-header border border-gray-300 px-2 py-1 text-center font-semibold">
                Total Avg
              </TableHead>
              <TableHead className="rotate-header border border-gray-300 px-2 py-1 text-center font-semibold">
                Avg Feedback (%)
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {facultyFeedback.map((f, idx) => {
              const totalAvg =
                f.questionRatings.reduce((acc, val) => acc + val, 0) /
                f.questionRatings.length;
              return (
                <TableRow
                  key={idx}
                  className="border border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="border border-gray-300 px-2 py-1 text-center">
                    {f.facultyName}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-2 py-1 text-center">
                    {f.subject}
                  </TableCell>
                  {f.questionRatings.map((rating, qIdx) => (
                    <TableCell
                      key={qIdx}
                      className="border border-gray-300 px-2 py-1 text-center"
                    >
                      {rating.toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell className="border border-gray-300 px-2 py-1 text-center">
                    {totalAvg.toFixed(2)}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-2 py-1 text-center">
                    {((totalAvg / 5) * 100).toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {facultyFeedback.length > 0 && (
        <div className="print-container mt-6">
          <AvgFeedback data={facultyFeedback} />
          {facultyFeedback.length > 0 && (
            <div className="print-container">
              {facultyFeedback.map((f, idx) => (
                <TeacherWiseReport
                  key={idx}
                  teacherName={f.facultyName}
                  subject={f.subject}
                  questions={questions}
                  ratings={f.questionRatings}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FormSummary;
