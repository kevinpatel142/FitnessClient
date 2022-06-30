import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl, PORT } from "../../environment/environment";
import Moment from "react-moment";
import { Link } from 'react-router-dom';

function SessionPaymentDetail() {
    const queryStringPara = new URLSearchParams(window.location.search);
    console.log("queryStringPara", queryStringPara);
    let paymentId = queryStringPara.get("id");
    const [paymentData, setPaymentData] = useState({});
    const [cancelTime, setcancelTime] = useState(false);
    useEffect(() => {
        axios.post(`${apiUrl}${PORT}/payment/paymentdetails`, { id: paymentId })
            .then(response => {
                if (response.status == 200) {
                    const then = new Date(response.data.result.createdAt);
                    const now = new Date();
                    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

                    console.log("msBetweenDates", msBetweenDates);
                    // 👇️ convert ms to hours                  min  sec   ms
                    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
                    if (hoursBetweenDates < 24)
                        setcancelTime(true);

                    console.log('condi',);
                    console.log(hoursBetweenDates);
                    setPaymentData(response.data.result);
                }
            }).catch(err => {
                console.log(err);
            });
    }, [])
    const cancelOrder = (e) => {
        e.preventDefault();
        console.log("cancel order");
    }
    console.log("paymentData", paymentData);
    return (
        <>
            <div className="topimg session_detail">
                {/* <img src="/img/Chooseplan.png" className="w-100" alt="Plan" /> */}
                <img className="logo-img" src="/img/KNKTLogo.png" alt="logo" />
                <h3 className="sessiontext">Session Payment Details</h3>
            </div>
            <div className="container mob-view">
                <div className="row mt-lg-5">
                    <div className="col-xl-8 col-md-12 col-12 mx-lg-auto">
                        <div className="payment-detail">
                            <div className="row">
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Plan Name <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p>{paymentData.plantype}</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Session <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p>{paymentData.noofsession == '1' ? 'Single session' : `${paymentData.noofsession} sessions`} </p>
                                </div>
                                {/* <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>No of session(s) <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p>{paymentData.noofsession}</p>
                                </div> */}
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Purchased Date <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p><Moment format="DD MMMM YYYY, hh:mm A" date={paymentData.updatedAt} /></p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Amount <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p>$ {paymentData.amount}</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Status <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <div className="row">
                                        <div className="col-4">
                                            <button className="btn btn-success w-100">Paid</button>
                                        </div>
                                        {/* {cancelTime === true ?
                                            <>
                                                <div className="col-4">
                                                    <button onClick={cancelOrder} className="btn btn-danger w-100">Cancel Order</button>

                                                </div>
                                            </>
                                            : <></>
                                        } */}

                                    </div>

                                    {/* <p><span className="btn-success p-status m-0 text-center">Paid</span></p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SessionPaymentDetail;