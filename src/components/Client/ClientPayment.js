import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';
function ClientPayment() {
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [isNewCard, setIsNewCard] = useState(false);
    const [newCardArr, setNewCardArr] = useState([]);
    const initialState = {
        cardholdersName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
        rememberMyCard: false
    };
    const [payment, setPayment] = useState({
        paymentMethod: "",
        cardholdersName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
        rememberMyCard: false
    });
    const [{ cardholdersName, cardNumber, expirationMonth, expirationYear, cvv, rememberMyCard }, setNewCardDetail] = useState(initialState);
    const purchasePlan = JSON.parse(localStorage.getItem("PurchasePlan"));
    useEffect(() => {
        callToken();
    }, []);
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }

    const handleChange = (objName, val) => {
        setPayment(prevState => ({ ...prevState, [objName]: val }));
    }

    const newCardhandleChange = e => {
        if (e.target.name === "cvv") {
            if (e.target.value.length > 3)
                return;
        }
        const { name, value } = e.target;
        setNewCardDetail(prevState => ({ ...prevState, [name]: value }));
    };

    const deleteCardDetail = (ele) => {
        setNewCardArr(newCardArr.filter(item => item.cardNumber !== ele.cardNumber))
    }

    const onPayNow = (e) => {
        e.preventDefault();

        let isValid = true;
        var errormsg = {};
        if (payment.cardholdersName === "") {
            errormsg.cardholdersName = "Please enter holder name!";
            isValid = false;
        }
        if (payment.cardNumber === "") {
            errormsg.cardNumber = "Please enter card number!";
            isValid = false;
        }

        if (payment.expirationMonth === "") {
            errormsg.expirationMonth = "Please select expiration month!";
            isValid = false;
        }
        if (payment.expirationYear === "") {
            errormsg.expirationYear = "Please select expiration year!";
            isValid = false;
        }
        if (payment.cvv === "") {
            errormsg.cvv = "Please enter cvv number!";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid) {
            let savepayment = {
                date: new Date(),
                noofsession: purchasePlan.sessions,
                plantype: purchasePlan.planType,
                amount: purchasePlan.amount
            }
            document.querySelector('.loading').classList.remove('d-none');
            axios.post(`${apiUrl}${PORT}/payment/savepayment`, savepayment)
                .then(response => {
                    document.querySelector('.loading').classList.add('d-none');
                    if (response.data.status === 1)
                        history.push("/trainer");
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
    const addNewCard = (e) => {
        e.preventDefault();

        let isValid = true;
        var errormsg = {};
        if (cardholdersName === "") {
            errormsg.newcardholdersName = "Please enter holder name!";
            isValid = false;
        }
        if (cardNumber === "") {
            errormsg.newcardNumber = "Please enter card number!";
            isValid = false;
        }

        if (expirationMonth === "") {
            errormsg.newexpirationMonth = "Please select expiration month!";
            isValid = false;
        }
        if (expirationYear === "") {
            errormsg.newexpirationYear = "Please select expiration year!";
            isValid = false;
        }
        if (cvv === "") {
            errormsg.newcvv = "Please enter cvv number!";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid) {
            setNewCardArr(prev => ([...prev, initialState]));
            setErrors({});
            setIsNewCard(false);
            console.log(initialState);
        }
    }
    return (
        <>
            <div className="container my-md-5 py-md-4">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                <div className="commonbox">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt='Logo' />
                                    <h3>Payment</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                {!isNewCard ?
                                    <div className="loginbox clientpayment">
                                        <h6 className="mb-4 ml-3">Details:</h6>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Plan</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">{purchasePlan.planType} ({purchasePlan.sessions === '1' ? "Single" : purchasePlan.sessions} sessions)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Amount</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">${purchasePlan.amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Tax</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">$02.00</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {newCardArr.length > 0 &&
                                            <>
                                                <h6 className="mb-4 ml-3">Payment Method:</h6>
                                                <div className="cardblock">
                                                    <div className="col-md-12">
                                                        <div className="grid">
                                                            {/* <label className="card">
                                                                    <input name="plan" className="radio" type="radio" checked />
                                                                    <span className="plan-details">
                                                                        <span className="plan-type  d-flex justify-content-between">
                                                                            <span>Creadit card</span>
                                                                            <img src="/img/mastercard.png" className="cardimg" />
                                                                        </span>
                                                                        <span>xxxx xxxx xxxx 4521</span>
                                                                        <span className="d-flex justify-content-between">
                                                                            <span>09/25</span>
                                                                            <a className="cursor-pointer"><i className="fas fa-trash"></i><span className="pl-1">Delete</span></a>
                                                                        </span>
                                                                    </span>
                                                                </label> */}
                                                            {newCardArr && newCardArr.map((ele) => {
                                                                return <label className="card">
                                                                    <input name="plan" className="radio" type="radio" />
                                                                    <span className="plan-details">
                                                                        <span className="d-flex justify-content-between">
                                                                            <span>Debit card</span>
                                                                            <img src="/img/visacard.png" className="cardimg visaimg" alt="Card" />
                                                                        </span>
                                                                        <span>xxxx xxxx xxxx 2035</span>
                                                                        <span className="d-flex justify-content-between">
                                                                            <span>05/21</span>
                                                                            <a href={() => false} className="cursor-pointer" onClick={(e) => { deleteCardDetail(ele) }}><i className="fas fa-trash"></i><span className="pl-1">Delete</span></a>
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <h6 className="mb-4 ml-3 font-weight-bold">Payment:</h6>
                                        <h6 className="my-4 ml-3 font-weight-bold">Card Details:</h6>
                                        <div className="col-md-12">
                                            <input className="input-box w-100 mb-3" placeholder="Cardholder's Name" value={payment.cardholdersName} onChange={(e) => { handleChange("cardholdersName", e.target.value) }} />
                                            <div className="text-danger">{errors.cardholdersName}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <input type={'text'} className="input-box w-100 mb-3" placeholder="Card Number"
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }} value={payment.cardNumber}
                                                onChange={(e) => {
                                                    if (e.target.value.length === 17)
                                                        return;
                                                    handleChange("cardNumber", e.target.value)
                                                }}
                                            />
                                            <div className="text-danger">{errors.cardNumber}</div>
                                        </div>
                                        <div className="col-md-12 p-0 d-flex">
                                            <div className="col-md-8">
                                                <label>Expiration date</label>
                                                <div className="d-flex justify-content-between">
                                                    <select className="input-box w-100 mr-2" value={payment.expirationMonth} onChange={(e) => { handleChange("expirationMonth", e.target.value) }}>
                                                        <option></option>
                                                        <option>1</option>
                                                        <option>2</option>
                                                        <option>3</option>
                                                        <option>4</option>
                                                        <option>5</option>
                                                        <option>6</option>
                                                        <option>7</option>
                                                        <option>8</option>
                                                        <option>9</option>
                                                        <option>10</option>
                                                        <option>11</option>
                                                        <option>12</option>
                                                    </select>
                                                    <select className="input-box w-100 mr-2" value={payment.expirationYear} onChange={(e) => { handleChange("expirationYear", e.target.value) }}>
                                                        <option></option>
                                                        <option>2022</option>
                                                        <option>2023</option>
                                                        <option>2024</option>
                                                        <option>2025</option>
                                                        <option>2026</option>
                                                        <option>2027</option>
                                                        <option>2028</option>
                                                        <option>2029</option>
                                                        <option>2030</option>
                                                    </select>
                                                </div>
                                                <div className="text-danger">{errors.expirationMonth}</div>
                                                <div className="text-danger">{errors.expirationYear}</div>
                                            </div>
                                            <div className="col-md-4">
                                                <label>CVC/CVV</label>
                                                <input className="input-box w-100 mr-2" type="text" maxLength={"3"} value={payment.cvv}
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        if (e.target.value.length === 3)
                                                            return;
                                                        handleChange("cvv", e.target.value)
                                                    }}
                                                />
                                                <div className="text-danger">{errors.cvv}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="Trainerreg" name="example1" value={payment.rememberMyCard}
                                                    onChange={(e) => { handleChange("rememberMyCard", e.currentTarget.checked) }} />
                                                <label className="custom-control-label" htmlFor="Trainerreg">Remember My Card</label>
                                            </div>
                                            <div className="text-danger">{errors.rememberMyCard}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="loginbtn mt-4 bg-transparent text-primary" onClick={(e) => { setIsNewCard(true); setNewCardDetail({ ...initialState }); }}>Add New Card</div>
                                            {/* <Link to="/paymentSuccess" className="loginbtn mt-4">Pay Now</Link> */}
                                            <div className="loginbtn mt-4" onClick={(e) => { onPayNow(e) }}> Pay Now </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="loginbox clientpayment">
                                        <h6 className="mb-4 ml-3">Details:</h6>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Plan</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">{purchasePlan.planType} ({purchasePlan.sessions} sessions)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Amount</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">${purchasePlan.amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="grayblock">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h6>Tax</h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="text-right">$02.00</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h6 className="mb-4 ml-3">Payment:</h6>
                                        <h6 className="my-4 ml-3 font-weight-bold">Card Details:</h6>
                                        <div className="col-md-12">
                                            <input className="input-box w-100 mb-3" placeholder="Cardholder's Name" value={cardholdersName} name="cardholdersName" onChange={newCardhandleChange} />
                                            <div className="text-danger">{errors.newcardholdersName}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <input className="input-box w-100 mb-3" placeholder="Card Number"
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                value={cardNumber} name="cardNumber" onChange={(e) => {
                                                    if (e.target.value.length === 17)
                                                        return;
                                                    newCardhandleChange(e)
                                                }} />
                                            <div className="text-danger">{errors.newcardNumber}</div>
                                        </div>
                                        <div className="col-md-12 p-0 d-flex">
                                            <div className="col-md-8">
                                                <label>Expiration date</label>
                                                <div className="d-flex justify-content-between">
                                                    <select className="input-box w-100 mr-2" value={expirationMonth} name="expirationMonth" onChange={newCardhandleChange}>
                                                        <option></option>
                                                        <option>1</option>
                                                        <option>2</option>
                                                        <option>3</option>
                                                        <option>4</option>
                                                        <option>5</option>
                                                        <option>6</option>
                                                        <option>7</option>
                                                        <option>8</option>
                                                        <option>9</option>
                                                        <option>10</option>
                                                        <option>11</option>
                                                        <option>12</option>
                                                    </select>
                                                    <select className="input-box w-100 mr-2" value={expirationYear} name="expirationYear" onChange={newCardhandleChange}>
                                                        <option></option>
                                                        <option>2022</option>
                                                        <option>2023</option>
                                                        <option>2024</option>
                                                        <option>2025</option>
                                                        <option>2026</option>
                                                        <option>2027</option>
                                                        <option>2028</option>
                                                        <option>2029</option>
                                                        <option>2030</option>
                                                    </select>
                                                </div>
                                                <div className="text-danger">{errors.newexpirationMonth}</div>
                                                <div className="text-danger">{errors.newexpirationYear}</div>
                                            </div>
                                            <div className="col-md-4">
                                                <label>CVC/CVV</label>
                                                <input className="input-box w-100 mr-2" type="text" maxLength={"3"}
                                                    name="cvv" value={cvv}
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    onChange={newCardhandleChange}
                                                />
                                                <div className="text-danger">{errors.newcvv}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="Trainerreg" name="rememberMyCard" value={rememberMyCard}
                                                    onChange={newCardhandleChange} />
                                                <label className="custom-control-label" htmlFor="Trainerreg">Remember My Card</label>
                                            </div>
                                            <div className="text-danger">{errors.rememberMyCard}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="loginbtn mt-4 bg-transparent text-primary" onClick={(e) => { setIsNewCard(false); setErrors({}); }}>Back</div>
                                            {/* <Link to="/paymentSuccess" className="loginbtn mt-4">Pay Now</Link> */}
                                            <div className="loginbtn mt-4" onClick={(e) => { addNewCard(e); }}> Add New </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ClientPayment;
