import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl, PORT } from '../../environment/environment';
import { Rating } from 'react-simple-star-rating';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';
function MyRating() {
    const [list, setList] = useState({});
    const [isMountRender, setMountRender] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    useEffect(() => {
        if (isMountRender) return;
    }, [isMountRender]);
    useEffect(() => {
        setMountRender(false);
        callToken();
        GetRatingList();
    }, []);
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    async function GetRatingList() {
        setIsLoader(true);
        await axios.get(`${apiUrl}${PORT}/trainer/trainer/myratings`, {}, {})
            .then(function (response) {
                setIsLoader(false);
                if (response.data.status === 1)
                    setList(response.data.result);
                else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    })
                    //window.alert(response.data.message);
                }
                /* renderArr(response.data.result); */
            }).catch(function (error) {
                console.log(error);
            });
    };

    return (
        <>
            {isLoader &&
                <div id="loader" className="loading">
                    <div className="mainloader"></div>
                </div>
            }
            <div className="container-fluid">
                <div className="col-md-12 col-12 p-0">
                    <div className="row">
                        <div className="col-md-12 col-12 mb-3">
                            <h1 className="main_title">My Ratings</h1>
                        </div>
                        {!isLoader && list.length === 0 ?
                            <div className="col-12">
                                <h4 className="no-record-box">
                                    <i className="fa fa-exclamation-triangle alerticon"></i>
                                    No record found!
                                </h4>
                            </div>
                            : ""}
                        <div className="col-lg-4 col-md-6 col-12">
                            {list.length > 0 && list?.map((ele,index) => {
                                return <div key={'index' + index} className="rating_box">
                                    <div className="d-flex justify-content-between mb-3">
                                        <div className="rating-div d-flex">
                                            <img src={`${apiUrl}${PORT}${ele.client_data.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt='Profile' />
                                            <div className="rating-title">
                                                <h5>{ele.client_data.firstname} {ele.client_data.lastname}</h5>
                                                <span>{ele.sessionrating.rate / 20}</span>
                                                <Rating size={20} ratingValue={ele.sessionrating.rate} allowHover="false" allowHalfIcon="true" readonly={true} />
                                                {/* <span className="rating pl-2">
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                </span> */}
                                            </div>
                                        </div>
                                        <span>{new Date(ele.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="rating-content">
                                        <p>{ele.sessionrating.review}</p>
                                    </div>
                                    <p className="text-body mb-0">Session : {ele.client_data.firstname}</p>
                                </div>
                            })}
                            {/* <div className="rating_box">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="rating-div d-flex">
                                        <img src="/img/rating-img2.png" alt="img" />
                                        <div className="rating-title">
                                            <h5>John Dant</h5>
                                            <span>4.0</span>
                                            <span className="rating pl-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="far fa-star text-white"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <span>28 May</span>
                                </div>
                                <div className="rating-content">
                                    <p>If a customer responds to your survey with a rating of 3 or below, they will be prompted to leave a comment and request further assistance. Your team is alerted via email of the poor experience, and the customer can be contacted directly before they post a negative review about your company!</p>
                                </div>
                                <p className="text-body mb-0">Session : Cross-Fit with Mike</p>
                            </div>
                            <div className="rating_box">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="rating-div d-flex">
                                        <img src="/img/rating-img3.png" alt="img" />
                                        <div className="rating-title">
                                            <h5>Amy Williams</h5>
                                            <span>4.0</span>
                                            <span className="rating pl-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="far fa-star text-white"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <span>21 may</span>
                                </div>
                                <div className="rating-content">
                                    <p>If a customer responds to your survey with a rating of 3 or below, they will be prompted to leave a comment and request further assistance. Your team is alerted via email of the poor experience, and the customer can be contacted directly before they post a negative review about your company!</p>
                                </div>
                                <p className="text-body mb-0">Session : Cross-Fit with Mike</p>
                            </div> */}
                        </div>
                        {/* <div className="col-md-4 col-12">
                            <div className="rating_box">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="rating-div d-flex">
                                        <img src="/img/rating-img1.png" alt="img" />
                                        <div className="rating-title">
                                            <h5>Ally Ashton</h5>
                                            <span>5.0</span>
                                            <span className="rating pl-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <span>4 June</span>
                                </div>
                                <div className="rating-content">
                                    <p>If a customer responds to your survey with a rating of 3 or below, they will be prompted to leave a comment and request further assistance. Your team is alerted via email of the poor experience, and the customer can be contacted directly before they post a negative review about your company!</p>
                                </div>
                                <p className="text-body mb-0">Session : Cross-Fit with Mike</p>
                            </div>
                            <div className="rating_box">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="rating-div d-flex">
                                        <img src="/img/rating-img2.png" alt="img" />
                                        <div className="rating-title">
                                            <h5>John Dant</h5>
                                            <span>4.0</span>
                                            <span className="rating pl-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="far fa-star text-white"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <span>28 May</span>
                                </div>
                                <div className="rating-content">
                                    <p>If a customer responds to your survey with a rating of 3 or below, they will be prompted to leave a comment and request further assistance. Your team is alerted via email of the poor experience, and the customer can be contacted directly before they post a negative review about your company!</p>
                                </div>
                                <p className="text-body mb-0">Session : Cross-Fit with Mike</p>
                            </div>
                            <div className="rating_box">
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="rating-div d-flex">
                                        <img src="/img/rating-img3.png" alt="img" />
                                        <div className="rating-title">
                                            <h5>Amy Williams</h5>
                                            <span>4.0</span>
                                            <span className="rating pl-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="far fa-star text-white"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <span>21 may</span>
                                </div>
                                <div className="rating-content">
                                    <p>If a customer responds to your survey with a rating of 3 or below, they will be prompted to leave a comment and request further assistance. Your team is alerted via email of the poor experience, and the customer can be contacted directly before they post a negative review about your company!</p>
                                </div>
                                <p className="text-body mb-0">Session : Cross-Fit with Mike</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>

    );
};

export default MyRating;