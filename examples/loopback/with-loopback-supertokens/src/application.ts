import {AuthenticationComponent} from '@loopback/authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  LoopbackSupertokensBindings,
  SupertokensComponent,
} from 'loopback-supertokens';
import path from 'path';
import {MemoryDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class ExampleApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Authentication:
    this.component(AuthenticationComponent);
    this.configure(AuthorizationBindings.COMPONENT).to({
      defaultDecision: AuthorizationDecision.DENY,
      precedence: AuthorizationDecision.ALLOW,
    });
    this.component(AuthorizationComponent);
    this.component(SupertokensComponent);

    this.dataSource(MemoryDataSource);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async boot(): Promise<void> {
    await super.boot();

    this.bind(LoopbackSupertokensBindings.WEBHOOK_SIGNATURE_SECRET).to(
      'webhook_signature_secret_key',
    );
  }
}
