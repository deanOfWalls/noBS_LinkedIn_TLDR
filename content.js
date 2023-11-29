// Function to display a popup message
function displayPopupMessage(message) {
  alert(message);
}

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
    // Wait for the LinkedIn job search page to fully load
    const isLinkedInJobSearchPage = /^https:\/\/www\.linkedin\.com\/jobs\/search\//.test(window.location.href);
    if (!isLinkedInJobSearchPage) {
      return; // Exit if not on the LinkedIn job search page
    }

    // Wait for the #ember277 > h2 element to be present
    const headerElement = await waitForElement('#ember277 > h2', 5000); // Adjust the timeout as needed

    if (!headerElement) {
      // Display a warning message if the header element is not found
      displayPopupMessage("Warning: Header element not found.");
      return; // Exit if the header element is not found
    }

    // Wait for the job details element to be present
    const jobDetailsElement = await waitForElement('#job-details > span', 5000); // Adjust the timeout as needed

    if (jobDetailsElement) {
      // Grab the text from the job details element
      const originalText = jobDetailsElement.textContent;

      // Call the ChatGPT API and get simplified text
      const simplifiedText = await callChatGPT(originalText);

      // Replace the text in the job details element with the summarized text
      jobDetailsElement.textContent = simplifiedText;

      // Display a success popup message
      displayPopupMessage("Job listing text updated successfully.");
    } else {
      // Display a message if the job details element is not found
      displayPopupMessage("Job details element not found.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Display an error popup message
    displayPopupMessage("An error occurred: " + error.message);
  }
}

// Function to wait for an element to be present
function waitForElement(selector, timeout) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error(`Element with selector ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
}

// Run the main function when the page is fully loaded
window.addEventListener('load', updateJobListingText);
