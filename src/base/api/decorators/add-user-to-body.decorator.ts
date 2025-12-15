import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User, UserDocument } from 'src/module/user/schemas/user.schema';
import * as _ from 'lodash';

export interface IAddParamsToBodyArgs {
  paramSource?: string;
  paramDest?: string;
  injectDataTo?: string;
}

const addAuthorToBody = createParamDecorator(
  (args: IAddParamsToBodyArgs, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const setValue = {
      id: user._id.toString(),
      userName: user.userName,
      nameDisplay: user.nameDisplay,
    };

    _.set(request.body, args.paramDest, setValue);
    return request.body;
  },
);
export const AddCreatedByToBody = () => addAuthorToBody({ paramDest: 'createdBy' });
export const AddUpdatedByToBody = () => addAuthorToBody({ paramDest: 'updatedBy' });
