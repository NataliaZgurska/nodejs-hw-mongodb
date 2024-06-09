import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contactname should be a string',
    'string.min': 'Contactname should have at least {#limit} characters',
    'string.max': 'Contactname should have at most {#limit} characters',
    'any.required': 'Contactname is required',
  }),

  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Contactnumber should have at least {#limit} characters',
    'string.max': 'Contactnumber should have at most {#limit} characters',
    'any.required': 'Contactnumber is required',
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .messages({
      'string.base': '"email" must be a string',
      'string.email': '"email" must be a valid email address',
    }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': '"isFavourite" must be a boolean value',
  }),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.value': 'Contacttype should be one of work, home or personal',
      'any.required': 'Contacttype is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Contactname should be a string',
    'string.min': 'Contactname should have at least {#limit} characters',
    'string.max': 'Contactname should have at most {#limit} characters',
  }),

  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Contactnumber should have at least {#limit} characters',
    'string.max': 'Contactnumber should have at most {#limit} characters',
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .messages({
      'string.base': '"email" must be a string',
      'string.email': '"email" must be a valid email address',
    }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': '"isFavourite" must be a boolean value',
  }),

  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.value': 'Contacttype should be one of work, home or personal',
  }),
});
