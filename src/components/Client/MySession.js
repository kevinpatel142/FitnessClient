import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
import Pagination from '../Pagination/Pagination';

function MySession() {
    const history = useHistory();
    const [upcomingList, setUpcomingList] = useState([]);
    const [completedList, setCompletedList] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [ucpageNum, setucPageNum] = useState(1);
    const [ucnoOfRecords, setucNoOfRecords] = useState(0);
    const uclimitValue = 6;
    const [cpageNum, setcPageNum] = useState(1);
    const [cnoOfRecords, setcNoOfRecords] = useState(0);
    const climitValue = 6;

    useEffect(() => {
        callToken();
        // fetchList();
        getupcommingsessionList(1);
        getcompeletedsessionList(1);
    }, []);

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }

    // const fetchList = async () => {
    //     setIsLoader(true);
    //     var obj = {
    //         limitValue: limitValue,
    //         pageNumber: (val || pageNum)
    //     };

    //     await axios.get(`${apiUrl}${PORT}/client/session/getclientsession`, obj, {}
    //     ).then(function (response) {
    //         setIsLoader(false);
    //         if (response.data.status === 1) {
    //             var upcomingList = [];//response.data.result.upcomingList;
    //             var completedList = [];//response.data.result.completedList;
    //             var curTime = new Date().toDateString();
    //             var acnt = 0; var rcnt = 0;


    //             if (response?.data?.result) {
    //                 if (response?.data?.result?.upcomingList.length > 0) {
    //                     response?.data?.result?.upcomingList.forEach(element => {

    //                         var sessdate = new Date(element?.date).toDateString();
    //                         var currentdate = new Date();
    //                         var currenthours = new Date().getHours();
    //                         var currentminutes = new Date().getMinutes();
    //                         currentdate.setHours(currenthours);
    //                         currentdate.setMinutes(currentminutes);
    //                         currentdate.setSeconds(0);
    //                         currentdate.setMilliseconds(0);

    //                         var sessiondate = new Date(sessdate + " " + element?.endhour);
    //                         var sessionhours = new Date(sessdate + " " + element?.endhour).getHours();
    //                         sessiondate.setHours(sessionhours);
    //                         sessiondate.setMinutes(0);
    //                         sessiondate.setSeconds(0);
    //                         sessiondate.setMilliseconds(0);
    //                         if (currentdate < sessiondate) {
    //                             upcomingList.push(element);
    //                         }

    //                         rcnt++;
    //                         if (response.data.result.upcomingList.length === rcnt) {
    //                             setUpcomingList(upcomingList);
    //                         }
    //                     });
    //                 }
    //                 if (response?.data?.result?.completedList.length > 0) {
    //                     response?.data?.result?.completedList.forEach(element => {

    //                         var sessdate = new Date(element?.date).toDateString();
    //                         var currentdate = new Date();
    //                         var currenthours = new Date().getHours();
    //                         currentdate.setHours(currenthours);
    //                         currentdate.setMinutes(0);
    //                         currentdate.setSeconds(0);
    //                         currentdate.setMilliseconds(0);

    //                         var sessiondate = new Date(sessdate + " " + element?.endhour);
    //                         var sessionhours = new Date(sessdate + " " + element?.endhour).getHours();
    //                         sessiondate.setHours(sessionhours);
    //                         sessiondate.setMinutes(0);
    //                         sessiondate.setSeconds(0);
    //                         sessiondate.setMilliseconds(0);
    //                         if (currentdate >= sessiondate) {
    //                             completedList.push(element);
    //                         }

    //                         acnt++;
    //                         if (response.data.result.completedList.length === acnt) {
    //                             setCompletedList(completedList);
    //                         }
    //                     });
    //                 }
    //             } else {
    //                 setUpcomingList(upcomingList);
    //                 setCompletedList(completedList);
    //             }
    //         }
    //         return response;
    //     }).catch(function (error) {
    //         setIsLoader(false);
    //         window.alert(error);
    //     });
    // }

    const uccurPage = (pageNum) => {
        setucPageNum(pageNum);
        getupcommingsessionList(pageNum);
    }

    const ccurPage = (pageNum) => {
        setcPageNum(pageNum);
        getcompeletedsessionList(pageNum);
    }

    const getupcommingsessionList = async (val) => {
        setIsLoader(true);
        var obj = {
            limitValue: uclimitValue,
            pageNumber: (val || ucpageNum)
        };

        await axios.post(`${apiUrl}${PORT}/client/session/getupcommingsession`, obj, {}
        ).then(function (response) {
            /* setIsLoader(false); */
            if (response.data.status === 1) {
                //var tempupcomingList = [];

                if (response?.data?.result) {
                    setucNoOfRecords(response.data?.result[0]?.totalCount[0]?.count || 0);
                    setUpcomingList(response.data?.result[0]?.paginatedResults);
                } else {
                    setUpcomingList([]);
                }
            }
            return response;
        }).catch(function (error) {
            setIsLoader(false);
            window.alert(error);
        });
    }

    const getcompeletedsessionList = async (val) => {
        setIsLoader(true);
        var obj = {
            limitValue: climitValue,
            pageNumber: (val || cpageNum)
        };

        await axios.post(`${apiUrl}${PORT}/client/session/getcompeletedsession`, obj, {}
        ).then(function (response) {
            setIsLoader(false);
            if (response.data.status === 1) {
                var tempcompletedList = [];
                if (response?.data?.result) {
                    setcNoOfRecords(response.data?.result[0]?.totalCount[0]?.count || 0);
                    setCompletedList(response.data?.result[0]?.paginatedResults);
                    // response.data?.result[0]?.paginatedResults.forEach(element => {
                    //     var sessdate = new Date(element?.date).toDateString();
                    //     var currentdate = new Date();
                    //     var currenthours = new Date().getHours();
                    //     currentdate.setHours(currenthours);
                    //     currentdate.setMinutes(0);
                    //     currentdate.setSeconds(0);
                    //     currentdate.setMilliseconds(0);

                    //     var sessiondate = new Date(sessdate + " " + element?.endhour);
                    //     var sessionhours = new Date(sessdate + " " + element?.endhour).getHours();
                    //     sessiondate.setHours(sessionhours);
                    //     sessiondate.setMinutes(0);
                    //     sessiondate.setSeconds(0);
                    //     sessiondate.setMilliseconds(0);
                    //     if (currentdate >= sessiondate) {
                    //         tempcompletedList.push(element);
                    //     }
                    // });
                    // setCompletedList(tempcompletedList);
                } else {
                    setCompletedList([]);
                }
            }
            return response;
        }).catch(function (error) {
            setIsLoader(false);
            window.alert(error);
        });
    }

    return (
        <>
            {isLoader &&
                <div id="loader" className="loading">
                    <div className="mainloader"></div>
                </div>
            }
            <div className="container-fluid">
                <div className="col-md-12 col-12 p-0">
                    <div className="row mb-3">
                        <div className="col-md-12 col-12">
                            <h1 className="main_title">My Session</h1>
                        </div>
                    </div>
                    <div className="row">
                        {!isLoader && (upcomingList.length === 0) ?
                            <div className="col-12">
                                <h4 className="no-record-box">
                                    <i className="fa fa-exclamation-triangle alerticon"></i>
                                    No session found!
                                </h4>
                            </div>
                            : ""}
                        {!isLoader && (completedList.length === 0) ?
                            <div className="col-12">
                                <h4 className="no-record-box">
                                    <i className="fa fa-exclamation-triangle alerticon"></i>
                                    No session found!
                                </h4>
                            </div>
                            : ""}
                    </div>
                    {upcomingList.length > 0 && (
                        <>
                            <div className="row">
                                {upcomingList.map((item, index) => (
                                    <div key={'index' + index} className="col-md-4 col-12 mb-3 cursor-pointer">
                                        <div className="session-imgblock">
                                            <img src={`${apiUrl + PORT + item.trainer_data.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png"; }} alt='Profile' />
                                        </div>
                                        <div className="my-session-content">
                                            <p className="session-title">{item.trainer_data.firstname}</p>
                                            <div className="d-flex justify-content-between">
                                                <div className="session-time">
                                                    <span className="s-whitebox"><i className="far fa-calendar pr-1"></i>{new Date(item.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</span>
                                                    <span className="s-whitebox"><i className="far fa-clock pr-1"></i>{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]}</span>
                                                </div>
                                                <div className="banner-btn mt-0 cursor-pointer" onClick={() => { history.push(`/booksessionsdetail?id=${item._id}&type=My Session`) }}>Start Training</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                    <Pagination className="pagination-bar" currentPage={ucpageNum} totalCount={ucnoOfRecords}
                                        pageSize={uclimitValue} onPageChange={page => uccurPage(page)} />
                                </div>
                            </div>
                        </>
                    )}
                    {completedList.length > 0 && (
                        <div className="row">
                            <div className="col-md-12 col-12 mb-3">
                                <h1 className="main_title">Completed Sessions</h1>
                            </div>
                            <>
                                {completedList.map((item, index) => (
                                    <div key={'index' + index} className="col-md-4 col-12 mb-3">
                                        <div className="session-imgblock">
                                            <img src={`${apiUrl + PORT + item.trainer_data.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} alt='Profile' />
                                        </div>
                                        <div className="my-session-content">
                                            <p className="session-title">Strength with {item.trainer_data.firstname}</p>
                                            <div className="d-flex justify-content-between">
                                                <div className="session-time">
                                                    <span className="s-whitebox"><i className="far fa-calendar pr-1"></i>{new Date(item.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</span>
                                                    <span className="s-whitebox"><i className="far fa-clock pr-1"></i>{item.starthour.split(':')[0] + ":" + item.starthour.split(':')[1]}</span>
                                                </div>
                                                <div className="banner-btn mt-0 cursor-pointer" onClick={() => { history.push(`/booksessionsdetail?id=${item._id}&type=Completed Sessions`) }}><i className="fas fa-redo fa-rotate-270 p-1"></i>Train Again</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>

                            <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                <Pagination className="pagination-bar" currentPage={cpageNum} totalCount={cnoOfRecords}
                                    pageSize={climitValue} onPageChange={page => ccurPage(page)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MySession;