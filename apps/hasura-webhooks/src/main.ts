import { bootstrapServer } from '@app/bootstrap/bootstrap.helper';

import { HasuraWebhooksModule } from './hasura-webhooks.module';

bootstrapServer(HasuraWebhooksModule, {});
