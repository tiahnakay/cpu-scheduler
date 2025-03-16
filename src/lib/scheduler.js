export function fifoScheduling(processes) {
    // ... (your existing FCFS code)
}

export function sjfScheduling(processes) {
    // ... (your existing SJF code)
}

export function roundRobinScheduling(processes, timeQuantum) {
    // ... (your existing RR code)
}

export function priorityScheduling(processes) {
    // ... (your existing Priority code)
}

export function mlfqScheduling(processes, timeQuantums) {
    let queues = Array.from({ length: timeQuantums.length }, () => []);
    processes.forEach(p => queues[0].push({ ...p, remainingTime: p.burstTime }));
    let time = 0, result = [];

    while (queues.some(q => q.length > 0)) {
        for (let i = 0; i < queues.length; i++) {
            let timeQuantum = timeQuantums[i];

            while (queues[i].length > 0) {
                let process = queues[i].shift();
                let executedTime = Math.min(timeQuantum, process.remainingTime);
                process.remainingTime -= executedTime;
                time += executedTime;

                if (process.remainingTime > 0) {
                    if (i < queues.length - 1) {
                        queues[i + 1].push(process);
                    } else {
                        queues[i].push(process);
                    }
                } else {
                    process.completionTime = time;
                    process.turnaroundTime = process.completionTime - process.arrivalTime;
                    process.waitingTime = process.turnaroundTime - process.burstTime;
                    result.push(process);
                }
            }
        }
    }
    return result;
}

// Example usage and test data
const processes = [
    { id: 1, arrivalTime: 0, burstTime: 10, priority: 3, originalBurstTime: 10 },
    { id: 2, arrivalTime: 2, burstTime: 6, priority: 1, originalBurstTime: 6 },
    { id: 3, arrivalTime: 4, burstTime: 4, priority: 2, originalBurstTime: 4 }
];
const timeQuantums = [4, 8];

const fifoResult = fifoScheduling(processes);
console.log("FIFO Result:", fifoResult);

const sjfResult = sjfScheduling(processes);
console.log("SJF Result:", sjfResult);

const rrResult = roundRobinScheduling(processes, 2);
console.log("RR Result:", rrResult);

const priorityResult = priorityScheduling(processes);
console.log("Priority Result:", priorityResult);

const mlfqResult = mlfqScheduling(processes, timeQuantums);
console.log("MLFQ Result:", mlfqResult);