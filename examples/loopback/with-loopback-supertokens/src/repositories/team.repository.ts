import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {Team, TeamRelations, User, TeamMember} from '../models';
import {UserRepository} from './user.repository';
import {TeamMemberRepository} from './team-member.repository';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {
  public readonly users: HasManyRepositoryFactory<
    User,
    typeof Team.prototype.id
  >;

  public readonly teamMembers: HasManyRepositoryFactory<TeamMember, typeof Team.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TeamMemberRepository') protected teamMemberRepositoryGetter: Getter<TeamMemberRepository>,
  ) {
    super(Team, dataSource);
    this.teamMembers = this.createHasManyRepositoryFactoryFor('teamMembers', teamMemberRepositoryGetter,);
  }
}
