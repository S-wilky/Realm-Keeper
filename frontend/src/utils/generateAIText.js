
async function generateText(prompt) {
  console.log("Prompt: ", prompt);
  const JSONSENT = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        prompt: prompt
        //   max_new_tokens: 150,
        //   temperature: 0.7,
        //   top_p: 0.9
        })
    }
  console.log("JSON sent: ", JSONSENT);
  try {
    const response = await fetch("${import.meta.env.AI_SERVICE_URL}/generate", JSONSENT);
    const data = await response.json();
    console.log("JSON received: ", data);
    return data.response; // This matches {"response": "..."} from FastAPI
  } catch (err) {
    console.error("Generation failed: ", err);
    return "Error: Could not generate text.";
  }
};

export default generateText;