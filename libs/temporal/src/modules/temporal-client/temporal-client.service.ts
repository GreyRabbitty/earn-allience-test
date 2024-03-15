import { Injectable } from '@nestjs/common';
import {
  Connection,
  Workflow,
  WorkflowClient,
  WorkflowHandle,
  WorkflowStartOptions,
} from '@temporalio/client';
import { WorkflowExecutionAlreadyStartedError } from '@temporalio/workflow';

import { ConfigService } from '@app/config';

@Injectable()
export class TemporalClientService {
  private workflowClient: WorkflowClient;

  constructor(private readonly configService: ConfigService) {}

  async getTemporalClient(): Promise<WorkflowClient> {
    if (this.workflowClient) return this.workflowClient;
    const host = this.configService.get('temporal.host');
    const port = this.configService.get('temporal.port');
    const connection = await Connection.connect({
      address: `${host}:${port}`,
    });
    this.workflowClient = new WorkflowClient({ connection });
    return this.workflowClient;
  }

  async startWorkflow(
    workflow: string,
    options: WorkflowStartOptions,
  ): Promise<WorkflowHandle> {
    const client = await this.getTemporalClient();
    return client.start(workflow, options);
  }

  /**
   * Start a new workflow or returning existing already running workflow handle
   * @param workflow
   * @param options
   */
  async getOrStartWorkflow(
    workflow: string,
    options: WorkflowStartOptions,
  ): Promise<WorkflowHandle> {
    const client = await this.getTemporalClient();

    try {
      return await this.startWorkflow(workflow, options);
    } catch (e) {
      if (!(e instanceof WorkflowExecutionAlreadyStartedError)) {
        throw e;
      }
      return client.getHandle(options.workflowId);
    }
  }

  async executeWorkflow<T extends Workflow>(
    workflow: string,
    options: WorkflowStartOptions<T>,
  ) {
    const client = await this.getTemporalClient();
    return client.execute<T>(workflow, options);
  }
}
