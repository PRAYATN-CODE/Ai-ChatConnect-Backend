import { executeCode } from "../services/executeservice.js";

export const executeCodeController = async (req, res) => {
    const { code, language } = req.body;

    // Validate input
    if (!code || !language) {
        return res.status(400).send({ error: "Code and language are required!" });
    }

    try {
        const output = await executeCode(code, language);
        res.send({ output });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
