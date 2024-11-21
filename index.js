document.getElementById("menu-icon").addEventListener("click", function () {
  const navbar = document.querySelector(".navbar");
  if (navbar.style.display === "block") {
    navbar.style.display = "none";
  } else {
    navbar.style.display = "block";
  }
});

function sendMail() {
  let parms = {
    name: document.getElementById(full_name).value,
    email: document.getElementById(sendMail).value,
    phone: document.getElementById(phone_number).value,
    subject: document.getElementById(subject).value,
    message: document.getElementById(message).value,
  };
  console.log(parms)
  emailjs.send("service_98elvb9", "template_1kj3k9n", parms).then("email sent");
}
