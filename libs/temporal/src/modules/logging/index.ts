import { Runtime } from '@temporalio/worker';

import { getContext } from '@app/temporal/modules/logging/log.interceptor';

export const logger = () => {
  return getContext()?.logger || Runtime.instance().logger;
};
