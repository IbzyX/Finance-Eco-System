import { Chart } from "react-chartjs-2";

export default function FinancialChart({ data, options }) {
  return (
    <Chart
      type="candlestick"
      data={data}
      options={options}
    />
  );
}