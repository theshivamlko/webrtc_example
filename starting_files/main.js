const myVideoContainer = document.querySelector('#myVideoContainer');
const myVideoElement = document.querySelector('#myVideo');

let pc = null

myVideoContainer.addEventListener('click', (event) => {

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            deviceId: {"exact": "aac418ecd0ce1ef1fcb7fa03bfdf04ad9c5dfc9051a91958a150dfedabe6a25a"}
        },
    }).then(async (localStream) => {

        getAllCameraIds();
        // Iriun Web Cam aac418ecd0ce1ef1fcb7fa03bfdf04ad9c5dfc9051a91958a150dfedabe6a25a

        console.debug('getDisplayMedia() initialized ', localStream);

        myVideoElement.srcObject = localStream;
        myVideoElement.play();


        // #1 Implementing WebRTC
        pc = new RTCPeerConnection()
        console.debug('getDisplayMedia() Created RTCPeerConnection ', pc);

        pc.addEventListener("icegatheringstatechange", (event) => {

            console.debug('icegatheringstatechange', event);
            console.debug('icegatheringstatechange currentTarget', event.currentTarget);

        });

        // #2 add type of media send or receive
        const tracks = localStream.getTracks();

        console.debug('tracks length ', tracks.length);

        tracks.forEach((track) => {
            pc.addTrack(track);
            console.debug('addTrack', track);

        })

        const offer = pc.createOffer()

        offer.then(offer => createOffer(offer,pc)).catch(error => {
            console.error("Offer Error", error);
        })


    }).catch(error => {
        console.error("getDisplayMedia Error occurred while retrieving stream", error);
    })

});

function getAllCameraIds() {

    navigator.mediaDevices.enumerateDevices().then(deviceArray => {

        deviceArray.forEach((device, index) => {

            // console.debug(`Device ${index}`,device.label,device.name,device.deviceId,device.kind,device.groupId,);

            // navigator.mediaDevices.getUserMedia({})

        })

    })

}

// Only to change SDP, not required here
/** @returns {string} The modified offer SDP. */
function readOfferSdp(offer) {
    if (typeof offer?.sdp !== "string") {
        throw new TypeError("Offer SDP is missing");
    }

    const sdpLines = offer.sdp.split(/\r?\n/);
    for (const [index, line] of sdpLines.entries()) {
        if (line.startsWith("a=sendrecv")) {
            console.debug(`Offer SDP line ${index + 1}:`, line);
            sdpLines[index] = "a=recvonly";
            break;

        }
    }

    return sdpLines.join("\n")
}

async function createOffer(offer,pc) {
    console.debug("Offer Created", offer);

 /*    Experiment
    const newSDP = readOfferSdp(offer);
    await pc.setLocalDescription(new RTCPeerConnection({
        type:"offer",
        sdp:newSDP
    }))
    */

    pc.setLocalDescription(offer)

    // Getting stats related to media track at our pc
    let stats = await pc.getStats()

    stats.forEach( report =>{
        console.log("stats:",report)
    })


    pc.onicecandidate = (event) => {
        console.debug("icecandidate RECEIVED:",event.candidate)

        if (event.candidate === null){
            console.debug("icecandidate Gathering:",pc.iceGatheringState)
        }
    }





}