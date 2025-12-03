import { Chart as ChartJS } from "chart.js";
import { Chart } from "react-chartjs-2";
import {
    CandlestickController,
    CandlestickElement,
} from "chartjs-chart-financial";

ChartJS.register(
    CandlestickController,
    CandlestickElement
);

export default function FinancialChart(props) {
    return <Chart {...props} type={CandlestickController.id} />;
}
