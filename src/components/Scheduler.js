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

export default function SchedulerPage({ darkMode }) {
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
            "FIFO": fifoScheduling(processes.map(p => ({ ...p }))),
            "SJF": sjfScheduling(processes.map(p => ({ ...p }))),
            "Round Robin": roundRobinScheduling(processes.map(p => ({ ...p })), timeQuantum),
            "Priority": priorityScheduling(processes.map(p => ({ ...p }))),
            "MLFQ": mlfqScheduling(processes.map(p => ({ ...p })), [2, 4, 8])
        };
        setAllResults(results);
        setShowAllResults(true);
        setResults([]);
    };

    return (
        <div className="scheduler-container" style={{ backgroundColor: darkMode ? '#121212' : '#ffffff', color: darkMode ? '#ffffff' : '#000000', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ color: darkMode ? '#bb86fc' : '#000000' }}>CPU Scheduling Simulator</h1>
        </div>
    );
}
