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

type QuestionFeedback = {
  question: string;
  rating: number;
};

const chartConfig = {
  rating: {
    label: "Rating",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TeacherWiseReportProps = {
  teacherName: string;
  subject: string;
  questions: string[];
  ratings: number[]; // one-to-one with questions
};

const TeacherWiseReport = ({
  teacherName,
  subject,
  questions,
  ratings,
}: TeacherWiseReportProps) => {
  // Combine questions + ratings
  const feedbackData: QuestionFeedback[] = questions.map((_, idx) => ({
    question: `Q${idx + 1}`,
    rating: parseFloat(ratings[idx].toFixed(2)) ?? 0,
  }));

  console.log("Rendering TeacherWiseReport for", teacherName, subject, {
    questions,
  });

  // this is change

  return (
    <div className="teacher-report mt-10">
      {/* Teacher Info */}
      <h2 className="text-xl font-bold text-center my-10">
        {teacherName} – {subject}
      </h2>

      {/* Responsive Layout */}
      <div className="report-grid grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Table */}
        <Card className="border border-border bg-background shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">
              Teacher Feedback Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead className="bg-muted">
                  <tr>
                    <th className="border border-border px-3 py-2 text-left">
                      Question
                    </th>
                    <th className="border border-border px-3 py-2 text-center">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="border border-border px-3 py-2">
                        {questions[idx]}
                      </td>
                      <td className="border border-border px-3 py-2 text-center">
                        {row.rating.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="hover:bg-muted/40 transition-colors">
                    <td className="border border-border px-3 py-2 font-bold">
                      Average Rating
                    </td>
                    <td className="border border-border px-3 py-2 text-center font-bold">
                      {(
                        ratings.reduce((acc, val) => acc + val, 0) /
                        ratings.length
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/40 transition-colors">
                    <td className="border border-border px-3 py-2 font-bold">
                      AVG FEEDBACK (%)
                    </td>
                    <td className="border border-border px-3 py-2 text-center font-bold">
                      {(
                        (ratings.reduce((acc, val) => acc + val, 0) /
                          ratings.length) *
                        20
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border border-border bg-background shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground text-center">
              Question-wise Rating Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full w-full px-0">
            <ChartContainer config={chartConfig} className="">
              <BarChart
                data={feedbackData}
                margin={{ top: 20, left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} stroke="var(--muted)" />
                <XAxis
                  dataKey="question"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--foreground)", fontSize: 10 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="rating"
                  fill="var(--color-rating)"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                >
                  <LabelList
                    dataKey="rating"
                    position="top"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <style>{`
    @media print {
      .report-grid {
        grid-template-columns: 1fr !important; /* force column layout */
      }
      .teacher-report {
        page-break-inside: avoid; /* keep table + chart together */
        break-inside: avoid;
      }
    }
  `}</style>
    </div>
  );
};

export default TeacherWiseReport;
