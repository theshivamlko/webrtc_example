let state = {
    userId: null
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