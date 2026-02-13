const { Question } = require("./Question.js");

class RoundRobinQuestion extends Question {
  generate() {
    // Generate a Round Robin scheduling problem instance
    const numProcesses = Math.floor(Math.random() * 3) + 3;
    const processes = [];
    const arr = [];
    const processArrivalTimes = [];
    
    for (let i = 0; i <= 6; i++) {
      arr.push(i);
    }
    
    const arrivalTimesSet = new Set(arr);
    for (let i = 0; i < numProcesses; i++) {
      const randomIndex = Math.floor(Math.random() * arrivalTimesSet.size);
      const arrivalTime = Array.from(arrivalTimesSet)[randomIndex];
      processArrivalTimes.push(arrivalTime);
      arrivalTimesSet.delete(arrivalTime);
    }
    
    processArrivalTimes.sort((a, b) => a - b);
    for (let i = 0; i < numProcesses; i++) {
      const arrivalTime = processArrivalTimes[i];
      const burstTime = Math.floor(Math.random() * 10) + 2;
      processes.push({ id: i + 1, arrivalTime: arrivalTime, burstTime: burstTime });
    }
    
    const timeQuantum = Math.floor(Math.random() * 4) + 2; // Time quantum between 2 and 5
    this.problemInstance = { processes, timeQuantum };
    return this.problemInstance;
  }

  solve() {
    // Solve the Round Robin scheduling problem instance
    const numProcesses = this.problemInstance.processes.length;
    const timeQuantum = this.problemInstance.timeQuantum;
    let totalWaitingTime = 0;
    
    // Sort processes by arrival time
    const processes = [...this.problemInstance.processes].sort((a, b) => {
      if (a.arrivalTime === b.arrivalTime) {
        return a.id - b.id;
      }
      return a.arrivalTime - b.arrivalTime;
    }).map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: null,
      lastExecutionEndTime: null
    }));
    
    let currentTime = 0;
    let processIndex = 0;
    const schedule = [];
    const waitingTimes = new Map();
    const operations = new Map();
    const completed = new Set();
    const queue = [];
    
    // Initialize operations map
    processes.forEach(p => {
      operations.set(p.id, '');
    });
    
    while (completed.size < numProcesses) {
      // Add all processes that have arrived to the queue
      while (processIndex < processes.length && processes[processIndex].arrivalTime <= currentTime) {
        queue.push(processes[processIndex]);
        processIndex++;
      }
      
      if (queue.length === 0) {
        // No process in queue, jump to next arrival time
        if (processIndex < processes.length) {
          const nextArrival = processes[processIndex].arrivalTime;
          schedule.push({ processId: -1, timeUnits: nextArrival - currentTime });
          currentTime = nextArrival;
        }
        continue;
      }
      
      // Execute process from queue
      const process = queue.shift();
      const timeToExecute = Math.min(timeQuantum, process.remainingTime);
      
      schedule.push({ processId: process.id, timeUnits: timeToExecute });
      
      // Calculate operations: store waiting gaps as start-end pairs
      const lastTimeReference = process.lastExecutionEndTime === null ? process.arrivalTime : process.lastExecutionEndTime;
      const opStr = operations.get(process.id);
      const gapOperation = `${currentTime}-${lastTimeReference}`;
      operations.set(process.id, opStr ? opStr + '+' + gapOperation : gapOperation);
      
      currentTime += timeToExecute;
      process.remainingTime -= timeToExecute;
      process.lastExecutionEndTime = currentTime;
      
      if (process.remainingTime > 0) {
        // Process not completed, add back to queue
        queue.push(process);
      } else {
        // Process completed
        process.completionTime = currentTime;
        completed.add(process.id);
        
        // Waiting Time = Completion Time - Arrival Time - Burst Time
        const waitingTime = process.completionTime - process.arrivalTime - process.burstTime;
        waitingTimes.set(process.id, Math.max(0, waitingTime));
        totalWaitingTime += Math.max(0, waitingTime);
      }
    }
    
    const averageWaitingTime = totalWaitingTime / numProcesses;
    return {
      schedule,
      operations: Object.fromEntries(operations),
      waitingTimes: Object.fromEntries(waitingTimes),
      averageWaitingTime
    };
  }
}

module.exports = { RoundRobinQuestion };
