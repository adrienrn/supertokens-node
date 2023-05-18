import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Team} from '../models';
import {TeamRepository} from '../repositories';
import {authorize} from '@loopback/authorization';

@authenticate('supertokens')
export class TeamController {
  constructor(
    @repository(TeamRepository)
    public teamRepository: TeamRepository,
  ) {}

  @authorize({allowedRoles: ['ADMIN', 'MANAGER']})
  @post('/teams')
  @response(200, {
    description: 'Team model instance',
    content: {'application/json': {schema: getModelSchemaRef(Team)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {
            title: 'NewTeam',
            exclude: ['id'],
          }),
        },
      },
    })
    team: Omit<Team, 'id'>,
  ): Promise<Team> {
    return this.teamRepository.create(team);
  }

  @authorize({allowedRoles: ['ADMIN']})
  @get('/teams/count')
  @response(200, {
    description: 'Team model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Team) where?: Where<Team>): Promise<Count> {
    return this.teamRepository.count(where);
  }

  @authorize({allowedRoles: ['ADMIN']})
  @get('/teams')
  @response(200, {
    description: 'Array of Team model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Team, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Team) filter?: Filter<Team>): Promise<Team[]> {
    return this.teamRepository.find(filter);
  }

  @get('/teams/{id}')
  @response(200, {
    description: 'Team model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Team, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Team, {exclude: 'where'}) filter?: FilterExcludingWhere<Team>,
  ): Promise<Team> {
    return this.teamRepository.findById(id, filter);
  }

  @authorize({allowedRoles: ['ADMIN', 'MANAGER']})
  @patch('/teams/{id}')
  @response(204, {
    description: 'Team PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Team, {partial: true}),
        },
      },
    })
    team: Team,
  ): Promise<void> {
    await this.teamRepository.updateById(id, team);
  }

  @authorize({allowedRoles: ['ADMIN', 'MANAGER']})
  @put('/teams/{id}')
  @response(204, {
    description: 'Team PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() team: Team,
  ): Promise<void> {
    await this.teamRepository.replaceById(id, team);
  }

  @authorize({allowedRoles: ['ADMIN']})
  @del('/teams/{id}')
  @response(204, {
    description: 'Team DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.teamRepository.deleteById(id);
  }
}
