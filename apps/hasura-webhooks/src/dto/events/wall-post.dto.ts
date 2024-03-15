import { HasuraEventPayloadDto } from '@app/hasura/dto';

class WallPost {
  id: string;

  title?: string;

  description: string;

  created_at: string;
}

export class WallPostEventDto extends HasuraEventPayloadDto<WallPost> {}
