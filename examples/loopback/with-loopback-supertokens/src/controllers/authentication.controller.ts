import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, post, requestBody} from '@loopback/rest';
import {WebhookEvent, WebhookEventType} from 'loopback-supertokens';
import {UserRepository} from '../repositories/user.repository';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class AuthenticationController {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  @authenticate('supertokens')
  @get('/authentication/users/me', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              properties: {
                session: {type: 'string'},
                userDataInAccessToken: {
                  additionalProperties: true,
                  example: {
                    'st-perm': {v: [], t: 1684077273061},
                    'st-role': {v: [], t: 1684077273049},
                  },
                  type: 'object',
                },
                userId: {type: 'string'},
              },
              type: 'object',
            },
          },
        },
      },
    },
    summary: 'Get the current logged in user',
  })
  async getCurrentUser(
    @inject(SecurityBindings.USER)
    profile: UserProfile,
  ) {
    return {
      session: profile.session,
      userId: profile.userId,
      userDataInAccessToken: profile.userDataInAccessToken,
    };
  }

  @authenticate('supertokens-internal-webhook')
  @post('/authentication/webhook')
  async execute(
    @requestBody()
    event: WebhookEvent,
  ): Promise<void> {
    switch (event.type) {
      case WebhookEventType.UserSignUp:
        this.userRepository.create(event.data.user);

        return;
    }
  }
}
