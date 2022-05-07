import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';

function Videosession() {
    const history = useHistory();
    const domain = 'meet.jit.si';
    let api = {};
    const mid = new URLSearchParams(window.location.search).get("mid");
    var loginUser = {};
    const loginuserrole = localStorage.getItem('usertype');
    const loginuserdetail = localStorage.getItem('user');
    if (loginuserdetail) {
        loginUser = JSON.parse(loginuserdetail);
    }
    const [isMountRender, setMountRender] = useState(true);

    useEffect(() => {
        callToken();
        if (isMountRender) return;
    }, [isMountRender]);

    useEffect(() => {
        setMountRender(false);
        startMeet();
    }, []);

    const callToken = () => {
        var obj = {
            meetingid: mid
        }
        axios.post(`${apiUrl}${PORT}/meeting/getconnectvideosession`, obj, {
        }).then(function (response) {
            if (response.data.status === 1) {
                if (response.data?.result?.videoSessions?.statusid === 1) {
                    return true;
                } else if (response.data?.result?.videoSessions?.statusid === 2) {
                    window.location.href = (loginuserrole === 'client') ? "/rating?id=" + response.data?.result?.videoSessions?.sessionid : "/sessiondetails?id=" + response.data?.result?.videoSessions?.sessionid;
                }
                else {
                    history.goBack();
                }
            }
            return true;
        }).catch(function (error) {
            console.log(error);
        });
        setTimeout(() => {
            callToken();
        }, 1500);
    }

    const endMeeting = async () => {
        var obj = {
            meetingid: mid,
            id: loginUser?._id
        }
        await axios.post(`${apiUrl}${PORT}/meeting/endvideosession`, obj, {
        }).then(function (response) {
            if (response.data.status === 1) {
                var sesId = response.data?.result?.sessionid;
                //window.location.href = (loginuserrole === 'client') ? "/trainer" : "/schedulerequest";
                window.location.href = (loginuserrole === 'client') ? "/rating?id=" + sesId : "/sessiondetails?id=" + sesId;
            }
            else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                })
            }
        }).catch(function (error) {
            //window.alert(error);
        });
    }

    const startMeet = () => {
        const options = {
            roomName: mid,
            width: '100%',
            height: 500,
            configOverwrite: {
                prejoinPageEnabled: false,
                startWithVideoMuted: 2,
                startWithAudioMuted: 2,
                startAudioMuted:0,
                startVideoMuted:0
            },
            userInfo: {
                displayName: (loginUser?.firstname || "Guest")
            },
            parentNode: document.querySelector('#jitsi-iframe')
        }
        api = new window.JitsiMeetExternalAPI(domain, options);
        api.addEventListeners({
            participantJoined: function () {
                
                var plist = api.getParticipantsInfo();
                console.log(plist);
            }
        });

        api.addEventListeners({
            participantLeft: function () {
                $('#jitsi-iframe').empty();
                endMeeting();
            }
        });
    }

    return (
        <>
            <div id="jitsi-iframe"></div>
        </>
    );
}

export default Videosession;