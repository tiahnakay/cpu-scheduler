export function fifoScheduling(processes) {
    let time = 0;
    return processes.map(p => {
        let startTime = Math.max(time, p.arrivalTime); // Ensure CPU waits if needed
        p.completionTime = startTime + p.burstTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime; // FIXED: Using burstTime
        time = p.completionTime;
        return p;
    });
}

// Example usage and test data
const processes = [
    { id: 1, arrivalTime: 0, burstTime: 5 },
    { id: 2, arrivalTime: 2, burstTime: 3 },
    { id: 3, arrivalTime: 4, burstTime: 1 }
];

const result = fifoScheduling(processes);
console.log(result);