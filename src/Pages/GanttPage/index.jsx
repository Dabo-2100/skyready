import { useState } from 'react'
import "gantt-task-react/dist/index.css";
import { Gantt } from 'gantt-task-react';

export default function GanttPage() {
    const [view, setView] = useState("Month");
    const [columnWidth, setColumnWidth] = useState(150);
    let tasks = [
        {
            id: 'task1',
            type: 'task',
            name: 'Retrofit 49064',
            start: new Date("2024-04-01"),
            end: new Date("2024-11-05"),
            progress: 0,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
        {
            id: 'task2',
            type: 'task',
            name: 'Retrofit 49079',
            start: new Date("2024-04-01"),
            end: new Date("2024-11-05"),
            progress: 0,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
    ];
    return (
        <div className='col-12 d-flex flex-wrap' style={{ height: "calc(100vh - 54px)", overflow: "auto" }}>
            <div className='col-12 d-flex justify-content-between'>
                <button className='btn btn-primary' onClick={() => setView("Week")}>Week</button>
                <button className='btn btn-primary' onClick={() => setView("Month")}>Month</button>
                <button className='btn btn-primary' onClick={() => setView("Year")}>Year</button>
                <div>
                    <button className='btn btn-info' onClick={() => setColumnWidth(columnWidth - 25)}>-</button>
                    <button className='btn btn-danger' onClick={() => setColumnWidth(columnWidth + 25)}>+</button>
                </div>
            </div>
            <div>
                <Gantt
                    tasks={tasks}
                    viewDate="2024-10-13"
                    // locale={"Java"}
                    headerHeight="50"
                    columnWidth={columnWidth}
                    viewMode={view} />

            </div>

        </div>
    )
}
