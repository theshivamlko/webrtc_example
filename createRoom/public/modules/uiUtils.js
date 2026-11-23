import * as state from "./states.js"
import * as appconstants from "./appconstants.js"


// selecting DOM elements
const user_session_id_element = document.getElementById("session_id_display");
const infoModalButton = document.getElementById('info_modal_button');
const infoModalContainer = document.getElementById('info_modal_content_container');
const closeModalButton = document.getElementById('close');
const consoleDisplay = document.getElementById('console_display');
const inputRoomNameElement = document.getElementById('input_room_channel_name');
const landingPageContainer = document.getElementById('landing_page_container');
const joinRoomButton = document.getElementById('join_button');
const createRoomButton = document.getElementById('create_room_button');
const roomNameHeadingTag = document.getElementById('room_name_heading_tag');
const roomInterface = document.getElementById('room_interface');
const messagesContainer = document.getElementById('messages');
const messageInputField = document.getElementById('message_input_field');
const messageInputContainer = document.getElementById('message_input');
const sendMessageButton = document.getElementById('send_message_button');
const destroyRoomButton = document.getElementById('destroy_button');
const exitButton = document.getElementById('exit_button');

// learning purposes
const offerorButtonsContainer = document.getElementById("offeror_process_buttons");
const offerorCreatePcButton = document.getElementById("create_pc");
const offerorAddDataTypeButton = document.getElementById("add_data_type");
const offerorCreateOfferButton = document.getElementById("create_offer");
const offerorSetLocalDescriptionButton = document.getElementById("update_local_description");
const offerorSendOfferButton = document.getElementById("send_offer");
const offerorIceButton = document.getElementById("ice_offeror");
const offerorSetRemoteDescriptionButton = document.getElementById("set_remote_description");

const offereeButtonsContainer = document.getElementById("offeree_process_buttons");
const offereeCreatePcButton = document.getElementById("offeree_create_pc");
const offereeAddDataTypeButton = document.getElementById("offeree_add_data_type");
const offereeSetRemoteDescriptionButton = document.getElementById("offeree_update_remote_description");
const offereeCreateAnswerButton = document.getElementById("offeree_create_answer");
const offereeSetLocalDescriptionButton = document.getElementById("offeree_update_local_description");
const offereeSendAnswerButton = document.getElementById("offeree_send_answer");
const offereeIceButton = document.getElementById("ice_offeree");

export const DOM = {
    userSessionIdElement: user_session_id_element,
    infoModalButton,
    infoModalContainer,
    closeModalButton,
    consoleDisplay,
    inputRoomNameElement,
    landingPageContainer,
    joinRoomButton,
    createRoomButton,
    roomNameHeadingTag,
    roomInterface,
    messagesContainer,
    messageInputField,
    messageInputContainer,
    sendMessageButton,
    destroyRoomButton,
    exitButton,

    // learning purposes
    offerorButtonsContainer,
    offerorCreatePcButton,
    offerorAddDataTypeButton,
    offerorCreateOfferButton,
    offerorSetLocalDescriptionButton,
    offerorSendOfferButton,
    offerorIceButton,
    offerorSetRemoteDescriptionButton,

    offereeButtonsContainer,
    offereeCreatePcButton,
    offereeAddDataTypeButton,
    offereeSetRemoteDescriptionButton,
    offereeCreateAnswerButton,
    offereeSetLocalDescriptionButton,
    offereeSendAnswerButton,
    offereeIceButton,
};
export function initializeUI(userId) {
    user_session_id_element.innerHTML = `Session Id: ${userId}`;
    state.setUserId(userId)

    setupModalEvents()

}


function openModel() {
    infoModalContainer.classList.add("show")
    infoModalContainer.classList.remove("hide")
}

function closeModelButton() {
    infoModalContainer.classList.add("hide")
    infoModalContainer.classList.remove("show")
}

function setupModalEvents() {

    infoModalButton.onclick = openModel
    closeModalButton.onclick = closeModelButton

    window.onclick = function (event) {
        if (event.target === infoModalContainer) {
            closeModelButton()
        }
    }

}


