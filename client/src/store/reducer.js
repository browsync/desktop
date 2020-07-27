
const initialState = {
    userData: {},
    bookmarkData: []
}

export default (state=initialState, action) => {
    switch(action.type) {
        case "ADD_USER" :
            return {
                ...state,
                userData: state.userData.concat(action.payload.User)
            }
        case "ADD_BOOKMARK" : 
        return {
            ...state,
            bookmarkData: state.bookmarkData.concat(action.payload.newBookmark)
        }
        default : 
        return state;
    }
}