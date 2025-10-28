const { Question } = require("./Question.js");

class FCFSQuestion extends Question {
  generate() {
    // Generate a FCFS scheduling problem instance
    // first step : generate random number of processes between 3 and 5
    const numProcesses = Math.floor(Math.random() * 3) + 3;
    // second step : generate random processes with arrival time and burst time
    const processes = [];
    const arr = [];
    const processArrivalTimes = [];
    for (let i = 0; i <= 6; i++) {
      arr.push(i);
    }
    const arrivalTimesSet = new Set(arr);
    for (let i = 0; i < numProcesses; i++) {
      // Arrival time between 0 and 9 and arrival time for each process should be unique
      const randomIndex = Math.floor(Math.random() * arrivalTimesSet.size);
      const arrivalTime = Array.from(arrivalTimesSet)[randomIndex];
      processArrivalTimes.push(arrivalTime);
      // remove that value from the Set to keep it unique
      arrivalTimesSet.delete(arrivalTime);
    }
    processArrivalTimes.sort((a, b) => a - b); // sort arrival times
    for (let i = 0; i < numProcesses; i++) {
      const arrivalTime = processArrivalTimes[i];
      const burstTime = Math.floor(Math.random() * 10) + 2; // Burst time between 2 and 10
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
    const waitingTimes = new Map();
    const operations = new Map();
    for (const process of processes) {
      if (currentTime < process.arrivalTime) {
        schedule.push({ processId: -1, timeUnits: process.arrivalTime - currentTime });
        currentTime = process.arrivalTime; // CPU is idle until the process arrives
      }
      const waitingTime = currentTime - process.arrivalTime;
      const ops = waitingTime != 0 ? `${currentTime}-${process.arrivalTime}` : "0";
      totalWaitingTime += waitingTime;
      schedule.push({ processId: process.id, timeUnits : process.burstTime });
      waitingTimes.set(process.id, waitingTime);
      operations.set(process.id, ops);
      currentTime += process.burstTime;
    }
    const averageWaitingTime = totalWaitingTime / numProcesses;
    return {schedule,operations : Object.fromEntries(operations), waitingTimes: Object.fromEntries(waitingTimes), averageWaitingTime};
  }
}

module.exports = { FCFSQuestion };
