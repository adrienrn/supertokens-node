import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {TeamMember, TeamMemberRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TeamMemberRepository extends DefaultCrudRepository<
  TeamMember,
  typeof TeamMember.prototype.id,
  TeamMemberRelations
> {

  public readonly user: BelongsToAccessor<User, typeof TeamMember.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(TeamMember, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
