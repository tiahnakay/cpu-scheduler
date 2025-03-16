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
  
  export function generateProcesses(num) {
    return Array.from({ length: num }, (_, i) => {
        const burstTime = Math.floor(Math.random() * 10) + 1;
        return {
            id: i + 1,
            arrivalTime: Math.floor(Math.random() * 10),
            burstTime,
            originalBurstTime: burstTime, // ✅ Store original burst time
            priority: Math.floor(Math.random() * 5) + 1
        };
    }).sort((a, b) => a.arrivalTime - b.arrivalTime);
  }
  