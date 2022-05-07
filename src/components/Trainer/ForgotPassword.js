import axios from 'axios';
import React, { useState } from 'react';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';

function ForgotPassword() {
    const [email, setUser] = useState("");

    const handleInputs = (e) => {
        setUser(e.target.value);
    }

    const PostForgotPassword = async (e) => {
        e.preventDefault();

        if (email === "") {
            //window.alert("Please enter email.");
            swal({
                title: "Error!",
                text: "Please enter email.",
                icon: "error",
                button: true
            })
            return false;
        }

        document.querySelector('.loading').classList.remove('d-none');
        await axios.post(`${apiUrl}${PORT}/trainer/account/passwordlink`, { "email": email }, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                swal({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success",
                    button: true
                })
                //window.alert(response.data.message);
                window.location.href = "/trainer/login";
            }
            else{
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
            console.log(error);
        });
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
                                    <img src="/img/KNKTLogo.png" alt="" />
                                    <h3>Forgot Password</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loading d-none">
                                    <div className="mainloader"></div>
                                </div>
                                <div className="loginbox Forgotbox">
                                    <h6 className="text-center mb-4">Link to reset password will be sent to your email account</h6>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} name="email" type="text" className="w-100  mb-3 input-box" placeholder="Email Address" />
                                    </div>
                                    <div className="col-md-12">
                                        <button onClick={(e) => PostForgotPassword(e)} className="loginbtn mt-4">Submit</button>
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

export default ForgotPassword;
