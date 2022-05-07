import React from 'react';
import { Link } from 'react-router-dom';
function SignupSuccess() {
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
                                    <h3>Register Success</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox">
                                    <div className="col-md-12 text-center">
                                        <i className="far fa-check-circle iconsize"></i>
                                        <p className="font-weight-bold font-18 mt-2">You are Registered Successfully.</p>
                                    </div>
                                    <div className="col-md-12">
                                        <Link to="/trainer/login" className="loginbtn mt-4 mb-4">Login</Link>
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

export default SignupSuccess;
