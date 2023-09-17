// Function to call ChatGPT API
async function callChatGPT(originalText) {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";
    const apiKey = "sk-getYourOwnKeyBuddy"; // Replace with your actual API key
  
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
  
  // Main function to update article text
async function updateArticleText() {
    try {
      // Show loading spinner
      const loadingSpinner = document.createElement('div');
      loadingSpinner.id = 'loadingSpinner';
      loadingSpinner.style.position = 'absolute';
      loadingSpinner.style.bottom = '10px'; // Adjust the position as needed
      loadingSpinner.style.right = '10px'; // Adjust the position as needed
      loadingSpinner.style.zIndex = '9999';
      loadingSpinner.style.display = 'block';
      loadingSpinner.innerHTML = '<img src="' + chrome.runtime.getURL('spinner.gif') + '" alt="Loading..." style="width: 50px; height: 50px;">';
      document.body.appendChild(loadingSpinner);
  
      // Grab the text from the HTML element
      const articleElement = document.querySelector('article.jobs-description__container.m4');
      const originalText = articleElement.textContent;
  
      // Call the ChatGPT API and get simplified text
      const simplifiedText = await callChatGPT(originalText);
  
      // Process the simplified text and apply formatting
      const formattedText = simplifiedText
        .split('\n')
        .map(line => {
          if (line.includes("Level of experience required:") || line.includes("Years of experience required:")) {
            return `<span style="color: red; font-weight: bold;">${line}</span><br>`;
          } else {
            return `${line}<br>`;
          }
        })
        .join('');
  
      // Replace the text in the HTML element
      articleElement.innerHTML = formattedText;
  
      // Hide the element with class "mt5 mb2"
      const mt5mb2Element = document.querySelector('.mt5.mb2');
      if (mt5mb2Element) {
        mt5mb2Element.style.display = 'none';
      }
  
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
    } catch (error) {
      console.error("Error:", error);
    }
  }
 
  
  // Run the main function when the page is fully loaded
  window.addEventListener('load', updateArticleText);
  