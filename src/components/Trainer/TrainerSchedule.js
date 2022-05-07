import React from 'react';
import { Link } from 'react-router-dom';

function TrainerSchedule() {
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
                                    <img src="/img/KNKTLogo.png" alt="Logo" />
                                    <h3>Set Schedule</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox regyourself">
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Hey Set the schedule for yourself!</h6>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="input-group control-group after-add-more position-relative">
                                                <div className="col-md-10 col-10">
                                                    <input type="text" name="addmore[]" id="ContactNo" className="input-box w-100" placeholder="Cross-Fit" />
                                                </div>
                                                <div className="col-md-2 d-flex p-0 col-2">
                                                    <div className="input-group-btn">
                                                        <button className="add-more addschdule" type="button"><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-10">
                                        <div className="copy d-none">
                                            <div className="control-group input-group" style={{ "margin-top": "10px" }}>
                                                <div name="addmore[]"></div>
                                                <div className="col-md-10 ">
                                                    <input className="input-group-btn input-box w-100 position-relative" placeholder="Cross-Fit Trainer" />
                                                </div>
                                                <div className="d-flex col-md-2 p-0">
                                                    <button className="remove minus" type="button"><i className="fas fa-minus"></i></button>
                                                    <button className="add-more addschdule" type="button"><i className="fas fa-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 my-3">
                                        <textarea className="w-100" placeholder="Introduction"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-md-10 col-10">
                                                <div className="input-group control-group  position-relative">
                                                    <input type="text" id="ContactNo" className="input-box w-100" placeholder="Cross-Fit Trainer" />
                                                    <div className="input-group-btn">
                                                        <button className="schedule position-absolute" type="button"><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 col-2">
                                                <i className="fas fa-download icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="col-md-10 col-10">
                                            <div className="copy">
                                                <div className="control-group input-group" style={{ "margin-top": "10px" }}>
                                                    <div className="d-flex">
                                                        <div className="removeinput">Cross-Fit Trainer</div>
                                                        <div className="input-group-btn position-relative">
                                                            <button className="remove2 position-absolute" type="button"><i className="fas fa-times"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2 mt-2 col-2">
                                            <i className="fas fa-file icon"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <ul className="list-inline togglebox my-3">
                                            <li>
                                                Email Notification
                                                <span className="float-right">
                                                    <label className="switch ">
                                                        <input type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Mailing List<span className="float-right">
                                                    <label className="switch ">
                                                        <input type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Text Notifications<span className="float-right">
                                                    <label className="switch ">
                                                        <input type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="custom-control custom-checkbox mb-3">
                                            <input type="checkbox" className="custom-control-input" id="Clientreg" name="example1" />
                                            <label className="custom-control-label terms-text" htmlFor="Clientreg"><span className="pl-2">I agree to the <Link to="/termsandcondition" className="gray-text"> Terms & Conditions </Link></span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <Link to='/trainersaccountinfo'><span className="loginbtn my-4">Submit</span></Link>
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

export default TrainerSchedule;