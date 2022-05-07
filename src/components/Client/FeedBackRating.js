import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';
function FeedBackRating() {
    const history = useHistory();
    const [sessionId, setSessionId] = useState();
    const [errors, setErrors] = useState({});
    const queryStringPara = new URLSearchParams(window.location.search);
    let sesId = queryStringPara.get("id");

    const [rate, setRate] = useState({ id: sesId, rate: 0, ratingOpt: [], review: '', createdate: '' })
    const handleRating = (rate) => {
        handleChange("rate", rate);
    }

    const [ratingOptArr, setRatingOptArr] = useState([]);

    useEffect(() => {
        setSessionId(sesId);

        const callToken = () => {
            verifytokenCall();
            setTimeout(() => {
                callToken();
            }, 3000);
        }

        callToken();
    }, [sesId]);

    const changeRatingOpt = (bool, value) => {
        if (bool === true) {
            ratingOptArr.push(value);
            setRatingOptArr([...new Set(ratingOptArr)])
        }
        else {
            setRatingOptArr([...new Set(ratingOptArr.filter(item => item !== value))]);
        }
        handleChange("ratingOpt", ratingOptArr);
    }

    const handleChange = (objName, val) => {
        if (val)
            setRate(prevState => ({ ...prevState, [objName]: val }));
    }
    const onSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        var errormsg = {};
        rate.id = sessionId;
        if (rate.review === "") {
            errormsg.review = "Please write review";
            isValid = false;
        }
        if (rate.ratingOpt.length === 0) {
            errormsg.ratingOpt = "Please select rate option";
            isValid = false;
        }
        if (rate.rate === 0) {
            errormsg.rate = "Please select feedback rate";
            isValid = false;
        }
        rate.createdate = new Date();
        setErrors(errormsg);
        if (isValid) {
            document.querySelector('.loading').classList.remove('d-none');
            axios.post(`${apiUrl}${PORT}/client/session/rating`, rate)
                .then(response => {
                    document.querySelector('.loading').classList.add('d-none');
                    if (response.data.status === 1) {
                        history.push("/mysession");
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

                }
                ).catch(function (error) {
                    document.querySelector('.loading').classList.add('d-none');
                });
        }
    }
    return (
        <>
            <div className="loading d-none">
                <div className="mainloader"></div>
            </div>
            <div className="container">
                <div className="col-md-12">
                    <div className="row my-5">
                        <div className="ratingblock mx-auto d-block my-5 py-5">
                            {/* <ul className="list-inline text-center">
                                <li className="list-inline-item"><i className="fas fa-star"></i></li>
                                <li className="list-inline-item"><i className="fas fa-star"></i></li>
                                <li className="list-inline-item"><i className="fas fa-star"></i></li>
                                <li className="list-inline-item"><i className="far fa-star"></i></li>
                                <li className="list-inline-item"><i className="far fa-star"></i></li>
                            </ul> */}
                            <div className="list-inline text-center">
                                {<Rating onClick={handleRating} ratingValue={0} allowHalfIcon={true} transition={true} />}
                            </div>
                            <p className="text-center text-primary mt-1 mb-2">Rate your experience with this session.</p>
                            <div className="text-danger">{errors.rate}</div>
                            <div className="wrapper">
                                <input type="checkbox" name="select" id="option-1" onChange={(e) => { changeRatingOpt(e.currentTarget.checked, 'Helpful'); }} />
                                <input type="checkbox" name="select" id="option-2" onChange={(e) => { changeRatingOpt(e.currentTarget.checked, 'Exciting'); }} />
                                <input type="checkbox" name="select" id="option-3" onChange={(e) => { changeRatingOpt(e.currentTarget.checked, 'Instrating'); }} />
                                <label htmlFor="option-1" className="option option-1">
                                    <span>Helpful</span>
                                    <span className="dot"><i className="fas fa-times text-white"></i></span>
                                </label>
                                <label htmlFor="option-2" className="option option-2">
                                    <span>Exciting</span>
                                    <span className="dot"><i className="fas fa-times text-white"></i></span>
                                </label>
                                <label htmlFor="option-3" className="option option-3 mr-0">
                                    <span>Instrating</span>
                                    <span className="dot"><i className="fas fa-times text-white"></i></span>
                                </label>
                            </div>
                            <div className="text-danger">{errors.ratingOpt}</div>
                            <label className="text-primary">Write Your Review:</label>
                            <textarea placeholder="Write your review here..." maxLength={2000} className="w-100 ratingarea" onChange={(e) => { handleChange("review", e.target.value) }}></textarea>
                            <div className="text-danger">{errors.review}</div>

                            <a className="loginbtn mt-5" href={() => false} onClick={(e) => { onSubmit(e) }}>Submit</a>
                            {/* data-toggle="modal" data-target="#trainer-submit" */}
                        </div>
                    </div>
                </div>

                {/* trainer submit detail Modal */}

                <div className="modal fade" id="trainer-submit" tabIndex={"-1"} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered report-trainer" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="col-md-12 col-12">
                                    <h4 className="book-title text-center">You Will see post workout details after trainer submits</h4>
                                    <Link to="/Home/Index" className="training_btn">Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* trainer submit detail Modal End  */}
            </div>
        </>
    )
}

export default FeedBackRating;