
async function generateText(prompt, mode = "lore") {
  console.log("Prompt: ", prompt);
  console.log("Mode: ", mode);

  const JSONSENT = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        prompt: prompt,
        mode: mode
        //   max_new_tokens: 150,
        //   temperature: 0.7,
        //   top_p: 0.9
        })
    }
  console.log("JSON sent: ", JSONSENT);
  try {
    const response = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/generate`, JSONSENT);
    const data = await response.json();
    console.log("JSON received: ", data);
    return data.response; // This matches {"response": "..."} from FastAPI
  } catch (err) {
    console.error("Generation failed: ", err);
    return "Error: Could not generate text.";
  }
};

export default generateText;