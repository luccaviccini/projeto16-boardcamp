import joi from 'joi';

export const gameSchema = joi.object({
  name: joi.string().min(2).required(),
  image: joi.string().min(2).required(),
  stockTotal: joi.number().greater(0).min(1).required(),
  pricePerDay: joi.number().greater(0).min(1).required(),
});

