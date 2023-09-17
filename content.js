// Create overlay button
const button = document.createElement('button');
button.id = 'overlayButton';
button.style.backgroundImage = `url(${chrome.runtime.getURL('tldr.png')})`;
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.right = '10px';
button.style.zIndex = '9999';
document.body.appendChild(button);

// Function to call ChatGPT API (Placeholder for now)
async function callChatGPT(originalText) {
  // Placeholder for API call
  return `Simplified Text: ${originalText}`;
}

// Main function to update article text
async function updateArticleText() {
  try {
    // Show loading spinner (assuming you have one in your HTML)
    document.getElementById("loadingSpinner").style.display = "block";

    // Grab the text from the HTML element
    const articleElement = document.querySelector('article.jobs-description__container.m4');
    const originalText = articleElement.textContent;

    // Call the ChatGPT API and get simplified text
    const simplifiedText = await callChatGPT(originalText);

    // Replace the text in the HTML element
    articleElement.textContent = simplifiedText;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Hide loading spinner
    document.getElementById("loadingSpinner").style.display = "none";
  }
}

// Add click event listener to the overlay button
button.addEventListener('click', updateArticleText);
