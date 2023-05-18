import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

export {default as supertokens} from 'supertokens-node';

const appInfo = {
  apiDomain: 'http://localhost:3000',
  appName: 'example-app',
  websiteDomain: 'http://localhost:4000',
};

export function configureSupertokens() {
  supertokens.init({
    appInfo,
    framework: 'loopback',
    recipeList: [EmailPassword.init(), Session.init(), UserRoles.init()],
    supertokens: {
      connectionURI: 'http://localhost:3567',
    },
  });
}
