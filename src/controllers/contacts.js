import createHttpError from 'http-errors';
import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  upsertContact,
} from '../services/contacts.js';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
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
  const { body } = req;
  const contact = await createContact(body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { body } = req;

  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${contactId}!`,
    });
  }

  const { contact } = await upsertContact(contactId, body);
  res.status(200).json({
    status: 200,
    message: `Successfully patched contact!`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const { body } = req;

  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${contactId}!`,
    });
  }

  const { isNew, contact } = await upsertContact(contactId, body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted contact!`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Wrong id ${contactId}!`,
    });
  }

  const contact = await deleteContactById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  res.status(204).send();
};
