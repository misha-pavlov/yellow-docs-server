import express, { Response } from "express";
import { UserReq } from "../types/common.types";
import { CreateType } from "./../types/templates.types";
import { checkExistsUserId } from "../utils/checkExistsUserId";

const TemplatesModel = require("../models/templatesModel/templatesModel");
const auth = require("../middleware/auth");
const templatesRouter = express.Router();

// POST
templatesRouter.post(
  "/create",
  auth,
  async (req: UserReq & CreateType, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const title = req.body.title;
    const content = req.body.content;

    if (!title) {
      res.status(400).json({ message: "Title is undefined!" });
      return null;
    }

    if (!content) {
      res.status(400).json({ message: "Content is undefined!" });
      return null;
    }

    const template = new TemplatesModel({
      title,
      content,
      owner: userId,
    });

    try {
      const templateToSave = await template.save();
      res.status(200).json(templateToSave);
    } catch (error) {
      // fix error types because unknown as default
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
);

// GET
templatesRouter.get(
  "/getTemplatesForUser",
  auth,
  async (req: UserReq & { limit?: number }, res: Response) => {
    const userId = checkExistsUserId(req, res);
    const templates = await TemplatesModel.find({ owner: userId }).limit(
      req.query.limit
    );

    if (!templates) {
      res
        .status(400)
        .json({ message: "Current user does not have templates!" });
      return null;
    }

    res.status(200).json(templates);
  }
);

module.exports = templatesRouter;
