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
    
    while (completed.size < numProcesses) {
      // Find all processes that have arrived and are not completed
      const available = processes.filter(p => p.arrivalTime <= currentTime && !completed.has(p.id));
      
      if (available.length === 0) {
        // No process available, find the next arriving process
        const nextProcess = processes.find(p => !completed.has(p.id) && p.arrivalTime > currentTime);
        if (nextProcess) {
          schedule.push({ processId: -1, timeUnits: nextProcess.arrivalTime - currentTime });
          currentTime = nextProcess.arrivalTime;
        }
      } else {
        // Select process with shortest remaining time
        const selectedProcess = available.reduce((min, p) => 
          p.remainingTime < min.remainingTime ? p : min
        );
        
        // Execute for 1 unit of time (to handle preemption properly)
        schedule.push({ processId: selectedProcess.id, timeUnits: 1 });
        selectedProcess.remainingTime--;
        currentTime++;
        
        if (selectedProcess.remainingTime === 0) {
          // Process completed
          selectedProcess.completionTime = currentTime;
          completed.add(selectedProcess.id);
          
          // Waiting Time = Completion Time - Arrival Time - Burst Time
          const waitingTime = selectedProcess.completionTime - selectedProcess.arrivalTime - selectedProcess.burstTime;
          waitingTimes.set(selectedProcess.id, Math.max(0, waitingTime));
          totalWaitingTime += Math.max(0, waitingTime);
          
          const ops = `${selectedProcess.completionTime - selectedProcess.burstTime}-${selectedProcess.arrivalTime}`;
          operations.set(selectedProcess.id, ops);
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

module.exports = { SRTFQuestion };
