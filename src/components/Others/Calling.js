import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';

function Calling() {
    const history = useHistory();
    const [time, setTime] = useState(0);

    let mid = new URLSearchParams(window.location.search).get("mid");
    var loginUser = {};
    const loginuserdetail = localStorage.getItem('user');
    const loginuserrole = localStorage.getItem('usertype');
    let userType = (loginuserrole === 'client') ? 'trainer' : 'client';
    if (loginuserdetail) {
        loginUser = JSON.parse(loginuserdetail);
        console.log(loginuserrole)
        console.log(userType)
    }
    // Sound Codeing
    const [playing, setPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [firstname, setFirstname] = useState(0);
    const [profile, setProfile] = useState(0);
    const audio = useRef(new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"));
    audio.current.onended = function () {
        setPlaying(false);
    };
    audio.current.onplay = function () {
        setHasError(false);
    };
    useEffect(() => {
        if (playing) {
            audio.current.play().then(() => {
                // Audio is playing.
            }).catch(error => {
                setHasError(true);
            });
        } else if (!hasError) {
            audio.current.pause();
        }
    })
    // Sound Codeing


    useEffect(() => {
        setTimeout(() => {
            setTime(time + 1);
            // After 30 second to back in page
            if (time === 30) {
                // Stop Sound
                setPlaying(false);
                disconnectMeeting();
            }
        }, 1000);

        var obj = {
            meetingid: mid
        }
        axios.post(`${apiUrl}${PORT}/meeting/getconnectvideosession`, obj, {
        }).then(function (response) {
            if (response.data.status === 1) {
                setFirstname(response.data?.result?.receiverData?.firstname || "Guest");
                setProfile((apiUrl + PORT + response.data?.result?.receiverData?.profile) || "/img/Small-no-img.png");
                if (response.data?.result?.videoSessions?.statusid === 1) {
                    history.push("/videosession?mid=" + response.data?.result?.videoSessions?.meetingid);
                } else if (response.data?.result?.videoSessions?.statusid === 2 || response.data?.result?.videoSessions?.statusid === 3) {
                    history.goBack();
                }
            }
            return true;
        }).catch(function (error) {
            console.log(error);
        });
    })
    const disconnectMeeting = async () => {
        var obj = {
            meetingid: mid,
            toid: loginUser?._id,
            type: "from"
        }
        await axios.post(`${apiUrl}${PORT}/meeting/disconnectvideosession`, obj, {
        }).then(function (response) {
            // Stop Sound
            setPlaying(false);
            if (response.data.status === 1) {
                history.goBack();
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
    return (
        <>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Fitness Management</title>
                    <link rel="icon" href="/img/favicon.png" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
                    <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" asp-append-version="true" />
                    <link rel="stylesheet" href="/css/site.css" asp-append-version="true" />
                </head>
                <body>
                    <div className="bg-black">
                        <div className="col-md-12">
                            <span className="wait-text">Please wait white we connect you to the {userType}</span>
                            <div className="row">
                                <div className="vediosession mx-auto d-block my-5 py-5">
                                    {profile &&
                                        <><img src={`${profile}`} className="mt-5 w-100" alt="Profile" onError={(e) => { e.target.src = "/img/Small-no-img.png" }} /></>
                                    }
                                    <h3 className="text-center text-white mt-4">{firstname || "Guest"}</h3>
                                    <p className="text-center text-white font-weight-bold">Wants to Join Session</p>
                                    <ul className="list-inline d-flex justify-content-between">
                                        <a className="dis-connect" href={() => false} onClick={(e) => { e.stopPropagation(); disconnectMeeting(); }}>Disconnect</a>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js" asp-append-version="true"></script>
                    <script src="~/js/site.js" asp-append-version="true"></script>
                    <script src="~/js/common.js" asp-append-version="true"></script>
                </body>

            </html>

        </>
    );
}

export default Calling;