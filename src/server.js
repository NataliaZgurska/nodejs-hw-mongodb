import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactsById } from './services/contacts.js';
import mongoose, { now } from 'mongoose';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(contactsRouter);
  // app.get('/contacts', async (req, res) => {
  //   const contacts = await getAllContacts();
  //   res.json({
  //     status: 200,
  //     message: 'Successfully found contacts!',
  //     data: contacts,
  //   });
  // });

  app.get('/contacts/:contactId', async (req, res) => {
    const id = req.params.contactId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        status: 400,
        message: `Wrong id ${id}!`,
      });
    }

    const contact = await getContactsById(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${id} not found!!!`,
      });
    }

    res.json({
      status: 200,
      message: 'Successfully get contact with id ${id}!',
      data: contact,
    });
  });

  // app.use('*', (req, res, next) => {
  //   res.status(404).json({
  //     message: 'Not found',
  //   });
  // });

  // app.use((err, req, res, next) => {
  //   res.status(500).json({
  //     message: 'Something went wrong',
  //     error: err.message,
  //   });
  // });

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
