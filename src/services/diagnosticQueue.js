import apiService from './apiService';
import { enrichDiagnosisWithRepairPricing } from './repairPricingService';
import commonProblemsService from './commonProblemsService';

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

export const createDiagnosticJob = (vehicle, problem) => ({
  id: `job-${Date.now()}`,
  vehicle,
  problem,
  status: 'queued',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const processDiagnosticJob = async (job, onStatusChange = () => {}) => {
  onStatusChange({ ...job, status: 'queued', updatedAt: new Date().toISOString() });
  await wait(400);

  const processingJob = { ...job, status: 'processing', updatedAt: new Date().toISOString() };
  onStatusChange(processingJob);

  try {
    // Get common problems for this vehicle
    const commonProblems = await commonProblemsService.getCommonProblems(
      job.vehicle.make, 
      job.vehicle.model, 
      job.vehicle.year
    );
    
    const aiDiagnosis = await apiService.diagnoseCarProblem(job.vehicle, job.problem, commonProblems);
    const diagnosis = await enrichDiagnosisWithRepairPricing(job.vehicle, job.problem, aiDiagnosis);
    
    // Add common problems data to the diagnosis
    diagnosis.commonProblems = commonProblems;
    
    const completedJob = {
      ...processingJob,
      diagnosis,
      status: 'completed',
      updatedAt: new Date().toISOString()
    };
    onStatusChange(completedJob);
    return completedJob;
  } catch (error) {
    const failedJob = {
      ...processingJob,
      error: error.message,
      status: 'failed',
      updatedAt: new Date().toISOString()
    };
    onStatusChange(failedJob);
    return failedJob;
  }
};

export const diagnosticQueueNotes = {
  purpose: 'This service simulates an event-driven queue: the UI creates a job, then an asynchronous worker processes it.',
  productionReplacement: 'In production, this could be replaced with Azure Queue Storage, RabbitMQ, Kafka, AWS SQS, or a database-backed job table.'
};
