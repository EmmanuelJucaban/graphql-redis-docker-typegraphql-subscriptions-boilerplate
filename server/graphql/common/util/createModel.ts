import { getModelForClass } from '@typegoose/typegoose';
import { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

export const createModel = function <U extends AnyParamConstructor<any>, QueryHelpers = {}>(cl: U, options?: IModelOptions): ReturnModelType<U, QueryHelpers> {
  return getModelForClass(cl, { schemaOptions: { timestamps: true }, ...options });
};
