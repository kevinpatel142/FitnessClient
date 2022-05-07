import axios from 'axios';
import React, { useState } from 'react';
import { apiUrl, PORT } from '../environment/environment';
import swal from 'sweetalert';
function ResetPassword() {
    localStorage.clear();

    var uri = window.location.pathname;
    let splituri = uri.split("/");
    let usertype = splituri[1];

    const [user, setUser] = useState({
        password: "", confirmpassword: ""
    });

    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const Reset = async (e) => {
        e.preventDefault();

        if (user.email === "") {
            //window.alert("Please enter email.");
            swal({
                title: "Error!",
                text: "Please enter email.",
                icon: "error",
                button: true
            })
            return false;
        }
        else if (user.confirmpassword === "") {
            //window.alert("Please enter Confirm Password.");
            swal({
                title: "Error!",
                text: "Please enter Confirm Password.",
                icon: "error",
                button: true
            })
            return false;
        }

        await axios.post(`${apiUrl}${PORT}/${usertype}/account/resetpassword/${splituri[4]}`, { "password": user.password, "confirmpassword": user.confirmpassword }, {
        }).then(function (response) {
            if (response.data.status === 1) {
                //window.alert(response.data.message);
                swal({
                    title: "Success!",
                    text: response.data.message,
                    icon: "success",
                    button: true
                })
                window.location.href = `/${usertype}/login`;
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
                                    <h3>New Password</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox">
                                    <h5 className="text-center mb-4">Create New Password</h5>
                                    <div className="col-md-12">
                                        <div className="position-relative">
                                            <input onChange={(e) => { handleInputs(e) }} name="password" type="password" className="w-100 mb-3 input-box" placeholder="Password" />
                                            <i className="fa fa-eye icon"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="position-relative">
                                            <input onChange={(e) => { handleInputs(e) }} name="confirmpassword" type="password" className="w-100 mb-3 input-box" placeholder="Confirm Password" />
                                            <i className="fa fa-eye icon"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <button onClick={(e) => { Reset(e) }} className="loginbtn mt-4">Reset</button>
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

export default ResetPassword;