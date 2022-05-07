import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
import Pagination from '../Pagination/Pagination';

function ScheduleRequest() {
    const history = useHistory();
    const [Id, setId] = useState("");
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});
    const [requestList, setRequestList] = useState([]);
    const [rnoOfRecords, setrNoOfRecords] = useState(0);
    const [rpageNum, setrPageNum] = useState(1);
    const rlimitValue = 4;
    const [acceptList, setAcceptList] = useState([]);
    const [anoOfRecords, setaNoOfRecords] = useState(0);
    const [apageNum, setaPageNum] = useState(1);
    const alimitValue = 6;

    const [sessionResponseModal, setSessionResponseModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [userDetail, setUserDetail] = useState();
    const handleClose = () => setDetailModal(false);
    const rejectRequestClose = () => setSessionResponseModal(false);
    useEffect(() => {
        callToken();
        PendingcallToken();
        //fetchList(false, null);
        getrequestsessionList(1, false, null);
        getacceptsessionList(1);
    }, [])
    useEffect(() => {
    }, [requestList, acceptList])

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 5000);
    }
    const PendingcallToken = () => {
        verifyPendingRequestCall();
        setTimeout(() => {
            PendingcallToken();
        }, 15000);
    }
    const verifyPendingRequestCall = async () => {
        getrequestsessionList(apageNum, false, null);
    }
    const getrequestsessionList = async (val, bolval, objdata) => {
        //setIsLoader(true);
        var obj = {
            limitValue: rlimitValue,
            pageNumber: (val || rpageNum)
        };
        await axios.post(`${apiUrl}${PORT}/trainer/session/getPendingRequest`, obj, {}
        ).then(function (response) {
            //setIsLoader(false);
            if (response.data.status === 1) {
                if (response?.data?.result) {
                    setrNoOfRecords(response.data?.result[0]?.totalCount[0]?.count || 0);
                    setRequestList(response.data?.result[0]?.paginatedResults);
                } else {
                    setrNoOfRecords(0);
                    setRequestList([]);
                }
                if (bolval) {
                    if (objdata?.requestType === 1) {
                        callingRequest(objdata);
                    }
                }
            }
            return response;
        }).catch(function (error) {
            //setIsLoader(false);
            window.alert(error);
        });
    }

    const getacceptsessionList = async (val) => {
        setIsLoader(true);
        var obj = {
            limitValue: alimitValue,
            pageNumber: (val || apageNum)
        };

        await axios.post(`${apiUrl}${PORT}/trainer/session/getAcceptRequest`, obj, {}
        ).then(function (response) {
            setIsLoader(false);
            if (response.data.status === 1) {
                if (response?.data?.result) {
                    setaNoOfRecords(response.data?.result[0]?.totalCount[0]?.count || 0);
                    setAcceptList(response.data?.result[0]?.paginatedResults);
                } else {
                    setaNoOfRecords(0);
                    setAcceptList([]);
                }
            }
            return response;
        }).catch(function (error) {
            setIsLoader(false);
            window.alert(error);
        });
    }


    const rcurPage = (pageNum) => {
        setrPageNum(pageNum);
        getrequestsessionList(pageNum, false, null);
    }

    const acurPage = (pageNum) => {
        setaPageNum(pageNum);
        getacceptsessionList(pageNum);
    }

    //const fetchList = async (val, objdata) => {

    // setIsLoader(true);
    // await axios.get(`${apiUrl}${PORT}/trainer/session/getsessionrequest`, {}, {}
    // ).then(function (response) {
    //     setIsLoader(false);
    //     setRequestList([]);
    //     setAcceptList([]);
    //     if (response.data.status === 1) {
    //         // setRequestList(response.data.result.requestList);
    //         // setAcceptList(response.data.result.acceptList);

    //         // var requestList = [];//response.data.result.requestList;
    //         // var acceptList = [];//response.data.result.acceptList;
    //         // var curTime = new Date().toDateString();
    //         // var acnt = 0; var rcnt = 0;
    //         // if (response?.data?.result) {
    //         //     if (response?.data?.result?.requestList.length > 0) {
    //         //         response?.data?.result?.requestList.forEach(element => {
    //         //             var sessdate = new Date(element?.date).toDateString();
    //         //             var currentdate = new Date();
    //         //             var currenthours = new Date().getHours();
    //         //             currentdate.setHours(currenthours);
    //         //             currentdate.setMinutes(0);
    //         //             currentdate.setSeconds(0);
    //         //             currentdate.setMilliseconds(0);

    //         //             var sessiondate = new Date(sessdate + " " + element?.starthour);
    //         //             var sessionhours = new Date(sessdate + " " + element?.starthour).getHours();
    //         //             sessiondate.setHours(sessionhours);
    //         //             sessiondate.setMinutes(0);
    //         //             sessiondate.setSeconds(0);
    //         //             sessiondate.setMilliseconds(0);

    //         //             if (new Date(sessdate).setHours(0, 0, 0) === new Date(curTime).setHours(0, 0, 0)) {
    //         //                 if (sessiondate >= currentdate) {
    //         //                     requestList.push(element);
    //         //                 }
    //         //             } else if (new Date(sessdate).setHours(0, 0, 0) >= new Date(curTime).setHours(0, 0, 0)) {
    //         //                 requestList.push(element);
    //         //             }
    //         //             rcnt++;
    //         //             if (response.data.result.requestList.length === rcnt) {
    //         //                 setRequestList(requestList);
    //         //             }
    //         //         });
    //         //     }
    //         //     if (response?.data?.result?.acceptList.length > 0) {
    //         //         response?.data?.result?.acceptList.forEach(element => {

    //         //             var sessdate = new Date(element?.date).toDateString();
    //         //             var currentdate = new Date();
    //         //             var currenthours = new Date().getHours();
    //         //             var currentminutes = new Date().getMinutes();
    //         //             currentdate.setHours(currenthours);
    //         //             currentdate.setMinutes(currentminutes);
    //         //             currentdate.setSeconds(0);
    //         //             currentdate.setMilliseconds(0);

    //         //             var sessionStdate = new Date(sessdate + " " + element?.starthour);
    //         //             var sessionSthours = new Date(sessdate + " " + element?.starthour).getHours();
    //         //             sessionStdate.setHours(sessionSthours);
    //         //             sessionStdate.setMinutes(0);
    //         //             sessionStdate.setSeconds(0);
    //         //             sessionStdate.setMilliseconds(0);


    //         //             var sessiondate = new Date(sessdate + " " + element?.endhour);
    //         //             var sessionhours = new Date(sessdate + " " + element?.endhour).getHours();
    //         //             sessiondate.setHours(sessionhours);
    //         //             sessiondate.setMinutes(0);
    //         //             sessiondate.setSeconds(0);
    //         //             sessiondate.setMilliseconds(0);
    //         //             if (currentdate < sessiondate) {
    //         //                 acceptList.push(element);
    //         //             }
    //         //             if ((currentdate >= sessionStdate) && (currentdate < sessiondate)) {
    //         //                 element.isVideocall = true;
    //         //             } else {
    //         //                 element.isVideocall = false;
    //         //             }

    //         //             // var sessdate = new Date(element?.date).toDateString();
    //         //             // var currenthours = new Date().getHours();
    //         //             // var sessionhours = new Date(sessdate + " " + element?.starthour).getHours();
    //         //             // // if (new Date(sessdate).setHours(0, 0, 0) === new Date(curTime).setHours(0, 0, 0)) {
    //         //             // if (sessionhours >= currenthours) {
    //         //             //     acceptList.push(element);
    //         //             // } else if (new Date(sessdate).setHours(0, 0, 0) >= new Date(curTime).setHours(0, 0, 0)) {
    //         //             //     acceptList.push(element);
    //         //             // }
    //         //             acnt++;
    //         //             if (response.data.result.acceptList.length === acnt) {
    //         //                 setAcceptList(acceptList);
    //         //             }
    //         //         });
    //         //     }
    //         // } else {
    //         //     setRequestList(requestList);
    //         //     setAcceptList(acceptList);
    //         // }

    //         setRequestList(response.data.result.requestList[0]?.paginatedResults);
    //         setAcceptList(acceptList);
    //         if (val) {
    //             callingRequest(objdata);
    //         }
    //     }
    //     return response;
    // }).catch(function (error) {
    //     setIsLoader(false);
    //     //window.alert(error);
    // });

    //}

    const handleInputs = (e) => {
        setReason(e.target.value);
    }

    const acceptRequest = async (e) => {

        const formData = new FormData();
        formData.append('id', e._id);
        formData.append('status', 1);
        /* document.querySelector('.loading').classList.remove('d-none'); */
        setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/trainer/session/schedulerequestupdate`, formData, {
        }).then(function (response) {
            /* document.querySelector('.loading').classList.add('d-none'); */
            setIsLoader(false);
            if (response.data.status === 1) {
                //fetchList(true, e);
                getrequestsessionList(1, true, e);
                getacceptsessionList(1);
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

    const rejectRequest = async () => {
        var errormsg = {};
        var isValid = true;
        // if (id === "") {
        //     errormsg.reason = "Please enter reason.";
        //     isValid = false;
        // }        
        if (reason === "") {
            errormsg.reason = "Please enter reason!";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid) {
            const formData = new FormData();
            formData.append('id', Id);
            formData.append('status', 2);
            formData.append('reason', reason);
            /* document.querySelector('.loading').classList.remove('d-none'); */
            setIsLoader(true);
            await axios.post(`${apiUrl}${PORT}/trainer/session/schedulerequestupdate`, formData, {
            }).then(function (response) {
                /* document.querySelector('.loading').classList.add('d-none'); */
                setIsLoader(false);
                if (response.data.status === 1) {
                    setErrors({});
                    setReason('');
                    setSessionResponseModal(false);
                    $(".modal-backdrop").removeClass("show");
                    //fetchList(false, null);
                    getrequestsessionList(1, false, null);
                    getacceptsessionList(1);
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
                window.alert(error);
                /* document.querySelector('.loading').classList.add('d-none'); */
                setIsLoader(false);
            });
        }
    }
    const callClientProfile = (id) => {
        history.push("/clientprofile?Id=" + id);
    }

    const acceptSessionActivateRequest = async (e) => {
        var sessdate = new Date(e.date).toDateString();

        var currentdate = new Date();
        var currenthours = new Date().getHours();
        currentdate.setHours(currenthours);
        currentdate.setMinutes(0);
        currentdate.setSeconds(0);
        currentdate.setMilliseconds(0);

        var sessiondate = new Date(sessdate);
        var sessionhours = new Date(sessdate + " " + e?.starthour).getHours();
        sessiondate.setHours(sessionhours);
        sessiondate.setMinutes(0);
        sessiondate.setSeconds(0);
        sessiondate.setMilliseconds(0);

        if (currentdate >= sessiondate) {
            // if ((new Date(sessdate + " " + e?.starthour).getTime() < (new Date().getTime())) && (new Date().setMinutes(new Date().getMinutes() + 60) < new Date(sessdate + " " + e?.endhour).getTime())) {
            const formData = new FormData();
            formData.append('id', e._id);
            formData.append('availablestatus', 1);
            /* document.querySelector('.loading').classList.remove('d-none'); */
            setIsLoader(true);
            await axios.post(`${apiUrl}${PORT}/trainer/session/sessionactivestatusupdate`, formData, {
            }).then(function (response) {
                /* document.querySelector('.loading').classList.add('d-none'); */
                setIsLoader(false);
                if (response.data.status === 1) {
                    //history.push('/videosession');
                    callingRequest(e);
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
        } else {
            //window.alert("Session time not match.");
            swal({
                title: "Error!",
                text: "Session time not match.",
                icon: "error",
                button: true
            })
        }
        // } else {
        //     //window.alert("Session date not match.");
        //     swal({
        //         title: "Error!",
        //         text: "Session date not match.",
        //         icon: "error",
        //         button: true
        //     })
        // }
    }

    const callingRequest = async (e) => {
        setIsLoader(true);
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
            setIsLoader(false);
            if (response.data.status === 1) {
                history.push("/calling" + "?mid=" + mid);
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
            setIsLoader(false);
            window.alert(error);
        });
    }

    const setUserDetails = (obj) => {
        setUserDetail(obj);
        setDetailModal(true);
    }
    return (
        <>
            {isLoader &&
                <div id="loader" className="loading">
                    <div className="mainloader"></div>
                </div>
            }

            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-6">
                        <h1 className="main_title mb-4">Session Requests</h1>
                    </div>
                </div>
                {requestList.length > 0 ?
                    <><div className="col-md-12 p-0">
                        <div className="row">
                            {requestList.map((item, index) => {
                                return (
                                    <div key={'index' + index} className="col-md-3" onClick={(e) => { e.stopPropagation(); setUserDetails(item); }}>
                                        <div className="lightbg">
                                            <img src={`${apiUrl}${PORT}${item.user_data.profile}`} alt='Profile' onError={(e) => { e.target.src = "/img/Small-no-img.png" }} className="mx-auto d-block" />
                                            {/* {item.user_data.coverprofile ? */}
                                            {/* /* :
                                                <div>{item.user_data.firstname.substring(0, 1).toUpperCase()}</div>
                                            } */ }
                                            <h6 className="text-center font-weight-bold">{item.user_data.firstname}{item.user_data.lastname}</h6>
                                            <ul className="list-inline">
                                                <li className="text-center text-primary"><i className="far fa-calendar pr-2"></i> {new Date(item.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' })}</li>
                                                <li className="text-center text-primary"><i className="fas fa-clock pr-2"></i>{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]}-{item.endhour.split(':')[0] + ":" + item.endhour.split(':')[1]}</li>
                                            </ul>
                                            <div onClick={(e) => { e.stopPropagation(); }} className="adblock d-flex justify-content-between">
                                                <button onClick={(e) => { e.stopPropagation(); acceptRequest(item) }} className="Accept">Accept</button>
                                                <button onClick={(e) => { e.stopPropagation(); setId(item._id); setSessionResponseModal(true); }} className="Decline mr-0 w-100" data-toggle="modal" data-target="#Rejection">Decline</button>
                                            </div>
                                        </div>
                                    </div>)
                            })}

                            <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                <Pagination className="pagination-bar" currentPage={rpageNum} totalCount={rnoOfRecords}
                                    pageSize={rlimitValue} onPageChange={page => rcurPage(page)} />
                            </div>
                        </div>
                    </div>
                    </>
                    :
                    <>{
                        !isLoader &&
                        <div className="col-12 p-0 mb-4">
                            <h4 className="no-record-box">
                                <i className="fa fa-exclamation-triangle alerticon"></i>
                                No Session requests found!
                            </h4>
                        </div>
                    }</>
                }
                {acceptList.length > 0 ?
                    <><div className="col-md-12 p-0">
                        <h1 className="main_title mb-4 mt-0">Upcoming Session</h1>
                        <div className="row">
                            {acceptList.map((item, index) => {
                                return (<div key={'index' + index} className="col-xl-4 col-lg-6">
                                    <div className="upcomingblock">
                                        <div className="row">
                                            <div className="col-md-2">
                                                <img src={`${apiUrl}${PORT}${item.user_data.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt='Profile' />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="sessioninfo">
                                                    <h6 className="font-weight-bold" onClick={() => { callClientProfile(item.user_data._id); }}>{item.user_data.firstname} {item.user_data.lastname}</h6>
                                                    <ul className="list-inline">
                                                        <li className="list-inline-item  text-primary">{new Date(item.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' })}</li>
                                                        <li className="list-inline-item text-primary">{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]}-{item.endhour.split(':')[0] + ":" + item.endhour.split(':')[1]}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                {item.isVideocall > 0 ?
                                                    <><div onClick={() => { acceptSessionActivateRequest(item); }}><i className="fas fa-video sessionicon"></i></div></>
                                                    :
                                                    <><div><i className="fas fa-video sessionicon-dis"></i></div></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            })}

                            <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                <Pagination className="pagination-bar" currentPage={apageNum} totalCount={anoOfRecords}
                                    pageSize={alimitValue} onPageChange={page => acurPage(page)} />
                            </div>
                        </div>
                    </div>
                    </>
                    :
                    <>{
                        !isLoader &&
                        <div className="col-12 p-0">
                            <h4 className="no-record-box">
                                <i className="fa fa-exclamation-triangle alerticon"></i>
                                No upcoming session found!
                            </h4>
                        </div>
                    }</>
                }
            </div>
            {/* <Link to="/sessiondetails" className="loginbtn w-25 float-right">Session Detail</Link> */}
            {/* <div className={`modal fade ${sessionResponseModal === false ? "" : "show"}`} style={{ display: `${sessionResponseModal === false ? "none" : "block"}` }} id="Rejection" role="dialog">
                <div className="modal-dialog modal-dialog-centered sessionbody" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <div className="col-md-12 col-12">
                                <h6 className="text-primary mb-3">Reason For Rejection</h6>
                                <div className="mb-4">
                                    <textarea onChange={(e) => handleInputs(e)} value={reason} className="w-100 Sessionrej text-primary" placeholder="Enter Reason"></textarea>
                                    <div className="text-danger">{errors.reason}</div>
                                    <div className="training_btn" onClick={() => { rejectRequest() }} >Submit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <Modal show={sessionResponseModal} onHide={rejectRequestClose} className="sessionbody" size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title className="book-title mb-0 modal-title h4 pl-5 pt-3">Reason For Rejection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12 col-12">
                        <h6 className="text-primary mb-3">Write reason for rejection</h6>
                        <div className="mb-4">
                            <textarea onChange={(e) => handleInputs(e)} value={reason} className="w-100 Sessionrej text-primary mb-0" placeholder="Enter Reason"></textarea>
                            <div className="text-danger">{errors.reason}</div>
                        </div>
                    </div>
                    <div className="col-md-12 col-12"><Button className="training_btn mb-3" onClick={(e) => { rejectRequest() }}>Submit</Button></div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button className="btn cancel_btn" onClick={(e) => { setErrors({}); setReason(''); setSessionResponseModal(false); }} >Close</Button>
                </Modal.Footer> */}
            </Modal>

            <Modal show={detailModal} onHide={handleClose} size="md" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="bg-transparent text-dark border-0 session-m" closeButton>
                    <Modal.Title className="book-title mb-0 modal-title h4 pl-3 pt-3">Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12 col-12">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <tr>
                                    <th>Profile</th>
                                    <td>
                                        <img className="p-photo" src={apiUrl + PORT + userDetail?.user_data?.profile} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} style={{ width: 'auto', height: '100px' }} alt="Profile" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <td>{userDetail?.user_data?.firstname} {userDetail?.user_data?.lastname}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{userDetail?.user_data?.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone No</th>
                                    <td>{userDetail?.user_data?.phoneno}</td>
                                </tr>
                            </table>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn cancel_btn" onClick={handleClose} >Close</Button>
                </Modal.Footer>
            </Modal>

            {/* <div className={`modal fade ${detailModal === false ? "" : "show"}`} style={{ display: `${detailModal === false ? "none" : "block"}` }} id="detail" role="dialog">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered detailmodal" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="mb-0">Details</h6>
                            <button type="button" onClick={() => { setDetailModal(false); }} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        {<tr>
                                            <th>CoverProfile</th>
                                            <td>
                                                <img className="p-photo" src={userDetail?.user_data?.coverprofile} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} style={{ width: 'auto', height: '100px' }} alt="Cover Profile" />
                                            </td>
                                        </tr>}
                                        <tr>
                                            <th>Profile</th>
                                            <td>
                                                <img className="p-photo" src={apiUrl + PORT + userDetail?.user_data?.profile} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} style={{ width: 'auto', height: '100px' }} alt="Profile" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Name</th>
                                            <td>{userDetail?.user_data?.firstname} {userDetail?.user_data?.lastname}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{userDetail?.user_data?.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Phone No</th>
                                            <td>{userDetail?.user_data?.phoneno}</td>
                                        </tr>
                                        <tr>
                                            <th>Qualifications</th>
                                            <td>{userDetail?.user_data?.qualifications?.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Certifications</th>
                                            <td>{userDetail?.user_data?.certifications?.name}</td>
                                        </tr>
                                        <tr>
                                            <th>About Us</th>
                                            <td>{userDetail?.user_data?.aboutus}</td>
                                        </tr>
                                        <tr>
                                            <th>Quote</th>
                                            <td>{userDetail?.user_data?.quote}</td>
                                        </tr>
                                        <tr>
                                            <th>Training Style</th>
                                            <td>{userDetail?.user_data?.trainingstyle}</td>
                                        </tr>
                                    </table>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer text-center">
                            <div className="col-md-6 col-12 mx-auto">
                                <div className="training_btn" onClick={() => { setDetailModal(false); }} >Close</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}

export default ScheduleRequest;
