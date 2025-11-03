"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type DataPoint = { year: string | number; rainfall: number; scarcity: number };

type WaterChartProps = { data: DataPoint[] };

export default function WaterChart({ data }: WaterChartProps) {
  return (
    <div className="w-full h-full text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="left"
            label={{
              value: "Rainfall (mm)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Scarcity Index",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="rainfall"
            name="Rainfall (mm)"
            fill="#80bfff"
            barSize={20}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="scarcity"
            name="Scarcity Index"
            stroke="#ff4d4f"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
