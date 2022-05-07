import axios from 'axios';
import { apiUrl, PORT } from '../../environment/environment';

export function verifytokenCall() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(`${apiUrl}${PORT}/account/verifytoken`, {}, {
        }).then(function (response) {
            if (response.data.status === 1) {
                if (response.data?.result?.User?.videostatus === 1 && response.data?.result?.User?.meetingid !== "") {
                    window.location.href = ("/Incoming?mid=" + response.data?.result?.User?.meetingid);
                }
            }
            return true;
        }).catch(function (error) {
            console.log(error);
        });
    }
}