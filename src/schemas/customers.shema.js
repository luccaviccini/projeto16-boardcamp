import joi from 'joi';

export const customerSchema = joi.object({
  name: joi.string().min(1).required(),
  phone: joi.string().min(1).max(11).required(),
  cpf: joi.string().min(1).max(12).required(),
  birthday: joi.string().min(1).max(10).required(),
});

