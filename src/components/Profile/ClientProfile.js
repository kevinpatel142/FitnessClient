import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
import swal from 'sweetalert';
function ClientProfile() {
    const queryStringPara = new URLSearchParams(window.location.search);
    let Id = queryStringPara.get("Id");

    const ProfileImage_URL = '/img/Small-no-img.png';
    const [isReportresone, setIsReportresone] = useState(false);
    const [reportObj, setReportObj] = useState({ clientid: Id, reason: "", isBlock: null });
    const [client, setClient] = useState({});
    const [currentFlag, setCurrentFlag] = useState("");
    const [errors, setErrors] = useState({});

    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    useEffect(() => {
        callToken();
        fetchProfile();
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const fetchProfile = async () => {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.post(`${apiUrl}${PORT}/client/account/getprofilebyid`, { id: Id }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                response.data.result.oldpassword = ""; response.data.result.password = ""; response.data.result.confirmPassword = "";
                if (response.data.result) {
                    setClient(response.data.result);
                    setProfileImagePreview((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : ProfileImage_URL);
                }

            }
            return response;
        }).catch(function (error) {
            document.querySelector('.loading').classList.add('d-none');
            console.log(error);
        });
    }

    const submitReport = async () => {
        let isSubmit = true;
        var errormsg = {};
        if (reportObj.report === "") {
            errormsg.report = "Please enter report!";
            isSubmit = false;
        }
        setErrors(errormsg);
        if (isSubmit) {
            reportObj.clientid = Id;
            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/blockreportclient`, reportObj, {
            }).then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                reportObj.clientid = "";
                reportObj.reason = "";
                reportObj.isBlock = null;
                $(".modal-backdrop").hide();
                if (response.data.status === 1) {
                    setIsReportresone(false);
                    swal({
                        title: "Success!",
                        text: response.data.message,
                        icon: "success",
                        button: true
                    })
                }
                else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    })
                    //window.alert(response.data.message);
                    setIsReportresone(false);
                }
            }).catch(function (error) {
                console.log(error);
                setIsReportresone(false);
                document.querySelector('.loading').classList.add('d-none');
            });
        }
    }

    return (
        <>
            <div className="container-fluid">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>

                <div className="col-md-12 col-12 p-0">
                    <div className="myprofile">
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <h1 className="main_title mb-5">Client Profile</h1>
                            </div>
                            <div className="col-md-6 col-12 text-right">
                                <ul className="list-inline info-icon">
                                    <li className="list-inline-item"><button data-toggle="modal" data-target="#report-block"><i className="far fa-flag"></i></button></li>
                                </ul>
                            </div>
                            <div className="col-md-5 col-12">
                                <div className="avatar-upload">
                                    <div className="avatar-preview">
                                        <div id="imagePreview" style={{ backgroundImage: `url(${profileimagepreview})` }}></div>
                                    </div>
                                    <div className="prof_name">
                                        <h4>{client.firstname} {client.lastname}, {client.age}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-12">
                                <div className="profile-box">
                                    <div className="row">
                                        <div className="col-md-6 col-12 pr-md-2">
                                            <div className="p_input">
                                                <label>Age</label>
                                                <p>{client.age}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 pl-md-2">
                                            <div className="p_input">
                                                <label>Gender</label>
                                                <p>{client.gender}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 pr-md-2">
                                            <div className="p_input">
                                                <label>Equipment</label>
                                                <p>{client.equipmentavailable}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 pl-md-2">
                                            <div className="p_input">
                                                <label>Height</label>
                                                <p>{client.height} {client.heightisfeet ? 'Feet' : 'Meters'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 pl-md-2">
                                            <div className="p_input">
                                                <label>Fitness Goals</label>
                                                <p>{client.otherfitnessgoals}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 pr-md-2">
                                            <div className="p_input">
                                                <label>Weight</label>
                                                <p>{client.weight} {client.weightiskg ? 'Kgs' : 'Pound'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-12 mb-3">
                                            <div className="p_input">
                                                <label>Injuries/Health Issues</label>
                                                <p>{client.injuriesorhelthissues}</p>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-12 col-12">
                                            <Link to="/editprofile" className="edit-btn">Edit Profile</Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="modal fade" id="report-block" role="dialog">
                <div className="modal-dialog modal-dialog-centered report-trainer" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={() => { $(".modal-backdrop").hide(); }} data-dismiss="modal" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h4 className="book-title text-center">Do you want to report or block the client?</h4>
                                <button className="training_btn bg-transparent text-primary mb-3" data-toggle="modal" data-dismiss="modal" href="#report-resone-block" onClick={() => { setIsReportresone(true); setReportObj(prevState => ({ ...prevState, isBlock: 2 })); setCurrentFlag("Report") }}>Report</button>
                                <button className="training_btn" data-toggle="modal" data-dismiss="modal" href="#report-resone-block" onClick={() => { setIsReportresone(true); setReportObj(prevState => ({ ...prevState, isBlock: 1 })); setCurrentFlag("Block") }}>Block</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal fade ${isReportresone === false ? "" : "show"}`} style={{ display: `${isReportresone === false ? "none" : "block"}` }} id="report-resone-block" role="dialog">
                <div className="modal-dialog modal-dialog-centered report-trainer" role="document">
                    <div className="modal-content">
                        <button type="button" onClick={() => { setIsReportresone(false); $(".modal-backdrop").hide(); }} data-dismiss="modal" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body">
                            <div className="col-md-12 col-12">
                                <h6 className="text-primary mb-3">{currentFlag}</h6>
                                <div className="mb-4">
                                    <textarea className="w-100 Sessionrej text-primary" placeholder={`Enter reason ${currentFlag}`} value={reportObj.reason} onChange={(e) => { setReportObj(prevState => ({ ...prevState, reason: e.target.value })) }}></textarea>
                                    <div className="text-danger">{errors.report}</div>
                                    <button className="training_btn" data-dismiss="modal" onClick={() => { submitReport() }}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ClientProfile;
