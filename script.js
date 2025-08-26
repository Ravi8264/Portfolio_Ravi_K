// Typing animation for the span element
const typingText = document.getElementById("typing-text");
const texts = [
  "Full Stack Developer",
  "Spring Boot Developer",
  "React Developer",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    // Deleting text
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Typing text
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  // Set typing speed - faster and smoother
  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    // Pause at end of typing
    typeSpeed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next text
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typeSpeed = 300;
  }

  setTimeout(typeText, typeSpeed);
}

// Start the typing animation when page loads
document.addEventListener("DOMContentLoaded", function () {
  typeText();
});
