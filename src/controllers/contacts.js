import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import mongoose from 'mongoose';

export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${id}!`,
    });
  }

  const contact = await getContactsById(id);

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${id} not found!`,
    });
  }

  res.json({
    status: 200,
    message: `Successfully get contact with id ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contacts,
  });
};

export const patchContactController = async (req, res, next) => {
  const id = req.params.contactId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${id}!`,
    });
  }

  const result = await updateContact(id, req.body);

  if (!result) {
    next(createHttpError(404, 'Student not foud'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const id = req.params.contactId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${id}!`,
    });
  }

  const contact = await deleteContact(id);

  if (!contact) {
    next(createHttpError(404, `Contact with id ${id} not found!`));
    return;
  }

  res.status(204).json({
    status: 204,
    message: `Contact with id ${id} deleted`,
  });
};
