import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
function SessionDetails() {
    const [basicMovementsArr, setBasicMovementsArr] = useState([]);
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [sessionId, setSessionId] = useState();
    const [weightList, setWeight] = useState([]);
    const [restDurationList, setRestDuration] = useState([]);
    const [setsList, setSets] = useState([]);
    const [repsList, setReps] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const queryStringPara = new URLSearchParams(window.location.search);
    let sesId = queryStringPara.get("id");

    const [workout, setWorkout] = useState({
        id: sesId, fitnessGoals: "", desiredOne: "", desiredTwo: "", basicMovements: [], additionalNotes: "", format: ""
        , createdate: ''
    });

    var loginUser = {};
    //const loginuserrole = localStorage.getItem('usertype');
    const loginuserdetail = localStorage.getItem('user');
    if (loginuserdetail) {
        loginUser = JSON.parse(loginuserdetail);
    }

    useEffect(() => {
        setSessionId(sesId);
        callToken();
        GetMasterList();
    }, [sesId])

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const [desiredOneArr, setDesiredOneArr] = useState([]);
    const changeDesiredOne = (bool, value) => {
        if (bool === true) {
            desiredOneArr.push(value);
            setDesiredOneArr([...new Set(desiredOneArr)])
        }
        else {
            setDesiredOneArr([...new Set(desiredOneArr.filter(item => item !== value))]);
        }
        handleChange("desiredOne", desiredOneArr);
    }

    async function GetMasterList() {
        setIsLoader(true);
        await axios.get(`${apiUrl}${PORT}/admin/getmovementlist`).then(function (response) {
            setIsLoader(false);
            if (response.data.status === 1) {
                if (response?.data?.result) {
                    debugger
                    setWeight(response?.data?.result.filter(x => x?.name === 'Weight'));
                    setRestDuration(response?.data?.result.filter(x => x?.name === 'Rest Duration'));
                    setSets(response?.data?.result.filter(x => x?.name === 'Sets'));
                    setReps(response?.data?.result.filter(x => x?.name === 'Reps'));
                }
            }
            else {
                swal({
                    title: "Error!",
                    text: response.data.message,
                    icon: "error",
                    button: true
                })
            }
        }).catch(function (error) {
            setIsLoader(false);
            swal({
                title: "Error!",
                text: error,
                icon: "error",
                button: true
            })
        });
    };

    const [desiredTwoArr, setDesiredTwoArr] = useState([]);
    const changeDesiredTwo = (bool, value) => {
        if (bool === true) {
            desiredTwoArr.push(value);
            setDesiredTwoArr([...new Set(desiredTwoArr)])
        }
        else {
            setDesiredTwoArr([...new Set(desiredTwoArr.filter(item => item !== value))]);
        }
        handleChange("desiredTwo", desiredTwoArr);
    }

    const changebBasicMovements = (bool, value) => {
        if (bool === true) {
            basicMovementsArr.push(
                {
                    movementName: value,
                    specifyMovement: "",
                    weight: "",
                    restDuration: "",
                    sets: "",
                    reps: ""

                }
            );
            setBasicMovementsArr([...new Set(basicMovementsArr)]);
        }
        else {
            setBasicMovementsArr([...new Set(basicMovementsArr.filter(item => item.movementName !== value))]);
        }
        handleChange("basicMovements", basicMovementsArr);
    }
    const handleDyanamicVal = (name, type, val) => {
        let obj = workout.basicMovements.filter(x => x.movementName === name)[0];
        obj[type] = val
        handleChange("basicMovements", workout.basicMovements);
    }

    const handleChange = (objName, val) => {
        if (val)
            setWorkout(prevState => ({ ...prevState, [objName]: val }));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        var errormsg = {};
        workout.id = sessionId;
        if (workout.fitnessGoals === "") {
            errormsg.fitnessGoals = "Please select fitness goals!";
            isValid = false;
        }
        if (workout.basicMovements.length === 0) {
            errormsg.basicMovements = "Please select atleast one movement!";
            isValid = false;
        }

        if (workout.additionalNotes === "") {
            errormsg.additionalNotes = "Please write additional notes!";
            isValid = false;
        }
        if (workout.format === "") {
            errormsg.format = "Please select format!";
            isValid = false;
        }
        workout.createdate = new Date();
        setErrors(errormsg);
        if (isValid) {
            setIsLoader(true);
            axios.post(`${apiUrl}${PORT}/trainer/session/workout`, workout)
                .then(response => {
                    setIsLoader(false);
                    if (response.data.status === 1) {
                        swal({
                            title: "Success!",
                            text: response.data.message,
                            icon: "success",
                            button: true
                        })
                        setTimeout(() => {
                            history.push("/schedulerequest");
                        }, 1500);
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
                    setIsLoader(false);
                });
        }
    }
    return (
        <>
            {isLoader &&
                <div className="loading">
                    <div className="mainloader"></div>
                </div>
            }
            <div className="container-fluid">
                <div className="fixedblock">
                    <h1 className="main_title mb-3">Workout From</h1>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="grayarea d-flex justify-content-between">
                                <h6>Name</h6>
                                <p>{loginUser?.firstname || "Guest"}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="grayarea d-flex justify-content-between">
                                <h6>Age</h6>
                                <p>{loginUser?.age || "N/A"}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="grayarea d-flex justify-content-between">
                                <h6>Injuries</h6>
                                <p>{loginUser?.injuriesorhelthissues || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row scrollblock sessionbox">
                    <div className="col-md-6">
                        <div className="position-relative">
                            <label className="text-primary font-weight-bold mb-3">Fitness Goals</label>
                            <select className="input-box cursor-pointer" value={workout.fitnessGoals} onChange={(e) => { handleChange("fitnessGoals", e.target.value) }}
                                placeholder="Select fitness goals">
                                <option value=''>Select fitness goals</option>
                                <option value='Lean'>Lean</option>
                                <option value='Fitness'>Fitness</option>
                            </select>
                            <i className="fas fa-chevron-down arrow_i"></i>
                            <div className="text-danger">{errors.fitnessGoals}</div>
                        </div>
                        <label className="text-primary font-weight-bold mb-3">What did you focus on today to achieve. Your Client desired fitness goals?</label>
                        <div className="checkboxblock filter-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox  mb-2 ">
                                        <input type="checkbox" className="custom-control-input" id="goal1" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Mobility'); }} />
                                        <label className="custom-control-label" htmlFor="goal1">Mobility </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal2" name="goal2" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Strength'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal2">Strength</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal3" name="goal3" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Endurance'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal3">Endurance</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal4" name="goal4" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Pain Management'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal4">Pain Management </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal5" name="goal5" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Hypertrophy'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal5">Hypertrophy</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal6" name="goal6" onChange={(e) => { changeDesiredOne(e.currentTarget.checked, 'Conditioning'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal6">Conditioning</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className="text-primary font-weight-bold my-3">What did you focous on today to achieve your client's desired fitness goals?</label>
                        <div className="checkboxblock filter-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal7" name="goal7" onChange={(e) => { changeDesiredTwo(e.currentTarget.checked, 'Lateral'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal7">Lateral</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal8" name="goa8" onChange={(e) => { changeDesiredTwo(e.currentTarget.checked, 'Saggital'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal8">Saggital</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal9" name="goal9" onChange={(e) => { changeDesiredTwo(e.currentTarget.checked, 'Transversv'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal9">Transversv </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label className="text-primary font-weight-bold my-3">Which of the 7 basic Movements did you work on today? (check all the apply)</label>
                        <div className="checkboxblock filter-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal10" name="goal10" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Vertical Push'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal10">Vertical Push</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal11" name="goal11" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Horizontal Push'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal11">Horizontal Push</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal12" name="goal12" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Horizontal Pull'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal12">Horizontal Pull </label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal13" name="goal13" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Core'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal13">Core</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal14" name="goal14" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Vertical Pull'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal14">Vertical Pull</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal15" name="goal15" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Hip Dominant'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal15">Hip Dominant</label>
                                    </div>
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input type="checkbox" className="custom-control-input" id="goal16" name="goal16" onChange={(e) => { changebBasicMovements(e.currentTarget.checked, 'Knee Dominant'); }} />
                                        <label className="custom-control-label text-primary" htmlFor="goal16">Knee Dominant</label>
                                    </div>
                                </div>
                            </div>
                            <div className="text-danger">{errors.basicMovements}</div>
                        </div>
                        <label className="text-primary font-weight-bold my-3">Additional Notes</label>
                        <textarea className="w-100 Sessionrej text-primary mb-3" placeholder="Write Your Notes" onChange={(e) => { handleChange("additionalNotes", e.target.value) }}></textarea>
                        <div className="text-danger">{errors.additionalNotes}</div>
                        <div className="position-relative">
                            <label className="text-primary font-weight-bold my-3">Format</label>
                            <select className="input-box cursor-pointer" onChange={(e) => { handleChange("format", e.target.value) }}
                                placeholder='Select format'>
                                <option value=''>Select format</option>
                                <option value='Circuits'>Circuits</option>
                                <option value='Format'>Format </option>
                            </select>
                            <i className="fas fa-chevron-down arrow_i"></i>
                            <div className="text-danger">{errors.format}</div>
                        </div>
                    </div>
                    <div className="col-md-6 position-relative">
                        <div className="subscrollbox">
                            <div className="dashbgimg">
                                <img src="/img/gym-workout.png" alt='Logo' />
                            </div>
                            {workout.basicMovements.length > 0 ?
                                <>
                                    {workout.basicMovements.map((ele, index) => {
                                        return (<>
                                            <div key={index} className="col-md-12">
                                                <h6 className="text-primary">{ele.movementName}</h6>
                                                <label className="text-primary">Specify Movement</label>
                                                <input className="input-box" placeholder="pushup" value={ele.specifyMovement} onChange={(e) => { handleDyanamicVal(ele.movementName, "specifyMovement", e.target.value) }} />
                                            </div>
                                            <div className="d-flex">
                                                <div className="col-md-6">
                                                    <label>Weight</label>
                                                    <select className="input-box cursor-pointer" placeholder="Select weight" onChange={(e) => { handleDyanamicVal(ele.movementName, "weight", e.target.value) }}>
                                                        <option value=''>Select weight</option>
                                                        {weightList.length > 0 && weightList.map((w) => {
                                                            return <option value={w.value}>{w.value}</option>
                                                        })}
                                                    </select>
                                                    <i className="fas fa-chevron-down arrow_i"></i>
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Rest Duration</label>
                                                    <select className="input-box cursor-pointer" placeholder="Select rest duration" onChange={(e) => { handleDyanamicVal(ele.movementName, "restDuration", e.target.value) }}>
                                                        <option value=''>Select rest duration </option>
                                                        {restDurationList.length > 0 && restDurationList.map((w) => {
                                                            return <option value={w.value}>{w.value}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <div className="col-md-6">
                                                    <label>Sets</label>
                                                    <select className="input-box cursor-pointer" placeholder="Select sets" onChange={(e) => { handleDyanamicVal(ele.movementName, "sets", e.target.value) }}>
                                                        <option value=''>Select sets</option>
                                                        {setsList.length > 0 && setsList.map((w) => {
                                                            return <option value={w.value}>{w.value}</option>
                                                        })}
                                                    </select>
                                                    <i className="fas fa-chevron-down arrow_i"></i>
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Reps</label>
                                                    <select className="input-box cursor-pointer" placeholder="Select reps" onChange={(e) => { handleDyanamicVal(ele.movementName, "reps", e.target.value) }}>
                                                        <option value=''>Select reps</option>
                                                        {repsList.length > 0 && repsList?.map((w) => {
                                                            return <option value={w.value}>{w.value}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </>)
                                    })}
                                </>
                                :
                                <>
                                    <div className="col-12">
                                        <h4 className="no-record-box">
                                            <i className="fa fa-exclamation-triangle alerticon"></i>
                                            No any one apply 7 basic movements!
                                        </h4>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div onClick={(e) => { onSubmit(e) }} className="loginbtn w-25 mx-auto d-block mt-5">Submit</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SessionDetails;
