import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import axios from 'axios';
import { verifytokenCall } from '../Others/Utils.js';
import { Link } from 'react-router-dom';
function PurchaseSession() {
    const history = useHistory();
    const [plan, setPlan] = useState('S-1-60');
    const [list, setList] = useState([]);
    const [planDetail, setPlanDetail] = useState({ date: new Date(), planType: 'Standard', sessions: 1, amount: 60 });
    useEffect(() => {
        callToken();
        GetList();
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const OnchnagePlan = (e, ele) => {
        $('radio').val('');
        setPlan(e.currentTarget.value);
        var plnArray = e.currentTarget.value.split('-');
        setPlanDetail({ date: new Date(), planType: (plnArray[0] === 'S') ? 'Standard' : 'Elite', sessions: ele.noofsession, amount: ele.amount });
    }
    const callPurchasePlan = (e) => {
        e.preventDefault();
        localStorage.setItem("PurchasePlan", JSON.stringify(planDetail));
        history.push("/clientpayment");
    }

    async function GetList() {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.get(`${apiUrl}${PORT}/payment/getplan`, {}, {}).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                setList(response.data.result)
            }
        }).catch(function (error) {
            console.log(error);
            document.querySelector('.loading').classList.add('d-none');
        });
    };
    return (
        <>
            <div className="loading d-none">
                <div className="mainloader"></div>
            </div>
            <div className="topimg">
                {/* <img src="/img/Chooseplan.png" className="w-100" alt="Plan" /> */}
                <img className="logo-img" src="/img/KNKTLogo.png" alt="logo" />
                <h3>Choose Your Plan</h3>
                <p>All of our trainers are certified & trustworthy! Elite trainers are Simply More experienced</p>
            </div>
            <div className="container">
                <div className="col-lg-10 offset-lg-1 col-12">
                    <div className="chooseplan">
                        <div className="row">
                            <div className="col-xl-5 col-md-6">
                                <div className={`planblock bg-white ${(plan.indexOf('S') > -1) ? "active" : ""}`}>
                                    <div className="headerblock">
                                        <h4>Standard</h4>
                                    </div>
                                    <div className="custom-radio-wrap">
                                        <form>
                                            {list.length > 0 ?
                                                list.map((ele, index) => {
                                                    if (ele.plantype === "Stander") {
                                                        return (<div key={'index' + index} className="form-group">
                                                            <input checked={plan === `S-1-${ele.noofsession}`} onChange={(e) => { OnchnagePlan(e, ele); }} value={`S-1-${ele.noofsession}`} id={`Standard${index}`} type="radio" name="custom-radio-btn" />
                                                            <label className="custom-radio" htmlFor={`Standard${index}`}>
                                                                <span className="label-text">{ele.noofsession === '1' ? 'Single' : `${ele.noofsession} Sessions`} <span className="float-right">${ele.amount}<span className="text-gray font-13"></span></span></span>
                                                            </label>
                                                        </div>
                                                        );
                                                    } else {
                                                        return <></>
                                                    }
                                                })
                                                :
                                                <>
                                                    <div className="no-session"> No sessions found!</div>
                                                </>
                                            }
                                            {/* <div className="form-group">
                                                <input checked={plan === 'S-12-660'} onChange={(e) => { OnchnagePlan(e); }} value={'S-12-660'} id="Standard2" type="radio" name="custom-radio-btn" />
                                                <label className="custom-radio" htmlFor="Standard2"></label>
                                                <span className="label-text">12 Sessions<span className="float-right">$660</span></span>
                                                <p className="pl-4 ml-2">Per Session $55 <br />$55*12</p>
                                            </div>

                                            <div className="form-group">
                                                <input checked={plan === 'S-36-1800'} onChange={(e) => { OnchnagePlan(e); }} value={'S-36-1800'} id="Standard3" type="radio" name="custom-radio-btn" />
                                                <label className="custom-radio" htmlFor="Standard3"></label>
                                                <span className="label-text">36 Sessions<span className="float-right">$1800</span></span>
                                                <p className="pl-4 ml-2">Per Session $50 <br />$50*36</p>
                                            </div> */}
                                            <button onClick={(e) => { callPurchasePlan(e); }} className="loginbtn">Continue</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-1 d-none d-xl-block"></div>
                            <div className="col-xl-5 col-md-6">
                                <div className={`planblock bg-white ${(plan.indexOf('S') > -1) ? "" : "active"}`}>
                                    <div className="headerblock">
                                        <h4>Elite</h4>
                                    </div>
                                    <div className="custom-radio-wrap">
                                        <form>
                                            {list.length > 0 ?
                                                list.map((ele, index) => {
                                                    if (ele.plantype === "Elite") {
                                                        return (<div key={'index' + index} className="form-group">
                                                            <input checked={plan === `E-1-${ele.noofsession}`} onChange={(e) => { OnchnagePlan(e, ele); }} value={`E-1-${ele.noofsession}`} id={`Elite${index}`} type="radio" name="custom-radio-btn" />
                                                            <label className="custom-radio" htmlFor={`Elite${index}`}>
                                                                <span className="label-text">{ele.noofsession === '1' ? 'Single' : `${ele.noofsession} Sessions`}<span className="float-right">${ele.amount}<span className="text-gray font-13"></span></span></span>
                                                            </label>
                                                        </div>
                                                        );
                                                    } else {
                                                        return <></>
                                                    }
                                                })
                                                :
                                                <>
                                                    <div className="no-session"> No sessions found!</div>
                                                </>
                                            }


                                            {/* <div className="form-group">
                                                <input checked={plan === 'E-1-75'} onChange={(e) => { OnchnagePlan(e); }} value={'E-1-75'} id="Elite1" type="radio" name="custom-radio-btn" />
                                                <label className="custom-radio" htmlFor="Elite1"></label>
                                                <span className="label-text">Single<span className="float-right">$75<span className="text-gray font-13">/hr</span></span></span>
                                            </div>
                                            <div className="form-group">
                                                <input checked={plan === 'E-12-780'} onChange={(e) => { OnchnagePlan(e); }} value={'E-12-780'} id="Elite2" type="radio" name="custom-radio-btn" />
                                                <label className="custom-radio" htmlFor="Elite2"></label>
                                                <span className="label-text">12 Sessions<span className="float-right">$780</span></span>
                                                <p className="pl-4 ml-2">Per Session $65 <br />$65*12</p>
                                            </div>
                                            <div className="form-group">
                                                <input checked={plan === 'E-36-2160'} onChange={(e) => { OnchnagePlan(e); }} value={'E-36-2160'} id="Elite3" type="radio" name="custom-radio-btn" />
                                                <label className="custom-radio" htmlFor="Elite3"></label>
                                                <span className="label-text">36 Sessions<span className="float-right">$2160</span></span>
                                                <p className="pl-4 ml-2">Per Session $60 <br />$50*36</p>
                                            </div> */}
                                            <button onClick={(e) => { callPurchasePlan(e); }} className="loginbtn">Continue</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-11 col-lg-11 d-sm-flex">
                                <h4 className="font-weight-bold my-sm-4 align-self-center">Purchased Session</h4>
                                <Link to="/payment/clientpaymenthistory" class="text-decoration-none btn btn-primary br-radius mt-2 mt-md-4 mb-4 ml-sm-auto choose-pay">Payment History</Link>
                            </div>
                            <div className="col-md-12 mb-5">
                                <div class="graysession">
                                    <div className="table-responsive">
                                        <table class="table w-100 mb-0">
                                            <tbody>
                                                <tr>
                                                    <td><span className="textgray">Date :</span><span className="text-primary font-weight-bold"> {planDetail.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span></td>
                                                    <td><span className="textgray">Plan :</span><span className="text-primary font-weight-bold bg-transparent planborder"> {planDetail.planType}</span></td>
                                                    <td><span className="textgray">Sessions :</span><span className="text-primary font-weight-bold"> {planDetail.sessions === '1' ? 'Single' : planDetail.sessions}</span></td>
                                                    <td><span className="textgray">Total :</span><span className="text-primary font-weight-bold"> ${planDetail.amount}</span></td>
                                                    </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </body>
            <script src="/lib/jquery/dist/jquery.min.js"></script>
            <script src="/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
            <script src="/js/site.js" asp-append-version="true"></script> */}
        </>
    );
}

export default PurchaseSession;
