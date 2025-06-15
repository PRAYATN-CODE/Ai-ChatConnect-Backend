import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service function to execute code based on language
export const executeCode = (code, language) => {
    return new Promise((resolve, reject) => {
        
        const fileName = `temp_code.${language === 'python' ? 'py' : 'js'}`;
        const filePath = path.join(__dirname, fileName); // Using path module to construct the file path

        fs.writeFile(filePath, code, (err) => {
            if (err) {
                return reject(`Error writing code to file: ${err.message}`);
            }

            let command;
            if (language === 'javascript') {
                command = `node ${filePath}`;
            } else if (language === 'python') {
                command = `python ${filePath}`;
            } else {
                return reject('Unsupported language');
            }

            // Execute the code using child process
            exec(command, (error, stdout, stderr) => {
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temporary file:', unlinkErr);
                    }
                });

                if (error) {
                    return reject(`Error executing code: ${stderr || error.message}`);
                }

                resolve(stdout);
            });
        });
    });
};

