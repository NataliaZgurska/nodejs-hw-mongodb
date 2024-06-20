import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  contactOwnerId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactsQuery.where('userId').equals(contactOwnerId);

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    ContactsCollection.find()
      .merge(contactsQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId, contactOwnerId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: contactOwnerId,
  });

  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId: userId,
  });
  return contact;
};

export const upsertContact = async (
  contactId,
  payload,
  contactOwnerId,
  options = {},
) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: contactOwnerId,
  });
  if (!contact) {
    throw createHttpError(403, 'This is not you contact!');
  }

  const rawResult = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (contactId, contactOwnerId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: contactOwnerId,
  });
  if (!contact) {
    throw createHttpError(403, 'This is not you contact!');
  }

  ContactsCollection.findByIdAndDelete({
    _id: contactId,
  });
};
