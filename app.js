import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";
import { weather } from "./apiClima.js";
dotenv.config();

const openai = new OpenAI({
    //api de la pagina https://openrouter.ai/
    apiKey: process.env.APIKEY,
    baseURL: 'https://openrouter.ai/api/v1' 
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, question => {
            resolve(question);
        });
    });
}


let conversationHistory = [];

async function clothingTemperature() {
    const temperatura = await weather();
    console.log(temperatura)
    //while (true) {
        // const question = await askQuestion('Que me queres preguntar? ');

        // if (question.trim().toLowerCase() === 'cerrar') {
        //     console.log('Chau!');
        //     rl.close();
        //     break;
        // }

        // Agregar la pregunta del usuario al historial
        conversationHistory.push({
            role: "user",
            content: `${temperatura} quiero que me digas de manera amigable que ropa me recomendas usar`
          });
          

        try {
            const chat = await openai.chat.completions.create({
                model: 'deepseek/deepseek-r1:free',
                messages: conversationHistory
            });

            const answer = chat.choices[0].message.content;
            console.log('\nMi respuesta:', answer, '\n');
            console.log('------------------------------------------------------------------ \n \n \n')

            conversationHistory.push({ role: "assistant", content: answer });

        } catch (error) {
            console.error('esto no funco', error);
        }
    //}
}

async function img() {
    while (true) {
        const link = await askQuestion('Ingrese link de la imagen: ');
        const question = await askQuestion('Que me queres preguntar? ');

        if (question.trim().toLowerCase() === 'cerrar') {
            console.log('Chau!');
            rl.close();
            break;
        }

        // Agregar la pregunta del usuario al historial
        conversationHistory.push({
            role: "user", content: [
                {
                    "type": "text",
                    "text": question
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": link
                    }
                }
            ]
        });

        try {
            const chat = await openai.chat.completions.create({
                model: 'meta-llama/llama-4-maverick:free',
                messages: conversationHistory
            });

            const answer = chat.choices[0].message;
            console.log('\nMi respuesta:', answer, '\n');
            console.log('------------------------------------------------------------------ \n \n \n')

            conversationHistory.push({ role: "assistant", content: answer });

        } catch (error) {
            console.error('esto no funco', error);
        }
    }
}





// img();
clothingTemperature();
