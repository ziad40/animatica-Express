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
    
    const timeQuantum = 3; // Fixed time quantum
    this.problemInstance = { processes, timeQuantum };
    return this.problemInstance;
  }

  solve() {
    // Solve the Round Robin scheduling problem instance
    const numProcesses = this.problemInstance.processes.length;
    const timeQuantum = this.problemInstance.timeQuantum;
    let totalWaitingTime = 0;
    
    const processes = [...this.problemInstance.processes].map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: null
    }));
    
    let currentTime = 0;
    const schedule = [];
    const waitingTimes = new Map();
    const operations = new Map();
    const completed = new Set();
    const queue = [];
    
    // Add initial process times to operations map
    processes.forEach(p => {
      operations.set(p.id, '');
    });
    
    let processIndex = 0;
    
    while (completed.size < numProcesses) {
      // Add newly arrived processes to queue
      while (processIndex < processes.length && processes[processIndex].arrivalTime <= currentTime) {
        if (!queue.some(p => p.id === processes[processIndex].id)) {
          queue.push(processes[processIndex]);
        }
        processIndex++;
      }
      
      if (queue.length === 0) {
        // No process in queue, jump to next arrival
        if (processIndex < processes.length) {
          const nextArrival = processes[processIndex].arrivalTime;
          schedule.push({ processId: -1, timeUnits: nextArrival - currentTime });
          currentTime = nextArrival;
          queue.push(processes[processIndex]);
          processIndex++;
        }
      } else {
        const process = queue.shift();
        const timeToExecute = Math.min(timeQuantum, process.remainingTime);
        
        schedule.push({ processId: process.id, timeUnits: timeToExecute });
        
        const opStr = operations.get(process.id);
        operations.set(process.id, opStr ? opStr + ',' + currentTime : String(currentTime));
        
        currentTime += timeToExecute;
        process.remainingTime -= timeToExecute;
        
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
        
        // Add newly arrived processes to queue
        while (processIndex < processes.length && processes[processIndex].arrivalTime <= currentTime) {
          if (!queue.some(p => p.id === processes[processIndex].id) && !completed.has(processes[processIndex].id)) {
            queue.push(processes[processIndex]);
          }
          processIndex++;
        }
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
