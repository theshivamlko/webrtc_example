import * as state from "./states.js"

const landingPageContainer = document.getElementById('landing_page_container');
const header = document.getElementById('header');
const enterRoomWrapper = document.getElementById('enter_room_wrapper');
const inputRoomChannelName = document.getElementById('input_room_channel_name');
const createRoomButton = document.getElementById('create_room_button');
const joinButton = document.getElementById('join_button');
const infoModalButton = document.getElementById('info_modal_button');
const infoModalContentContainer = document.getElementById('info_modal_content_container');
const modalContent = document.getElementById('modal_content');
const closeButton = document.getElementById('close');
const roomInterface = document.getElementById('room_interface');
const roomNameHeadingTag = document.getElementById('room_name_heading_tag');
const destroyButton = document.getElementById('destroy_button');
const exitButton = document.getElementById('exit_button');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message_input');
const messageInputField = document.getElementById('message_input_field');
const sendMessageButton = document.getElementById('send_message_button');
const offerorProcessButtons = document.getElementById('offeror_process_buttons');
const createPcButton = document.getElementById('create_pc');
const addDataTypeButton = document.getElementById('add_data_type');
const createOfferButton = document.getElementById('create_offer');
const updateLocalDescriptionButton = document.getElementById('update_local_description');
const sendOfferButton = document.getElementById('send_offer');
const iceOfferorButton = document.getElementById('ice_offeror');
const setRemoteDescriptionButton = document.getElementById('set_remote_description');
const offereeProcessButtons = document.getElementById('offeree_process_buttons');
const offereeCreatePcButton = document.getElementById('offeree_create_pc');
const offereeAddDataTypeButton = document.getElementById('offeree_add_data_type');
const offereeUpdateRemoteDescriptionButton = document.getElementById('offeree_update_remote_description');
const offereeCreateAnswerButton = document.getElementById('offeree_create_answer');
const offereeUpdateLocalDescriptionButton = document.getElementById('offeree_update_local_description');
const offereeSendAnswerButton = document.getElementById('offeree_send_answer');
const iceOffereeButton = document.getElementById('ice_offeree');
const consoleWrapper = document.getElementById('console_wrapper');
const sessionIdDisplay = document.getElementById('session_id_display');
const consoleDisplay = document.getElementById('console_display');

export const DOM = {
    landingPageContainer,
    header,
    enterRoomWrapper,
    inputRoomChannelName,
    createRoomButton,
    joinButton,
    infoModalButton,
    infoModalContentContainer,
    modalContent,
    closeButton,
    roomInterface,
    roomNameHeadingTag,
    destroyButton,
    exitButton,
    messages,
    messageInput,
    messageInputField,
    sendMessageButton,
    offerorProcessButtons,
    createPcButton,
    addDataTypeButton,
    createOfferButton,
    updateLocalDescriptionButton,
    sendOfferButton,
    iceOfferorButton,
    setRemoteDescriptionButton,
    offereeProcessButtons,
    offereeCreatePcButton,
    offereeAddDataTypeButton,
    offereeUpdateRemoteDescriptionButton,
    offereeCreateAnswerButton,
    offereeUpdateLocalDescriptionButton,
    offereeSendAnswerButton,
    iceOffereeButton,
    consoleWrapper,
    sessionIdDisplay,
    consoleDisplay,
};

export function initializeUI(userId) {
    sessionIdDisplay.innerHTML = `Session Id: ${userId}`;
    state.setUserId(userId)

    setupModalEvents()

}


function openModel() {
    infoModalContentContainer.classList.add("show")
    infoModalContentContainer.classList.remove("hide")
}

function closeModelButton() {
    infoModalContentContainer.classList.add("hide")
    infoModalContentContainer.classList.remove("show")
}

function setupModalEvents() {

    infoModalButton.onclick = openModel
    closeButton.onclick = closeModelButton

    window.onclick = function (event) {
        if (event.target === infoModalContentContainer) {
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

export  function creatorToProceedToRoom(){

    landingPageContainer.style.display = "none";
    exitButton.classList.add("hide")
    roomInterface.classList.remove("hide")
    roomNameHeadingTag.textContent =`You are in room ${state.getState().roomName}`

}


