import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import {Configuration, OpenAIApi} from "openai";

// to enable use of the dotenv variables
dotenv.config();

// Getting started with the configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

// create an openai instance
const openai = new OpenAIApi(configuration);

// initializing the express application and set up a couple of middle wares
const app = express()

app.use(cors());
app.use(express.json());  //This allows json to be passed from the frontend to the backend

// some dummy routes
app.get('/', async (req, res)=> {   //For getting data from the server
    res.status(200).send({
        'message':"Hallo there, this is my clone of chat gpt"
    })
})

app.post('/', async (req, res)=>{   //For posting data from the frontend
    // The code for this part is wrapped in a try and catch block
    try{
        const prompt = req.body.prompt; //The textarea name in the frontend form
        const response = await openai.createCompletion({
            "model":"text-davinci-003",
            "prompt":`${prompt}`,
            "temperature": 0,
            "max_tokens":3000,
            "top_p":1,
            "frequency_penalty":0.5,
            "presence_penalty":0
        })
        //After getting hte response from the api, it is to be sent  bakc to the frontend
        res.status(200).send({
            bot:response.data.choices[0].text
        })
    }catch(error){
        console.log(error);
        res.status(500).send({error})
    }
})

// To enable the server to always listen to new requests
app.listen(5000, ()=>console.log("My bot is running on port 5000: http://localhost:5000"))