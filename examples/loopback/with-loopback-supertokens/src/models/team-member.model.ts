import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class TeamMember extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'number',
  })
  teamId?: number;

  constructor(data?: Partial<TeamMember>) {
    super(data);
  }
}

export interface TeamMemberRelations {
  // describe navigational properties here
}

export type TeamMemberWithRelations = TeamMember & TeamMemberRelations;
