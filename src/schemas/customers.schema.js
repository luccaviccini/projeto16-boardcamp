import joi from 'joi';

export const customerSchema = joi.object({
  name: joi.string().min(1).required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
  birthday: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

