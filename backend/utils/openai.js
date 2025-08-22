import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        }),
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();

      
        if (!response.ok) {
            console.error("OpenAI API Error:", data);
            return "No response from OpenAI";
        }

       
        return data.choices?.[0]?.message?.content || "No response from OpenAI";
    } catch (err) {
        console.error("OpenAI API Error:", err);
        return "No response from OpenAI";
    }
};

export default getOpenAIAPIResponse;

