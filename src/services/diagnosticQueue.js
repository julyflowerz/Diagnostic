import { enrichDiagnosisWithRepairPricing } from './repairPricingService';
import diagnosticEngine from './diagnosticEngine';
import { getPreviousDiagnoses } from './diagnosticStorage';

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

export const createDiagnosticJob = (vehicle, problem = null) => ({
  id: `job-${Date.now()}`,
  vehicle,
  problem: problem || {
    name: 'User-reported symptoms',
    description: vehicle.symptoms,
    system: 'General',
    severity: vehicle.severity
  },
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
    // Get previous diagnoses for context
    const previousHistory = getPreviousDiagnoses(job.vehicle, job.vehicle.symptoms);
    
    // Use the new diagnostic engine
    const diagnosis = await diagnosticEngine.diagnoseVehicle(
      job.vehicle,
      job.problem.description || job.vehicle.symptoms || '',
      job.vehicle.obdCode,
      previousHistory
    );
    
    // Enrich with repair pricing
    const enrichedDiagnosis = await enrichDiagnosisWithRepairPricing(job.vehicle, job.problem, diagnosis);
    
    const completedJob = {
      ...processingJob,
      diagnosis: enrichedDiagnosis,
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
