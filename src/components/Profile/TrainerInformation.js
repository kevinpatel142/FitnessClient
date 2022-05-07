import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { Modal } from "react-bootstrap";
import { verifytokenCall } from '../Others/Utils.js';
import { isSameDay, startOfToday, endOfDay } from 'date-fns';
function TrainerInformation() {
    const history = useHistory();
    const [trainerId, setTrainerId] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [startDateStr, setStartDateStr] = useState('');
    const [startTimeStr, setStartTimeStr] = useState('');
    const [list, setList] = useState({});
    const [srlist, setSessionRequestList] = useState({});
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [IsTAndC, setIsTAndC] = useState(false);
    const [sessionReqModal, setSessionReqModal] = useState(false);
    const [confirmReqModal, setConfirmReqModal] = useState(false);
    const [isReportresone, setIsReportresone] = useState(false);
    const [isMountRender, setMountRender] = useState(true);
    const [reportObj, setReportObj] = useState({ trainerid: "", reason: "", isBlock: null });
    const [currentFlag, setCurrentFlag] = useState("");
    const [temptime, setTemptime] = useState(new Date());
    // const [plusTime, setPlusTime] = useState();
    const confirmReqModalClose = () => setConfirmReqModal(false);
    // const [isLoader, setIsLoader] = useState(false);
    // const [displayTime, setDisplayTime] = useState();
    //const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    //const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    //const [certificationsList, setCertificationsList] = useState();
    const calculateMinTime = date => isSameDay(date, new Date()) ? new Date() : startOfToday()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const queryStringPara = new URLSearchParams(window.location.search);
    let Id = queryStringPara.get("Id");

    //Onload event set here.
    useEffect(() => {
        if (isMountRender) return;
    }, [isMountRender]);

    useEffect(() => {
        document.body.classList.remove('scrollHide');
        setMountRender(false);
        callToken();
        GetList(Id);
        getSettingbycode();

        var dt = new Date();
        dt.setHours(dt.getHours());
        dt.setMinutes(0, 0, 0);
        setStartTime(dt);
        setTemptime(dt);
    }, [])

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
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

        /* if you want 2 digit hours: */
        h = h < 10 ? "0" + h : h;

        //var pattern = new RegExp("0?"+hh+":"+m+":"+s);
        return (h + ":" + m + ":" + s + " " + dd)
    }

    const callSendRequest = () => {
        let isSubmit = true;
        var errormsg = {};
        if (startDate === "") {
            errormsg.startDate = "Please select start date.";
            isSubmit = false;
        }
        if (startTime === "") {
            errormsg.startTime = "Please select start time.";
            isSubmit = false;
        }
        setErrors(errormsg);
        if (isSubmit) {
            sessionFuturReqCall();
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
            $(".modal-backdrop").hide();
            // let checkTime = new Date().setMinutes(new Date().getMinutes() + parseInt(plusTime) - 1);
            // let isTimeUp = checkTime >= startTime.getTime();
            // if (isTimeUp) {
            //     swal({
            //         title: "Error!",
            //         text: `You can not session request in your selected time. please you can select after ${plusTime} minutes.`,
            //         icon: "error",
            //         button: true
            //     })
            // } else {
            //let endTime = startTime;
            setTemptime(startTime);

            var sTime = startTime;
            var endTime = new Date(startTime);
            endTime = new Date(endTime.setMinutes(endTime.getMinutes() + 60));

            var ssdate = new Date(startDate);
            ssdate.setHours(sTime.getHours());
            ssdate.setMinutes(sTime.getMinutes());

            var endate = new Date(startDate);
            endate.setHours(endTime.getHours());
            endate.setMinutes(endTime.getMinutes());

            // let obj = {
            //     'trainerid': trainerId,
            //     'date': startDate,
            //     'starthour': formatDate(startTime),
            //     'endhour': formatDate(temptime.setMinutes(temptime.getMinutes() + 60)),
            // }
            let obj = {
                'trainerid': trainerId,
                'date': startDate,
                'starthour': formatDate(sTime),
                'endhour': formatDate(endTime),
                'startdatetime': ssdate,
                'enddatetime': endate,
                'requestType':0
            }

            setStartDateStr(startDate.getDate() + ' ' + monthNames[startDate.getMonth()]);
            setStartTimeStr(startTime.getHours() + ':' + startTime.getMinutes() + ' - ' + endTime.getHours() + ':' + endTime.getMinutes());

            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/session/sessionrequest`, obj, {
            }).then(function (response) {
                /* formatDate(temptime.setMinutes(temptime.getMinutes() - 60)) */
                $(".modal-backdrop").hide();
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    setIsTAndC(false);
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
                    //window.alert(response.data.message);
                }
            }).catch(function (error) {
                formatDate(temptime.setMinutes(temptime.getMinutes() - 60))
                console.log(error);
                $(".modal-backdrop").hide();
                document.querySelector('.loading').classList.add('d-none');
            });
            //}
        }
    }

    const ShowSessionBooked = () => {
        setOpen(true);
        // $('.modal-dialog').hide();
        setSessionReqModal(false);
        setConfirmReqModal(false);
    }

    const handleTAndC = (e) => {
        setIsTAndC(e.currentTarget.checked);
    }

    async function GetList(id) {
        document.querySelector('.loading').classList.remove('d-none');
        setTrainerId(id);
        await axios.post(`${apiUrl}${PORT}/trainer/trainer/gettrainer`, { userId: id })
            .then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                response.data.result.trainerlist.isbookmarktrainer = response.data?.result?.client_bm_data.some(s => s === Id);
                setList(response.data.result?.trainerlist);
                setSessionRequestList(response.data.result?.sessionrequestlist);
                /* renderArr(response.data.result); */
            }).catch(function (error) {
                //document.querySelector('.loading').classList.add('d-none');
                console.log(error);
            });
    };

    const bookmarkTainer = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tainerId', Id);
        document.querySelector('.loading').classList.remove('d-none');
        await axios.post(`${apiUrl}${PORT}/client/bookmarktrainer`, formData, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                //GetList(Id);
                //history.push("trainerinformation?Id=" + Id);
                window.location.reload();
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
            console.log(error);
            document.querySelector('.loading').classList.add('d-none');
        });
    }

    const callingRequest = async (e) => {
        document.querySelector('.loading').classList.remove('d-none');
        let mid = (new Date()).getTime();
        var obj = {
            meetingid: mid.toString(),
            sessionid: e._id,
            fromid: e.tId,
            toid: e.cId,
            starttime: new Date()
        }
        axios.post(`${apiUrl}${PORT}/meeting/startvideosession`, obj, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                history.push("/calling?mid=" + mid);
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
            document.querySelector('.loading').classList.add('d-none');
            window.alert(error);
        });
    }

    const submitReport = async () => {
        let isSubmit = true;
        var errormsg = {};
        if (reportObj.report === "") {
            errormsg.report = "Please enter report!";
            isSubmit = false;
        }
        setErrors(errormsg);
        if (isSubmit) {
            reportObj.trainerid = Id;
            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/blockreporttrainer`, reportObj, {
            }).then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                reportObj.trainerid = "";
                reportObj.reason = "";
                reportObj.isBlock = null;
                $(".modal-backdrop").hide();
                if (response.data.status === 1) {
                    setIsReportresone(false);
                }
                else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    })
                    //window.alert(response.data.message);
                    setIsReportresone(false);
                }
            }).catch(function (error) {
                console.log(error);
                setIsReportresone(false);
                document.querySelector('.loading').classList.add('d-none');
            });
        }
    }

    const getSettingbycode = async () => {
        let obj = {
            code: "SESDLY"
        }
        // setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/admin/getSettingbycode`, obj, {
        }).then(function (response) {
            // setIsLoader(false);
            if (response.data.status === 1) {
                // setPlusTime(response.data?.result?.val || "");
                startTime.setMinutes(startTime.getMinutes() + parseInt(response.data?.result?.val || 0)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
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
            // setIsLoader(false);
        });
    }

    const sessionFuturReqCall = () => {
        setSessionReqModal(true);
    }

    return (
        <>
            <div className="loading d-none">
                <div className="mainloader"></div>
            </div>

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
                                                <span className="float-md-left">Cross-fit with {list.firstname}</span>
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
                <div className="col-md-12 col-12">
                    <div className="row">
                        <div className="col-md-12 col-12 p-0">
                            <div className="info-bg">
                                <img src={`${apiUrl + PORT + list.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} alt="img" />
                            </div>
                        </div>
                        <div className="col-md-12 col-12">
                            <div className="trainer-info">
                                <div className="row mb-4">
                                    <div className="col-md-6 col-12">
                                        <div className="d-flex info-img">
                                            <img src={`${apiUrl + PORT + list?.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt='User' />
                                            <div className="t_name">
                                                <h4>{list.firstname} <i className="fas fa-circle text-success dot_i"></i></h4>
                                                <p>
                                                    {list.trainingstyle !== "" && list.trainingstyle ?
                                                        <span>{list.trainingstyle?.substr(1, 10)}</span> : <></>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 text-right">
                                        <ul className="list-inline info-icon">
                                            <li className="list-inline-item">
                                                <button onClick={(e) => { bookmarkTainer(e); }}>
                                                    <i className={`${(list.isbookmarktrainer === true) ? "fa" : "far"} fa-bookmark`}></i>
                                                </button>
                                            </li>
                                            <li className="list-inline-item"><button data-toggle="modal" data-target="#report-block"><i className="far fa-flag"></i></button></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="info-content">
                                            <h4>About {list.firstname}</h4>
                                            <p className="mb-0 content-box">
                                                {list.aboutus || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="info-content">
                                            <h4>Certifications</h4>
                                            <ul className="list-inline certifi mb-0 content-box">
                                                {
                                                    list?.certifications?.name?.length > 0 ?
                                                        list?.certifications?.name.split(',')?.map((ele, i) => {
                                                            return (<li key={'certifi' + i}>{ele}</li>);
                                                        })
                                                        : <>-</>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="info-content">
                                            <h4>Training Style</h4>
                                            <p className="mb-0 content-box">{list.trainingstyle || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="info-content">
                                            <h4>Favourite Quote</h4>
                                            <p className="mb-0 content-box">{list.quote || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row d-none">
                                    <div className="col-md-3 mb-3 offset-md-6">
                                        <button className="training_btn" data-dismiss="modal" data-toggle="modal" data-target="#session-detail">Find Another Trainer</button>
                                    </div>
                                    <div className="col-md-3">
                                        <button className="training_btn" data-dismiss="modal" data-toggle="modal" data-target="#searchtrainer">1 hour left</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-12 bookhistory mt-2">
                                        <ul className="nav nav-tabs" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-toggle="tab" href="#Book">Book Session</a>
                                            </li>
                                            <li className="nav-item">
                                                <a id="myHistory" className="nav-link" data-toggle="tab" href="#History">History</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content">
                                            <div id="Book" className="tab-pane active">
                                                <div className="col-md-12 col-12">
                                                    <div className="row">
                                                        <div className="col-md-4 col-12">
                                                            <div className="ui calendar" id="datepicker">
                                                                <label>Select Date</label>
                                                                <div className="position-relative">
                                                                    <i className="far fa-calendar picker_i"></i>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" minDate={new Date()} className="input-box" selected={startDate} onChange={(date) => setStartDate(date)} />
                                                                    <div className="text-danger">{errors.startDate}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-12">
                                                            <div className="ui calendar" id="time">
                                                                <label>Select Time</label>
                                                                <div className="position-relative">
                                                                    <i className="far fa-clock picker_i"></i>
                                                                    <DatePicker className="input-box" selected={startTime} onChange={(date) => { setStartTime(date) }}
                                                                        minDate={new Date()}
                                                                        minTime={calculateMinTime(new Date(startDate))}
                                                                        maxTime={endOfDay(new Date())}
                                                                        showTimeSelect
                                                                        showTimeSelectOnly
                                                                        timeIntervals={60}
                                                                        timeCaption="Time"
                                                                        dateFormat="h:mm aa" placeholder="Time"
                                                                    />
                                                                    <div className="text-danger">{errors.startTime}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-12">
                                                            <button data-toggle="modal" data-target="#send-request" onClick={() => { callSendRequest() }} className="training_btn mb-3">Request future session</button>
                                                            <Link to="/mysession" className="training_btn bg-transparent text-primary">Start Training Now</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="History" className="tab-pane fade">
                                                <div className="col-12">
                                                    <div className="row">
                                                        {srlist?.length > 0 &&
                                                            srlist?.map((item, i) => {
                                                                return (<div key={'workout_' + i} className="col-md-4 col-12">
                                                                    <div className="history_block">
                                                                        <div className="d-flex justify-content-between mb-2">
                                                                            <h4>Strength with {item.trainer_data.firstname}</h4>
                                                                            <Link to={'/workoutform?Id=' + item._id}><span className="work_btn">View Workout</span></Link>
                                                                        </div>
                                                                        <div className="crossfit-t">
                                                                            <div className="mb-1"><i className="far fa-calendar pr-1"></i> {new Date(item.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</div>
                                                                            <div>
                                                                                <i className="far fa-clock pr-1"></i>
                                                                                {item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1] + " " + item.starthour.split(' ')[1]}&nbsp;to&nbsp;
                                                                                {item.endhour.split(':')[0] + ":" + item.endhour.split(':')[1] + " " + item.endhour.split(' ')[1]}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>);
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={sessionReqModal} onHide={() => { setSessionReqModal(false); }} className="searchtrainer" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Your booking details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12 col-12">
                        <div className="history_block mb-4">
                            <h4 className="mb-3">Cross-Fit</h4>
                            <div className="crossfit-t">
                                <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>{startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span></div>
                                <div className="mb-1"><i className="far fa-clock pr-2"></i><span>{startTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></div>
                                <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                            </div>
                        </div>
                        <div className="filter-box custom-control custom-checkbox mb-4">
                            <input type="checkbox" className="custom-control-input" id="bookcheck1" value={IsTAndC} checked={IsTAndC} name="example2" onChange={(e) => { handleTAndC(e) }} />
                            <label className="custom-control-label" htmlFor="bookcheck1">
                                I agree to the <Link to='/cancellationpolicy' className="text-gray">Cancel/ Rescheduling Policy.</Link>
                            </label>
                            <div className="text-danger">{errors.isAgree}</div>
                        </div>
                        <div className="training_btn" onClick={(e) => { e.preventDefault(); postSendRequest() }}>Send Request</div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <div className={`modal fade ${sessionReqModal === false ? "" : "show"}`} style={{ display: `${sessionReqModal === false ? "none" : "block"}` }} id="send-request" role="dialog">
                <div className="modal-dialog modal-dialog-centered mbody" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={() => { setSessionReqModal(false); }} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="book-title">Your booking details</h4>
                                <div className="history_block mb-4">
                                    <h4 className="mb-3">Cross-Fit</h4>
                                    <div className="crossfit-t">
                                        <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>{startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span></div>
                                        <div className="mb-1"><i className="far fa-clock pr-2"></i><span>{startTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span></div>
                                        <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                                    </div>
                                </div>
                                <div className="filter-box custom-control custom-checkbox mb-4">
                                    <input type="checkbox" className="custom-control-input" id="bookcheck1" value={IsTAndC} checked={IsTAndC} name="example2" onChange={(e) => { handleTAndC(e) }} />
                                    <label className="custom-control-label" htmlFor="bookcheck1">
                                        I agree to the <Link to='/cancellationpolicy' className="text-gray">Cancel/ Rescheduling Policy.</Link>
                                    </label>
                                    <div className="text-danger">{errors.isAgree}</div>
                                </div>
                                <div className="training_btn" onClick={(e) => { e.preventDefault(); postSendRequest() }}>Send Request</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <Modal show={confirmReqModal} onHide={confirmReqModalClose} className="searchtrainer" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                {/* <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header> */}
                <button onClick={() => ShowSessionBooked()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Body>
                    <div className="col-md-12 col-12 text-center"
                        onClick={() => {
                            setConfirmReqModal(false);
                            setTimeout(() => {
                                setOpen(false)
                            }, 5000);
                        }}>
                        <button className="checkbtn" onClick={() => ShowSessionBooked()} aria-controls="session-book" data-dismiss="modal" aria-expanded={open}>
                            <i className="far fa-check-circle check-i"></i>
                            <h4 className="book-title">Awaiting confirmation from Trainer.</h4>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <div className="modal fade" id="searchtrainer" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered searchtrainer" role="document">
                    <div className="modal-content">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="">{list?.firstname} is 1 hour out - would you like to wait for {list?.firstname} or search for another trainer</h4>
                                <button className="training_btn mb-3" data-toggle="modal" data-dismiss="modal" href="#session-request">Request Future Session</button>
                                <Link to="/trainer" className="training_btn bg-transparent text-primary">Find Another Trainer</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="report-block" role="dialog">
                <div className="modal-dialog modal-dialog-centered report-trainer" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={() => { $(".modal-backdrop").hide(); }} data-dismiss="modal" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="book-title text-center">Do you want to report or block the Trainer?</h4>
                                <button className="training_btn bg-transparent text-primary mb-3" data-toggle="modal" data-dismiss="modal" href="#report-resone-block" onClick={() => { setIsReportresone(true); setReportObj(prevState => ({ ...prevState, isBlock: 2 })); setCurrentFlag("Report") }}>Report</button>
                                <button className="training_btn" data-toggle="modal" data-dismiss="modal" href="#report-resone-block" onClick={() => { setIsReportresone(true); setReportObj(prevState => ({ ...prevState, isBlock: 1 })); setCurrentFlag("Block") }}>Block</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal fade ${isReportresone === false ? "" : "show"}`} style={{ display: `${isReportresone === false ? "none" : "block"}` }} id="report-resone-block" role="dialog">
                <div className="modal-dialog modal-dialog-centered report-trainer" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={() => { setIsReportresone(false); $(".modal-backdrop").hide(); }} data-dismiss="modal" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h6 className="text-primary mb-3">{currentFlag}</h6>
                                <div className="mb-4">
                                    <textarea className="w-100 Sessionrej text-primary" placeholder={`Enter reason ${currentFlag}`} value={reportObj.reason} onChange={(e) => { setReportObj(prevState => ({ ...prevState, reason: e.target.value })) }}></textarea>
                                    <div className="text-danger">{errors.report}</div>
                                    <button className="training_btn" data-dismiss="modal" onClick={() => { submitReport() }}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="Rejection" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered sessionbody" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h6 className="text-primary mb-3">Report</h6>
                                <div className="mb-4">
                                    <textarea className="w-100 Sessionrej text-primary" placeholder="Enter Reason"></textarea>
                                    <button className="training_btn" data-dismiss="modal">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="session-detail" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered mbody sessiondetail" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="book-title">Your Session details</h4>
                                <div className="history_block mb-4">
                                    <h4 className="mb-3">Cross-Fit</h4>
                                    <div className="crossfit-t">
                                        <div className="mb-1"><i className="far fa-calendar pr-2"></i><span>7 July</span></div>
                                        <div className="mb-1"><i className="far fa-clock pr-2"></i><span>10:00 - 11:00</span></div>
                                        <div><i className="fas fa-map-marker-alt pr-2"></i><span>Online (Workout from home)</span></div>
                                    </div>
                                </div>
                                <div className="filter-box custom-control custom-checkbox mb-4">
                                    <input type="checkbox" className="custom-control-input" id="bookcheck2" />
                                    <label className="custom-control-label" htmlFor="bookcheck2">I agree to the <a className="text-gray" href='/cancellationpolicy'>Cancel/ Rescheduling Policy.</a></label>
                                </div>
                                <button className="training_btn mb-3" onClick={() => { callingRequest(); }}>Start Training</button>
                                <button className="training_btn bg-transparent text-primary" data-dismiss="modal" data-toggle="modal" data-target="#cancel-b">Cancel Training</button>
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
                                <a className="training_btn" data-toggle="modal" data-dismiss="modal" href="#session-request">Request Future Session</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="cancel-b" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered cancel-b" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-md-12 col-12 text-center">
                                <h4 className="book-title">Are You sure you want to cancel your booking?</h4>
                                <button className="training_btn bg-transparent text-primary mb-3" data-dismiss="modal" data-toggle="modal" data-target="#cancel-b">Cancel Training</button>
                                <Link className="training_btn mb-2" to="/mysession">No,Thanks</Link>
                                <p className="c-policy">Please review our cancellation policy <Link to="/cancellationpolicy">Cancel/ Rescheduling Policy.</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="session-request" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered mbody sessiondetail" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="book-title">Your Session details</h4>
                                <div className="row">
                                    <div className="col-md-12 col-12">
                                        <div className="ui calendar" id="datepicker">
                                            <label>Select Date</label>
                                            <div className="position-relative">
                                                <i className="far fa-calendar picker_i"></i>
                                                <input className="input-box" type="text" placeholder="Date" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <div className="ui calendar" id="time">
                                            <label>Select Time</label>
                                            <div className="position-relative">
                                                <i className="far fa-clock picker_i"></i>
                                                <input className="input-box" type="text" placeholder="Time" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <button className="training_btn mb-3" data-toggle="modal" data-target="#confirm-t" data-dismiss="modal">Send Request</button>
                                        <button className="training_btn bg-transparent text-primary" data-toggle="modal" data-target="#cancel-b" data-dismiss="modal">Cancel Training</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default TrainerInformation;