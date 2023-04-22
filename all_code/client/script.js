import bot from "/bot.svg";
import user from "/user.svg";

// accessing the chat_container and the form
const form = document.querySelector('form')
const chatContainer = document.querySelector('chat_container')

// This variable is to be used later to set the loading interval of the bot when fetching the response
let loadInterval;

// This loader function to show that the bot is loading th answer
function Loader(element){
  element.textContent = " ";

  loadInterval = setInterval(()=>{
    element.textContent += ".";

    // when the number of dots we need is reached, then we refresh the element again
    if (element.textContent === "...."){
      element.textContent = " ";
    }
  }, 300)
}

// This functionis to set the bot to return one character at a set time interval
function typeText(element, text){
  // starting with the character at index 0
  let index = 0

  let interval = setInterval(()=> {
    // if the index var is less than the length of the bot response, then the bot is still typing the response
    if (index < text.length){
      // then set the inner HTML of the element
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      // after reaching the length of the response string, clear the interval
      clearInterval(interval);
    }
  },20)
}

// Generating a unique Id for each bti response
function generateUniqueId(){
  // to make a complex uniqueId for each Message, I used the curre date and time at which the message is returned,
  // generated a random number which later is stringified and combined to form an ID
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `Id-${timestamp}-${hexadecimalString}`;
}

// Structuring the UI according to the element communicating ( the user or the bot)
function chatStripe(isAi, value, uniqueId){
  // conditional redering basing on the element communicating
  function Ai(){if (isAi){
    return 'ai'
  }}
  const ClasName = "wrapper " + Ai();
  console.log(ClasName);
  return(
    // Using a template string since we need spaces in the content
    // The message div renders the response generated bby the AI
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
            <img 
            src=${isAi? bot : user}
            alt=${isAi? 'bot': 'user'}/>
        </div>
        
        <div class="message" id=${uniqueId}>
            ${value}
        </div>
      </div>
    </div>

    `
  )
}

const handleSubmit=async(e)=>{
    // to prevent the default behaviour of a browser (reloading when a form is submitted)
    e.preventDefault();
    
    // to catch the data input by the user
    const data = new FormData(form);

    // creating a user's chat stripe after the form has been submitted
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    // the prompt is the name of the textarea which is the form
    // after this, the form is reset to its intial state, empty
    form.reset();

    // Then a chat stripe for the bot is created by generating a unique ID for the message using the function generated above
    const uniqueId = generateUniqueId();

    // the initial value in the message div of the bot's chat stripe is an empty string relating to the loader function above
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // enable a user to csee every new mesage brought by the bot, enable it to keep scrolling down
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // fetch the newly created div, ie the chat container and invoke the loader to see the div
    const messageDiv = document.getElementById(uniqueId);
    Loader(messageDiv);

}

// To view the changes made to the handleSubmit function, add an eventListener to the form
form.addEventListener('submit', handleSubmit);

// enable submission of the form using th eenter key on the keyboard
form.addEventListener('keyup', (e)=>{
  if (e.keyCode ===13){
    handleSubmit(e);
  }
})