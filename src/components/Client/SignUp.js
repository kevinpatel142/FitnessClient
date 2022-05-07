import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';

function SignUp() {
    const history = useHistory();
    const [isHidden, setIsHidden] = useState(true);
    const [isPwdHidden, setIsPwdHidden] = useState(true);
    const [isCPwdHidden, setIsCPwdHidden] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${apiUrl}${PORT}/account/verifytoken`, {}, {
            }).then(function (response) {
                if (response.data.status === 1) {
                    history.push("/trainer");
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, [])

    const ProfileImage_URL = '/img/Small-no-img.png';

    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    const [profileimage, setProfileImage] = useState(null);

    const [IsNext, setIsNext] = useState(0);

    const [fitnessgoal, setFitnessGoal] = useState({ fitnessgoal1: false, fitnessgoal2: false, fitnessgoal3: false });

    const [firstStepNext, setFirstStepNext] = useState({ name: '', email: '', password: '', isAgree: false });

    const [user, setUser] = useState({
        firstname: "", lastname: "", email: "", password: "", confirmpassword: "", phoneno: "", age: "", gender: "Male", heightisfeet: true, height: "", weightiskg: true, weight: "", equipmentavailable: "", fitnessgoals: "", otherfitnessgoals: "", injuriesorhelthissues: "", emailnotifications: false, maillinglist: false, textnotifications: false, webnotifications: false, mobilenotifications: false
    });

    const [errors, setErrors] = useState({});

    const [IsTAndC, setIsTAndC] = useState(false);

    const OnFileChange = event => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            setProfileImagePreview(ProfileImage_URL);
            //setProfileImage(null);
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            const fileReader = new window.FileReader();
            const file = event.target.files[0];

            setProfileImage(event.target.files[0]);

            fileReader.onload = fileLoad => {
                const { result } = fileLoad.target;
                setProfileImagePreview(result);
                //setProfileImage(result);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const handleInputs = (e) => {
        if (e.target.name === "heightisfeet")
            setUser({ ...user, [e.target.name]: !!JSON.parse(String(e.target.value).toLowerCase()) });
        if (e.target.name === "weightiskg")
            setUser({ ...user, [e.target.name]: !!JSON.parse(String(e.target.value).toLowerCase()) });
        else if (e.target.name !== "heightisfeet")
            setUser({ ...user, [e.target.name]: e.target.value });
    }

    const SelectHeight = (e, number) => {
        if (document.querySelector('#heightul li.active') !== null)
            document.querySelector('#heightul li.active').classList.remove('active');

        e.currentTarget.classList.add("active");

        user.height = number;
    }

    const SelectWeight = (e, number) => {
        if (document.querySelector('#weightul li.active') !== null)
            document.querySelector('#weightul li.active').classList.remove('active');

        e.currentTarget.classList.add("active");

        user.weight = number;
    }

    const range = (start, end, step) => {
        return Array.from(Array.from(Array(Math.ceil((end - start) / step)).keys()), x => start + x * step);
    }

    const handleFitnessGoal = (e) => {
        setFitnessGoal({ ...fitnessgoal, [e.target.name]: e.currentTarget.checked ? [e.target.value] : '' });
    }

    const handleTAndC = (e) => {
        setIsTAndC(e.currentTarget.checked);
    }

    const Next = async (e) => {
        e.preventDefault();
        let isValid = true;
        var errormsg = {};

        let reg_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let reg_numbers = /^[0-9]+$/;

        if (!profileimage) {
            //window.alert("Please upload Profile.");
            swal({
                title: "Error!",
                text: "Please upload Profile.",
                icon: "error",
                button: true
            })
            isValid = false;
        }
        if (user.firstname === "") {
            errormsg.firstname = "Please enter First Name.";
            isValid = false;
        }
        if (user.lastname === "") {
            errormsg.lastname = "Please enter Last Name.";
            isValid = false;
        }
        if (user.email === "") {
            errormsg.email = "Please enter Email.";
            isValid = false;
        }
        else if (reg_email.test(user.email) === false) {
            errormsg.email = "Please enter valid Email.";
            isValid = false;
        }
        if (user.password === "") {
            errormsg.password = "Please enter Password.";
            isValid = false;
        }
        else if (user.password.length < 6) {
            errormsg.phoneno = "Please enter valid Password.";
            isValid = false;
        }
        if (user.confirmpassword === "") {
            errormsg.confirmpassword = "Please enter Confirm Password.";
            isValid = false;
        }
        else if (user.password !== user.confirmpassword) {
            errormsg.confirmpassword = "Password and Confirm password do not match.";
            isValid = false;
        }
        if (user.phoneno === "") {
            errormsg.phoneno = "Please enter Mobile Number.";
            isValid = false;
        }
        else if (user.phoneno.length !== 10 || !reg_numbers.test(user.phoneno)) {
            errormsg.phoneno = "Please enter valid Mobile Number.";
            isValid = false;
        }

        setErrors(errormsg);
        if (isValid === true) {
            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/account/verifyemailexists`, { "email": user.email }, {
            }).then(function (response) {
                if (response.data.status === 2) {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    })
                    //window.alert(response.data.message);
                }
                else {
                    setIsNext(2);
                    localStorage.setItem("secoundStepNext", JSON.stringify(user));
                }
                document.querySelector('.loading').classList.add('d-none');
            }).catch(function (error) {
                console.log(error);
                document.querySelector('.loading').classList.add('d-none');
            });
        } else {
            setIsNext(1);
        }
    }

    const PostSignUp = async (e) => {
        e.preventDefault();
        if (fitnessgoal.fitnessgoal1 === true)
            user.fitnessgoals = "Lower Body Fat";
        if (fitnessgoal.fitnessgoal2 === true)
            user.fitnessgoals += ",Lean and Toned";
        if (fitnessgoal.fitnessgoal3 === true)
            user.fitnessgoals += ",Build Muscle";

        let isValid = true;
        var errormsg = {};

        let reg_numbers = /^[0-9]+$/;

        if (user.age === "") {
            errormsg.age = "Please enter Age.";
            isValid = false;
        }
        else if (user.age < 5 || user.age > 120 || !reg_numbers.test(user.age)) {
            errormsg.age = "Please enter valid Age.";
            isValid = false;
        }
        if (user.gender === "") {
            errormsg.gender = "Please enter Gender.";
            isValid = false;
        }
        if (user.equipmentavailable === "") {
            errormsg.equipmentavailable = "Please enter Available Equipment.";
            isValid = false;
        }
        if (user.height === "") {
            errormsg.height = "Please select Height.";
            isValid = false;
        }
        if (user.weight === "") {
            errormsg.weight = "Please select Weight.";
            isValid = false;
        }
        if (user.fitnessgoal === "" && user.otherfitnessgoals === "") {
            errormsg.fitnessgoal = "Please select or enter Fitness Goal.";
            isValid = false;
        }
        if (user.injuriesorhelthissues === "") {
            errormsg.injuriesorhelthissues = "Please enter Injuries Or Helth Issues.";
            isValid = false;
        }
        if (!IsTAndC) {
            errormsg.isAgree = "Please check Terms & Conditions!";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid === true) {
            let obj = {
                //'profile': profileimage,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'password': user.password,
                'confirmpassword': user.confirmpassword,
                'phoneno': user.phoneno,
                'age': user.age,
                'gender': user.gender,
                'heightisfeet': user.heightisfeet,
                'height': user.height,
                'weightiskg': user.weightiskg,
                'weight': user.weight,
                'equipmentavailable': user.equipmentavailable,
                'fitnessgoals': user.fitnessgoals,
                'otherfitnessgoals': user.otherfitnessgoals,
                'injuriesorhelthissues': user.injuriesorhelthissues,
                'emailnotifications': user.emailnotifications,
                'maillinglist': user.maillinglist,
                'textnotifications': user.textnotifications,
                'webnotifications': user.webnotifications,
                'mobilenotifications': user.mobilenotifications,
            }
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }
            form_data.append("profile", profileimage);
            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/account/register`, form_data, {
            }).then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    localStorage.setItem("finalSignUpRegisterStep", JSON.stringify(user));
                    localStorage.clear();
                    history.push("/signupsuccess");
                }
                //window.alert(response.data.message);
                swal({
                    title: response.data.status === 1 ? "Success!" : 'Error',
                    text: response.data.message,
                    icon: response.data.status === 1 ? "success" : 'error',
                    button: true
                })
            }).catch(function (error) {
                console.log(error);
                localStorage.removeItem("finalSignUpRegisterStep");
                document.querySelector('.loading').classList.add('d-none');
            });
        }
    }

    const handleChange = (objName, val) => {
        setFirstStepNext(prevState => ({ ...prevState, [objName]: val }));
        console.log(firstStepNext);
    }

    const firstStepSignUpNext = (e) => {
        e.preventDefault();
        let isSubmit = true;
        var errormsg = {};
        let reg_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (firstStepNext.name === "") {
            errormsg.name = "Please enter Name";
            isSubmit = false;
        }
        if (firstStepNext.password === "") {
            errormsg.password = "Please enter password";
            isSubmit = false;
        }
        if (!firstStepNext.isAgree) {
            isSubmit = false;
            errormsg.isAgree = "Please check Terms & Conditions!";
        }
        if (firstStepNext.email === "") {
            errormsg.email = "Please enter Email.";
            isSubmit = false;
        }
        else if (reg_email.test(firstStepNext.email) === false) {
            errormsg.email = "Please enter valid Email.";
            isSubmit = false;
        }
        setErrors(errormsg);
        if (isSubmit) {
            setIsNext(1);
            let nameList = (firstStepNext.name || "").split(' ');
            if (nameList.length > 1) {
                user.lastname = nameList[nameList.length - 1];
                nameList.pop();
            }
            user.firstname = nameList.map(s => s).join(' ');
            user.email = firstStepNext.email;
            user.password = firstStepNext.password;
            localStorage.setItem("firstStepNext", JSON.stringify(firstStepNext));
        }
    }


    return (
        <>
            <div className="container my-md-5 py-md-4">
                <div className="commonbox">
                    <div className="col-md-12">
                        <div className={`row ${IsNext === 0 ? "" : "d-none"}`}>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt="Logo" />
                                    <h3>Everyday is a Fresh Start.</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox registerbox">
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Let's get you started on this fitness journey</h6>
                                    </div>
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item col-md-6 col-6 w-100">
                                            <a className="nav-link text-center active" href={() => false} onClick={() => { history.push('/client/login') }} data-toggle="tab">MEMBER</a>
                                        </li>
                                        <li className="nav-item col-md-6 col-6 w-100">
                                            <a className="nav-link text-center" data-toggle="tab" href={() => false} onClick={() => { history.push('/trainersignup') }}>TRAINER</a>
                                        </li>
                                    </ul>
                                    <div className='tab-content'>
                                        <div id="MEMBER" className="container tab-pane active">
                                            <div className="row my-4">
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Name" onChange={(e) => { handleChange("name", e.target.value) }} />
                                                    <div className="text-danger">{errors.name}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Email Address" onChange={(e) => { handleChange("email", e.target.value) }} />
                                                    <div className="text-danger">{errors.email}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        {/* <input id="password-field" type="password" className="form-control w-100  mb-3 input-box" name="password" onChange={(e) => { handleChange("password", e.target.value) }} />
                                                        <span toggle="#password-field" className="fa fa-eye icon field-icon toggle-password"></span> */}
                                                        <input id="password-field" onChange={(e) => { handleChange("password", e.target.value) }} name="password" type={isHidden === true ? "password" : "text"} className="w-100 mb-3 input-box" placeholder="Password" />
                                                        <span toggle="#password-field" className={`fa fa-eye${isHidden === false ? "" : "-slash"} icon field-icon toggle-password`} onClick={() => setIsHidden(!isHidden)}></span>
                                                    </div>
                                                    <div className="text-danger">{errors.password}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="custom-control custom-checkbox my-2">
                                                        <input type="checkbox" className="custom-control-input" id="Clientreg" name="example1" onChange={(e) => { handleChange("isAgree", e.currentTarget.checked) }} />
                                                        <label className="custom-control-label terms-text" htmlFor="Clientreg"> <span className="pl-2">I agree with the <Link to="/termsandcondition" className="gray-text">Terms & Conditions</Link></span></label>
                                                    </div>
                                                    <div className="text-danger">{errors.isAgree}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button className="loginbtn mt-4" onClick={(e) => { firstStepSignUpNext(e) }}>Next</button>
                                                    {/* <a href="/Home/Registeryourself" className="loginbtn mt-4">Next</a> */}
                                                </div>
                                                <div className="col-md-12 text-center mt-3">
                                                    <span className="text-login">Already Registered ? <Link to="/client/login" className="linktext">Login</Link></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="TRAINER" className="container tab-pane fade">
                                            <div className="row my-4">
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Name" />
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Email Address" />
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        <input id="password-field" type="password" className="form-control w-100  mb-3 input-box" name="password" value="secret" />
                                                        <span toggle="#password-field" className="fa fa-eye icon field-icon toggle-password"></span>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        <input id="password-field" type="password" className="form-control w-100  mb-3 input-box" name="password" value="secret" />
                                                        <span toggle="#password-field" className="fa fa-eye icon field-icon toggle-password"></span>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="custom-control custom-checkbox mb-3">
                                                        <input type="checkbox" className="custom-control-input" id="Trainerreg" name="example1" />
                                                        <label className="custom-control-label terms-text " htmlFor="Trainerreg"><span className="pl-2">I agree with the  <Link to="/termsandcondition" className="gray-text">Terms & Conditions</Link></span></label>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button className="loginbtn mt-4">Next</button>
                                                    {/* <a href="/Home/Trainerregister" className="loginbtn mt-4">Next</a> */}
                                                </div>
                                                <div className="col-md-12 text-center mt-3">
                                                    <span>Already Registered ? <Link to="/client/login" className="linktext">Login</Link></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row  ${IsNext === 1 ? "" : "d-none"}`}>
                            <div className="loading d-none">
                                <div className="mainloader"></div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt="" />
                                    <h3>Register Yourself</h3>
                                </div>
                            </div>
                            <div className={`col-md-6 p-0`}>
                                <div className="loginbox regyourself">
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Register Yourself</h6>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="Profile">
                                                <div className="avatar-upload">
                                                    <div className="avatar-edit">
                                                        <input type="file" onChange={OnFileChange} id="imageUpload" accept=".png, .jpg, .jpeg" />
                                                        <label htmlFor="imageUpload"><i className="fas fa-camera"></i></label>
                                                    </div>
                                                    <div className="avatar-preview">
                                                        <div id="imagePreview" style={{ backgroundImage: `url(${profileimagepreview})` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8 mt-2">
                                            <div className="col-md-12">
                                                <input onChange={(e) => handleInputs(e)} value={user.firstname} name="firstname" type="text" className="w-100 mb-3 input-box" placeholder="First Name" />
                                                <div className="text-danger">{errors.firstname}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <input onChange={(e) => handleInputs(e)} value={user.lastname} name="lastname" type="text" className="w-100 mb-3 input-box" placeholder="Last Name" />
                                                <div className="text-danger">{errors.lastname}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.email} name="email" type="text" className="w-100 mb-3 input-box" placeholder="Email Address" />
                                        <div className="text-danger">{errors.email}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="position-relative">
                                            {/* <input onChange={(e) => handleInputs(e)} value={user.password} name="password" type="password" className="w-100 mb-3 input-box" placeholder="Password" />
                                            <i className="fa fa-eye icon"></i> */}
                                            <input onChange={(e) => handleInputs(e)} value={user.password} name="password" type={isPwdHidden === true ? "password" : "text"} className="w-100  mb-3 input-box" placeholder="Password" />
                                            <i className={`fa fa-eye${isPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsPwdHidden(!isPwdHidden)}></i>

                                            <div className="text-danger">{errors.password}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="position-relative">
                                            {/* <input onChange={(e) => handleInputs(e)} value={user.confirmpassword} name="confirmpassword" type="password" className="w-100  mb-3 input-box" placeholder="Confirm Password" />
                                            <i className="fa fa-eye icon"></i> */}
                                            <input onChange={(e) => handleInputs(e)} value={user.confirmpassword} name="confirmpassword" type={isCPwdHidden === true ? "password" : "text"} className="w-100  mb-3 input-box" placeholder="Confirm Password" />
                                            <i className={`fa fa-eye${isCPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsCPwdHidden(!isCPwdHidden)}></i>
                                            <div className="text-danger">{errors.confirmpassword}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.phoneno} name="phoneno"
                                            pattern="[+-]?\d+(?:[.,]\d+)?" type="number" className="w-100 mb-3 input-box" placeholder="Mobile Number" />
                                        <div className="text-danger">{errors.phoneno}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { Next(e) }} className="loginbtn mt-4">Next</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { setIsNext(0) }} className="loginbtn my-4">Back</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={`row ${IsNext === 2 ? "" : "d-none"}`}>
                            <div className="loading d-none">
                                <div className="mainloader"></div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt="" />
                                    <h3>Register Yourself</h3>
                                </div>
                            </div>

                            <div className={`col-md-6 p-0 `}>
                                <div className="loginbox regyourself">
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Register Yourself</h6>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.age} name="age" min="1" type="number" className="w-100 mb-3 input-box" placeholder="Age" />
                                        <div className="text-danger">{errors.age}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Gender</label>
                                        <div className="genderbox">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="genderblock">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input onChange={(e) => handleInputs(e)} value="Male" type="radio" checked={user.gender === "Male"} className="custom-control-input" id="Male" name="gender" />
                                                            <label className="custom-control-label" htmlFor="Male"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="genderblock genderblock1">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input onChange={(e) => handleInputs(e)} value="Female" type="radio" checked={user.gender === "Female"} className="custom-control-input" id="Female" name="gender" />
                                                            <label className="custom-control-label" htmlFor="Female"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="genderblock genderblock2">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input onChange={(e) => handleInputs(e)} value="Non-Binary" type="radio" checked={user.gender === "Non-Binary"} className="custom-control-input" id="Non-Binary" name="gender" />
                                                            <label className="custom-control-label" htmlFor="Non-Binary"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-danger">{errors.gender}</div>
                                    </div>

                                    <div className="col-md-12 col-12 my-4">
                                        <div className="d-flex justify-content-between mb-4">
                                            <label className="pt-2 mb-0">Height</label>
                                            <div className="feet-metter d-flex">
                                                <input onChange={(e) => handleInputs(e)} checked={user.heightisfeet === true} value={true} type="radio" name="heightisfeet" id="radio1" />
                                                <label className="input_lbl mr-2" htmlFor="radio1">Feet</label>
                                                <input onChange={(e) => handleInputs(e)} checked={user.heightisfeet === false} value={false} type="radio" name="heightisfeet" id="radio2" />
                                                <label className="input_lbl" htmlFor="radio2">Meters</label>
                                            </div>
                                        </div>
                                        <div className="scale-hw">
                                            <ul key="heightul" id="heightul" className="scroll">
                                                {
                                                    user.heightisfeet === true ?
                                                        range(4, 8, 1).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.1)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.2)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.3)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.4)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.5)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.6)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.7)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.8)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.9)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number)} className="list-item">
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                        :
                                                        range(100, 240, 10).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectHeight(e, number - 9)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 8)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 7)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 6)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 5)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 4)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 3)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 2)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 1)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number)} className="list-item">
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                }
                                            </ul>
                                        </div>
                                        <div className="text-danger">{errors.height}</div>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <div className="d-flex justify-content-between mb-4">
                                            <label className="pt-2 mb-0">Weight</label>
                                            <div className="feet-metter d-flex">
                                                <input onChange={(e) => handleInputs(e)} checked={user.weightiskg === true} value={true} type="radio" name="weightiskg" id="radio3" />
                                                <label className="input_lbl mr-2" htmlFor="radio3">Kg</label>
                                                <input onChange={(e) => handleInputs(e)} checked={user.weightiskg === false} value={false} type="radio" name="weightiskg" id="radio4" />
                                                <label className="input_lbl" htmlFor="radio4">Pound</label>
                                            </div>
                                        </div>
                                        <div className="scale-hw">
                                            <ul id="weightul" className="scroll">
                                                {
                                                    user.weightiskg === true ?
                                                        range(30, 210, 10).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectWeight(e, number - 9)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 8)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 7)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 6)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 5)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 4)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 3)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 2)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 1)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number)} className="list-item">
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                        :
                                                        range(30, 300, 5).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectWeight(e, number - 4)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 3)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 2)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 1)} className="list-item"><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number)} className="list-item">
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                }
                                            </ul>
                                        </div>
                                        <div className="text-danger">{errors.weight}</div>
                                    </div>

                                    <div className="col-md-12">
                                        <label>Equipment Available</label>
                                        <input onChange={(e) => handleInputs(e)} value={user.equipmentavailable} name="equipmentavailable" type="text" className="input-box w-100" placeholder="Please write available equipment or type 'none' - you'll still get sweaty either way!" />
                                        <div className="text-danger">{errors.equipmentavailable}</div>
                                    </div>

                                    <div className="col-md-12 mb-2">
                                        <label>Fitness Goals</label>
                                        <div className="fitnessgoal">
                                            <div className="cat action wrapper">
                                                <label className='option option-1'>
                                                    <input type="checkbox" value="Lower Body Fat" name="fitnessgoal1" onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal1" />
                                                    <span>Lower Body Fat</span>
                                                </label>
                                                <label className='option option-2'>
                                                    <input type="checkbox" value="Lean and Toned" name="fitnessgoal2" onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal2" />
                                                    <span>Lean and Toned</span>
                                                </label>
                                                <label className='option option-3 mr-0"' >
                                                    <input type="checkbox" value="Build Muscle" name="fitnessgoal3" onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal3" />
                                                    <span>Build Muscle</span>
                                                </label>
                                                {/* <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal1" id="fitnessgoal1" checked />
                                                <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal2" id="fitnessgoal2" />
                                                <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal3" id="fitnessgoal3" />
                                                <label htmlFor="fitnessgoal1" className="option option-1">
                                                    <span>Lower Body Fat</span>
                                                    <span><i className="fas fa-times text-white"></i></span>
                                                    <span className="dot"></span>
                                                </label>
                                                <label htmlFor="fitnessgoal2" className="option option-2">
                                                    <span>Lean and Toned</span>
                                                    <span><i className="fas fa-times text-white"></i></span>
                                                    <span className="dot"></span>
                                                </label>
                                                <label htmlFor="fitnessgoal3" className="option option-3 mr-0">
                                                    <span>Build Muscle</span>
                                                    <span><i className="fas fa-times text-white"></i></span>
                                                    <span className="dot"></span>
                                                </label> */}
                                            </div>
                                        </div>
                                        <div className="text-danger">{errors.fitnessgoal}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Others</label>
                                        <textarea onChange={(e) => handleInputs(e)} value={user.otherfitnessgoals} name="otherfitnessgoals" className="w-100 mb-4" placeholder="Please Write Any Other Fitness Goals."></textarea>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Injuries/Health Issues</label>
                                        <textarea onChange={(e) => handleInputs(e)} value={user.injuriesorhelthissues} name="injuriesorhelthissues" className="w-100 mb-4" placeholder="Let us know of any injuries or health issues you have you have or write 'none' if you have no concerns."></textarea>
                                        <div className="text-danger">{errors.injuriesorhelthissues}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <ul className="list-inline togglebox">
                                            <li>
                                                Email Notification
                                                <span className="float-right">
                                                    <label className="switch">
                                                        <input onChange={(e) => handleInputs(e)} name="emailnotifications"
                                                            defaultChecked="false" type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Mailing List
                                                <span className="float-right">
                                                    <label className="switch">
                                                        <input onChange={(e) => handleInputs(e)} name="maillinglist" defaultChecked="false" type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Text Notifications
                                                <span className="float-right">
                                                    <label className="switch">
                                                        <input onChange={(e) => handleInputs(e)} name="textnotifications" defaultChecked="false" type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Web Notifications
                                                <span className="float-right">
                                                    <label className="switch">
                                                        <input onChange={(e) => handleInputs(e)} name="webnotifications" defaultChecked="false" type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                            <li>
                                                Mobile Notifications
                                                <span className="float-right">
                                                    <label className="switch">
                                                        <input onChange={(e) => handleInputs(e)} name="mobilenotifications" defaultChecked="false" type="checkbox" className="default" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="custom-control custom-checkbox my-2">
                                            <input type="checkbox" className="custom-control-input" id="term" name="example2" onChange={(e) => { handleTAndC(e) }} />
                                            <label className="custom-control-label terms-text" htmlFor="term"><span className="pl-2">I agree to the <Link to="/termsandcondition" target="_blank" className="gray-text">Terms & Conditions</Link></span></label>
                                        </div>
                                        <div className="text-danger">{errors.isAgree}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { PostSignUp(e) }} className="loginbtn my-4">Register</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { setIsNext(1) }} className="loginbtn mt-md-4 mb-4">Back</button>
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

export default SignUp;
