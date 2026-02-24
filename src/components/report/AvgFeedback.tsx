"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

type FacultyFeedback = {
  facultyName: string;
  subject: string;
  averageFeedback: number;
  className?: string;
  questionRatings?: number[];
};

type AvgFeedbackProps = {
  data: FacultyFeedback[];
};

const chartConfig = {
  averageFeedback: {
    label: "Average Feedback",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function AvgFeedback({ data }: AvgFeedbackProps) {
  if (!data || !data.length) return null;

  // ✅ Normalize numbers to 2 decimal places
  const normalizedData = data.map((row) => ({
    ...row,
    subject: row.subject.split("(")[0].trim(), // Extract subject name without code
    averageFeedback: Number(row.averageFeedback.toFixed(2)),
    questionRatings: row.questionRatings?.map((q) => Number(q.toFixed(2))),
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full mt-6">
      {/* Table Section */}
      <Card className="flex-1 border border-border bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">
            Faculty Feedback Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-muted">
                <tr>
                  <th className="border border-border px-3 py-2 text-left">
                    Faculty
                  </th>
                  <th className="border border-border px-3 py-2 text-left">
                    Subject
                  </th>
                  <th className="border border-border px-3 py-2 text-center">
                    Average Feedback
                  </th>
                </tr>
              </thead>
              <tbody>
                {normalizedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="border border-border px-3 py-2">
                      {row.facultyName}
                    </td>
                    <td className="border border-border px-3 py-2">
                      {row.subject}
                    </td>
                    <td className="border border-border px-3 py-2 text-center">
                      {row.averageFeedback.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="flex-1 border border-border bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">
            Faculty Feedback in Percentage
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={normalizedData}
              margin={{ top: 20, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} stroke="var(--muted)" />
              <XAxis
                dataKey="subject"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="averageFeedback"
                fill="var(--color-averageFeedback)"
                radius={[6, 6, 0, 0]}
                barSize={36}
              >
                <LabelList
                  dataKey="averageFeedback"
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => value.toFixed(2)} // ✅ labels also fixed
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
