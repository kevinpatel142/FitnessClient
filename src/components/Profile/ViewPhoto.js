import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';
function ViewPhoto() {
    const history = useHistory();
    const ProfileImage_URL = '/img/Small-no-img.png';
    const [profileimagepreview, setProfileImagePreview] = useState(ProfileImage_URL);
    const [profileimage, setProfileImage] = useState(null);
    const initState = { date: new Date(), list: [], base64Img: [] };
    const [getAllPhotos, setGetAllPhotos] = useState([]);
    const [isMountRender, setMountRender] = useState(true);
    useEffect(() => {
        if (isMountRender) return;
    }, [isMountRender]);
    useEffect(() => {
        setMountRender(false);
        callToken();
        fetchProgressPhotos();
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    const fetchProgressPhotos = () => {
        document.querySelector('.loading').classList.remove('d-none');
        axios.get(`${apiUrl}${PORT}/client/account/getprogressphotos`, {}, {}).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                debugger
                if (response.data.result && response.data.result.length > 0) {
                    if (response.data.result.length > 0) {
                        if (response.data.result.filter(x => new Date(x.date).toLocaleDateString() === new Date().toLocaleDateString()).length === 0) {
                            response.data.result.push(initState);
                        } else {
                            response.data.result.forEach(ele => {
                                ele['base64Img'] = ele.list
                            });
                        }
                    }
                    setGetAllPhotos(response.data.result);
                } else {
                    response.data.result.push(initState);
                    setGetAllPhotos(response.data.result);
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
        }).catch(function (error) {
            document.querySelector('.loading').classList.add('d-none');
            window.alert(error);
        });
    };
    /* const fetchProgressPhotos = () => {
        document.querySelector('.loading').classList.remove('d-none');
        setGetAllPhotos(JSON.parse(localStorage.getItem("progressphotos")));
        document.querySelector('.loading').classList.add('d-none');
    } */

    const OnFileChange = (event, obj) => {
        const file_size = event.target.files[0].size;
        if (file_size > 1048000) {
            alert("File size more than 1 MB. File size must under 1MB !");
            event.preventDefault();
        } else {
            debugger
            const fileReader = new window.FileReader();
            const file = event.target.files[0];
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
    };

    const uploadImages = async (e) => {
        e.preventDefault();
        document.querySelector('.loading').classList.remove('d-none');
        const formData = new FormData();
        var filelist = [];
        debugger
        for (var key in getAllPhotos[0].list) {
            if (getAllPhotos[0].list[key].type !== undefined) {
                formData.append(getAllPhotos[0].list[key].name, getAllPhotos[0].list[key]);
                filelist.push(getAllPhotos[0].list[key].name);
            } else {
                let isCheckBase64 = getAllPhotos[0].list[key]?.indexOf('data:image/') > -1;
                if (!isCheckBase64) {
                    formData.append(getAllPhotos[0].list[key].split('/')[getAllPhotos[0].list[key].split('/').length  - 1], getAllPhotos[0].list[key]);
                    filelist.push(getAllPhotos[0].list[key].split('/')[getAllPhotos[0].list[key].split('/').length  - 1]);
                }
            }
        }
        filelist = filelist.filter(function (element) {
            return element !== undefined;
        });
        formData.append("filelist", JSON.stringify(filelist));
        formData.append("progressphotos", new Date(getAllPhotos[0].date));
        //formData.append("progressphotos", JSON.stringify(getAllPhotos[0].date));
        await axios.post(`${apiUrl}${PORT}/client/account/saveprogressphotos`, formData, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                history.push("/editprofile")
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
            document.querySelector('.loading').classList.add('d-none');
            window.alert(error);
        });
    }

    /* const uploadImages = async () => {
        document.querySelector('.loading').classList.remove('d-none');
        localStorage.setItem("progressphotos", JSON.stringify(getAllPhotos));
        document.querySelector('.loading').classList.add('d-none');
        history.push("/editprofile")
    } */

    return (
        <>
            <div className="container-fluid">
                <div className="loading d-none">
                    <div className="mainloader"></div>
                </div>
                <div className="col-md-12 col-12 p-0">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <h1 className="main_title mb-4">Progress Photos</h1>
                        </div>
                        {getAllPhotos.length > 0 && getAllPhotos.map((res, index) => {
                            debugger
                            return <div key={index} className="col-md-6 col-12">
                                <div className="row">
                                    <div className="col-md-12 col-12 mb-4">
                                        <div className="d-flex">
                                            <div className="p-photo">
                                                <img src="/img/Small-no-img.png" onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt='Profile' />
                                            </div>
                                            <div className="progress-content">
                                                <p>Photos</p>
                                                <span>{new Date(res.date).toDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {res?.base64Img && res?.base64Img?.length > 0 && res?.base64Img.map((ele, index) => {
                                        if (ele?.type?.indexOf('image/') > -1) {
                                            return <></>
                                        } else {
                                            return <div key={index} className="col-lg-3 col-md-6 col-12 mb-2">
                                                <div className="prog-img">
                                                    <img src={`${ele?.indexOf('data:image/') > -1 ? ele : apiUrl + PORT + ele}`} alt="img" />
                                                </div>
                                            </div>
                                        }
                                    })}
                                    {res?.list && res?.list?.length > 0 && res?.list.map((ele, index) => {
                                        let isFile = ele.type ? ele.type.indexOf('image') > -1 : false;
                                        if (!isFile) {
                                            return <div key={index} className="col-lg-3 col-md-6 col-12 mb-2">
                                                <div className="prog-img">
                                                    <img src={apiUrl + PORT + ele} alt="img" />
                                                </div>
                                            </div>
                                        }
                                    })}
                                    {new Date().toDateString() === new Date(res.date).toDateString() ?
                                        <div className="col-lg-3 col-md-6 col-12">
                                            <div className="prog-img">
                                                <input type="file" id="imgupload" onChange={(e) => { OnFileChange(e, res) }} />
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </div>
                            </div>
                        })}
                        {/* <div className="col-md-12 pl-0" style={{ display: 'none' }}>
                            <div className="col-md-10">
                                <div className="copy">
                                    {profileimagepreview}
                                    {profileimage}
                                </div>
                            </div>
                        </div> */}
                        <div className="col-12">
                            <div className="upload_btn prog-upload" onClick={(e) => { uploadImages(e) }}>Submit</div>
                            {/* <div className="upload_btn prog-upload" onClick={history.push("/editprofile")}>Back</div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewPhoto;
