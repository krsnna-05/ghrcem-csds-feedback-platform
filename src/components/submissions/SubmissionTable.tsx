"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubmissionRow from "./SubmissionRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Submission = {
  id: number;
  Name: string;
  Roll: number;
};

type SubmissionTableProps = {
  submissions: Submission[];
  Branch: string;
};

export default function SubmissionTable({
  submissions,
  Branch,
}: SubmissionTableProps) {
  const dataToShow = submissions;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Student Submissions</h2>
        <Button className="bg-foreground text-background hover:opacity-90">
          Refresh
        </Button>
      </div>

      {/* Table */}
      {dataToShow.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Roll No</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataToShow.map((student) => (
              <SubmissionRow
                id={student.id}
                key={student.id}
                name={student.Name}
                rollNo={student.Roll}
                branch={Branch}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <Card className="flex items-center justify-center p-10 text-muted-foreground text-sm rounded-2xl shadow-sm border-dashed">
          No submissions yet
        </Card>
      )}
    </div>
  );
}
