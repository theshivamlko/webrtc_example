let state = {
    userId: null,
    ws: null
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
export const setWSocket = (ws) => {

    setState({
        ws: ws
    })

}