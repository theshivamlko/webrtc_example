let state = {
    userId: null,
    ws: null,
    roomName: null
};

const setState = (newState) => {

    state = {
        ...state,
        ...newState
    }
};


export const setUserId = (userId) => {

    setState({
        userId: userId
    })

}
export const setRoomName = (roomName) => {

    setState({
        roomName: roomName
    })

}
export const setWSocket = (ws) => {

    setState({
        ws: ws
    })

}

export const getState = () => {
    return state
}
export const resetState = () => {
    return {
        userId: null,
        ws: null,
        roomName: null
    };
}