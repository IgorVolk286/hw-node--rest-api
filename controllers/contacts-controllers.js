// const moviesServise = require("../models/contacts.js");
const HttpErr = require("../helpers/HttpError.js");
// const contactChema = require("../schems/contacts-schems.js");
const {
  Contact,
  addContactChema,
  updateContactChema,
} = require("../models/Contact.js");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    console.log(favorite);
    const find = { owner };
    if (favorite !== undefined) {
      find.favorite = favorite;
    }
    const skip = (page - 1) * limit;
    const result = await Contact.find(find, "name email phone", {
      skip,
      limit,
    }).populate("owner", "email subscription");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOne({ _id: contactId, owner });
    if (!result) {
      throw HttpErr(404, `Contact with id ${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addNewContact = async (req, res, next) => {
  try {
    const { error } = addContactChema.validate(req.body);
    if (error) {
      throw HttpErr(404, error.message);
    }
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!result) {
      throw HttpErr(404, `Contact with id ${contactId} not found`);
    }
    res.status(201).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    console.log(req.params);
    const { error } = updateContactChema.validate(req.body);
    if (error) {
      throw HttpErr(404, error.message);
    }

    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    console.log(req.params);
    const { error } = updateContactChema.validate(req.body);
    if (error) {
      throw HttpErr(404, "missing field favorite");
    }

    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addNewContact,
  deleteById,
  updateContact,
  updateStatusContact,
};
