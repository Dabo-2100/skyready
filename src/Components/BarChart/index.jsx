import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    scales,
} from 'chart.js';


export default function BarChart(props) {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const data = {
        labels: props.labels,
        datasets: props.datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Departement Progress',
            },
        },
        scales: {
            x: {
                grid: {
                    color: "#ffffff1c"
                },
                ticks: {
                    color: "white"
                }
            },
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: "#ffffff1c"
                },
                ticks: {
                    color: "white",
                    stepSize: 5, // Optional: Customize the step size of the ticks
                    callback: function (value) {
                        return value + ' %'; // Display the value with a percentage symbol
                    },
                }
            }
        }
    };

    return (
        <div className="col-12 d-flex container">
            <Bar data={data} options={options} />
        </div>
    )
}