import apiService from './apiService';
import { enrichDiagnosisWithRepairPricing } from './repairPricingService';

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
    const aiDiagnosis = await apiService.diagnoseCarProblem(job.vehicle, job.problem);
    const diagnosis = await enrichDiagnosisWithRepairPricing(job.vehicle, job.problem, aiDiagnosis);
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
