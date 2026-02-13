const { Question } = require("./Question.js");

class SRTFQuestion extends Question {
  generate() {
    // Generate a SRTF (Shortest Remaining Time First) scheduling problem instance
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
    
    this.problemInstance = { processes };
    return this.problemInstance;
  }

  solve() {
    // Solve the SRTF scheduling problem instance (preemptive SJF)
    const numProcesses = this.problemInstance.processes.length;
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
      completionTime: null
    }));
    
    let currentTime = 0;
    let processIndex = 0;
    const schedule = [];
    const waitingTimes = new Map();
    const operations = new Map();
    const completed = new Set();
    const queue = [];
    
    // Initialize operations map and track last execution end time for each process
    const processLastEndTime = new Map();
    processes.forEach(p => {
      operations.set(p.id, '');
      processLastEndTime.set(p.id, null);
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
      
      // Select process with shortest remaining time
      const selectedProcess = queue.reduce((min, p) => 
        p.remainingTime < min.remainingTime ? p : min
      );
      
      // Execute for 1 unit of time
      const timeToExecute = 1;
      
      // Add schedule entry, combining with previous if same process
      if (schedule.length > 0 && schedule[schedule.length - 1].processId === selectedProcess.id) {
        // Combine with last entry
        schedule[schedule.length - 1].timeUnits += timeToExecute;
      } else {
        // New entry - record gap operation for this chunk start
        const chunkStartTime = currentTime;
        const lastEndTime = processLastEndTime.get(selectedProcess.id);
        const referenceTime = lastEndTime === null ? selectedProcess.arrivalTime : lastEndTime;
        const opStr = operations.get(selectedProcess.id);
        const gapOperation = `${chunkStartTime}-${referenceTime}`;
        operations.set(selectedProcess.id, opStr ? opStr + '+' + gapOperation : gapOperation);
        
        // Add new schedule entry
        schedule.push({ processId: selectedProcess.id, timeUnits: timeToExecute });
      }
      
      currentTime += timeToExecute;
      selectedProcess.remainingTime -= timeToExecute;
      processLastEndTime.set(selectedProcess.id, currentTime);
      
      if (selectedProcess.remainingTime === 0) {
        // Process completed
        selectedProcess.completionTime = currentTime;
        completed.add(selectedProcess.id);
        
        // Remove from queue
        const idx = queue.indexOf(selectedProcess);
        if (idx > -1) {
          queue.splice(idx, 1);
        }
        
        // Waiting Time = Completion Time - Arrival Time - Burst Time
        const waitingTime = selectedProcess.completionTime - selectedProcess.arrivalTime - selectedProcess.burstTime;
        waitingTimes.set(selectedProcess.id, Math.max(0, waitingTime));
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

module.exports = { SRTFQuestion };
