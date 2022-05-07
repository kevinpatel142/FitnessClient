import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
import Pagination from '../Pagination/Pagination';
function SavedTrainer({ type, flterValue }) {
    const [List, setList] = useState([]);
    const [bookmarkTrainerList, setbookmarkTrainerList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(0);
    const limitValue = 6;
    function initScroll() {
        // $(".smart").each(function () {
        //     var $frame = $(this);
        //     var $slidee = $frame.children("ul").eq(0);
        //     var $wrap = $frame.parent();

        //     // Call Sly on frame
        //     $frame.sly({
        //         itemNav: "basic",
        //         smart: 1,
        //         activateOn: "click",
        //         mouseDragging: 1,
        //         touchDragging: 1,
        //         releaseSwing: 1,
        //         startAt: 0,
        //         scrollBar: $wrap.find(".scrollbar"),
        //         pagesBar: $wrap.find(".pages"),
        //         activatePageOn: "click",
        //         speed: 300,
        //         elasticBounds: 1,
        //         easing: "easeOutExpo",
        //         dragHandle: 1,
        //         dynamicHandle: 1,
        //         clickBar: 1,

        //         // Scrolling
        //         scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
        //         scrollBy: 1, // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
        //         scrollHijack: 100, // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
        //         scrollTrap: 1, // Don't bubble scrolling when hitting scrolling limits.

        //         // Buttons
        //         forward: $wrap.find(".forward"),
        //         backward: $wrap.find(".backward"),
        //         prev: $wrap.find(".prev"),
        //         next: $wrap.find(".next"),
        //         prevPage: $wrap.find(".prevPage"),
        //         nextPage: $wrap.find(".nextPage")
        //     });

        //     // To Start button
        //     $wrap.find(".toStart").on("click", function () {
        //         var item = $(this).data("item");
        //         // Animate a particular item to the start of the frame.
        //         // If no item is provided, the whole content will be animated.
        //         $frame.sly("toStart", item);
        //     });

        //     // To Center button
        //     $wrap.find(".toCenter").on("click", function () {
        //         var item = $(this).data("item");
        //         // Animate a particular item to the center of the frame.
        //         // If no item is provided, the whole content will be animated.
        //         $frame.sly("toCenter", item);
        //     });

        //     // To End button
        //     $wrap.find(".toEnd").on("click", function () {
        //         var item = $(this).data("item");
        //         // Animate a particular item to the end of the frame.
        //         // If no item is provided, the whole content will be animated.
        //         $frame.sly("toEnd", item);
        //     });

        //     // Add item
        //     $wrap.find(".add").on("click", function () {
        //         $frame.sly("add", "<li>" + $slidee.children().length + "</li>");
        //     });

        //     // Remove item
        //     $wrap.find(".remove").on("click", function () {
        //         $frame.sly("remove", -1);
        //     });
        // });        
    }

    //Onload event set here.
    useEffect(() => {
        callToken();
        GetList(1);
        //initScroll();
        scrollBody();
    }, []);
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const curPage = (pageNum) => {
        setPageNum(pageNum);
        GetList(pageNum);
    }
    const scrollBody = (event) => {
        document.body.classList.add('scrollHide');
    }
    const loadData = async (list) => {
        let finalList = [];
        //Make array of 3 sections
        for (var i = 0; i < 3; i++) {
            finalList.push({ "id": i + 1, "List": [], "bookmarktrainerList": list.bookmarktrainer });
        }
        for (var j = 0; j < list.length; j++) {
            for (var k = 0; k < finalList.length; k++) {
                if (j < list.length)
                    finalList[k].List.push(list[j]);
                if (k < finalList.length - 1)//Last k we need to skip it
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
        }
        else {
            const updatedList = finalList.map((listitem, index) => {
                return (<div key={'mainkey' + index} className="col-md-4 col-12">
                    <div className="loading d-none">
                        <div className="mainloader"></div>
                    </div>
                    <div className="wrap" style={{ height: '95%', overflow: 'auto', paddingRight: '5px' }}>
                        <div className="frame smart" id={'smart' + index} style={{ height: 'auto', scrollbarWidth: 'none' }}>
                            <ul key={'mainulkey' + index} className="items">
                                {listitem.List.map((tainerlist, sindex) => {
                                    //if (status === 0 || tainerlist.availablestatus === status) {
                                    return <><li key={'subkey' + sindex} className="col-12 p-0">
                                        <Link to={'/trainerinformation?Id=' + tainerlist._id} title={tainerlist.firstname}>
                                            <div className="banner-img">
                                                {/* <img src={`${tainerlist.coverprofile}`} onError={(e) => { e.target.src = "/img/crossfit.jpg" }} alt="" /> */}
                                                <img src={`${apiUrl + PORT + tainerlist.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} alt="" />
                                                <div className="img-content">
                                                    <div className="banner-i d-flex justify-content-between">
                                                        <span>{tainerlist.type || ''}</span>
                                                        <button className="bookmark" onClick={(e) => { e.preventDefault(); bookmarkTainer(tainerlist); }}>
                                                            <i className={`${(listitem.bookmarktrainerList.filter(f => f === tainerlist._id).length > 0) ? "fa" : "far"} fa-bookmark`}></i>
                                                        </button>
                                                    </div>
                                                    <div className="banner-user">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex">
                                                                <div className="user-pro">
                                                                    <img src={`${apiUrl + PORT + tainerlist.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt="" />
                                                                    {/* {tainerlist.profile !== "" && tainerlist.profile ?
                                                                            <img src={`${apiUrl + PORT +tainerlist.profile}`} onError={handleOnError} alt="" />
                                                                            :
                                                                            <div>{tainerlist.firstname.substring(0, 1).toUpperCase()}</div>
                                                                        } */}
                                                                </div>
                                                                <div className="">
                                                                    <span>{tainerlist.firstname}</span>
                                                                    <i className={tainerlist.availablestatus === 1 ? "fas fa-circle text-success circle-i" : (tainerlist.availablestatus === 2 ? "fas fa-circle text-danger circle-i" : "fas fa-circle text-secondary circle-i")}></i>
                                                                    <Rating initialValue={tainerlist.rankingtrainer} size="17" readonly="true" allowHover="false" allowHalfIcon="true" />
                                                                    <p className="mb-0">
                                                                        {tainerlist.trainingstyle !== "" && tainerlist.trainingstyle ?
                                                                            <span>{tainerlist.trainingstyle.substr(1, 10)}</span> : <></>
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <Link className="banner-btn" to="/mysession">Start Training</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    </>
                                    // } else {
                                    //     return <></>
                                    // }
                                })}
                            </ul>
                        </div>
                    </div>
                </div>)
            });
            setList(updatedList);
        }
    };
    const bookmarkTainer = async (e) => {
        const formData = new FormData();
        formData.append('tainerId', e._id);
        document.querySelector('.loading').classList.remove('d-none');
        await axios.post(`${apiUrl}${PORT}/client/bookmarktrainer`, formData, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                GetList(1);
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
    async function GetList(val) {
        debugger
        document.querySelector('.loading').classList.remove('d-none');
        var obj = {
            limitValue: limitValue,
            pageNumber: (val * 1),
            availablestatus: 0,
            bookmarkTainer: bookmarkTrainerList || [],
            name: flterValue
        };
        await axios.post(`${apiUrl}${PORT}/trainer/trainer/savetrainerlist`, obj).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                response.data?.result?.trainerlist.forEach(element => {
                    var seesionrankinglist = response.data?.result?.rankinglist.filter(s => s.trainerid === element._id).map(x => x.sessionrating);
                    element.rankingtrainer = (seesionrankinglist.length > 0) ? (((seesionrankinglist.reduce((a, v) => a = a + v.rate, 0)) / seesionrankinglist.length)) : 0;
                });
                setbookmarkTrainerList(response.data?.result?.client_data?.bookmarktrainer || []);
                response.data.result.trainerlist.bookmarktrainer = response.data?.result?.client_data?.bookmarktrainer;
                loadData(response.data?.result?.trainerlist);
                setNoOfRecords(response.data?.result?.noOfRecords || 0);
                initScroll();
            } else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
    return (
        <>
            <div className="container-fluid">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                <div className="col-12 p-0">
                    <div className="row mb-3">
                        <div className="col-md-6 col-12">
                            <h1 className="main_title">Saved Trainers</h1>
                        </div>
                    </div>
                    <div className="collapse" id="filterblock">
                        <div className="row filter-box">
                            <div className="col-md-4 col-12">
                                <div className="custom-control custom-checkbox custom-control-inline mb-3 mr-4">
                                    <input type="checkbox" className="custom-control-input" id="All" />
                                    <label className="custom-control-label" htmlFor="All">All </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-control-inline mb-3 mr-4">
                                    <input type="checkbox" className="custom-control-input" id="Offline" />
                                    <label className="custom-control-label" htmlFor="Offline">Offline </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-control-inline mb-3">
                                    <input type="checkbox" className="custom-control-input" id="Available" />
                                    <label className="custom-control-label" htmlFor="Available">Available Now </label>
                                </div>
                            </div>
                            <div className="col-md-5 col-12 pl-0">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor="customRadioInline1">Standard Trainers</label>
                                </div>
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor="customRadioInline2">Elite Trainers</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row filter-input mb-3">
                                    <div className="col-md-3 col-12">
                                        <div className="position-relative">
                                            <label>Ratings</label>
                                            <i className="fas fa-chevron-down arrow_i"></i>
                                            <select className="input-box">
                                                <option></option>
                                                <option>Ascending</option>
                                                <option>Descending </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <div className="position-relative">
                                            <label>Type Of Workout</label>
                                            <i className="fas fa-chevron-down arrow_i"></i>
                                            <select className="input-box">
                                                <option></option>
                                                <option>Choose Workout</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <div className="position-relative">
                                            <label>Gender</label>
                                            <i className="fas fa-chevron-down arrow_i"></i>
                                            <select className="input-box">
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {List}
                        <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                            <Pagination className="pagination-bar" currentPage={pageNum} totalCount={noOfRecords}
                                pageSize={limitValue} onPageChange={page => curPage(page)} />
                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}

export default SavedTrainer;
