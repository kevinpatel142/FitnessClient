import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { Collapse } from 'react-bootstrap';
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { verifytokenCall } from '../Others/Utils.js';
import { isSameDay, startOfToday, endOfDay } from 'date-fns';

function BookSessionsDetail() {
    const history = useHistory();
    const [trainerId, setTrainerId] = useState();
    const queryStringPara = new URLSearchParams(window.location.search);
    let sessionId = queryStringPara.get("id");
    let sessionType = queryStringPara.get("type");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [IsTAndC, setIsTAndC] = useState(false);
    const [IsTAndC1, setIsTAndC1] = useState(false);
    const [sessionConfirmModal, setSessionConfirmModal] = useState(false);
    const [sessionDetailModal, setSessionDetailModal] = useState(false);
    const [newSessionDetailModal, setNewSessionDetailModal] = useState(false);
    const [sessionReqModal, setSessionReqModal] = useState(false);
    const [confirmReqModal, setConfirmReqModal] = useState(false);
    const [sessionInfo, setSessionInfo] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [plusTime, setPlusTime] = useState();
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [startDateStr, setStartDateStr] = useState('');
    const [startTimeStr, setStartTimeStr] = useState('');

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const calculateMinTime = date => isSameDay(date, new Date()) ? new Date() : startOfToday()
    const getSessionById = () => {
        setIsLoader(true);
        axios.post(`${apiUrl}${PORT}/client/session/getSessionByid`, { id: sessionId }, {
        }).then(function (response) {
            setIsLoader(false);
            if (response.data.status === 1) {
                var rankInfo = response.data?.result?.rankinglist.filter(x => x.sessionrating !== undefined).map(x => x.sessionrating);
                if (response.data?.result?.sessionrequestlist.length > 0) {
                    response.data?.result?.sessionrequestlist.forEach(element => {
                        element.rankingtrainer = ((rankInfo.length > 0) ? (rankInfo.reduce((a, v) => a = a + v.rate, 0) / rankInfo.length) : 0);
                    });
                }
                setTrainerId(response.data?.result?.sessionrequestlist[0]?.trainer_data?._id);
                setSessionInfo(response.data?.result?.sessionrequestlist || []);
                if (sessionType === "My Session") {
                    setSessionDetailModal(true);
                    $(".modal-backdrop").addClass("show");
                }
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
            setIsLoader(false);
            window.alert(error);
        });
    }

    const getSettingbycode = async () => {
        let obj = {
            code: "SESDLY"
        }
        setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/admin/getSettingbycode`, obj, {
        }).then(function (response) {
            if (response.data.status === 1) {
                setPlusTime(response.data?.result?.val || "");
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
            setIsLoader(false);
        });
    }

    useEffect(() => {
        callToken();
        getSessionById();
        getSettingbycode();
    }, []);

    const handleTAndC = (e) => {
        setIsTAndC(e.currentTarget.checked);
    }

    const handleTAndC1 = (e) => {
        setIsTAndC1(e.currentTarget.checked);
    }

    const callSessionStartRequest = () => {
        var sessdate = new Date(sessionInfo[0]?.date).toDateString();
        var currentdate = new Date();
        var currenthours = new Date().getHours();
        currentdate.setHours(currenthours);
        currentdate.setMinutes(0);
        currentdate.setSeconds(0);
        currentdate.setMilliseconds(0);

        var sessiondate = new Date(sessdate + " " + sessionInfo[0]?.starthour);
        var sessionhours = new Date(sessdate + " " + sessionInfo[0]?.starthour).getHours();
        sessiondate.setHours(sessionhours);
        sessiondate.setMinutes(0);
        sessiondate.setSeconds(0);
        sessiondate.setMilliseconds(0);
        if (currentdate >= sessiondate) {
            let isSubmit = true;
            var errormsg = {};
            if (selectedStartDate === "") {
                errormsg.startDate = "Please select start date.";
                isSubmit = false;
            }
            if (selectedStartTime === "") {
                errormsg.startTime = "Please select start time.";
                isSubmit = false;
            }
            if (!IsTAndC1) {
                errormsg.isAgree = "Please check Terms & Conditions!";
                isSubmit = false;
            }
            setErrors(errormsg);
            if (isSubmit) {
                let mid = (new Date()).getTime();
                var obj = {
                    meetingid: mid.toString(),
                    sessionid: sessionId,
                    fromid: sessionInfo[0].cId,
                    toid: sessionInfo[0].tId,
                    starttime: new Date()
                }
                setIsLoader(true);
                axios.post(`${apiUrl}${PORT}/meeting/startvideosession`, obj, {
                }).then(function (response) {
                    setIsLoader(false);
                    if (response.data.status === 1) {
                        setSessionDetailModal(false);
                        history.push("/calling?mid=" + mid);
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
                    setIsLoader(false);
                    window.alert(error);
                });
            }
        }
        else {
            swal({
                title: "Error!",
                text: "Session time not match.",
                icon: "error",
                button: true
            })
        }
    }

    const postSendRequest = async () => {
        let isSubmit = true;
        var errormsg = {};
        if (!IsTAndC) {
            errormsg.isAgree = "Please check Terms & Conditions!";
            isSubmit = false;
        }
        setErrors(errormsg);
        if (isSubmit) {

            var sTime = selectedStartTime;
            var endTime = new Date(selectedStartTime);
            endTime = new Date(endTime.setMinutes(endTime.getMinutes() + 60));

            var ssdate = new Date(selectedStartDate);
            ssdate.setHours(sTime.getHours());
            ssdate.setMinutes(sTime.getMinutes());

            var endate = new Date(selectedStartDate);
            endate.setHours(endTime.getHours());
            endate.setMinutes(endTime.getMinutes());
            let obj = {
                'trainerid': trainerId,
                'date': selectedStartDate,
                'starthour': formatDate(sTime),
                'endhour': formatDate(endTime),
                'startdatetime': ssdate,
                'enddatetime': endate,
                'requestType':0
            }

            setStartDateStr(selectedStartDate.getDate() + ' ' + monthNames[selectedStartDate.getMonth()]);
            setStartTimeStr(sTime.getHours() + ':' + sTime.getMinutes() + ' - ' + endTime.getHours() + ':' + endTime.getMinutes());

            setIsLoader(true);
            await axios.post(`${apiUrl}${PORT}/client/session/sessionrequest`, obj, {
            }).then(function (response) {
                setIsLoader(false);
                setErrors({});
                if (response.data.status === 1) {
                    setSessionReqModal(false);
                    setConfirmReqModal(true);
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
                console.log(error);
                setIsLoader(false);
            });
        }
    }

    function formatDate(idate) {
        var d = new Date(idate);
        var hh = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h === 0) {
            h = 12;
        }

        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        h = h < 10 ? "0" + h : h;

        return (h + ":" + m + ":" + s + " " + dd)
    }

    const sessionFuturReqCall = () => {
        let isSubmit = true;
        var errormsg = {};
        // if (!IsTAndC1) {
        //     errormsg.isAgree = "Please check Terms & Conditions!";
        //     isSubmit = false;
        // }
        setErrors(errormsg);
        if (isSubmit) {
            setErrors({});
            setSessionDetailModal(false);
            new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            setNewSessionDetailModal(true);
            setSessionDetailModal(false);
        }
    }

    const submitNewSessionDetail = () => {
        // let checkTime = new Date().setMinutes(new Date().getMinutes() + parseInt(plusTime) - 1);
        // let isTimeUp = checkTime >= selectedStartTime.getTime();
        // if (!isTimeUp) {
        //     swal({
        //         title: "Error!",
        //         text: `You can not session request in your selected time. please you can select after ${plusTime} minutes.`,
        //         icon: "error",
        //         button: true
        //     })
        // } else {
        setSessionReqModal(true);
        setNewSessionDetailModal(false);
        //}
    }

    return (
        <>
            {isLoader &&
                <div className="loading">
                    <div className="mainloader"></div>
                </div>
            }
            <Collapse in={open}>
                <div id="session-book">
                    <div className="col-md-6 col-12 mx-auto">
                        <div>
                            <div className="session-book">
                                <div className="row">
                                    <div className="col-md-2 col-12 text-center" onClick={() => { setOpen(false); }}>
                                        <i className="far fa-check-circle check-s"></i>
                                    </div>
                                    <div className="col-md-10 col-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="float-md-left">Session Booked!</span>
                                                <span className="float-md-right">{startDateStr}</span>
                                            </div>
                                            <div className="col-12 session-text">
                                                <span className="float-md-left">Cross-Fit with {sessionInfo[0]?.trainer_data?.firstname}</span>
                                                <span className="float-md-right">{startTimeStr}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse>

            <div className="container-fluid">
                <div className="col-md-12 col-12 p-0">
                    <div className="row mb-3">
                        <div className="col-md-12 col-12">
                            <h1 className="main_title">{sessionType === "My Session" ? 'My Sessions Details' : 'Completed Sessions Details'}</h1>
                        </div>
                    </div>
                    {sessionInfo.length > 0 &&
                        <>
                            {sessionInfo.map((item, index) => (
                                <div className="row">
                                    <div className="col-md-4 col-12">
                                        <div className="history_block mb-4">
                                            <div className="d-flex justify-content-between">
                                                <h4 className="mb-3">
                                                    {item.trainer_data.trainingstyle !== "" && item.trainer_data.trainingstyle ?
                                                        <span>{item.trainer_data.trainingstyle.substr(1, 20)}</span> : <>Strength</>
                                                    }
                                                </h4>
                                                <span className="exercies">{item?.sessionworkout?.basicMovements?.length} Exercises</span>
                                            </div>
                                            <div className="crossfit-t">
                                                <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>{new Date(item.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</span></div>
                                                <div className="mb-1"><i className="far fa-clock pr-2"></i><span>{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]} - {item.endhour.split(':')[0] + ":" + item.endhour.split(':')[1]}</span></div>
                                                <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    {(sessionType === "My Session") ?
                                        <>
                                            <div className="col-md-8 col-12">
                                            </div>
                                        </> :
                                        <>
                                            <div className="col-md-8 col-12">
                                                <a href={() => false} data-toggle="modal" data-target="#session-detail" onClick={() => { setSessionDetailModal(true); }} className="train-again cursor-pointer">Train Again</a>
                                            </div>
                                        </>
                                    }
                                    <div className="col-md-12 col-12">
                                        <label className="workout_t">Type Of Workout</label>
                                        {(item?.sessionworkout?.basicMovements.length > 0) ?
                                            <>
                                                {item?.sessionworkout?.basicMovements.map((sitem, sindex) => (
                                                    <p className="text-gray">{sitem.movementName}</p>
                                                ))}
                                            </>
                                            :
                                            <>
                                                <p className="text-gray">None</p>
                                            </>
                                        }
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <div className="row">
                                            <div className="col-md-8 col-12">
                                                <div className="session-trainer">
                                                    <label className="workout_t mb-2">Trainer </label>
                                                    <div className="d-flex">
                                                        <img src={`${apiUrl + PORT + item.trainer_data.profile}`} alt="img" onError={(e) => { e.target.src = "/img/Small-no-img.png" }} />
                                                        <div className="row">
                                                            <div className="col-md-12 pt-4">
                                                                <h4 className="float-left text-primary mr-5 mb-1">{item.trainer_data.firstname}<i className="fas fa-circle text-success circle-i"></i></h4>
                                                                <span className="float-right text-primary pt-1">
                                                                    <Rating ratingValue={item.rankingtrainer} size="20" readonly="true" allowHover="false" allowHalfIcon="true" />
                                                                </span>
                                                                <p className="text-gray clr">
                                                                    {item.trainer_data.trainingstyle !== "" && item.trainer_data.trainingstyle ?
                                                                        <span>{item.trainer_data.trainingstyle.substr(1, 10)}</span> : <></>
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    }
                    {!isLoader && sessionInfo.length === 0 &&
                        <div>
                            No result found!
                        </div>
                    }
                </div>
            </div>

            <Modal show={sessionDetailModal} onHide={(e) => { setSessionDetailModal(false); }} className="mbody sessiondetail" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title className="book-title mb-0 modal-title h4 pl-5 ml-4 pt-3">Your Session Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="col-md-12 col-12">
                        {sessionInfo.length > 0 ?
                            sessionInfo.map((item) => (
                                <div className="history_block mb-4">
                                    <h4 className="mb-3">
                                        {item.trainer_data.trainingstyle !== "" && item.trainer_data.trainingstyle ?
                                            <span>{item.trainer_data.trainingstyle.substr(1, 20)}</span> : <>Strength</>
                                        }
                                    </h4>
                                    <div className="crossfit-t">
                                        <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>{new Date(item.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</span></div>
                                        <div className="mb-1"><i className="far fa-clock pr-2"></i><span>{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]} - {item.endhour.split(':')[0] + ":" + item.endhour.split(':')[1]}</span></div>
                                        <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                                    </div>
                                </div>
                            ))
                            :
                            <></>
                        }
                        <div className="filter-box custom-control custom-checkbox mb-4">
                            <input type="checkbox" className="custom-control-input" id="bookcheck" name="example3" onChange={(e) => { handleTAndC1(e) }} />
                            <label className="custom-control-label" htmlFor="bookcheck">
                                I agree to the <Link to='/cancellationpolicy' className="text-gray">Cancel/ Rescheduling Policy.</Link>
                            </label>
                            <div className="text-danger">{errors.isAgree}</div>
                        </div>

                        {sessionType === 'My Session' &&
                            <>
                                <div className="training_btn mb-3" href={() => false} onClick={() => { callSessionStartRequest(); }}>Start Training</div>
                                <div className="training_btn bg-transparent text-primary" href={() => false}
                                    onClick={() => { setSessionDetailModal(false); setSessionConfirmModal(true); }}
                                    data-dismiss="modal" data-toggle="modal" data-target="#cancel-b">Cancel Training</div>
                                <div className="col-10 mx-auto my-4">
                                    <div className="row">
                                        <div className="col-md-5 or"></div>
                                        <div className="col-md-2">
                                            <div className="jbm-or">
                                                <span>OR</span>
                                            </div>
                                        </div>
                                        <div className="col-md-5 or"></div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="training_btn" href={() => false}
                            onClick={() => { sessionFuturReqCall(); }}>Request Future Session</div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={sessionReqModal} onHide={(e) => { setSessionReqModal(false); }} className="mbody sessiondetail" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title className="book-title mb-0 modal-title h4 pl-5 ml-4 pt-3">Your booking details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="col-md-12 col-12">
                        <div className="history_block mb-4">
                            <h4 className="mb-3">Cross-Fit</h4>
                            <div className="crossfit-t">
                                <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>{selectedStartDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span></div>
                                <div className="mb-1"><i className="far fa-clock pr-2"></i><span>{selectedStartTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></div>
                                <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                            </div>
                        </div>
                        <div className="filter-box custom-control custom-checkbox mb-4">
                            <input type="checkbox" className="custom-control-input" id="bookcheck1" name="example2" onChange={(e) => { handleTAndC(e) }} />
                            <label className="custom-control-label" htmlFor="bookcheck1">
                                I agree to the <Link to='/cancellationpolicy' className="text-gray">Cancel/ Rescheduling Policy.</Link>
                            </label>
                            <div className="text-danger">{errors.isAgree}</div>
                        </div>
                        <div data-dismiss="modal" className="training_btn" onClick={() => { postSendRequest() }}>Send Request</div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={confirmReqModal} onHide={(e) => { setConfirmReqModal(false); }} className="mbody sessiondetail" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="col-md-12 col-12 text-center" onClick={() => {
                        setConfirmReqModal(false);
                        setTimeout(() => {
                            setOpen(false)
                        }, 5000);
                    }}>
                        <button className="checkbtn" onClick={() => setOpen(!open)} aria-controls="session-book" data-dismiss="modal" aria-expanded={open}>
                            <i className="far fa-check-circle check-i"></i>
                            <h4 className="book-title">Awaiting confirmation from Trainer.</h4>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={sessionConfirmModal} onHide={(e) => { setSessionConfirmModal(false); }} size="md" className="mbody sessiondetail" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="col-md-12 col-12 text-center">
                        <h4 className="book-title">Are You sure you want to cancel your booking?</h4>
                        <a className="training_btn bg-transparent text-primary mb-3" href={() => false}
                            onClick={() => { $(".modal-backdrop").removeClass("show"); setSessionConfirmModal(false); }}
                            data-dismiss="modal" data-toggle="modal" data-target="#cancel-b">Cancel Training</a>
                        <Link className="training_btn mb-2" onClick={() => { $(".modal-backdrop").removeClass("show"); setSessionConfirmModal(false); }} to="/MySession">No,Thanks</Link>
                        <p className="c-policy">Please review our cancellation policy <Link to="">Cancel/ Rescheduling Policy.</Link></p>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={newSessionDetailModal} onHide={(e) => { setNewSessionDetailModal(false); }} className="mbody sessiondetail" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title className="book-title mb-0 modal-title h4 pl-5 ml-4 pt-3">Your Session details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <div className="col-md-12 col-12">
                        <div className="row">
                            <div className="col-md-12 col-12">
                                <div className="ui calendar" id="datepicker">
                                    <label>Select Date</label>
                                    <div className="position-relative">
                                        <i className="far fa-calendar picker_i"></i>
                                        <DatePicker dateFormat="dd-MM-yyyy" minDate={new Date()} className="input-box" selected={selectedStartDate} onChange={(date) => { setSelectedStartDate(date); setSelectedStartTime(date); }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-12">
                                <div className="ui calendar" id="time">
                                    <label>Select Time</label>
                                    <div className="position-relative">
                                        <i className="far fa-clock picker_i"></i>
                                        <DatePicker className="input-box" selected={selectedStartTime} onChange={(date) => setSelectedStartTime(date)}
                                            minDate={new Date()}
                                            minTime={calculateMinTime(new Date(selectedStartDate))}
                                            maxTime={endOfDay(new Date())}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={60}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa" placeholder="Time"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mt-4">
                                <button className="training_btn mb-3" onClick={() => { submitNewSessionDetail(); }}>Send Request</button>
                                <button className="training_btn bg-transparent text-primary" onClick={() => { setNewSessionDetailModal(false); }}>Cancel Training</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>);
}

export default BookSessionsDetail;