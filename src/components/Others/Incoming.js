import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';

function Incoming() {
    const history = useHistory();
    const [time, setTime] = useState(0);
    const [firstname, setFirstname] = useState(0);
    const [profile, setProfile] = useState(0);
    const [isLoader, setIsLoader] = useState(false);
    let mid = new URLSearchParams(window.location.search).get("mid");
    var loginUser = {};
    const loginuserdetail = localStorage.getItem('user');
    if (loginuserdetail) {
        loginUser = JSON.parse(loginuserdetail);
    }
    // Sound Codeing
    const [playing, setPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
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
            if (time === 32) {
                // Stop Sound
                setPlaying(false);
                history.goBack();
            }
        }, 1000);

        var obj = {
            meetingid: mid
        }
        axios.post(`${apiUrl}${PORT}/meeting/getconnectvideosession`, obj, {
        }).then(function (response) {
            if (response.data.status === 1) {
                setFirstname(response.data?.result?.senderData?.firstname || "Guest");
                setProfile((apiUrl + PORT + response.data?.result?.senderData?.profile) || "/img/Small-no-img.png");
                if (response.data?.result?.videoSessions?.statusid === 0) {
                    return true;
                } if (response.data?.result?.videoSessions?.statusid === 1) {
                    history.push("/videosession?mid=" + response.data?.result?.videoSessions?.meetingid);
                } else {
                    history.goBack();
                }
            }
            return true;
        }).catch(function (error) {
            console.log(error);
        });
    })

    const acceptMeeting = async () => {
        var obj = {
            meetingid: mid
        }
        setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/meeting/joinvideosession`, obj, {
        }).then(function (response) {
            setIsLoader(false);
            // Stop Sound
            setPlaying(false);
            if (response.data.status === 1) {
                history.push("/videosession?mid=" + mid);
            }
            else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                })
                //window.alert(response.data.message);
            }

        }).catch(function (error) {
            //window.alert(error);
            /* document.querySelector('.loading').classList.add('d-none'); */
            setIsLoader(false);
        });
    }
    const rejectMeeting = async () => {
        var obj = {
            meetingid: mid,
            toid: loginUser?._id,
            type: "to"
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

            {isLoader &&
                <div id="loader" className="loading">
                    <div className="mainloader"></div>
                </div>
            }

            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>@ViewData["Title"] - Fitness Management</title>
                <link rel="icon" href="/img/favicon.png" />
                <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href="~/css/site.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </head>

            <div className="bg-black">
                <div className="col-md-12">
                    <div className="row">
                        <div className="vediosession mx-auto d-block my-5 py-5">
                            {profile &&
                                <><img src={`${profile}`} className="mt-5 w-100" alt="Profile" onError={(e) => { e.target.src = "/img/Small-no-img.png" }} /></> 
                            }
                            <h3 className="text-center text-white mt-4">{firstname || "Guest"}</h3>
                            <p className="text-center text-white font-weight-bold">Wants to Join Session</p>
                            <ul className="list-inline d-flex justify-content-between">
                                <li className="list-inline-item"><a href={() => false} onClick={(e) => { e.stopPropagation(); rejectMeeting(); }}><i className="fas fa-phone bg-danger p-4 rounded-circle text-white"></i></a></li>
                                <li className="list-inline-item"><a href={() => false} onClick={(e) => { e.stopPropagation(); acceptMeeting(); }}><i className="fas fa-video bg-success p-4 rounded-circle text-white"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>





            <script src="~/lib/jquery/dist/jquery.min.js"></script>
            <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
            <script src="~/js/site.js" asp-append-version="true"></script>

        </>
    );
}

export default Incoming;