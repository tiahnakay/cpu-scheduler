export function fifoScheduling(processes) {
    // ... (your existing FCFS code)
}

export function sjfScheduling(processes) {
    let time = 0, result = [];
    let queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime); // Sort by arrival first

    while (queue.length > 0) {
        let availableProcesses = queue.filter(p => p.arrivalTime <= time);
        if (availableProcesses.length === 0) {
            time = queue[0].arrivalTime; // Skip to next available process
            continue;
        }
        availableProcesses.sort((a, b) => a.burstTime - b.burstTime); // Pick shortest job
        let process = availableProcesses.shift();
        process.completionTime = time + process.burstTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        time = process.completionTime;
        result.push(process);
        queue = queue.filter(p => p !== process); // Remove from queue
    }
    return result;
}

// Example usage and test data
const processes = [
    { id: 1, arrivalTime: 0, burstTime: 5 },
    { id: 2, arrivalTime: 2, burstTime: 3 },
    { id: 3, arrivalTime: 4, burstTime: 1 }
];

const fifoResult = fifoScheduling(processes);
console.log("FIFO Result:", fifoResult);

const sjfResult = sjfScheduling(processes);
console.log("SJF Result:", sjfResult);