
import Joi from "joi";

export const createElementSchema = Joi.object({
    type: Joi.string()
        .valid("rect", "circle", "path", "text", "sticky", "line", "arrow")
        .required(),
    position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required()
    }).required(),
    size: Joi.object({
        width: Joi.number().default(0),
        height: Joi.number().default(0)
    }).required(),
    points: Joi.array().items(
        Joi.object({
            x: Joi.number(),
            y: Joi.number()
        })
    ).default([]),
    style: Joi.object({
        color: Joi.string().default("#000000"),
        fillColor: Joi.string().default("transparent"),
        strokeWidth: Joi.number().default(2),
        opacity: Joi.number().min(0).max(1).default(1),
        fontSize: Joi.number().default(16)
    }).required(),
    text: Joi.string().optional().allow(null, ""),
    version: Joi.number().default(0)
});