export function logToConsole(message, color = "#FFFFFF", highlight = false,
                             highlightColor = "#FFFF83") {

    const messageElement = document.createElement('div');
    messageElement.classList.add('console-message');

    messageElement.textContent = message;
    messageElement.style.color = color;

    if (highlight) {
        messageElement.style.backgroundColor = highlightColor;
        messageElement.style.fontWeight = "bold";
        messageElement.style.padding = "8x";
        messageElement.style.borderRadius = "4x";
        messageElement.style.transition = "background-color 0.5s ease";
    }

    consoleDisplay.appendChild(messageElement);
    consoleDisplay.scrollTop = messageElement.scrollHeight; // scroll to bottom

}

export function creatorToProceedToRoom() {

    landingPageContainer.style.display = "none";
    exitButton.classList.add("hide")
    roomInterface.classList.remove("hide")
    roomNameHeadingTag.textContent = `You are in room ${state.getState().roomName}`

}


inputRoomNameElement.addEventListener('keypress', (event) => {

    if (event.key === "Enter") {
        createRoomButton.click();
    }
})

export function exitRoom() {

    landingPageContainer.style.display = "block";
    roomInterface.classList.add("hide")
    roomNameHeadingTag.textContent = ``
    state.resetState()

}


export function joineeToProceedToRoom() {

    landingPageContainer.style.display = "none"; // hides the landing page section
    roomInterface.classList.remove("hide"); // showing the room interface
    destroyRoomButton.classList.add("hide");
    roomNameHeadingTag.textContent = `You are in room ${state.getState().roomName}`;
    messagesContainer.innerHTML = "pls wait ... connecting via WebRTC";

    // show process buttons for learning purposes only
    offerorButtonsContainer.classList.remove("hide");
    offerorButtonsContainer.classList.add("show");

}


export function updateCreatorRoom() {
    destroyRoomButton.classList.add('hide');
    exitButton.classList.remove('hide');
    messagesContainer.innerHTML = "pls wait ... connecting via WebRTC";

}

export function updateUiForRemainingUser() {

    alert("a user has left your room");
    state.setOtherUserId(null);
    messagesContainer.innerHTML = "Waiting for a peer to join.";
}


export function updateUIButton(button,message){
    button.classList.remove("process_pending");
    button.classList.add("process_complete");
    button.setAttribute("disabled", true);
    logToConsole(message);
}

export function updateUiOnSuccessfulConnection( ){
    messageInputContainer.classList.remove("hide");
    messageInputContainer.classList.add("show");
    // remove text inside of message container
    messagesContainer.innerHTML = "";

    // remove the learning buttons for the offeror
    offerorButtonsContainer.classList.remove("show");
    offerorButtonsContainer.classList.add("hide");
    // remove the learning buttons for the offeree
    offereeButtonsContainer.classList.remove("show");
    offereeButtonsContainer.classList.add("hide");

    // register keypress event on our input message element
    messageInputField.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            sendMessageButton.click();
        }
    });
}

// show offeree's buttons
export function showOffereeButtons() {
    offereeButtonsContainer.classList.remove("hide");
    offereeButtonsContainer.classList.add("show");
};


export function addOutgoingMessageToUi(message) {
    const userTag = "YOU";
    const formattedMessage = `${userTag}: ${message}`;
    const messageElement = document.createElement("div");
    messageElement.style.color = appconstants.theme.green;
    messageElement.textContent = formattedMessage;
    // add our message element to the DOM
    messagesContainer.appendChild(messageElement);
    messageInputField.value = "";
    // ensure the UI scrolls to allow user to always see new incoming and outgoing messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

export function addIncomingMessageToUi(msg) {
    const otherUserId = state.getState().otherUserId;
    const formattedMessage = `${otherUserId}: ${msg}`;
    const messageElement = document.createElement("div");
    messageElement.style.color = appconstants.theme.orange;
    messageElement.textContent = formattedMessage;
    // add our message element to the DOM
    messagesContainer.appendChild(messageElement);
    messageInputField.value = "";
    // ensure the UI scrolls to allow user to always see new incoming and outgoing messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};
