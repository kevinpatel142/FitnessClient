import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
function WorkOutForm() {
    const queryStringPara = new URLSearchParams(window.location.search);
    let Id = queryStringPara.get("Id");
    const [workout, setWorkout] = useState({
        id: Id, fitnessGoals: "", desiredOne: [], desiredTwo: [], basicMovements: [], additionalNotes: "", format: ""
    });
    useEffect(() => {
        callToken();
        getWorkoutDetail();
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const getWorkoutDetail = () => {
        document.querySelector('.loading').classList.remove('d-none');
        axios.post(`${apiUrl}${PORT}/client/session/getworkout`, { id: Id })
            .then(response => {
                
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    setWorkout(response?.data?.result[0]);
                    console.log(workout);
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
                console.log(error);
                document.querySelector('.loading').classList.add('d-none');
            });
    }

    const ShowWorkoutForm = () => {
        $("#dvWorkoutSummary").removeClass("d-none");
        $("#dvWorkoutForm").addClass("d-none");
    };
    return (
        <>
            <div className="container-fluid">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                <div className="col-md-12 col-12 p-0">
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <h1 className="main_title">Past Session Detail</h1>
                        </div>
                        <div className="col-md-12 col-12 mb-3">
                            <div className="info-bg">
                                <img src={`${apiUrl}${PORT}${workout?.trainer_data?.coverprofile}`} onError={(e) => { e.target.src = "/img/Back-No-Image.png" }} alt="img" />
                            </div>
                        </div>
                        <div className="col-md-12 col-12" id="dvWorkoutForm">
                            <h1 className="main_title mb-2 pt-2">{workout?.trainer_data?.firstname}</h1>
                            <div className="col-md-4 col-12 pl-0 mb-5">
                                <div className="workout-dt d-flex justify-content-between">
                                    <div className="">{workout?.trainer_data?.trainingstyle}</div>
                                </div>
                                <div className="workout-dt d-flex justify-content-between">
                                    <div className="pt-2">
                                        <span className="pr-4">{workout?.date ? new Date(workout?.date).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' }) : ''}</span>
                                        <span className="pr-2">
                                            {workout?.starthour || workout?.endhour ?
                                                <>
                                                    <i className="far fa-clock pr-2"></i>
                                                    {workout?.starthour ? workout?.starthour?.split(':')[0] + ":" + workout?.starthour?.split(':')[1] + " " + workout?.starthour?.split(' ')[1] : ''}&nbsp;to&nbsp;
                                                    {workout?.endhour ? workout?.endhour?.split(':')[0] + ":" + workout?.endhour?.split(':')[1] + " " + workout?.endhour?.split(' ')[1] : ''}
                                                </>
                                                : ''
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-6 col-12 pl-0">
                                <button className="post-workout" onClick={() => { ShowWorkoutForm() }}><i className="far fa-file file_i"></i>Post-Workout Form <i className="fas fa-chevron-right right_i"></i></button>
                            </div>
                        </div>
                        <div className="col-md-12 col-12 d-none" id="dvWorkoutSummary">
                            <h2 className="main_title mb-4 pt-4">Workout Summary</h2>
                            <div className="workout_Summary">
                                <div className="row mb-3">
                                    <div className="col-md-2 col-12">
                                        <label>Fitness Goals</label>
                                        <p>{workout?.sessionworkout?.fitnessGoals || "N/A"}</p>
                                    </div>
                                    <div className="col-md-4 col-12">
                                        <label>Major focus on today to achieve desired fitness goals.</label>
                                        {workout?.sessionworkout?.desiredOne.length > 0 ?
                                            <>
                                                {workout?.sessionworkout?.desiredOne?.map((ele, index) => {
                                                    return <p key={index}>{ele}</p>
                                                })}
                                            </>
                                            :
                                            <>
                                                <p>N/A</p>
                                            </>
                                        }
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <label>Which planes of motion did you work on today?</label>
                                        {workout?.sessionworkout?.desiredTwo.length > 0 ?
                                            <>
                                                {workout?.sessionworkout?.desiredTwo?.map((ele, index) => {
                                                    return <p key={index}>{ele}</p>
                                                })}
                                            </>
                                            :
                                            <>
                                                <p>N/A</p>
                                            </>
                                        }
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <label>Additional Notes</label>
                                        <p>{workout?.sessionworkout?.additionalNotes || "N/A"}</p>
                                    </div>
                                </div>
                                {workout?.sessionworkout?.basicMovements.length > 0 && workout?.sessionworkout?.basicMovements?.map((ele, index) => {
                                    return <div className="row mb-3">
                                        <div className="col-lg-4 col-md-6 col-12">
                                            {index === 0 ? <label>7 basic movements you work on today</label> : ""}
                                            <p>{ele.movementName}</p>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-12">
                                            <label>Specify Movement</label>
                                            <p>{ele.specifyMovement ? ele.specifyMovement : "N/A"}</p>
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <div className="row">
                                                <div className="col-md-6 col-12 mb-2">
                                                    <label>Sets</label>
                                                    <p>{ele.sets || "-"}</p>
                                                </div>
                                                <div className="col-md-6 col-12 mb-2">
                                                    <label>Reps</label>
                                                    <p>{ele.reps || "-"}</p>
                                                </div>
                                                <div className="col-md-6 col-12 mb-2">
                                                    <label>Weight</label>
                                                    <p>{ele.weight || "-"}</p>
                                                </div>
                                                <div className="col-md-6 col-12 mb-2">
                                                    <label>Rest Duration</label>
                                                    <p>{ele.restDuration || "-"}</p>
                                                </div>
                                                <div className="col-md-12 col-12 mb-2">
                                                    <label>Format</label>
                                                    <p>{workout?.sessionworkout.format || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WorkOutForm;
