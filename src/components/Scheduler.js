"use client"
import { useState, useEffect, useRef } from "react";
import { 
    fifoScheduling, 
    sjfScheduling, 
    roundRobinScheduling, 
    priorityScheduling, 
    mlfqScheduling, 
    generateProcesses 
} from "../lib/scheduler";
import { Chart } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "chart.js/auto";
import { motion } from "framer-motion";

export default function SchedulerPage() {
    const [processes, setProcesses] = useState([]);
    const [results, setResults] = useState([]);
    const [allResults, setAllResults] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
    const [timeQuantum, setTimeQuantum] = useState(2); 
    const [showAllResults, setShowAllResults] = useState(false);
    const chartRefs = useRef({});

    useEffect(() => {
        setProcesses(generateProcesses(5));
    }, []);

    const runScheduler = () => {
        let clonedProcesses = processes.map(p => ({ ...p }));
        let result = [];

        switch (selectedAlgorithm) {
            case "FIFO": 
                result = fifoScheduling(clonedProcesses); 
                break;
            case "SJF": 
                result = sjfScheduling(clonedProcesses); 
                break;
            case "Round Robin": 
                result = roundRobinScheduling(clonedProcesses, timeQuantum); 
                break;
            case "Priority": 
                result = priorityScheduling(clonedProcesses); 
                break;
            case "MLFQ": 
                result = mlfqScheduling(clonedProcesses, [2, 4, 8]); 
                break;
            default: 
                result = fifoScheduling(clonedProcesses);
        }

        setResults(result);
        setShowAllResults(false);
        setAllResults(null);
    };

    const runAllSchedulers = () => {
        const results = {
            "FIFO": fifoScheduling(processes.map(p => ({ ...p })) ),
            "SJF": sjfScheduling(processes.map(p => ({ ...p })) ),
            "Round Robin": roundRobinScheduling(processes.map(p => ({ ...p })), timeQuantum),
            "Priority": priorityScheduling(processes.map(p => ({ ...p })) ),
            "MLFQ": mlfqScheduling(processes.map(p => ({ ...p })), [2, 4, 8])
        };
        setAllResults(results);
        setShowAllResults(true);
        setResults([]);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        let yPos = 20;

        if (results.length > 0 && !showAllResults) {
            doc.text(`${selectedAlgorithm} Results`, 10, yPos);
            yPos += 10;
            const tableData = results.map(p => [
                `P${p.id}`, p.originalBurstTime, p.waitingTime, p.turnaroundTime, p.completionTime
            ]);
            doc.autoTable({
                head: [["Process", "Burst Time", "Waiting Time", "Turnaround Time", "Completion Time"]],
                body: tableData,
                startY: yPos
            });
        } else if (showAllResults && allResults) {
            Object.keys(allResults).forEach(algorithm => {
                doc.text(`${algorithm} Results`, 10, yPos);
                yPos += 10;
                const tableData = allResults[algorithm].map(p => [
                    `P${p.id}`, p.originalBurstTime, p.waitingTime, p.turnaroundTime, p.completionTime
                ]);
                doc.autoTable({
                    head: [["Process", "Burst Time", "Waiting Time", "Turnaround Time", "Completion Time"]],
                    body: tableData,
                    startY: yPos
                });
                yPos = doc.autoTable.previous.finalY + 10;
            });
        }
        doc.save("scheduler_results.pdf");
    };

    return (
        <div className="scheduler-container">
            <h1>CPU Scheduling Simulator</h1>
            
            <div className="controls">
                <label>Algorithm:</label>
                <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
                    <option>FIFO</option>
                    <option>SJF</option>
                    <option>Round Robin</option>
                    <option>Priority</option>
                    <option>MLFQ</option>
                </select>
                {selectedAlgorithm === "Round Robin" && (
                    <input 
                        type="number" 
                        value={timeQuantum} 
                        onChange={(e) => setTimeQuantum(Number(e.target.value))} 
                        min="1" 
                        placeholder="Time Quantum" 
                    />
                )}
                <button onClick={runScheduler}>Run</button>
                <button onClick={runAllSchedulers}>Run All</button>
                <button onClick={exportToPDF}>Export to PDF</button>
            </div>

            {results.length > 0 && !showAllResults && (
                <div>
                    <h2>{selectedAlgorithm} Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Process</th>
                                <th>Burst Time</th>
                                <th>Waiting Time</th>
                                <th>Turnaround Time</th>
                                <th>Completion Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(p => (
                                <tr key={p.id}>
                                    <td>P{p.id}</td>
                                    <td>{p.originalBurstTime}</td>
                                    <td>{p.waitingTime}</td>
                                    <td>{p.turnaroundTime}</td>
                                    <td>{p.completionTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Chart 
                        type="bar"
                        data={{
                            labels: results.map(p => `P${p.id}`),
                            datasets: [
                                {
                                    label: "Completion Time",
                                    data: results.map(p => p.completionTime),
                                    backgroundColor: "#ff6384"
                                },
                                {
                                    label: "Burst Time",
                                    data: results.map(p => p.originalBurstTime),
                                    backgroundColor: "#36a2eb"
                                }
                            ]
                        }}
                    />
                </div>
            )}

            {showAllResults && allResults && Object.keys(allResults).map((algorithm) => (
                <div key={algorithm}>
                    <h2>{algorithm} Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Process</th>
                                <th>Burst Time</th>
                                <th>Waiting Time</th>
                                <th>Turnaround Time</th>
                                <th>Completion Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allResults[algorithm].map(p => (
                                <tr key={p.id}>
                                    <td>P{p.id}</td>
                                    <td>{p.originalBurstTime}</td>
                                    <td>{p.waitingTime}</td>
                                    <td>{p.turnaroundTime}</td>
                                    <td>{p.completionTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Chart 
                        type="bar"
                        data={{
                            labels: allResults[algorithm].map(p => `P${p.id}`),
                            datasets: [
                                {
                                    label: "Completion Time",
                                    data: allResults[algorithm].map(p => p.completionTime),
                                    backgroundColor: "#ff6384"
                                },
                                {
                                    label: "Burst Time",
                                    data: allResults[algorithm].map(p => p.originalBurstTime),
                                    backgroundColor: "#36a2eb"
                                }
                            ]
                        }}
                    />
                </div>
            ))}
        </div>
    );
