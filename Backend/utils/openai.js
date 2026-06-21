/* import dotenv from"dotenv";
import router from "../routes/chat.js";
import OpenAI from "openai";
dotenv.config();

const getOpenAIAPIResponse = async(message) =>{
   app .post("/api/chat", async (req, res) => {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user",
              content: message,
      
    
            }],
          })
        });

    try{
        const data = await response.json();
        // ...existing code...
    const answer = data.choices[0]?.message.content || "No response";
    return res.send(answer);
    // ...existing code... // ✅ send back to Thunder Client
      } catch (err) {
        console.log(err);
      }
    });
}


   export default getOpenAIAPIResponse; */

import dotenv from "dotenv";
dotenv.config();

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response";
  } catch (err) {
    console.error("OpenAI API Error:", err);
    throw err;
  }
};

export default getOpenAIAPIResponse;
