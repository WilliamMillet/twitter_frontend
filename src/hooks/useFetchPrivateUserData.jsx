import { useEffect, useState } from "react"


const useFetchPrivateUserData = () => {
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const token = JSON.parse(localStorage.getItem('jsonwebtoken'))
    const name = JSON.parse(localStorage.getItem('user_identifying_name'))

    if (!token || !name) {
        return { 
            userData: null, 
            error: "Missing token or user name in localStorage", 
            loading: false, 
            fetchUserData: () => {} 
        };
    }

    const fetchUserData = () => {
        setLoading(true)
        setError(null)

        fetch(`http://localhost:5000/api/users/getMainPublicAndPrivateUserDetails/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            return response.json()
        })
        .then(data => {
            setUserData(data)
        })
        .catch((error) => {
            console.error("Error fetching data, error");
            setError(error.message)
        })
        .finally(() => {
            setLoading(false)
        })
    }
    return { userData, error, loading, fetchUserData}

}

export default useFetchPrivateUserData;


