import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Team, TeamMember} from '../models';
import {TeamRepository} from '../repositories';

export class TeamTeamMemberController {
  constructor(
    @repository(TeamRepository) protected teamRepository: TeamRepository,
  ) {}

  @get('/teams/{id}/members', {
    responses: {
      '200': {
        description: 'Array of Team has many TeamMember',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TeamMember)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<TeamMember>,
  ): Promise<TeamMember[]> {
    return this.teamRepository.teamMembers(id).find(filter);
  }

  @post('/teams/{id}/members', {
    responses: {
      '200': {
        description: 'Team model instance',
        content: {'application/json': {schema: getModelSchemaRef(TeamMember)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Team.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TeamMember, {
            title: 'NewTeamMemberInTeam',
            exclude: ['id'],
            optional: ['teamId'],
          }),
        },
      },
    })
    teamMember: Omit<TeamMember, 'id'>,
  ): Promise<TeamMember> {
    return this.teamRepository.teamMembers(id).create(teamMember);
  }

  @patch('/teams/{id}/members', {
    responses: {
      '200': {
        description: 'Team.TeamMember PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TeamMember, {partial: true}),
        },
      },
    })
    teamMember: Partial<TeamMember>,
    @param.query.object('where', getWhereSchemaFor(TeamMember))
    where?: Where<TeamMember>,
  ): Promise<Count> {
    return this.teamRepository.teamMembers(id).patch(teamMember, where);
  }

  @del('/teams/{id}/members', {
    responses: {
      '200': {
        description: 'Team.TeamMember DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(TeamMember))
    where?: Where<TeamMember>,
  ): Promise<Count> {
    return this.teamRepository.teamMembers(id).delete(where);
  }
}
