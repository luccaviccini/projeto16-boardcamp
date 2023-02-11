import joi from "joi";

export const rentalSchema = joi.object({
  customerId: joi.number().integer().greater(0).required(),
  gameId: joi.number().integer().greater(0).required(),
  rentDate: joi.date().required(),
  daysRented: joi.number().integer().greater(0).required(),
  returnDate: joi.date().allow(null),
  originalPrice: joi.number().greater(0).required(),
  delayFee: joi.number().allow(null),
});
