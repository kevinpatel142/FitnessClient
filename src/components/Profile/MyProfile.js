import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';

function MyProfile() {
    const history = useHistory();
    const ProfileImage_URL = '/img/Small-no-img.png';
    const CoverImage_URL = '/img/Back-No-Image.png';
    const TrainerProfileImage_URL = '/img/Small-no-img.png';
    const usertype = localStorage.getItem('usertype');
    const [isOwdHidden, setIsOwdHidden] = useState(true);
    const [isPwdHidden, setIsPwdHidden] = useState(true);
    const [isCPwdHidden, setIsCPwdHidden] = useState(true);
    const [client, setClient] = useState({});
    const [user, setUser] = useState({
        firstname: "", lastname: "", email: "", oldpassword: "", password: "", confirmpassword: "", phoneno: "", gender: "Male", aboutus: "", trainingstyle: "", quote: "", experience: 0, qualifications: "",
        specialitys: "", introduction: "", certifications: "", emailnotifications: false, maillinglist: false, textnotifications: false
    });

    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    const [profileimage, setProfileImage] = useState(null);

    const [coverimagepreview, setCoverImagePreview] = useState(CoverImage_URL);
    const [coverimage, setCoverImage] = useState(null);

    const [trainerProfileImagePreview, setTrainerProfileImagePreview] = useState(TrainerProfileImage_URL);
    const [trainerimagepreview, setTrainerImage] = useState(null);
    const [expVal, setExp] = useState(1);
    const [qualificationshtmllist, setHtmlQualifications] = useState([]);

    const [workoutList, setWorkOutList] = useState([]);
    const [filterWorkout, setFilterWorkout] = useState([]);
    const [tags, settags] = useState([]);
    const ref = useRef(null);
    const trainingstyle = useRef('');
    useEffect(() => {
        document.body.classList.remove('scrollHide');
        callToken();
        fetchProfile();
        getTypeOfWorkout();
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [])

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            debugger
            trainingstyle.current = '';
            setFilterWorkout([]);
        }
    };

    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    const [errors, setErrors] = useState({});
    const fetchProfile = async () => {
        document.querySelector('.loading').classList.remove('d-none');
        let _url = (usertype === "client") ? '/client/account' : '/trainer/account';
        await axios.get(`${apiUrl}${PORT}${_url}/getprofile`, {}, {}
        ).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                if (usertype === "client") {
                    response.data.result.oldpassword = ""; response.data.result.password = ""; response.data.result.confirmPassword = "";
                    if (response.data.result) {
                        setClient(response.data.result);

                        setProfileImagePreview((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : ProfileImage_URL);
                        setProfileImage((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : ProfileImage_URL);

                        setTrainerProfileImagePreview((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : TrainerProfileImage_URL);
                        setTrainerImage((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : TrainerProfileImage_URL);
                    }
                } else {
                    debugger
                    response.data.result.oldpassword = ""; response.data.result.password = ""; response.data.result.confirmPassword = "";
                    if (response.data.result) {
                        setUser(response.data.result);
                        setProfileImagePreview((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : ProfileImage_URL);
                        setProfileImage((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : ProfileImage_URL);

                        setTrainerProfileImagePreview((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : TrainerProfileImage_URL);
                        setTrainerImage((response.data.result.profile) ? apiUrl + PORT + response.data.result.profile : TrainerProfileImage_URL);

                        setCoverImagePreview((response.data?.result?.coverprofile) ? apiUrl + PORT + response.data?.result?.coverprofile : CoverImage_URL);
                        setCoverImage((response.data?.result?.coverprofile) ? apiUrl + PORT + response.data?.result?.coverprofile : CoverImage_URL);
                        setImagesQuaPathList(response.data?.result?.qualifications?.path || []);

                        const newTags = response.data?.result?.trainingstyle.split(',');
                        settags(newTags);
                        trainingstyle.current = '';
                        /* setUser({ ...user, trainingstyle: '' }); */
                        //user.certifications =  response.data?.result?.qualifications?.name;
                    }
                    // setTimeout(() => {
                    //     //setUser({ ...user, ["gender"]: (response.data?.result?.gender || "Male") }); 
                    //     user.gender = (response.data?.result?.gender || "Male");
                    // }, 1000);
                    if (response.data?.result?.qualifications?.name != null) {
                        setQualifications(response.data?.result?.qualifications?.name.split(','));
                    }
                }
            }
            return response;
        }).catch(function (error) {
            document.querySelector('.loading').classList.add('d-none');
            console.log(error);
        });
    }


    const PostEditProfile = async (e) => {
        e.preventDefault();
        debugger

        let isValid = true;
        var errormsg = {};

        let reg_numbers = /^[0-9]+$/;
        if (!profileimage && (usertype === "client")) {
            //window.alert("Please upload Profile.");
            swal({
                title: "Error!",
                text: "Please upload Profile.",
                icon: "error",
                button: true
            })
            isValid = false;
        }
        if (!trainerimagepreview && (usertype !== "client")) {
            //window.alert("Please upload Profile.");
            swal({
                title: "Error!",
                text: "Please upload Profile.",
                icon: "error",
                button: true
            })
            isValid = false;
        }
        if (!coverimage) {
            //window.alert("Please upload Cover Image.");
            swal({
                title: "Error!",
                text: "Please upload Cover Image.",
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
        if (user.phoneno === "") {
            errormsg.phoneno = "Please enter Mobile Number.";
            isValid = false;
        }
        else if (user.phoneno.length !== 10 || !reg_numbers.test(user.phoneno)) {
            errormsg.phoneno = "Please enter valid Mobile Number.";
            isValid = false;
        }
        if (user.aboutus === "") {
            errormsg.aboutus = "Please enter about us description.";
            isValid = false;
        }
        /* if (user.trainingstyle === "") {
            errormsg.trainingstyle = "Please enter training style.";
            isValid = false;
        } */
        if (tags.length === 0) {
            errormsg.trainingstyle = "Please enter training style.";
            isValid = false;
        }
        if (user.quote === "") {
            errormsg.quote = "Please enter quote description.";
            isValid = false;
        }
        if (qualificationslist.length === 0) {
            errormsg.qualification = "Please enter qualifications.";
            isValid = false;
        }
        // if (cerimagesPathList.length == 0) {
        //     errormsg.certificationImg = "Please upload image here...";
        //     isValid = false;
        // }

        // if (user.introduction === "") {
        //     errormsg.introduction = "Please enter introduction.";
        //     isValid = false;
        // }
        // if (certificationslist.length == 0) {
        //     errormsg.certifications = "Please enter certifications.";
        //     isValid = false;
        // }
        // if (specialityslist.length == 0) {
        //     errormsg.speciality = "Please enter specialitys.";
        //     isValid = false;
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
            let qualificationsObj = {
                "name": qualificationslist.join(","),
                "path": imagesQuaPathList
            }
            // let certificationsObj = {
            //     "name": certificationslist.join(","),
            //     "path": cerimagesPathList
            // }
            //const formData = new FormData();
            //formData.append("profile", profileimage);
            let obj = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phoneno: user.phoneno,
                gender: user.gender,
                aboutus: user.aboutus,
                trainingstyle: tags.join(','),
                quote: user.quote,
                experience: parseInt(expVal),//parseInt(document.getElementById("experience").value),
                oldpassword: user.oldpasswor || "",
                password: user.passwor || "",
                confirmpassword: user.confirmpasswor || ""
            }
            // "specialitys": specialityslist.toString(),
            // "introduction": user.introduction,
            // "certifications": certificationsObj,
            // "emailnotifications": (user.emailnotifications == "on") ? true : user.emailnotifications,
            // "maillinglist": (user.maillinglist == "on") ? true : user.maillinglist,
            // "textnotifications": (user.textnotifications == "on") ? true : user.textnotifications
            var formData = new FormData();
            for (var key in obj) {
                formData.append(key, obj[key]);
            }

            if (trainerimagepreview?.type === undefined) {
                formData.append("edprofile", trainerimagepreview);
            } else {
                formData.append("profile", trainerimagepreview);
            }
            if (coverimage?.type === undefined) {
                formData.append("edcoverprofile", coverimage);
            } else {
                formData.append("coverprofile", coverimage);
            }
            // formData.append('profile', trainerimagepreview);
            // formData.append("coverprofile", coverimage);

            document.querySelector('.loading').classList.remove('d-none');
            await axios.post(`${apiUrl}${PORT}/trainer/account/updateprofile`, formData)
                .then(response => {
                    document.querySelector('.loading').classList.add('d-none');
                    if (response.data.status === 1) {
                        if (qualificationsObj != null) {
                            updateTrainerPara(qualificationsObj, "", user._id);
                        } else {
                            history.push("/myprofile");
                        }
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
    }
    const updateTrainerPara = (qualificationsObj, certificationsObj, tid) => {
        var form_data = new FormData();
        for (var key in qualificationsObj?.path) {
            form_data.append(qualificationsObj?.path[key].name, qualificationsObj?.path[key].uri);
        }
        form_data.append("id", tid);
        form_data.append("qualifications", JSON.stringify(qualificationsObj));
        form_data.append("certifications", "");
        document.querySelector('.loading').classList.remove('d-none');
        axios.post(`${apiUrl}${PORT}/trainer/account/updateTrainerPara`, form_data)
            .then(response => {
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    //window.alert(response.data.message);
                    swal({
                        title: "Success!",
                        text: response.data.message,
                        icon: "success",
                        button: true
                    })
                    history.push("/myprofile");
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
            });
    };

    const [qualificationslist, setQualifications] = useState([]);
    const [qualification, setQualification] = useState("");
    const [imagesQuaPathList, setImagesQuaPathList] = useState([]);
    const handleQualification = (e) => {
        setQualification(e.target.value);
    }

    const handleQualifications = (e) => {
        e.preventDefault();
        debugger
        var errormsg = {};
        var isValid = true;
        if (qualification === "") {
            errormsg.note = "Please enter note.";
            isValid = false;
        }
        if (imagesQuaPathList.length === 0) {
            errormsg.image = "Please upload image here..";
            isValid = false;
        }
        if (qualificationslist.length > 0 && qualificationslist.filter(x => x === qualification).length > 0) {
            errormsg.already = "This qualification already exist!";
            isValid = false;
        }
        if (imagesQuaPathList.filter(x => x.qualification === qualification).length === 0) {
            errormsg.image = "Please upload image here..";
            isValid = false;
        }
        if (imagesQuaPathList.filter(x => x.qualification === qualification).length > 0) {
            var objFile = imagesQuaPathList.filter(x => x.qualification === qualification);
            if (objFile[0].uri === undefined || objFile[0].uri === null) {
                errormsg.image = "Please upload image here..";
                isValid = false;
            }
        }

        setErrors(errormsg);
        if (isValid) {
            qualificationslist.push(qualification);
            setQualifications(qualificationslist);
            setQualification("");

            const updatedList = qualificationslist.map((listItems, index) => {
                return <div id={`qualification${index}`} className="control-group input-group" style={{ marginTop: "10px" }}>
                    <div className="d-flex col-md-6 pl-0">
                        <div name="qualifications" className="removeinput">{listItems}</div>
                        <div className="input-group-btn position-relative">
                            <button onClick={() => { removeQualifications(index) }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div className="col-md-6 position-relative">
                        <img src="/img/file.png" className="Fileicon" alt="File" />
                    </div>
                </div>
            });
            setHtmlQualifications(updatedList);
        }
    }

    const removeQualifications = (index) => {
        qualificationslist.splice(index, 1);
        var qualificationslst = qualificationslist;
        setQualifications(qualificationslst);

        const updatedList = qualificationslist.map((listItems, index) => {
            return <div key={'qualification' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
                <div className="d-flex">
                    <div name="qualifications" className="removeinput">{listItems}</div>
                    <div className="input-group-btn position-relative">
                        <button onClick={() => { removeQualifications(index) }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        });
        setHtmlQualifications(updatedList);
    }

    const OnQualificationFileChange = (event, value) => {
        const file_size = event.target.files[0]?.size;
        if (file_size > 1048000) {
            setImagesQuaPathList(null);
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            const fileReader = new window.FileReader();
            const file = event.target.files[0];

            fileReader.onload = fileLoad => {
                //const { result } = fileLoad.target;

                var maxId = imagesQuaPathList.length > 0 ? (imagesQuaPathList.length + 1) : 1;
                imagesQuaPathList.push({
                    "uri": file,
                    "name": file.name,
                    "type": file.type,
                    "id": maxId,
                    "qualification": value
                });
                setImagesQuaPathList(imagesQuaPathList);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const plusminus = (e) => {
        var count;
        if (e === "-") {
            count = expVal;
            count = parseInt(count) - 1;
            count = count < 1 ? 1 : count;
        }
        else {
            count = expVal;
            count++;
        }
        setExp(count);
        return false;
    };

    const handleExp = (e) => {
        setExp(e.target.value);
    };

    // const OnFileChange = (event) => {
    //     const file_size = event.target.files[0].size;
    //     if (file_size > 1048000) {
    //         setProfileImagePreview(null);
    //         //setProfileImage(null);
    //         alert("File size more than 1 MB. File size must under 1MB !");
    //         event.preventDefault();
    //     } else {
    //         const fileReader = new window.FileReader();
    //         const file = event.target.files[0];
    //         setProfileImage(event.target.files[0]);

    //         fileReader.onload = fileLoad => {
    //             const { result } = fileLoad.target;
    //             setProfileImagePreview(result);
    //             //setProfileImage(result);
    //         };

    //         fileReader.readAsDataURL(file);
    //     }
    // };

    const OnFileChangeTrainerProfile = (event) => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            setTrainerProfileImagePreview(TrainerProfileImage_URL);
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            const fileReader = new window.FileReader();
            const file = event.target.files[0];
            setTrainerImage(event.target.files[0]);

            fileReader.onload = fileLoad => {
                const { result } = fileLoad.target;
                setTrainerProfileImagePreview(result);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const OnCoverFileChange = (event) => {
        const file_size = event.target.files[0].size;
        if (file_size > 2096000) {
            setCoverImagePreview(CoverImage_URL);
            //setCoverImage(null);
            alert("File size more than 2 MB. File size must under 2MB !");
            event.preventDefault();
        } else {
            const fileReader = new window.FileReader();
            const file = event.target.files[0];
            setCoverImage(event.target.files[0]);

            fileReader.onload = fileLoad => {
                const { result } = fileLoad.target;
                setCoverImagePreview(result);
                //setCoverImage(result);
            };

            fileReader.readAsDataURL(file);
        }
    };
    async function getTypeOfWorkout() {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.get(`${apiUrl}${PORT}/trainer/trainer/getworkoutcategory`, {}, {})
            .then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    setWorkOutList(response.data.result);
                }
                else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    });
                }
            }).catch(function (error) {
                document.querySelector('.loading').classList.add('d-none');
            });
    };
    const tagChange = (e) => {
        setUser({ ...user, trainingstyle: e.target.value });
        handleSuggestion();
    };

    const handleKeyDown = e => {
        if (e.keyCode === 9) {
            e.preventDefault();
        }
        handleSuggestion();
    };

    const handleSuggestion = () => {

        const suggestFilterInput = workoutList.filter(suggest =>
            suggest.name.toLowerCase().includes(user.trainingstyle?.toLowerCase())
        );

        const suggestFilterTags = suggestFilterInput.filter(
            suggest => !tags.includes(suggest.name)
        );
        setFilterWorkout(suggestFilterTags);
    };

    const handleDelete = i => {
        const newTags = tags.filter((tag, j) => i !== j);
        settags(newTags);
        setFilterWorkout([]);
    };

    const AddTags = text => {
        settags([...tags, text]);
        user.trainingstyle = '';
        trainingstyle.current = '';
        setUser(user);
        setFilterWorkout([]);
    };
    return (
        <>
            <div className="container-fluid" ref={ref}>
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                {
                    (usertype === "client") ?
                        <>
                            <div className="col-md-12 col-12 p-0">
                                <div className="myprofile">
                                    <div className="row">
                                        <div className="col-12">
                                            <h1 className="main_title mb-5">My Profile</h1>
                                        </div>
                                        <div className="col-md-5 col-12">
                                            <div className="avatar-upload">
                                                {/* <div className="avatar-edit">
                                                    <input type='file' onChange={OnFileChange} id="imageUpload" accept=".png, .jpg, .jpeg" />
                                                    <label htmlFor="imageUpload"></label>
                                                </div> */}
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
                                                            <label>Equipment</label>
                                                            <p>{client.equipmentavailable}</p>
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
                                                            <label>Weight</label>
                                                            <p>{client.weight} {client.weightiskg ? 'Kgs' : 'Pound'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12 pl-md-2">
                                                        <div className="p_input">
                                                            <label>Height</label>
                                                            <p>{client.height} {client.heightisfeet ? 'Feet' : 'Meters'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-12">
                                                        <div className="p_input">
                                                            <label>Fitness Goals</label>
                                                            <p>{client.otherfitnessgoals}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-12 mb-3">
                                                        <div className="p_input">
                                                            <label>Injuries/Health Issues</label>
                                                            <p>{client.injuriesorhelthissues}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-12">
                                                        <Link to="/editprofile" className="edit-btn">Edit Profile</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="row">

                                <div className="col-md-12">
                                    <h1 className="main_title mb-3">My Profile</h1>
                                </div>
                                <div className="col-md-6 pr-lg-5">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="Profile coverprofile">
                                                <div className="avatar-upload">
                                                    <div className="avatar-edit">
                                                        <input preview="imagePreview" onChange={OnCoverFileChange} type="file" id="coverimageUpload" accept=".png, .jpg, .jpeg" />
                                                        <label htmlFor="coverimageUpload"><i className="fas fa-camera"></i></label>
                                                    </div>
                                                    <div className="avatar-preview">
                                                        <div id="imagePreview" className='w-100' style={{ backgroundImage: `url(${coverimagepreview})` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="Profile subprofile">
                                                        <div className="avatar-upload">
                                                            <div className="avatar-edit">
                                                                <input preview="imagePreview" onChange={OnFileChangeTrainerProfile} type="file" id="imageUpload" accept=".png, .jpg, .jpeg" />
                                                                <label htmlFor="imageUpload"><i className="fas fa-camera"></i></label>
                                                            </div>
                                                            <div className="avatar-preview">
                                                                <div id="imagePreview" style={{ backgroundImage: `url(${trainerProfileImagePreview})` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 mt-4">
                                                    <input onChange={(e) => handleInputs(e)} value={user.firstname} name="firstname" type="text" className="input-box" placeholder="First Name" />
                                                    <div className="text-danger">{errors.firstname}</div>
                                                    <input onChange={(e) => handleInputs(e)} value={user.lastname} name="lastname" type="text" className="input-box" placeholder="Last Name" />
                                                    <div className="text-danger">{errors.lastname}</div>

                                                </div>
                                                <div className="col-md-12">
                                                    <input onChange={(e) => handleInputs(e)} value={user.phoneno} name="phoneno" className="input-box" placeholder="Mobile Number" />
                                                    <div className="text-danger">{errors.phoneno}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <h6>Gender</h6>
                                                    <div className="genderbox">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <div className="genderblock">
                                                                    <div className="custom-control custom-checkbox mb-3">
                                                                        <input onChange={(e) => handleInputs(e)} value="Male" type="radio" defaultChecked={user.gender === "Male"} className="custom-control-input" id="Male" name="gender" />
                                                                        <label className="custom-control-label" htmlFor="Male"></label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="genderblock genderblock1">
                                                                    <div className="custom-control custom-checkbox mb-3">
                                                                        <input onChange={(e) => handleInputs(e)} value="Female" type="radio" defaultChecked={user.gender === "Female"} className="custom-control-input" id="Female" name="gender" />
                                                                        <label className="custom-control-label" htmlFor="Female"></label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="genderblock genderblock2">
                                                                    <div className="custom-control custom-checkbox mb-3">
                                                                        <input onChange={(e) => handleInputs(e)} value="Non-Binary" type="radio" defaultChecked={user.gender === "Non-Binary"} className="custom-control-input" id="Non-Binary" name="gender" />
                                                                        <label className="custom-control-label" htmlFor="Non-Binary"></label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-danger">{errors.gender}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <textarea onChange={(e) => handleInputs(e)} value={user.aboutus} name="aboutus" className="w-100 Sessionrej text-primary border-primary mb-3" placeholder="About"></textarea>
                                                    <div className="text-danger">{errors.aboutus}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="tags-content">
                                                        <div>
                                                            {tags.map((tag, i) => (
                                                                <div key={i} className="tag">
                                                                    {tag}
                                                                    <div className="remove-tag" onClick={() => handleDelete(i)}>
                                                                        ×
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="tags-input">
                                                            <input
                                                                type="text"
                                                                className="w-100 mb-4"
                                                                value={trainingstyle.current}
                                                                ref={trainingstyle}
                                                                onChange={(e) => { tagChange(e) }}
                                                                onKeyDown={(e) => { handleKeyDown(e) }}
                                                                placeholder="Describe your training style"

                                                            />
                                                            {Boolean(filterWorkout.length) && (
                                                                <div className="tags-suggestions">
                                                                    {filterWorkout.map(suggest => {
                                                                        return <div
                                                                            className="suggestion-item"
                                                                            onClick={() => AddTags(suggest.name)}
                                                                        >
                                                                            {suggest.name}
                                                                        </div>
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* <textarea onChange={(e) => handleInputs(e)} value={user.trainingstyle} name="trainingstyle" className="w-100 Sessionrej text-primary border-primary mb-3" placeholder="Describe your training style"></textarea> */}
                                                    <div className="text-danger">{errors.trainingstyle}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <textarea onChange={(e) => handleInputs(e)} value={user.quote} name="quote" className="w-100 Sessionrej text-primary border-primary mb-3" placeholder="Your favorite quote"></textarea>
                                                    <div className="text-danger">{errors.quote}</div>
                                                </div>
                                                <div className="col-md-12 pl-0" style={{ display: 'none' }}>
                                                    <div className="col-md-10">
                                                        <div className="copy">
                                                            {qualificationshtmllist}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <a href={() => false} onClick={(e) => { PostEditProfile(e) }} className="training_btn w-50 mx-auto d-block">Save</a>
                                                </div>
                                                <div className="col-md-12 text-center mt-2">
                                                    <Link to="/termsncondition" className="text-center text-primary">Terms & Condition</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 pl-lg-5">
                                    <div className="col-md-12">
                                        <div className="row m-1">
                                            <div className="col-md-12 p-0">
                                                <div className="number">
                                                    <div className="row">
                                                        <div className="col-md-6 pt-2">
                                                            <h6 className="text-gray">Experience (in years)</h6>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="pmclass">
                                                                <span className="minus text-primary" onClick={() => plusminus('-')}>-</span>
                                                                <input type="text" value={expVal} onChange={handleExp} />
                                                                <span className="plus text-primary" onClick={() => plusminus('+')}>+</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-10 mt-4">
                                                <div className="row unused">
                                                    <div className="input-group control-group after-add-more position-relative">
                                                        <input onChange={(e) => handleQualification(e)} type="text" name="qualification" value={qualification} className="input-box w-100" placeholder="Cross-Fit Trainer" autocomplete="off" />
                                                        <div className="input-group-btn">
                                                            <button onClick={(e) => { handleQualifications(e) }} className="add-more position-absolute" type="button"><i className="fas fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 mt-3">
                                                <div className="uploadimg">
                                                    <input type="file" id="uploadQualification" onChange={(e) => { OnQualificationFileChange(e, qualification) }} accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                    <label htmlFor="uploadQualification">
                                                        <img src="/img/upload.png" alt='Upload' />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="text-danger">{errors.qualification}</div>
                                            <div className="text-danger">{errors.note}</div>
                                            <div className="text-danger">{errors.image}</div>
                                            <div className="text-danger">{errors.already}</div>
                                        </div>
                                    </div>
                                    {qualificationslist.length > 0 && qualificationslist.map((listItems, index) => {
                                        return <>
                                            <div key={`qualification${index}`} className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-10">
                                                        <div className="copy">
                                                            <div className="control-group input-group" style={{ marginTop: "10px" }} id={`qualification${index}`}>
                                                                <div className="d-flex">
                                                                    <div name={'qualification' + index} className="removeinput">{listItems}</div>
                                                                    <div className="input-group-btn position-relative">
                                                                        <button onClick={() => { removeQualifications(index); }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2 mt-2">
                                                        <div className="uploadimg">
                                                            <input type="file" id="uploadQualification2" accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                            <label htmlFor="uploadQualification2">
                                                                <img src="/img/file.png" className="Fileicon" style={{ position: "unset" }} alt="File" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    })}
                                    <div className="col-md-12 mt-4">
                                        <h4 className="font-weight-bold mb-3">New Password</h4>
                                        <input onChange={(e) => handleInputs(e)} value={user.oldpassword} type={isOwdHidden === true ? "password" : "text"} name="oldpassword" className="input-box" placeholder="old password" autocomplete="off" />
                                        <i className={`fa fa-eye${isOwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsOwdHidden(!isOwdHidden)}></i>
                                        <div className="text-danger">{errors.oldpassword}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.password} type={isPwdHidden === true ? "password" : "text"} name="password" className="input-box" placeholder="Password" autocomplete="off" />
                                        <i className={`fa fa-eye${isPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsPwdHidden(!isPwdHidden)}></i>
                                        <div className="text-danger">{errors.password}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.confirmpassword} type={isCPwdHidden === true ? "password" : "text"} name="confirmpassword" className="input-box" placeholder="Confirm password" autocomplete="off" />
                                        <i className={`fa fa-eye${isCPwdHidden === false ? "" : "-slash"} icon`} onClick={() => setIsCPwdHidden(!isCPwdHidden)}></i>
                                        <div className="text-danger">{errors.confirmpassword}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>
        </>
    );
}

export default MyProfile;
