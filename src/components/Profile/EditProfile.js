import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
function EditProfile() {
    const history = useHistory();
    const ProfileImage_URL = '/img/Small-no-img.png';
    const [isOwdHidden, setIsOwdHidden] = useState(true);
    const [isPwdHidden, setIsPwdHidden] = useState(true);
    const [isCPwdHidden, setIsCPwdHidden] = useState(true);
    const [user, setUser] = useState({
        firstname: "", lastname: "", email: "", countryCode: null, oldpassword: "", password: "", confirmpassword: "", phoneno: "", age: "", gender: "Male", heightisfeet: true, height: "", weightiskg: true, weight: "", equipmentavailable: "", fitnessgoals: "", otherfitnessgoals: "", injuriesorhelthissues: "", emailnotifications: false, maillinglist: false, textnotifications: false, webnotifications: false, mobilenotifications: false
    });
    const [fitnessgoal, setFitnessGoal] = useState([]);
    const [progressphotos, setProgressphotos] = useState([]);
    const [mask, setMask] = useState()
    const [mobileNumber, setMobilenumber] = useState('')
    //const [isView, setIsView] = useState(false);
    const [country, setCountry] = useState([]);
    useEffect(() => {
        callToken();
        fetchProfile(0);
        GetCountryList();
    }, [])

    const beautifyMobileNumber = (rowMobileNumber) => {
        let index = 0
        let mobileNumber = ''
        if (mask !== undefined) {
            if (mask.length < rowMobileNumber.length) {
                return
            }
            for (const letter of rowMobileNumber.trim()) {
                /* console.log("1st", mask.charAt(index) == '_');
                console.log("2nd", mask.charAt(index) == '(');
                console.log("3rd", mask.charAt(index) == ')');
                console.log("letter", letter); */
                if (mask.charAt(index) == '_') {
                    mobileNumber = mobileNumber + letter
                } else if (mask.charAt(index) == '(') {
                    mobileNumber = mobileNumber + letter
                }
                else if (mask.charAt(index) == ')') {
                    mobileNumber = mobileNumber + letter
                }
                else {
                    mobileNumber = mobileNumber + letter
                }
                index++
            }
            // console.log("mobileNumber",mobileNumber)
        }
        setMobilenumber(mobileNumber)

    }

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const handleInputs = (e) => {
        if (e.target.name === "heightisfeet")
            setUser({ ...user, [e.target.name]: !!JSON.parse(String(e.target.value).toLowerCase()) });
        if (e.target.name === "weightiskg")
            setUser({ ...user, [e.target.name]: !!JSON.parse(String(e.target.value).toLowerCase()) });
        else if (e.target.name !== "heightisfeet")
            setUser({ ...user, [e.target.name]: e.target.value });

    }
    const [errors, setErrors] = useState({});
    const fetchProfile = async (val) => {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.get(`${apiUrl}${PORT}/client/account/getprofile`, {}, {}
        ).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                response.data.result.oldpassword = ""; response.data.result.password = ""; response.data.result.confirmpassword = "";
                setUser(response.data.result);
                setMobilenumber(response.data.result.phoneno);
                user.height = response.data.result.height;
                user.weight = response.data.result.weight;
                if (response.data.result.fitnessgoals.length > 0) {
                    var list = response.data.result.fitnessgoals.split(',');
                    list.forEach(element => {
                        fitnessgoal.push(element)
                    });
                    setFitnessGoal(fitnessgoal);
                }
                /* response.data.result.progressphotos.push({ date: new Date(), list: [] }); */
                setProgressphotos(response.data.result.progressphotos);

                /* localStorage.setItem("progressphotos", JSON.stringify(response.data.result.progressphotos)); */
                /* setProgressphotos(JSON.parse(localStorage.getItem("progressphotos"))); */
                /* console.log(progressphotos); */
                // console.log(response.data?.result?.profile != "null");
                console.log("response",response);
                let profileImage = response.data?.result?.profile != "null" && response.data?.result?.profile != "" ? apiUrl + PORT + response.data?.result?.profile : ProfileImage_URL
                // console.log("profileImage", profileImage);
                setProfileImagePreview(profileImage);
                setProfileImage(profileImage);
                if (val === 1) {
                    const loginuserdetail = localStorage.getItem('user');
                    var loginUser = {};
                    if (loginuserdetail) {
                        loginUser = JSON.parse(loginuserdetail);
                        loginUser.profile = response.data?.result?.profile;
                        localStorage.setItem('user', JSON.stringify(loginUser));
                    }
                }
            }
        }).catch(function (error) {
            console.log(error);
        });
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
        if (e.currentTarget.checked) {
            fitnessgoal.push(e.target.value)
            setFitnessGoal(fitnessgoal.map(x => x));
            user.fitnessgoals = fitnessgoal.map(x => x).join(',');
        }
        else {
            setFitnessGoal(fitnessgoal.filter(x => x !== e.target.value));
            user.fitnessgoals = fitnessgoal.filter(x => x !== e.target.value).join(',');
        }
    }

    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    const [profileimage, setProfileImage] = useState(null);
    const OnFileChange = (event) => {
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
                //setProfileImage(result);
                setProfileImagePreview(result);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const PostEditProfile = async (e) => {
        e.preventDefault();
        /* if (fitnessgoal.fitnessgoal1 === true)
            user.fitnessgoals = "Lower Body Fat";
        if (fitnessgoal.fitnessgoal2 === true)
            user.fitnessgoals += ",Lean and Toned";
        if (fitnessgoal.fitnessgoal3 === true)
            user.fitnessgoals += ",Build Muscle"; */

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
        if (fitnessgoal === "" && user.otherfitnessgoals === "") {
            errormsg.fitnessgoal = "Please select or enter Fitness Goal.";
            isValid = false;
        }
        if (user.injuriesorhelthissues === "") {
            errormsg.injuriesorhelthissues = "Please enter Injuries Or Helth Issues.";
            isValid = false;
        }
        // if (user.password || user.confirmpassword || user.oldpassword) {
        //     if (user.password !== user.confirmpassword) {
        //         errormsg.password = "Password and confirm password solud be same!";
        //         isValid = false;
        //     }
        // }
        if (user.oldpassword !== "" && user.password !== "" && user.confirmpassword !== "") {
            // if (user.oldpassword == "") {
            //     errormsg.password = "Old Password not same as current password";
            //     isSubmit = false;
            // }
            if (user.confirmpassword === "") {
                errormsg.password = "Please enter confirm password";
                isValid = false;
            }
            if (user.password !== user.confirmpassword) {
                errormsg.password = "Please enter same password & confirm password";
                isValid = false;
            }
        }
        setErrors(errormsg);
        if (isValid === true) {
            // console.log("progressphotos", typeof (progressphotos[0]));
            // user.phoneno = mobileNumber;
            let obj = {
                //'profile': profileimage,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'phoneno': mobileNumber,
                'age': user.age,
                'gender': user.gender,
                'heightisfeet': user.heightisfeet,
                'height': user.height,
                'weightiskg': user.weightiskg,
                'weight': user.weight,
                'equipmentavailable': user.equipmentavailable,
                'fitnessgoals': fitnessgoal.join(','),
                'otherfitnessgoals': user.otherfitnessgoals,
                'injuriesorhelthissues': user.injuriesorhelthissues,
                'emailnotifications': user.emailnotifications,
                'maillinglist': user.maillinglist,
                'textnotifications': user.textnotifications,
                'webnotifications': user.webnotifications,
                'mobilenotifications': user.mobilenotifications,

                'oldpassword': user.oldpassword,
                'password': user.password,
                'confirmpassword': user.confirmpassword,
                // 'progressphotos': progressphotos,
            }
            console.log("obj", obj);
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }

            console.log("profileimage", typeof (profileimage));

            let profile = profileimage;
            if (typeof (profileimage) == 'string') {
                profile = profileimage.split(apiUrl + PORT);
                profile = profile[1];
                setProfileImage(...profileimage, profile);
            }

            if (profileimage?.type === undefined) {
                form_data.append("edprofile", profile);
            } else {
                form_data.append("profile", profile);
            }
            
            if (progressphotos?.type === undefined) {
                form_data.append('edprogressphotos', progressphotos);
            } else {
                form_data.append("progressphotos", progressphotos);
            }



            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/client/account/updateprofile`, form_data, {
            }).then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                // console.log("response", response);
                if (response.data.status === 1) {
                    localStorage.setItem("progressphotos", []);
                    // localStorage.setItem("user", []);
                    // console.log("response", response);
                    localStorage.setItem('user', JSON.stringify(response.data.result));
                    // history.push("/editprofile");
                    fetchProfile(1);
                    swal({
                        title: "Success!",
                        text: response.data.message,
                        icon: "success",
                        button: true
                    })
                } else {
                    //window.alert(response.data.message);
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    })
                }
            }).catch(function (error) {
                document.querySelector('.loading').classList.add('d-none');
            });
        }
    }

    const pageNavigate = (e) => {
        e.preventDefault();

        //setIsView(true);
        localStorage.setItem("progressphotos", JSON.stringify(progressphotos));
        history.push("/viewphoto");
    }

    const inputProgressImage = (event) => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            const file = event.target.files[0];
            // console.log(file);
            /* result.push(Object.values(file));
            const result = Object.keys(file).map((key) => file[key]);
            console.log("file",typeof(result[Object.keys(result)[0]]));
            
            console.log("result",result[Object.keys(result)[0]]); */
            setProgressphotos(file);
        }
    };
    /* const inputProgressImage = (event, obj) => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            // debugger
            const fileReader = new window.FileReader();
            const file = event.target.files[0];
            this.setState({ files: [...this.state.files, ...e.target.files] })
            if (file) {
                fileReader.onload = fileLoad => {
                    const { result } = fileLoad.target;
                     if (getAllPhotos.length > 0) {
                        if (obj && obj.date === getAllPhotos.filter(x => x.date === obj.date)[0]?.date) {
                            getAllPhotos.filter(x => x.date === obj.date)[0].list.push(file);
                            getAllPhotos.filter(x => x.date === obj.date)[0].base64Img.push(result);
                        }
                    } else {
                        obj.list.push(file);
                        obj.base64Img.push(result);
                        setGetAllPhotos(old => [...old, obj]);
                    }
                    setProfileImagePreview(result);
                    setProfileImage(file);
                };
                fileReader.readAsDataURL(file);
            }
        }
    }; */
    async function GetCountryList() {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.get(`${apiUrl}${PORT}/admin/getcountrylist`).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                setCountry(response?.data?.result)
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
            document.querySelector('.loading').classList.add('d-none');
            swal({
                title: "Error!",
                text: error,
                icon: "error",
                button: true
            })
        });
    };

    return (
        <>
            <div className="container-fluid">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                <div className="col-md-12 col-12 p-0">
                    <div className="row mb-5">
                        <div className="col-6">
                            <h1 className="main_title">My Profile</h1>
                        </div>
                        <div className="col-md-6 col-12 text-right">
                            <a className="noti-btn" href="/notifications"><i className="fas fa-cog"></i></a>
                        </div>
                    </div>
                    {/* <form encType='multipart/form-data'> */}
                    <div className="edit-profile">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <div className="row myprofile">
                                    <div className="col-md-4 col-12 mb-2">
                                        <div className="edit_proimg avatar-upload">
                                            <div className="avatar-edit">
                                                <input type='file' onChange={OnFileChange} id="imageUpload" accept=".png, .jpg, .jpeg" />
                                                <label htmlFor="imageUpload"></label>
                                            </div>
                                            <div className="avatar-preview">
                                                {<div id="imagePreview" style={{ backgroundImage: `url(${profileimagepreview})` }}></div>}
                                                {/* <img src={profileimagepreview} /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 col-12 pl-md-0 mb-2">
                                        <div className="row">
                                            <div className="col-12">
                                                <input onChange={(e) => handleInputs(e)} value={user.firstname} name="firstname" type="text" className="w-100  mb-4 input-box" placeholder="First Name" />
                                                <div className="text-danger">{errors.firstname}</div>
                                            </div>
                                            <div className="col-12">
                                                <input onChange={(e) => handleInputs(e)} value={user.lastname} name="lastname" type="text" className="w-100  mb-4 input-box" placeholder="Last Name" />
                                                <div className="text-danger">{errors.lastname}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.email} name="email" type="text" className="w-100 mb-4 input-box" placeholder="Email Address" />
                                        <div className="text-danger">{errors.email}</div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-4">
                                        <div className="input-group">
                                            <select className="input-box" value={user.countryCode}
                                                onChange={(e) => {
                                                    debugger
                                                    user.countryCode = e.target.value;
                                                    user.phoneno = '';
                                                        setUser(user);
                                                    setMask(country.filter(x => x.code == e.target.value)[0]?.mask) // mask
                                                }}>
                                                <option value="">Select country</option>
                                                {country.length > 0 && country.map((x => {
                                                    return <option value={x.code}>{x.name}</option>
                                                }))}
                                            </select>
                                            <div className="text-danger">{errors.countryCode}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 col-8">
                                        <input
                                            placeholder={mask}
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="cc-number"
                                            name="cardNumber"
                                            id="cardNumber"
                                            value={mobileNumber}
                                            onChange={(event) => {
                                                if (event.target.value.length === 11)
                                                            return;
                                                const { value } = event.target
                                                // console.log("value",value);
                                                beautifyMobileNumber(value);
                                            }}
                                            className="w-100 mb-4 input-box"
                                        />
                                        {/* <input onChange={(e) => {
                                            if (e.target.value.length === 11)
                                                return;

                                            handleInputs(e)
                                        }} value={user.phoneno} name="phoneno" className="w-100  mb-4 input-box" placeholder="Mobile Number"
                                        /> */}
                                        <div className="text-danger">{errors.phoneno}</div>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.age} name="age" min="1" type="number" className="w-100 mb-4 input-box" placeholder="Age" />
                                        <div className="text-danger">{errors.age}</div>
                                    </div>
                                    <div className="col-md-12 col-12">
                                        <h6 className="text-blue">Gender</h6>
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
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.1)} className={`list-item ${user.height === ((number - 1) + 0.1) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.2)} className={`list-item ${user.height === ((number - 1) + 0.2) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.3)} className={`list-item ${user.height === ((number - 1) + 0.3) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.4)} className={`list-item ${user.height === ((number - 1) + 0.4) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.5)} className={`list-item ${user.height === ((number - 1) + 0.5) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.6)} className={`list-item ${user.height === ((number - 1) + 0.6) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.7)} className={`list-item ${user.height === ((number - 1) + 0.7) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.8)} className={`list-item ${user.height === ((number - 1) + 0.8) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, (number - 1) + 0.9)} className={`list-item ${user.height === ((number - 1) + 0.9) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number)} className={`list-item ${user.height === number ? "active" : ""}`}>
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                        :
                                                        range(100, 240, 10).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectHeight(e, number - 9)} className={`list-item ${user.height === ((number - 9)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 8)} className={`list-item ${user.height === ((number - 8)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 7)} className={`list-item ${user.height === ((number - 7)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 6)} className={`list-item ${user.height === ((number - 6)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 5)} className={`list-item ${user.height === ((number - 5)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 4)} className={`list-item ${user.height === ((number - 4)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 3)} className={`list-item ${user.height === ((number - 3)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 2)} className={`list-item ${user.height === ((number - 2)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number - 1)} className={`list-item ${user.height === ((number - 1)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectHeight(e, number)} className={`list-item ${user.height === (number) ? "active" : ""}`}>
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
                                                                <li onClick={(e) => SelectWeight(e, number - 9)} className={`list-item ${user.weight === ((number - 9)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 8)} className={`list-item ${user.weight === ((number - 8)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 7)} className={`list-item ${user.weight === ((number - 7)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 6)} className={`list-item ${user.weight === ((number - 6)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 5)} className={`list-item ${user.weight === ((number - 5)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 4)} className={`list-item ${user.weight === ((number - 4)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 3)} className={`list-item ${user.weight === ((number - 3)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 2)} className={`list-item ${user.weight === ((number - 2)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 1)} className={`list-item ${user.weight === ((number - 1)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number)} className={`list-item ${user.weight === number ? "active" : ""}`}>
                                                                    <span className="line-height"></span>
                                                                    <label>{number}</label>
                                                                </li>
                                                            </span>
                                                        )
                                                        :
                                                        range(30, 300, 5).map((number, index) =>
                                                            <span key={Math.random().toString(36).substr(2, 9)}>
                                                                <li onClick={(e) => SelectWeight(e, number - 4)} className={`list-item ${user.weight === ((number - 4)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 3)} className={`list-item ${user.weight === ((number - 3)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 2)} className={`list-item ${user.weight === ((number - 2)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number - 1)} className={`list-item ${user.weight === ((number - 1)) ? "active" : ""}`}><span className="line-height subline"></span></li>
                                                                <li onClick={(e) => SelectWeight(e, number)} className={`list-item ${user.weight === number ? "active" : ""}`}>
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
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="row pl-md-4">
                                    <div className="col-12">
                                        <label>Equipment Available</label>
                                        <input onChange={(e) => handleInputs(e)} value={user.equipmentavailable} name="equipmentavailable" type="text" className="input-box w-100 mb-4" placeholder="Treadmill" />
                                        <div className="text-danger">{errors.equipmentavailable}</div>
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label>Fitness Goals</label>
                                        <div className="fitnessgoal">
                                            {/* <div className="wrapper">
                                                <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal1" id="fitnessgoal1" defaultChecked={false} />
                                                <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal2" id="fitnessgoal2" defaultChecked={false} />
                                                <input onChange={(e) => handleFitnessGoal(e)} type="checkbox" name="fitnessgoal3" id="fitnessgoal3" defaultChecked={false} />
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
                                                </label>
                                            </div> */}
                                            <div className="cat action wrapper">
                                                <label className='option option-1'>
                                                    <input type="checkbox" value="Lower Body Fat" name="fitnessgoal1" checked={user?.fitnessgoals?.split(',').filter(x => x === "Lower Body Fat").length > 0} onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal1" />
                                                    <span>Lower Body Fat</span>
                                                </label>
                                                <label className='option option-2'>
                                                    <input type="checkbox" value="Lean and Toned" name="fitnessgoal2" checked={user?.fitnessgoals?.split(',').filter(x => x === "Lean and Toned").length > 0} onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal2" />
                                                    <span>Lean and Toned</span>
                                                </label>
                                                <label className='option option-3 mr-0"' >
                                                    <input type="checkbox" value="Build Muscle" name="fitnessgoal3" checked={user?.fitnessgoals?.split(',').filter(x => x === "Build Muscle").length > 0} onChange={(e) => handleFitnessGoal(e)} id="fitnessgoal3" />
                                                    <span>Build Muscle</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="text-danger">{errors.fitnessgoal}</div>
                                    </div>
                                    <div className="col-12">
                                        <label>Others</label>
                                        <textarea onChange={(e) => handleInputs(e)} value={user.otherfitnessgoals} name="otherfitnessgoals" className="w-100 mb-3 other-txtarea" placeholder="Please Write Any Other Fitness Goals."></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label>Injuries/Health Issues</label>
                                        <textarea onChange={(e) => handleInputs(e)} value={user.injuriesorhelthissues} name="injuriesorhelthissues" className="w-100 mb-4 txt-area" placeholder="Let us know of any injuries or health issues you have you have or write 'none' if you have no concerns."></textarea>
                                        <div className="text-danger">{errors.injuriesorhelthissues}</div>
                                    </div>
                                    <div className="col-12">
                                        <label className="mt-2 mb-3">Progress Photos</label>
                                        <div className="banner-btn float-right mt-0 mb-3" onClick={(e) => { pageNavigate(e) }}> VIEW</div>
                                        {/* <Link className="banner-btn float-right mt-0 mb-3" to="/viewphoto">VIEW</Link> */}
                                        <a className="upload_btn mb-4" href="/viewphoto">Upload</a>
                                        {/* <input type="file" className="upload_btn mb-4" onChange={inputProgressImage} multiple/> */}

                                    </div>
                                    <h2 className="main_title mb-2 px-3 mb-4">New Password</h2>
                                    <div className="col-12">
                                        <input type={isOwdHidden === true ? "password" : "text"} className="w-100 mb-4 input-box" placeholder="Old Password" value={user.oldpassword} name="oldpassword" onChange={(e) => handleInputs(e)} />
                                        <i className={`fa fa-eye${isOwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsOwdHidden(!isOwdHidden)}></i>
                                    </div>
                                    <div className="col-12">
                                        <input type={isPwdHidden === true ? "password" : "text"} className="w-100 mb-4 input-box" placeholder="Password" value={user.password} name="password" onChange={(e) => handleInputs(e)} />
                                        <i className={`fa fa-eye${isPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsPwdHidden(!isPwdHidden)}></i>
                                    </div>
                                    <div className="col-12">
                                        <input type={isCPwdHidden === true ? "password" : "text"} className="w-100 mb-4 input-box" placeholder="Confirm Password" value={user.confirmpassword} name="confirmpassword" onChange={(e) => handleInputs(e)} />
                                        <i className={`fa fa-eye${isCPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsCPwdHidden(!isCPwdHidden)}></i>
                                    </div>
                                    <div className="text-danger">{errors.password}</div>
                                </div>
                            </div>
                            <div className="col-12 text-center mt-4 mb-3">
                                <Link to="/MyProfile/Profile" onClick={(e) => { PostEditProfile(e) }} className="training_btn edit_save">Save</Link>
                                <Link className="text-gray font-weight-bold" to="/termsncondition">Terms & Conditions</Link>
                            </div>
                        </div>
                    </div>
                    {/* </form> */}
                </div>
            </div>
        </>
    );
}

export default EditProfile;
