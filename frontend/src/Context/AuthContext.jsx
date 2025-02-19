import {createContext, useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import {useNavigate} from 'react-router-dom'
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
    const navigate = useNavigate()
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [authTokens, setAuthTokens] = useState(()=>localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    let loginUser = async (e) => {
        let response = await fetch("", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'email': e.email, 'password': e.password})
        })
        let data = await response.json
        console.log('data', data)
        if (response.statusCode === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
            navigate('/')
        } else {
            alert("ERROR")
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authToken')
        navigate('/login')
    }
    let updateToken = async () => {
        let response = await fetch("", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'refresh': authTokens.refresh})
        })
        let data = await response.json
        if (response.statusCode === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
        } else {
            logoutUser()
        }
    }
    let contextData = {
        loginUser: loginUser,
        logoutUser: logoutUser,
        user: user,
        authTokens: authTokens
    }

    useEffect(()=>{
        let fourMins = 1000 * 60 * 4
        let interval = setInterval(()=>{
            if (authTokens) {
                updateToken()
            }
        }, fourMins)
        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}