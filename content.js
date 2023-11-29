// Function to call ChatGPT API
async function callChatGPT(originalText) {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = "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"; // Replace with your actual API key

  const payload = {
    model: "gpt-3.5-turbo", // Replace with the model you're using
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      {
        role: "user",
        content: `Simplify the text in this job listing to only display, in a concise and simple manner, years of experience required, level of experience required, security clearance required, education required, and skills required. Format it as follows:
          Level of experience required: {e.g, 'None found', 'Entry', 'Mid', or 'Senior'} //only mark these if you specifically find keywords such as entry, mid, or senior, otherwise use 'None found'
          Years of experience required: {list the years of experience found in the description} //only mark if you specifically find keywords indicating the years of experience required.
          Security clearance required: {'None' or whatever level is detected} //only mark if you specifically find keywords indicating security clearance requirements.
          Education required: {mention any degree or schooling} //only mark if you specifically find keywords indicating educational requirements
          Skills required: {mention any languages, skills, or software experience} //put each skill on a new line with its own bulletpoint.`
      }
    ]
  };

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Function to update job listing text
async function updateJobListingText() {
  try {
    const isLinkedInJobSearchPage = /^https:\/\/www\.linkedin\.com\/jobs\/search\//.test(window.location.href);
    const jobDetailsElement = document.querySelector('#job-details > span');

    if (isLinkedInJobSearchPage && jobDetailsElement) {
      // Grab the text from the job details element
      const originalText = jobDetailsElement.textContent;

      // Call the ChatGPT API and get simplified text
      const simplifiedText = await callChatGPT(originalText);

      // Replace the text in the job details element with the summarized text
      jobDetailsElement.textContent = simplifiedText;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function when the page is fully loaded
window.addEventListener('load', updateJobListingText);
