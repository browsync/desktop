
export const login = (email, password, loggedIn) => {
    return async (dispatch) => {
        const resp = await fetch("http://localhost:5000/login", 
        {method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    })
    const userData = await resp.json()
    // redis.set('access_token', userData.access_token)
    localStorage.setItem('access_token', userData.access_token)
    loggedIn();
    dispatch({
        type: "ADD_USER",
        payload: {
            User: userData
        }
    })
    }
}