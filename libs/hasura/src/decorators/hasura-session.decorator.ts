import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HasuraSession = (
  key: string,
  isOptional = false,
): ParameterDecorator => {
  return createParamDecorator((data, ctx: ExecutionContext) => {
    const { key, isOptional } = data;
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();
    const { session_variables: session } = request.body;

    response.locals = { ...response.locals, hasuraSession: session };

    const ret = key ? session?.[key] : session;
    if (ret === undefined && !isOptional) {
      throw new Error(`missing key: ${key}`);
    }
    return ret;
  })({ key, isOptional });
};
