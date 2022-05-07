import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';

function AccountInfo() {
    //Onload event set here.
    const history = useHistory();
    const [trainerId, setTrainerId] = useState("");

    useEffect(() => {
        setTrainerId(localStorage.getItem('trainerId'));
        const token = localStorage.getItem('token');

        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${apiUrl}${PORT}/account/verifytoken`, {}, {
            }).then(function (response) {
                if (response.data.status === 1) {
                    history.push("/sessionrequest");
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, [])
    const [accountinfo, setAccountInfo] = useState({
        userid: "", accountholdername: "", accountnumber: "", bankname: "", swiftcode: ""
    });
    const handleInputs = (e) => {
        setAccountInfo({ ...accountinfo, [e.target.name]: e.target.value });
    }
    const [errors, setErrors] = useState({});

    const PostAccountInfo = async (e) => {
        e.preventDefault();
        let isValid = true;
        var errormsg = {};
        let reg_numbers = /^[0-9]+$/;
        if (trainerId === "") {
            //window.alert("Trainer not valid.");
            swal({
                title: "Error!",
                text: "Trainer not valid.",
                icon: "error",
                button: true
            })
            return false;
        }
        if (accountinfo.accountholdername === "") {
            errormsg.accountholdername = "Please enter Account holder name.";
            isValid = false;
        }
        if (accountinfo.accountnumber === "" && !reg_numbers.test(accountinfo.accountnumber)) {
            errormsg.accountnumber = "Please enter Account number.";
            isValid = false;
        }
        if (accountinfo.bankname === "") {
            errormsg.bankname = "Please enter Mobile Bank name.";
            isValid = false;
        }
        if (accountinfo.swiftcode === "") {
            errormsg.swiftcode = "Please enter Mobile Swift code.";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid === true) {
            const formData = new FormData();
            formData.append('userid', trainerId);
            formData.append('accountholdername', accountinfo.accountholdername);
            formData.append('accountnumber', accountinfo.accountnumber);
            formData.append('bankname', accountinfo.bankname);
            formData.append('swiftcode', accountinfo.swiftcode);

            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/trainer/accountinfo/saveaccountinfo`, formData, {
            }).then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    localStorage.removeItem('trainerId');
                    // localStorage.removeItem('user');
                    // localStorage.removeItem('usertype');
                    // localStorage.removeItem('token');
                    history.push("/signupsuccess");
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
            });
        }
    }

    const CancelBtn = () => {
        history.push("/signupsuccess");
    }

    return (
        <>
            <div className="container my-md-5 py-md-4">
                <div className="commonbox">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt='Logo' />
                                    <h3>Set Up <br /> Payment</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loading d-none">
                                    <div className="mainloader"></div>
                                </div>
                                <div className="loginbox">
                                    <h6 className="mb-4 ml-3">Account info:</h6>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={accountinfo.accountholdername} name="accountholdername" type="text" className="w-100  mb-3 input-box" placeholder="Accountholder's Name" />
                                        <div className="text-danger">{errors.accountholdername}</div>
                                    </div>
                                    <div className="col-md-12">
                                        {/* <input onChange={(e) => handleInputs(e)} value={accountinfo.accountnumber} name="accountnumber" type="text"
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }} maxLength={12} className="w-100  mb-3 input-box" placeholder="Account Number" /> */}
                                        <input className="input-box w-100 mb-3" name="accountnumber" placeholder="Account Number"
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            value={accountinfo.accountnumber} onChange={(e) => {
                                                if (e.target.value.length === 17)
                                                    return;
                                                handleInputs(e)
                                            }} />
                                        <div className="text-danger">{errors.accountnumber}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={accountinfo.bankname} name="bankname" type="text" className="w-100  mb-3 input-box" placeholder="Bank Name" />
                                        <div className="text-danger">{errors.bankname}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={accountinfo.swiftcode} name="swiftcode" type="text" className="w-100  mb-3 input-box" placeholder="Swift Code" />
                                        <div className="text-danger">{errors.swiftcode}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { PostAccountInfo(e) }} className="loginbtn my-4">Submit</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { CancelBtn(); }} className="loginbtn mt-md-4 mb-4">Cancel</button>
                                            </div>
                                        </div>
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
export default AccountInfo;
