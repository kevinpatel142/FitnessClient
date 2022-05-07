import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
function SignUp() {
    const history = useHistory();
    const [IsNext, setIsNext] = useState(0);
    const [isHidden, setIsHidden] = useState(true);
    const [isCHidden, setIsCHidden] = useState(true);
    const [workoutList, setWorkOutList] = useState([]);
    const [filterWorkout, setFilterWorkout] = useState([]);
    const [tags, settags] = useState([]);
    const ref = useRef(null);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${apiUrl}${PORT}/account/verifytoken`, {}, {
            }).then(function (response) {
                if (response.data.status === 1) {
                    history.push("/sessionrequest");
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
        getTypeOfWorkout();
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [])
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            user.trainingstyle = '';
            setUser(user);
            setFilterWorkout([]);
        }
    };

    async function getTypeOfWorkout() {
        document.querySelector('.loading').classList.remove('d-none');
        await axios.get(`${apiUrl}${PORT}/trainer/trainer/getworkoutcategory`, {}, {})
            .then(function (response) {
                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    setWorkOutList(response.data.result);
                    /* setFilterWorkout(response.data.result); */
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

    const ProfileImage_URL = '/img/default-avatar.svg';
    const CoverImage_URL = '/img/regi-cover.png';


    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    const [coverimagepreview, setCoverImagePreview] = useState(CoverImage_URL);
    const [profileimage, setProfileImage] = useState(null);
    const [coverimage, setCoverImage] = useState(null);
    const [firstStepNext, setFirstStepNext] = useState({ name: '', email: '', password: '', confirmpassword: '', isAgree: false });


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
                setProfileImagePreview(result);
                //setProfileImage(result);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const [user, setUser] = useState({
        firstname: "", lastname: "", email: "", password: "", confirmpassword: "", phoneno: "", gender: "Male", aboutus: "", trainingstyle: "", quote: "", experience: 0, qualifications: "",
        specialitys: "", introduction: "", certifications: "", emailnotifications: false, maillinglist: false, textnotifications: false
    });
    const [qualificationslist, setQualifications] = useState([]);
    const [qualificationshtmllist, setHtmlQualifications] = useState([]);
    const [qualification, setQualification] = useState("");
    const [IsTAndC, setIsTAndC] = useState(false);
    const [imagesQuaPathList, setImagesQuaPathList] = useState([]);
    const handleQualification = (e) => {
        setQualification(e.target.value);
    }

    const handleQualifications = (e) => {

        e.preventDefault();
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
                        <img src="/img/file.png" className="Fileicon" alt='File' />
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
        const file_size = event.target.files[0].size;
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

    const [specialityslist, setSpecialitys] = useState([]);
    // const [specialityshtmllist, setHtmlSpecialitys] = useState([]);
    const [speciality, setSpeciality] = useState("");

    const handleSpeciality = (e) => {
        setSpeciality(e.target.value);
    }

    const handleSpecialitys = (e) => {
        if (speciality === "")
            return;
        specialityslist.push(speciality);
        setSpecialitys(specialityslist);
        setSpeciality("");

        // const updatedSList = specialityslist.map((SlistItems, index) => {
        //     return <div key={'speciality' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
        //         <div className="col-md-10">
        //             <div name="specialitys" className="removeinput">{SlistItems}</div>
        //         </div>
        //         <div className="d-flex col-md-2 p-0">
        //             <div className="remove minus">
        //                 <button onClick={() => { removeSpecialitys(index) }} className="remove minus" type="button"><i className="fas fa-minus"></i></button>
        //             </div>
        //         </div>
        //     </div>
        // });
        // setHtmlSpecialitys(updatedSList);
    }

    const removeSpecialitys = (index) => {
        specialityslist.splice(index, 1);
        var specialityslst = specialityslist;
        setSpecialitys(specialityslst);

        // const updatedSList = specialityslist.map((SlistItems, index) => {
        //     return <div key={'speciality' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
        //         <div className="col-md-10">
        //             <div name="specialitys" className="removeinput">{SlistItems}</div>
        //         </div>
        //         <div className="d-flex col-md-2 p-0">
        //             <div className="remove minus">
        //                 <button onClick={() => { removeSpecialitys(index) }} className="remove minus" type="button"><i className="fas fa-minus"></i></button>
        //             </div>
        //         </div>
        //     </div>
        // });
        // setHtmlSpecialitys(updatedSList);
    }

    const [certificationslist, setCertifications] = useState([]);
    const [certificationshtmllist, setHtmlCertifications] = useState([]);
    const [certification, setCertification] = useState("");
    const [cerimagesPathList, setCerImagesPathList] = useState([]);

    const handleCertification = (e) => {
        setCertification(e.target.value);
    }

    const handleCertifications = (e) => {
        e.preventDefault();
        var errormsg = {};
        var isValid = true;

        if (certification === "") {
            errormsg.certification = "Please enter certification.";
            isValid = false;
        }
        if (cerimagesPathList.length === 0) {
            errormsg.certificationImg = "Please upload image here..";
            isValid = false;
        }
        if (certificationslist.length > 0 && certificationslist.filter(x => x === certification).length > 0) {
            errormsg.certificationAlready = "This certification already exist!";
            isValid = false;
        }
        if (cerimagesPathList.filter(x => x.certification === certification).length === 0) {
            errormsg.certificationImg = "Please upload image here..";
            isValid = false;
        }
        if (cerimagesPathList.filter(x => x.certification === certification).length > 0) {
            var objFile = cerimagesPathList.filter(x => x.certification === certification);
            if (objFile[0].uri === undefined || objFile[0].uri === null) {
                errormsg.certificationImg = "Please upload image here..";
                isValid = false;
            }
        }
        setErrors(errormsg);
        if (isValid) {
            certificationslist.push(certification);
            setCertifications(certificationslist);
            setCertification("");
        }

        const updatedCList = certificationslist.map((ClistItems, index) => {
            return <div key={'certification' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
                <div className="d-flex">
                    <div name="certifications" className="removeinput">{ClistItems}</div>
                    <div className="input-group-btn position-relative">
                        <button onClick={() => { removeCertifications(index) }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        });
        setHtmlCertifications(updatedCList);
    }

    const removeCertifications = (index) => {
        certificationslist.splice(index, 1);
        var certificationslst = certificationslist;
        setCertifications(certificationslst);

        const updatedCList = certificationslist.map((ClistItems, index) => {
            return <div key={'certification' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
                <div className="d-flex">
                    <div name="certifications" className="removeinput">{ClistItems}</div>
                    <div className="input-group-btn position-relative">
                        <button onClick={() => { removeCertifications(index) }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        });
        setHtmlCertifications(updatedCList);
    }

    const onCertificationFileChange = (event, value) => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            setCerImagesPathList(null);
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            const fileReader = new window.FileReader();
            const file = event.target.files[0];

            fileReader.onload = fileLoad => {
                //const { result } = fileLoad.target;
                var maxId = cerimagesPathList.length > 0 ? (cerimagesPathList.length + 1) : 1;
                cerimagesPathList.push({
                    "uri": file,
                    "name": file.name,
                    "type": file.type,
                    "id": maxId,
                    "certification": value
                });
                setCerImagesPathList(cerimagesPathList);
            };
            fileReader.readAsDataURL(file);

        }
    };

    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const [errors, setErrors] = useState({});
    const [expVal, setExp] = useState(1);
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

    const PostSignUp = async (e) => {
        e.preventDefault();
        

        let isValid = true;
        var errormsg = {};

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
        if (!coverimage) {
            swal({
                title: "Error!",
                text: "Please upload Cover Image.",
                icon: "error",
                button: true
            })
            //window.alert("Please upload Cover Image.");
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
        if (cerimagesPathList.length === 0) {
            errormsg.certificationImg = "Please upload image here...";
            isValid = false;
        }

        if (user.introduction === "") {
            errormsg.introduction = "Please enter introduction.";
            isValid = false;
        }
        if (certificationslist.length === 0) {
            errormsg.certifications = "Please enter certifications.";
            isValid = false;
        }
        if (specialityslist.length === 0) {
            errormsg.speciality = "Please enter specialitys.";
            isValid = false;
        }

        if (!IsTAndC) {
            errormsg.isAgree = "Please check Terms & Conditions!";
            isValid = false;
        }
        setErrors(errormsg);
        if (isValid === true) {

            let getFirstStepNextObj = JSON.parse(localStorage.getItem("firstStepNext"));
            let qualificationsObj = {
                "name": qualificationslist.join(","),
                "path": imagesQuaPathList
            }
            let certificationsObj = {
                "name": certificationslist.join(","),
                "path": cerimagesPathList
            }
            const formData = new FormData();
            formData.append('coverprofile', coverimage);
            formData.append('profile', profileimage);
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('email', getFirstStepNextObj.email);
            formData.append('password', getFirstStepNextObj.password);
            formData.append('confirmpassword', getFirstStepNextObj.confirmpassword);
            formData.append('phoneno', user.phoneno);
            formData.append('gender', user.gender);
            formData.append('aboutus', user.aboutus);
            formData.append('trainingstyle', tags.join(','));
            formData.append('quote', user.quote);
            formData.append('experience', parseInt(expVal));//parseInt(document.getElementById("experience").value));
            formData.append('specialitys', specialityslist.toString());
            formData.append('introduction', user.introduction);
            //formData.append('qualifications', qualificationsObj);
            //formData.append('certifications', certificationsObj);
            formData.append('emailnotifications', (user.emailnotifications === "on") ? true : user.emailnotifications);
            formData.append('maillinglist', (user.maillinglist === "on") ? true : user.maillinglist);
            formData.append('textnotifications', (user.textnotifications === "on") ? true : user.textnotifications);
            // const formData = {
            //     "coverprofile": coverimage,
            //     "profile": profileimage,
            //     "firstname": user.firstname,
            //     "lastname": user.lastname,
            //     "email": getFirstStepNextObj.email,
            //     "password": getFirstStepNextObj.password,
            //     "confirmpassword": getFirstStepNextObj.confirmpassword,
            //     "phoneno": user.phoneno,
            //     "gender": user.gender,
            //     "aboutus": user.aboutus,
            //     "trainingstyle": user.trainingstyle,
            //     "quote": user.quote,
            //     "experience": parseInt(expVal),//parseInt(document.getElementById("experience").value),
            //     "qualifications": qualificationsObj,
            //     "specialitys": specialityslist.toString(),
            //     "introduction": user.introduction,
            //     "certifications": certificationsObj,
            //     "emailnotifications": (user.emailnotifications === "on") ? true : user.emailnotifications,
            //     "maillinglist": (user.maillinglist === "on") ? true : user.maillinglist,
            //     "textnotifications": (user.textnotifications === "on") ? true : user.textnotifications
            // }

            document.querySelector('.loading').classList.remove('d-none');
            axios.post(`${apiUrl}${PORT}/trainer/account/register`, formData)
                .then(response => {

                    document.querySelector('.loading').classList.add('d-none');
                    if (response.data.status === 1) {

                        localStorage.setItem('trainerId', response.data.result._id);
                        if (qualificationsObj != null || certificationsObj != null) {
                            updateTrainerPara(qualificationsObj, certificationsObj, response.data.result._id);
                        } else {
                            history.push("/trainersaccountinfo");
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
        for (var key1 in certificationsObj?.path) {
            form_data.append(certificationsObj?.path[key1].name, certificationsObj?.path[key1].uri);
        }
        form_data.append("id", tid);
        form_data.append("qualifications", JSON.stringify(qualificationsObj));
        form_data.append("certifications", JSON.stringify(certificationsObj));

        document.querySelector('.loading').classList.remove('d-none');
        axios.post(`${apiUrl}${PORT}/trainer/account/updateTrainerPara`, form_data)
            .then(response => {

                document.querySelector('.loading').classList.add('d-none');
                if (response.data.status === 1) {
                    history.push("/trainersaccountinfo");
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
    const handleTAndC = (e) => {
        setIsTAndC(e.currentTarget.checked);
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
        if (firstStepNext.confirmpassword === "") {
            errormsg.password = "Please enter confirm password";
            isSubmit = false;
        }
        if (firstStepNext.password !== firstStepNext.confirmpassword) {
            errormsg.password = "Please enter same password & confirm password";
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
    // const handleUserChange = (objName, val) => {
    //     setUser(prevState => ({ ...prevState, [objName]: val }));
    //     console.log(user);
    // }

    const secondStepSignUpNext = async (e) => {
        e.preventDefault();

        let isValid = true;
        var errormsg = {};

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
            errormsg.note = "Please enter qualifications.";
            isValid = false;
        }
        if (imagesQuaPathList.length === 0) {
            errormsg.image = "Please upload image here..";
            isValid = false;
        }

        setErrors(errormsg);
        if (isValid) {
            user.experience = parseInt(expVal);// parseInt(document.getElementById("experience").value);
            user.qualifications = qualificationslist.toString();

            setIsNext(2);
            localStorage.setItem("secoundStepNext", JSON.stringify(user));
        }
    }
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
        setUser(user);
        setFilterWorkout([]);
    };
    return (
        <>
            <div className="container my-md-5 py-md-4" ref={ref}>
                <div className="commonbox" ref={ref}>
                    <div className="col-md-12">
                        <div className={`row ${IsNext === 0 ? "" : "d-none"}`}>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt='Logo' />
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
                                            <div className="nav-link text-center" onClick={() => { history.push('/clientsignup') }} data-toggle="tab">MEMBER</div>
                                        </li>
                                        <li className="nav-item col-md-6 col-6 w-100">
                                            <div className="nav-link text-center active" data-toggle="tab" onClick={() => { history.push('/trainer/login') }}>TRAINER</div>
                                        </li>
                                    </ul>
                                    <div className='tab-content'>
                                        <div id="TRAINER" className="container tab-pane fade active">
                                            <div className="row my-4">
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Name" value={firstStepNext.name} onChange={(e) => { handleChange("name", e.target.value) }} />
                                                    <div className="text-danger">{errors.name}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" className="w-100  mb-3 input-box" placeholder="Email Address" value={firstStepNext.email} onChange={(e) => { handleChange("email", e.target.value) }} />
                                                    <div className="text-danger">{errors.email}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        {/* <input id="password-field" type="password" placeholder="Password" className="form-control w-100  mb-3 input-box" name="password" value={firstStepNext.password} onChange={(e) => { handleChange("password", e.target.value) }} />
                                                        <span toggle="#password-field" className="fa fa-eye icon toggle-password"></span> */}
                                                        <input id="password-field" onChange={(e) => { handleChange("password", e.target.value) }} value={firstStepNext.password} name="password" type={isHidden === true ? "password" : "text"} className="w-100  mb-3 input-box" placeholder="Password" />
                                                        <span toggle="#password-field" className={`fa fa-eye${isHidden === false ? "" : "-slash"} icon field-icon toggle-password`} onClick={() => setIsHidden(!isHidden)}></span>
                                                    </div>
                                                    <div className="text-danger">{errors.password}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        {/* <input id="confirmpassword-field" type="password" placeholder="Confirm Password" className="form-control w-100  mb-3 input-box" name="confirmpassword" value={firstStepNext.confirmpassword} onChange={(e) => { handleChange("confirmpassword", e.target.value) }} />
                                                        <span toggle="#confirmpassword-field" className="fa fa-eye icon toggle-password"></span> */}
                                                        <input id="confirmpassword-field" onChange={(e) => { handleChange("confirmpassword", e.target.value) }} value={firstStepNext.confirmpassword} name="password" type={isCHidden === true ? "password" : "text"} className="w-100 mb-3 input-box" placeholder="Confirm Password" />
                                                        <span toggle="#confirmpassword-field" className={`fa fa-eye${isCHidden === false ? "" : "-slash"} icon field-icon toggle-password`} onClick={() => setIsCHidden(!isCHidden)}></span>
                                                    </div>
                                                    <div className="text-danger">{errors.password}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="custom-control custom-checkbox my-2">
                                                        <input type="checkbox" className="custom-control-input" id="Clientreg" name="example1" value={firstStepNext.isAgree} onChange={(e) => { handleChange("isAgree", e.currentTarget.checked) }} />
                                                        <label className="custom-control-label terms-text" htmlFor="Clientreg"><span className="pl-2">I agree to the <Link to="/termsandcondition" className="gray-text"> Terms & Conditions </Link></span></label>
                                                    </div>
                                                    <div className="text-danger">{errors.isAgree}</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button className="loginbtn mt-4" onClick={(e) => { firstStepSignUpNext(e) }}>Next</button>
                                                    {/* <Link to="/Home/Registeryourself" className="loginbtn mt-4">Next</Link> */}
                                                </div>
                                                <div className="col-md-12 text-center mt-3">
                                                    <span className="text-login">Already Registered ? <Link to="/trainer/login" className="linktext">Login</Link></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${IsNext === 1 ? "" : "d-none"}`}>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt="" />
                                    <h3>Register Yourself</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox regyourself">
                                    <div className="loading d-none">
                                        <div className="mainloader"></div>
                                    </div>
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Register Yourself</h6>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="Profile coverprofile mb-3">
                                            <label>Cover Picture</label>
                                            <div className="avatar-upload">
                                                <div className="avatar-edit">
                                                    <input type="file" onChange={OnCoverFileChange} id="coverimageUpload" accept=".png, .jpg, .jpeg" />
                                                    <label htmlFor="coverimageUpload"><i className="fas fa-camera"></i></label>
                                                </div>
                                                <div className="avatar-preview">
                                                    <div id="coverimagePreview" className='w-100' style={{ backgroundImage: `url(${coverimagepreview})` }}></div>
                                                </div>
                                            </div>
                                        </div>
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
                                                <input onChange={(e) => handleInputs(e)} value={user.firstname} name="firstname" type="text" className="w-100  mb-3 input-box" placeholder="First Name" />
                                                <div className="text-danger">{errors.firstname}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <input onChange={(e) => handleInputs(e)} value={user.lastname} name="lastname" type="text" className="w-100  mb-3 input-box" placeholder="Last Name" />
                                                <div className="text-danger">{errors.lastname}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <input onChange={(e) => handleInputs(e)} value={user.phoneno} name="phoneno" className="w-100  mb-3 input-box" placeholder="Mobile Number" />
                                        <div className="text-danger">{errors.phoneno}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Gender</label>
                                        <div className="genderbox mb-2">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="genderblock">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input onChange={(e) => handleInputs(e)} value="Male" type="radio" defaultChecked={user.gender === "Male"} className="custom-control-input" id="Male" name="gender" />
                                                            <label className="custom-control-label" htmlFor="Male"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="genderblock genderblock1">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input onChange={(e) => handleInputs(e)} value="Female" type="radio" defaultChecked={user.gender === "Female"} className="custom-control-input" id="Female" name="gender" />
                                                            <label className="custom-control-label" htmlFor="Female"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col">
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
                                        <textarea onChange={(e) => handleInputs(e)} value={user.aboutus} name="aboutus" className="w-100 mb-4" placeholder="About"></textarea>
                                        <div className="text-danger">{errors.aboutus}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="tags-content">
                                            {tags.map((tag, i) => (
                                                <div key={i} className="tag">
                                                    {tag}
                                                    <div className="remove-tag" onClick={() => handleDelete(i)}>
                                                        ×
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="tags-input">
                                                <input
                                                    type="text"
                                                    className="w-100 mb-4"
                                                    value={user.trainingstyle}
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
                                        {/* <textarea onChange={(e) => handleInputs(e)} value={user.trainingstyle} name="trainingstyle" className="w-100 mb-4" placeholder="Describe your training style"></textarea> */}
                                        <div className="text-danger">{errors.trainingstyle}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <textarea onChange={(e) => handleInputs(e)} value={user.quote} name="quote" className="w-100 mb-4" placeholder="Your favorite quote"></textarea>
                                        <div className="text-danger">{errors.quote}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row m-0">
                                            <div className="col-md-12 p-0">
                                                <div className="number">
                                                    <div className="row">
                                                        <div className="col-lg-6 pt-2">
                                                            <h6 className="text-gray">Experience(in years)</h6>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            {/* <div className="pmclass">
                                                                <span className="minus text-primary">-</span>
                                                                <input onChange={(e) => handleInputs(e)} id="experience" name="experience" type="text" value={experience} />
                                                                <span className="plus text-primary">+</span>
                                                            </div> */}
                                                            <div className="pmclass">
                                                                <span className="minus text-primary" onClick={() => plusminus('-')}>-</span>
                                                                <input type="text" value={expVal} onChange={handleExp} />
                                                                <span className="plus text-primary" onClick={() => plusminus('+')}>+</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-10 col-10 mt-4">
                                                <div className="row unused">
                                                    <div className="input-group control-group after-add-more position-relative">
                                                        <input onChange={(e) => handleQualification(e)} autoComplete={'off'} type="text" name="qualification" value={qualification} className="input-box w-100" placeholder="Qualification Details" />
                                                        <div className="input-group-btn">
                                                            <button onClick={(e) => { handleQualifications(e) }} className="add-more position-absolute" type="button"><i className="fas fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 col-2 mt-3 pr-0 text-center">
                                                <div className="uploadimg">
                                                    <input type="file" id="uploadQualification" onChange={(e) => { OnQualificationFileChange(e, qualification) }} accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                    <label for="uploadQualification">
                                                        <img src="/img/upload.png" alt='Upload' />
                                                    </label>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-12 pl-0">
                                                <div className="col-md-10">
                                                    <div className="copy">
                                                        {qualificationshtmllist}
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* <div className="col-md-12 pl-0" style={{ display: 'none' }}>
                                                <div className="col-md-10">
                                                    <div className="copy">
                                                        {qualificationshtmllist}
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* <div className="text-danger">{errors.qualification}</div> */}
                                            <div className="text-danger">{errors.note}</div>
                                            <div className="text-danger">{errors.image}</div>
                                            <div className="text-danger">{errors.already}</div>
                                        </div>
                                    </div>
                                    {qualificationslist.length > 0 && qualificationslist.map((listItems, index) => {
                                        return <>
                                            <div key={`qualification${index}`} className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-10 col-10">
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
                                                    <div className="col-md-2 col-2 mt-2">
                                                        <div className="uploadimg">
                                                            <input type="file" id="uploadQualification2" accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                            <label htmlFor="uploadQualification2">
                                                                <img src="/img/file.png" alt='File' className="Fileicon" style={{ position: "unset" }} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    })}
                                    <div className="col-12">
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <button className="loginbtn mt-4" onClick={(e) => { secondStepSignUpNext(e) }}>Sign Up</button>
                                                {/* <button onClick={(e) => { PostSignUp(e) }} className="loginbtn my-4">Sign Up</button> */}
                                            </div>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { setIsNext(0); }} className="loginbtn mt-4 mb-5">Back</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${IsNext === 2 ? "" : "d-none"}`}>
                            <div className="col-md-6 p-0">
                                <div className="loginimg"></div>
                                <div className="overlay"></div>
                                <div className="col-md-12 logoblock">
                                    <img src="/img/KNKTLogo.png" alt='Logo' />
                                    <h3>Set Schedule</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loginbox regyourself">
                                    <div className="col-md-12 mb-4">
                                        <h6 className="text-center">Hey Set the schedule for yourself!</h6>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row unused">
                                            <div className="input-group control-group after-add-more position-relative">
                                                <div className="col-md-10 col-10">
                                                    <input onChange={(e1) => handleSpeciality(e1)} type="text" autoComplete={'off'} name="speciality" value={speciality} className="input-box w-100" placeholder="Fitness Speciality" />
                                                </div>
                                                <div className="col-md-2 col-2 d-flex p-0">
                                                    <div className="input-group-btn">
                                                        <button onClick={(e1) => { handleSpecialitys(e1) }} className="add-more addschdule" type="button"><i className="fas fa-plus"></i></button>
                                                    </div>
                                                </div>
                                                <div className="text-danger pl-3">{errors.speciality}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-12 pl-0">
                                        <div className="col-md-10">
                                            <div className="copy">
                                                {specialityshtmllist}
                                            </div>
                                        </div>
                                    </div> */}
                                    {/*                  <div className="col-md-12 pl-0" style={{ display: 'none' }}>
                                        <div className="col-md-10">
                                            <div className="copy">
                                                {specialityshtmllist}
                                            </div>
                                        </div>
                                    </div> */}
                                    {specialityslist.length > 0 && specialityslist.map((SlistItems, index) => {
                                        return <div key={`specialitys${index}`} className={`col-md-12 hidespecialitys${index} `} >
                                            <div className="row">
                                                <div className="col-md-10 col-10">
                                                    <div className="copy">
                                                        <div key={'speciality' + index} className="control-group input-group">
                                                            <div className="col-md-10 col-10 p-0 ">
                                                                <div name="specialitys" className="input-box mb-3 w-100">{SlistItems}</div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="d-flex col-md-2 col-2 p-0">
                                                    <button onClick={() => { removeSpecialitys(index) }} className="remove minus" type="button"><i className="fas fa-minus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                    }

                                    <div className="col-md-12">
                                        <label>Introduction</label>
                                        <textarea onChange={(e) => handleInputs(e)} value={user.introduction} name="introduction" className="w-100 mb-2" placeholder="Introduction"></textarea>
                                        <div className="text-danger">{errors.introduction}</div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="row m-0">
                                            <div className="col-md-10 col-10 mt-4">
                                                <div className="row unused">
                                                    <div className="input-group control-group after-add-more position-relative">
                                                        <input onChange={(e2) => handleCertification(e2)} type="text" autoComplete={'off'} name="certification" value={certification} className="input-box w-100 mb-3" placeholder="Certifications" />
                                                        <div className="input-group-btn">
                                                            <button onClick={(e2) => { handleCertifications(e2) }} className="add-more position-absolute" type="button"><i className="fas fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 col-2 mt-3 pr-0 text-center">
                                                <div className="uploadimg">
                                                    <input type="file" id="uploadCertifications" onChange={(e) => { onCertificationFileChange(e, certification) }} accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                    <label htmlFor="uploadCertifications">
                                                        <img src="/img/upload.png" alt='Upload' />
                                                    </label>
                                                </div>

                                            </div>
                                            <div className="text-danger">{errors.certification}</div>
                                            <div className="text-danger">{errors.certificationImg}</div>
                                            <div className="text-danger">{errors.certificationAlready}</div>
                                        </div>
                                    </div>
                                    {certificationslist.length > 0 && certificationslist.map((ClistItems, index) => {
                                        return <div key={`certification${index}`} className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-10 col-10">
                                                    <div className="copy">
                                                        <div key={'certification' + index} className="control-group input-group" style={{ marginTop: "10px" }}>
                                                            <div className="d-flex">
                                                                <div name="certifications" className="removeinput">{ClistItems}</div>
                                                                <div className="input-group-btn position-relative">
                                                                    <button onClick={() => { removeCertifications(index) }} className="remove position-absolute" type="button"><i className="fas fa-times"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 col-2 mt-2 text-center">
                                                    <div className="uploadimg">
                                                        <input type="file" id="uploadQualification1" accept=".png, .jpg, .jpeg, .pdf, .doc" />
                                                        <label htmlFor="uploadQualification1">
                                                            <img src="/img/file.png" alt='File' className="Fileicon" style={{ position: "unset" }} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })}

                                    <div className="col-md-12">
                                        <ul className="list-inline togglebox my-3">
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
                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="custom-control custom-checkbox my-2">
                                            <input type="checkbox" className="custom-control-input" id="term" name="example2" onChange={(e) => { handleTAndC(e) }} />
                                            <label className="custom-control-label terms-text" htmlFor="term"><span className="pl-2">I agree to the  <Link to="/termsandcondition" className="gray-text">Terms & Conditions</Link></span></label>
                                        </div>
                                        <div className="text-danger">{errors.isAgree}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { PostSignUp(e) }} className="loginbtn my-4">Submit</button>
                                            </div>
                                            <div className="col-md-6">
                                                <button onClick={(e) => { setIsNext(1); }} className="loginbtn mt-md-4 mb-5">Back</button>
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
