const { Question } = require("./Question.js");

class SJFQuestion extends Question {
  generate() {
    // Generate a SJF (Shortest Job First) scheduling problem instance
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
    // Solve the SJF scheduling problem instance
    const numProcesses = this.problemInstance.processes.length;
    let totalWaitingTime = 0;
    
    const processes = [...this.problemInstance.processes];
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
        // Select process with shortest burst time
        const selectedProcess = available.reduce((min, p) => 
          p.burstTime < min.burstTime ? p : min
        );
        // Calculate waiting time for the selected process but use arrival time as client requested, not the actual waiting time
        // const waitingTime = currentTime - selectedProcess.arrivalTime;
        const waitingTime = selectedProcess.arrivalTime;
        // const ops = `${currentTime}-${selectedProcess.arrivalTime}`;
        const ops = selectedProcess.arrivalTime;

        totalWaitingTime += waitingTime;
        
        schedule.push({ processId: selectedProcess.id, timeUnits: selectedProcess.burstTime });
        waitingTimes.set(selectedProcess.id, waitingTime);
        operations.set(selectedProcess.id, ops);
        
        currentTime += selectedProcess.burstTime;
        completed.add(selectedProcess.id);
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

module.exports = { SJFQuestion };
