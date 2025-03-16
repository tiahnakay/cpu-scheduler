export function fifoScheduling(processes) {
    // ... (your existing FCFS code)
}

export function sjfScheduling(processes) {
    // ... (your existing SJF code)
}

export function roundRobinScheduling(processes, timeQuantum) {
    let time = 0;
    let queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime); // Ensure sorted arrival
    let result = [];

    while (queue.length > 0) {
        let process = queue.shift();
        let executedTime = Math.min(timeQuantum, process.burstTime);
        process.burstTime -= executedTime;
        time += executedTime;

        if (process.burstTime > 0) {
            queue.push(process);
        } else {
            process.completionTime = time;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.originalBurstTime;
            result.push(process);
        }
    }
    return result;
}

export function priorityScheduling(processes) {
    let time = 0, result = [];
    let queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime); // Ensure correct arrival order

    while (queue.length > 0) {
        let availableProcesses = queue.filter(p => p.arrivalTime <= time);
        if (availableProcesses.length === 0) {
            time = queue[0].arrivalTime; // Skip to next available process
            continue;
        }
        availableProcesses.sort((a, b) => a.priority - b.priority); // Pick highest priority
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
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 3, originalBurstTime: 5 },
    { id: 2, arrivalTime: 2, burstTime: 3, priority: 1, originalBurstTime: 3 },
    { id: 3, arrivalTime: 4, burstTime: 1, priority: 2, originalBurstTime: 1 }
];
const timeQuantum = 2;

const fifoResult = fifoScheduling(processes);
console.log("FIFO Result:", fifoResult);

const sjfResult = sjfScheduling(processes);
console.log("SJF Result:", sjfResult);

const rrResult = roundRobinScheduling(processes, timeQuantum);
console.log("RR Result:", rrResult);

const priorityResult = priorityScheduling(processes);
console.log("Priority Result:", priorityResult);