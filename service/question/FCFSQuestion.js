const { Question } = require("./Question.js");

class FCFSQuestion extends Question {
  generate() {
    // Generate a FCFS scheduling problem instance
    // first step : generate random number of processes between 3 and 10
    const numProcesses = Math.floor(Math.random() * 8) + 3;
    // second step : generate random processes with arrival time and burst time
    const processes = [];
    for (let i = 0; i < numProcesses; i++) {
      const arrivalTime = Math.floor(Math.random() * 10); // Arrival time between 0 and 9
      const burstTime = Math.floor(Math.random() * 10) + 1; // Burst time between 1 and 10
      processes.push({ id: i + 1, arrivalTime: arrivalTime, burstTime: burstTime });
    }
    this.problemInstance = { processes };
    return this.problemInstance;
  }

  solve() {
    // Solve the FCFS scheduling problem instance
    const numProcesses = this.problemInstance.processes.length;
    let totalWaitingTime = 0;
    // Sort processes by arrival time
    const processes = [...this.problemInstance.processes].sort((a, b) => {
      if (a.arrivalTime === b.arrivalTime) {
        return a.id - b.id; // keep order by id if arrivalTime is same
      }
      return a.arrivalTime - b.arrivalTime;
    });
    let currentTime = 0;
    const schedule = [];
    for (const process of processes) {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime; // CPU is idle until the process arrives
      }
      const waitingTime = currentTime - process.arrivalTime;
      totalWaitingTime += waitingTime;
      schedule.push({ processId: process.id, startTime: currentTime, endTime: currentTime + process.burstTime, waitingTime: waitingTime });
      currentTime += process.burstTime;
    }
    const averageWaitingTime = totalWaitingTime / numProcesses;
    return {schedule, averageWaitingTime};
  }
}

module.exports = { FCFSQuestion };
