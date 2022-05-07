import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { Collapse, Modal } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';

function Trainer({ type, flterValue }) {
    const history = useHistory();
    const [allList, setAllList] = useState([]);
    const [List, setList] = useState([]);
    const [workoutList, setWorkOutList] = useState([]);
    const [sessionBook, setSessionBook] = useState('');
    const [status, setStatus] = useState();
    const [isLoader, setIsLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmReqModal, setConfirmReqModal] = useState(false);
    const [startDateStr, setStartDateStr] = useState('');
    const [startTimeStr, setStartTimeStr] = useState('');
    const selectedStartTime = new Date();
    const selectedStartDate = new Date();
    const [pageNum, setPageNum] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(0);
    var noOfRec = 0;
    var actualnoOfRec = 0;
    var isLoaderVal = false;
    const limitValue = 9;
    const queryStringPara = new URLSearchParams(window.location.search);
    let currentStatus = queryStringPara.get("status") || 1;
    const [filterObj, setFilterObj] = useState({ availablestatus: parseInt(currentStatus), name: "", isfilter: false, isStandardTrainers: true, ratings: "", typeOfWorkout: "", gender: "", type: "", limitValue: limitValue, pageNumber: pageNum });
    const prevScrollY = useRef(0);
    const [goingUp, setGoingUp] = useState(false);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var allTrainerList = [];
    useEffect(() => {
        document.body.classList.add('scrollHide');
        callToken();
        getTypeOfWorkout();
        GetList((status || parseInt(currentStatus)), 1);
    }, []);

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }

    const loadData = async (list, bookmarktrainer, status) => {
        let finalList = [];
        for (var i = 0; i < 3; i++) {
            finalList.push({ "id": i + 1, "List": [], "bookmarktrainerList": bookmarktrainer });
        }
        for (var j = 0; j < list.length; j++) {
            for (var k = 0; k < finalList.length; k++) {
                if (j < list.length)
                    finalList[k].List.push(list[j]);
                if (k < finalList.length - 1)
                    j++;
            }
        }
        if (list.length === 0) {
            const updatedList = <div className="col-12">
                <h4 className="no-record-box">
                    <i className="fa fa-exclamation-triangle alerticon"></i>
                    No Record Found
                </h4>
            </div>
            setList(updatedList);
            setIsLoader(false);
        }
        else {
            const updatedList = finalList.map((listitem, index) => {
                return (<div key={'mainkey' + index} className="col-xl-4 col-md-6 col-12">
                    <div className="loading d-none">
                        <div className="mainloader"></div>
                    </div>
                    <div className="wrap" style={{ height: '95%', overflow: 'auto', paddingRight: '5px' }}>
                        <div className="frame smart" onScroll={onScrollDown} id={'smart' + index} style={{ overflow: 'auto', height: '800px', scrollbarWidth: 'none' }}>
                            <ul className="items">
                                {listitem.List.filter(tainerlist => tainerlist.availablestatus === status || status === 0).map((tainerlist, sindex) => {
                                    return (<li key={'subkey' + sindex} className="col-12 p-0">
                                        <div title={tainerlist.firstname}>
                                            <div className="banner-img">
                                                <img src={`${apiUrl + PORT + tainerlist.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} alt="" />
                                                <div className="img-content">
                                                    <div className="banner-i d-flex justify-content-between">
                                                        <span>{tainerlist.type || ''}</span>
                                                        <button className="bookmark" onClick={(e) => { e.preventDefault(); bookmarkTainer(tainerlist, status); }}>
                                                            <i className={`${(listitem.bookmarktrainerList.filter(f => f === tainerlist._id).length > 0) ? "fa" : "far"} fa-bookmark`}></i>
                                                        </button>
                                                    </div>
                                                    <div className="banner-user">
                                                        <div className="d-sm-flex justify-content-between">
                                                            <div className="d-flex">
                                                                <Link to={'/trainerinformation?Id=' + tainerlist._id} title={tainerlist.firstname} className="user-name">
                                                                    <div className="user-pro">
                                                                        <img src={`${apiUrl + PORT + tainerlist.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt="" />
                                                                    </div>
                                                                    <div className="">
                                                                        {/* <span>{tainerlist.firstname} {tainerlist.averageRating.toFixed(2)} {Math.round(tainerlist.averageRating.toFixed(2))}</span> */}
                                                                        <span>{tainerlist.firstname}</span>
                                                                        <i className={tainerlist.availablestatus === 1 ? "fas fa-circle text-success circle-i" : (tainerlist.availablestatus === 2 ? "fas fa-circle text-danger circle-i" : "fas fa-circle text-secondary circle-i")}></i>
                                                                        <Rating ratingValue={tainerlist.averageRating * 20} size="20" readonly="true" allowHover="false" allowHalfIcon="true" />
                                                                        <p className="mb-0">
                                                                            {tainerlist.trainingstyle !== "" && tainerlist.trainingstyle ?
                                                                                <span>{tainerlist.trainingstyle.substr(1, 10)}</span> : <></>
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="">
                                                                {(status !== 1) ?
                                                                    <>
                                                                        <Link to={`/mysession`} className="banner-btn">Start Training</Link>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Link onClick={(e) => { e.preventDefault(); postSendRequest(tainerlist); }} className="banner-btn">Start Training</Link>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>)
                                })}
                            </ul>
                        </div>
                    </div>
                </div>)
            });
            setIsLoader(false);
            setList(updatedList);
        }
    };

    const bookmarkTainer = async (e, status) => {
        const formData = new FormData();
        formData.append('tainerId', e._id);
        setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/client/bookmarktrainer`, formData, {
        }).then(function (response) {
            setIsLoader(false);
            if (response.data.status === 1) {
                GetList(status, 1);
            }
            else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                });
            }
        }).catch(function (error) {
            console.log(error);
            setIsLoader(false);
        });
    }

    const onScrollDown = () => {
        if (isLoaderVal === true || noOfRec <= actualnoOfRec) {
            return;
        } else {
            setIsLoader(true);
            isLoaderVal = true;
            const queryStringPara = new URLSearchParams(window.location.search);
            let currentStatus = queryStringPara.get("status") || 1;
            var newpageNum = pageNum;
            GetList(parseInt(currentStatus), newpageNum + 1);
            setPageNum(newpageNum);
        }
    }

    async function GetList(status, val) {
        filterObj.isfilter = false;
        var trainerfilterObj = filterObj;
        trainerfilterObj.availablestatus = status;
        trainerfilterObj.pageNumber = val;
        trainerfilterObj.name = flterValue;
        trainerfilterObj.isfilter = flterValue ? true : false;
        setIsLoader(true);
        setStatus(status);
        await axios.post(`${apiUrl}${PORT}/trainer/trainer/maintrainerlist`, trainerfilterObj).then(function (response) {
            if (response.data.status === 1) {
                // response.data.result.trainerlist.bookmarktrainer = response.data?.result?.client_data?.bookmarktrainer;
                // loadData(response.data?.result?.trainerlist, response.data?.result?.client_data?.bookmarktrainer, status);
                setNoOfRecords(response.data?.result?.noOfRecords || 0);
                noOfRec = response.data?.result?.noOfRecords || 0;
                //setCompletedList(response.data?.result?.trainerlist[0]?.paginatedResults);

                var tempList = [];
                if (allTrainerList === null || allTrainerList === undefined || allTrainerList.length <= 0) {
                    tempList = response.data?.result?.trainerlist;
                } else {
                    if (noOfRec >= allTrainerList.length) {
                        tempList = allTrainerList;
                        for (let index = 0; index < response.data?.result?.trainerlist.length; index++) {
                            tempList.push(response.data?.result?.trainerlist[index]);
                        }
                    }
                }
                actualnoOfRec = tempList.length || 0;
                allTrainerList = tempList;
                setAllList(tempList);
                loadData(tempList, response.data?.result?.client_data?.bookmarktrainer, status);
            }
            else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                })
            }
            isLoaderVal = false;
        }).catch(function (error) {
            setIsLoader(false);
            console.log(error);
        });
        // setIsLoader(true);
        // var obj = {
        //     availablestatus: status,
        //     isfilter: false,
        //     limitValue: limitValue,
        //     pageNumber: (val * 1)
        // };

        // await axios.post(`${apiUrl}${PORT}/trainer/trainer/maintrainerlist`, obj).then(function (response) {
        //     if (response.data.status === 1) {
        //         setNoOfRecords(response.data?.result?.trainerlist[0]?.totalCount[0]?.count || 0);
        //         //setCompletedList(response.data?.result?.trainerlist[0]?.paginatedResults);

        //         var tempList = [];
        //         if (allList == null || allList == undefined || allList.length <= 0) {
        //             tempList = response.data?.result?.trainerlist[0]?.paginatedResults;
        //         } else {
        //             tempList = allList;
        //             for (let index = 0; index < response.data?.result?.trainerlist[0]?.paginatedResults.length; index++) {
        //                 tempList.push(response.data?.result?.trainerlist[0]?.paginatedResults[index]);
        //             }
        //         }
        //         setAllList(tempList);
        //         loadData(tempList, response.data?.result?.client_data?.bookmarktrainer, status);


        //     }
        // }).catch(function (error) {
        //     setIsLoader(false);
        // });
    };

    async function getTypeOfWorkout() {
        setIsLoader(true);
        await axios.get(`${apiUrl}${PORT}/trainer/trainer/getworkoutcategory`, {}, {})
            .then(function (response) {
                if (response.data.status === 1)
                    setWorkOutList(response.data.result);
                else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    });
                }
            }).catch(function (error) {
                setIsLoader(false);
                window.alert(error);
            });
    };

    const onSubmitFilter = async (objName, val) => {
        filterObj.isfilter = true;

        var trainerfilterObj = filterObj;
        trainerfilterObj.availablestatus = parseInt(currentStatus);
        if (val) {
            trainerfilterObj[objName] = val;
            setFilterObj(prevState => ({ ...prevState, [objName]: val }));
        }

        setIsLoader(true);
        await axios.post(`${apiUrl}${PORT}/trainer/trainer/maintrainerlist`, trainerfilterObj).then(function (response) {
            if (response.data.status === 1) {
                // response.data.result.trainerlist.bookmarktrainer = response.data?.result?.client_data?.bookmarktrainer;
                // loadData(response.data?.result?.trainerlist, response.data?.result?.client_data?.bookmarktrainer, status);
                setNoOfRecords(response.data?.result?.noOfRecords || 0);
                noOfRec = response.data?.result?.noOfRecords || 0;
                //setCompletedList(response.data?.result?.trainerlist[0]?.paginatedResults);

                var tempList = [];
                if (allTrainerList.length <= 0) {
                    tempList = response.data?.result?.trainerlist;
                } else {
                    tempList = allTrainerList;
                    for (let index = 0; index < response.data?.result?.trainerlist.length; index++) {
                        tempList.push(response.data?.result?.trainerlist[index]);
                    }
                }
                setAllList(tempList);
                loadData(tempList, response.data?.result?.client_data?.bookmarktrainer, status);
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
            console.log(error);
        });
    }

    const postSendRequest = async (trainer_data) => {
        let isSubmit = true;
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
                'trainerid': trainer_data._id,
                'date': selectedStartDate,
                'starthour': formatDate(sTime),
                'endhour': formatDate(endTime),
                'startdatetime': ssdate,
                'enddatetime': endate,
                'requestType': 1
            }

            setStartDateStr(selectedStartDate.getDate() + ' ' + monthNames[selectedStartDate.getMonth()]);
            setStartTimeStr(sTime.getHours() + ':' + sTime.getMinutes() + ' - ' + endTime.getHours() + ':' + endTime.getMinutes());
            setSessionBook(trainer_data?.firstname);

            setIsLoader(true);
            await axios.post(`${apiUrl}${PORT}/client/session/sessionrequest`, obj, {
            }).then(function (response) {
                setIsLoader(false);
                if (response.data.status === 1) {
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
    const clearObj = () => {
        const queryStringPara = new URLSearchParams(window.location.search);
        let currentStatus = queryStringPara.get("status") || 1;
        setFilterObj({
            ...filterObj,
            availablestatus: parseInt(currentStatus),
            isfilter: false,
            isStandardTrainers: true,
            ratings: '',
            typeOfWorkout: '',
            gender: '',
            type: '',
        });
        GetList(parseInt(currentStatus), 1)
    }
    return (
        <>{isLoader &&
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
                                                <span className="float-md-left">Cross-Fit with {sessionBook}</span>
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
                <div className="col-12 p-0">
                    <div className="row mb-3">
                        <div className="col-md-2 col-12">
                            <h1 className="main_title">Trainers</h1>
                        </div>
                        <div className="col-md-10 col-12">
                            <ul className="filter_nav list-inline">
                                <li className={`list-inline-item ${status === 1 ? "active" : ""}`} onClick={() => { GetList(1, 1); history.push('/trainer?status=1') }}> <button>Available Now</button></li>
                                <li className={`list-inline-item ${status === 2 ? "active" : ""}`} onClick={() => { GetList(2, 1); history.push('/trainer?status=2') }}><button>Online</button></li>
                                <li className={`list-inline-item ${status === 0 ? "active" : ""}`} onClick={() => { GetList(0, 1); history.push('/trainer?status=0') }}><button>All</button></li>
                            </ul>
                        </div>
                    </div>
                    {type === "openFilter" &&
                        <div>
                            <div className="row filter-box">
                                <div className="col-md-5 col-12 mb-3">
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" checked={filterObj.type === 'Standard' ? true : false} onChange={(e) => { onSubmitFilter("type", (e.currentTarget.checked === true ? "Standard" : "ELite")) }} />
                                        <label className="custom-control-label" htmlFor="customRadioInline1">Standard Trainers</label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" checked={filterObj.type === 'ELite' ? true : false} onChange={(e) => { onSubmitFilter("type", (e.currentTarget.checked === true ? "ELite" : "Standard")) }} />
                                        <label className="custom-control-label" htmlFor="customRadioInline2">Elite Trainers</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row filter-input mb-3">
                                        <div className="col-md-3 col-12">
                                            <div className="position-relative">
                                                <label>Ratings</label>
                                                <select className="input-box" value={filterObj.ratings} onChange={(e) => { onSubmitFilter("ratings", e.target.value) }}>
                                                    <option value={''}>Select order</option>
                                                    <option value={1}>Ascending</option>
                                                    <option value={-1}>Descending </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <div className="position-relative">
                                                <label>Type Of Workout</label>
                                                <select className="input-box" value={filterObj.typeOfWorkout} onChange={(e) => { onSubmitFilter("typeOfWorkout", e.target.value) }}>
                                                    <option>Choose Workout</option>
                                                    {workoutList.map(({ _id, name }, index1) => <option key={'wprkoptionkey' + index1} value={name} >{name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <div className="position-relative">
                                                <label>Gender</label>
                                                <select className="input-box" value={filterObj.gender} onChange={(e) => { onSubmitFilter("gender", e.target.value) }}>
                                                    <option value={''}>Select gender</option>
                                                    <option value={'Male'}>Male</option>
                                                    <option value={'Female'}>Female</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <div className="training_btn mt-4" onClick={() => { clearObj() }}>Cancel</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="row">
                        {List}
                    </div>
                </div>
            </div>


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
                        <button className="checkbtn" onClick={() => setOpen(true)} aria-controls="session-book" data-dismiss="modal" aria-expanded={open}>
                            <i className="far fa-check-circle check-i"></i>
                            <h4 className="book-title">Awaiting confirmation from Trainer.</h4>
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Trainer;