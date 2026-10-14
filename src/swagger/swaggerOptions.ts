import type {
  OperationIdFactory,
  StandardSchemaConverter,
} from '@nestjs/swagger';
import { zodOpenApiConverter } from './zod-openapi.converter.js';

// Everything you can pass as the third argument of SwaggerModule.createDocument().
// It mirrors Nest's own SwaggerDocumentOptions, so the object below can be handed straight to it.
export interface SwaggerDocumentOptions {
  // Only document these modules. Leave it out and every module in the app is scanned.
  include?: Function[];

  // Classes that no route references directly but you still want listed under "Schemas"
  // (handy for things like shared error shapes).
  extraModels?: Function[];

  // Hide the prefix set with app.setGlobalPrefix('api') from the documented paths.
  ignoreGlobalPrefix?: boolean;

  // When using `include`, also pick up routes from the modules those modules import.
  deepScanRoutes?: boolean;

  // Decides the operationId for each route, which client generators use as the method name.
  // Nest's default is `${controllerKey}_${methodKey}`, e.g. PostsController_create.
  operationIdFactory?: OperationIdFactory;

  // Names the entries in a response's `links` section. Nest's default is
  // `${controllerKey}_${methodKey}_from_${fieldKey}`.
  // More on links: https://swagger.io/docs/specification/links/
  linkNameFactory?: (
    controllerKey: string,
    methodKey: string,
    fieldKey: string
  ) => string;

  // Tags each route with its controller's name minus "Controller" (PostsController -> "Posts").
  // On by default. Turn it off if you'd rather tag everything yourself with @ApiTags().
  autoTagControllers?: boolean;

  // Flip the default around: only routes marked with @ApiIncludeEndpoint() show up. Off by default.
  onlyIncludeDecoratedEndpoints?: boolean;

  // Drop `default` values that are created at runtime, like `new Date()` or class instances.
  // Without this the generated document changes on every restart. Off by default.
  excludeDynamicDefaults?: boolean;

  // Cuts off `example`/`examples` on schemas once they nest deeper than this.
  // A single property can override it with @ApiProperty({ exampleMaxDepth }). No limit by default.
  exampleMaxDepth?: number;

  // Turns Standard Schemas (Zod, Valibot, ArkType, ...) used in @Body({ schema }),
  // @ApiResponse({ standardSchema }) and friends into OpenAPI schemas.
  standardSchemaConverter?: StandardSchemaConverter;
}

// The options this app actually uses.
export const swaggerDocumentOptions: SwaggerDocumentOptions = {
  // Use just the method name (create, findAll, ...) so generated clients get short method names.
  operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,

  // Let zod-openapi turn our Zod schemas into OpenAPI.
  standardSchemaConverter: zodOpenApiConverter,
};
