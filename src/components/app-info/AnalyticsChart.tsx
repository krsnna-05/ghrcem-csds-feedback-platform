import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type chatDataType = {
  Month: string; // coming from backend ("9", "10", etc.)
  FormsCreated: number;
  FeedbackTaken: number;
};

interface chartDatatype {
  ChartData: chatDataType[];
}

const monthMap: Record<string, string> = {
  "1": "January",
  "2": "February",
  "3": "March",
  "4": "April",
  "5": "May",
  "6": "June",
  "7": "July",
  "8": "August",
  "9": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const AnalyticsChart = ({ ChartData }: chartDatatype) => {
  // Transform backend data into recharts format
  const chartData = ChartData.map((item) => ({
    month: monthMap[item.Month] ?? item.Month,
    forms: item.FormsCreated,
    submissions: item.FeedbackTaken,
  }));

  // Dynamic width calculation
  const minWidth = Math.max(200, chartData.length * 120);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: `${minWidth}px` }}>
        <ChartContainer
          config={{
            forms: { label: "Forms Created", color: "var(--chart-1)" },
            submissions: { label: "Feedback Taken", color: "var(--chart-2)" },
          }}
          className="min-h-[256px] w-full"
        >
          <BarChart accessibilityLayer data={chartData} margin={{ top: 30 }}>
            <Legend verticalAlign="bottom" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="forms" fill="var(--chart-1)" barSize={20} radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="submissions"
              fill="var(--chart-2)"
              barSize={20}
              radius={4}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
