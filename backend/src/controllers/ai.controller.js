import { prompts } from "../prompts/ai.prompts.js";
import { generate } from "../services/ai.service.js";

async function runPrompt(res, prompt) {
    const result = await generate(prompt);

    return res.json({
        success: true,
        text: result,
    });
}

export async function translate(req, res) {

    const { text, from, to } = req.body;

    return runPrompt(
        res,
        prompts.translate({
            text,
            from,
            to
        })
    );

}

export async function improve(req, res) {

    return runPrompt(
        res,
        prompts.improve(req.body)
    );

}

export async function friendly(req, res) {

    return runPrompt(
        res,
        prompts.friendly(req.body)
    );

}

export async function formal(req, res) {

    return runPrompt(
        res,
        prompts.formal(req.body)
    );

}