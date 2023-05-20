import {SupertokensWebhookHelper} from 'loopback-supertokens';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

const appInfo = {
  apiDomain: 'http://localhost:3000',
  appName: 'example-app',
  websiteDomain: 'http://localhost:4000',
};

const SUPERTOKENS_INTERNAL_WEBHOOK_URL =
  'http://localhost:3000/authentication/webhook';
const SUPERTOKENS_INTERNAL_WEBHOOK_SECRET = 'webhook_signature_secret_key';

const webhookHelper = new SupertokensWebhookHelper(
  SUPERTOKENS_INTERNAL_WEBHOOK_SECRET,
);

export function configureSupertokens() {
  supertokens.init({
    appInfo,
    framework: 'loopback',
    recipeList: [
      EmailPassword.init({
        override: {
          apis: apiImpl => {
            return {
              ...apiImpl,
              signUpPOST: async input => {
                if (!apiImpl.signUpPOST) {
                  throw new Error('Should never happen');
                }

                const response = await apiImpl.signUpPOST(input);
                if (response.status === 'OK') {
                  webhookHelper
                    .dispatchWebhookEvent(
                      SUPERTOKENS_INTERNAL_WEBHOOK_URL,
                      webhookHelper
                        .getEventFactory()
                        .createUserSignUpEvent(response),
                    )
                    .catch((err: Error) => {
                      console.error(err);
                    });
                }

                return response;
              },
            };
          },
        },
      }),
      Session.init(),
      UserRoles.init(),
    ],
    supertokens: {
      connectionURI: 'http://localhost:3567',
    },
  });
}
