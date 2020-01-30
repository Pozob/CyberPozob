import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.interceptors.response.use(null, error => {
    try {
        const userError = error.response && error.response.status >= 400 && error.response.status < 500;
    
        if(!userError) {
            console.log("Hard Error:", error);
        }
    } catch(e) {
        console.error('Error while fetching Data:', e);
    }
    
    return Promise.reject(error);
});


export default {
    get: axios.get,
    post: axios.post,
    engine: axios
    // I dont think we need more right now.
    // If this changes, just add the other methos here
}