import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
export default function BarChart({ labels, datasets }) {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const data = { labels, datasets };
    const options = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
            y: {
                min: 0, max: 100,
                ticks: {
                    stepSize: 10,
                    callback: (value) => value + '%',
                }
            }
        }
    };
    return (
        <div className="col-12">
            <Bar data={data} options={options} />
        </div>
    )
}