// Get the event ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

fetch(`https://quiz.vilor.com/api/events/${eventId}/details`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    // Get the contact-right element
    const registerRight = document.querySelector('.register-right');

    // Change the values in the contact-right element
    registerRight.querySelector('img').src = data.img;
    registerRight.querySelector('h3').textContent = data.name;
    registerRight.querySelector('p').textContent = data.description;
    const tableRows = registerRight.querySelectorAll('tr');
    tableRows[0].querySelector('td:nth-child(2)').textContent = data.date;
    tableRows[1].querySelector('td:nth-child(2)').textContent = data.fee;
    tableRows[2].querySelector('td:nth-child(2)').textContent = data.capacity;
    tableRows[3].querySelector('td:nth-child(2)').textContent = data.remainingSlots;
})
.catch((error) => console.error('Error:', error));

fetch('https://quiz.vilor.com/api/events/listing', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const containerElement = document.querySelector('.container'); // Get the container element in your HTML
    data.slice(0, 10).forEach(item => { // Loop through the first 10 items of the data
      // Create a new .box element for each data item
      const boxElement = document.createElement('div');
      boxElement.classList.add('box');
  
      // Create and append the img element
      const imgElement = document.createElement('img');
      imgElement.src = item.img; // Set the src attribute to the image URL from your data
      boxElement.appendChild(imgElement);
  
      // Create and append the h3 element
      const h3Element = document.createElement('h3');
      h3Element.textContent = item.name; // Set the text content to the event name from your data
      boxElement.appendChild(h3Element);
  
      // Create and append the p element for the description
      const p1Element = document.createElement('p');
      p1Element.textContent = item.description; // Set the text content to the event description from your data
      boxElement.appendChild(p1Element);
  
      // Create and append the p element for the date
      const p2Element = document.createElement('p');
      p2Element.innerHTML = "<b>Date:</b> " + item.date; // Set the innerHTML to the event date from your data
      boxElement.appendChild(p2Element);
  
        // If the event has zero remaining slots, make the box slightly grey and change the button to a "sold out" button
        if (item.remainingSlots === 0) {
            boxElement.style.backgroundColor = '#ddd'; // Make the box slightly grey

            // Create and append the "sold out" button
            const soldOutButton = document.createElement('button');
            soldOutButton.textContent = 'Full House';
            soldOutButton.style.color = 'red';
            soldOutButton.style.backgroundColor = '#ddd';
            soldOutButton.style.border = 'none';
            boxElement.appendChild(soldOutButton);
        } else {
            // If the event has more than zero remaining slots, create and append the registration button
            const registerButton = document.createElement('a');
            registerButton.href = `registration.html?id=${item.id}`; // Set the href attribute to the registration link from your data
            registerButton.classList.add('btn');
            registerButton.textContent = 'Register';
            boxElement.appendChild(registerButton);
        }

  
      // Append the .box element to the .container element
      containerElement.appendChild(boxElement);
    });
  })
  .catch((error) => console.error('Error:', error));
  

  function checkRegisterInputs(event){
    
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const contactName = document.getElementById('name');
    const messageElement = document.getElementById('message');
    
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const nameValue = contactName.value.trim();

    let isValid = true;

    if(emailValue === ''){
        setErrorFor(email, "Email cannot be blank");
        isValid = false;
    } else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
        isValid = false;
	} else {
        setSuccessFor(email);
    }

    if(phoneValue === ''){
        setErrorFor(phone, "Phone cannot be blank");
        isValid = false;
    } else if (!phoneValue.startsWith('+60') && !phoneValue.startsWith('60')){
        setErrorFor(phone, "Phone number must start with '+60' or '60'");
        isValid = false;
    } else if(phoneValue.length < 11 || phoneValue.length > 13){
        setErrorFor(phone, "Invalid phone number");
        isValid = false;
    } else if(isNaN(phoneValue)){
        setErrorFor(phone, "Please input numbers");
        isValid = false;
    } else{
        setSuccessFor(phone);
    }

    if(nameValue === ''){
        setErrorFor(contactName, "Name cannot be blank");
        isValid = false;
    } else{
        setSuccessFor(contactName);
    }

    if (isValid) {
        messageElement.style.marginTop = '30px';
        messageElement.textContent = 'Registration successful!';
        messageElement.style.color = 'green';
        document.getElementById('register-form').action = `https://quiz.vilor.com/api/events/${eventId}/register`;
        // setTimeout(function() {
        //     window.history.back();  // Redirect user to the previous page after 3 seconds
        // }, 3000);
        return true;
    } else {
        event.preventDefault();
        return false;
    }
    
}

function setErrorFor(input, message) {
    const rmbForgot = document.querySelector(".rmb-forgot");
    const agreement = document.getElementById("agreement");
	const inputBox = input.parentElement;
	const small = inputBox.querySelector('small');
    if(input === agreement){
        rmbForgot.className = 'rmb-forgot error';
    } else {
        inputBox.className = 'input-box error';
    }

    if (small) {
        small.innerText = message;
    } else {
        console.error("Element not found in the DOM.");
    }
	//small.innerText = message;
}

function setSuccessFor(input) {
    const rmbForgot = document.querySelector(".rmb-forgot");
    const agreement = document.getElementById("agreement");
	const inputBox = input.parentElement;
    if(input === agreement){
        rmbForgot.className = 'rmb-forgot success';
    } else {
        inputBox.className = 'input-box success';
    }
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}