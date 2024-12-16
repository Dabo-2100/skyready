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
        labels: ['Airframe', 'Avionics', 'Structure'],
        datasets: [
            {
                label: 'Progress',
                data: [65, 59, 80],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
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
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 10, // Optional: Customize the step size of the ticks
                    callback: function (value) {
                        return value + '%'; // Display the value with a percentage symbol
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
