import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { getToken } from "./../../firebaseInit";

function Login() {
    const history = useHistory();
    const [isHidden, setIsHidden] = useState(true);

    const [isTokenFound, setTokenFound] = useState(false);
    const [pushToken, setPushToken] = useState("");
    // To load once
    useEffect(() => {
        let data;
        async function tokenFunc() {
            data = await getToken(setTokenFound);
            if (data) {
                console.log("Token is", data);
                setPushToken(data);
            }
            return data;
        }
        tokenFunc();
    }, [setTokenFound]);

    useEffect(() => {
        localStorage.clear();
    }, []);


    const GotoTrainer = () => {
        history.push("/trainer/login");
    }

    const [user, setUser] = useState({
        email: "", password: ""
    });
    const handleInputs = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const PostLogin = async (e) => {
        e.preventDefault();

        if (user.email === "") {
            //window.alert("Please enter email.");
            swal({
                title: "Error!",
                text: "Please enter email.",
                icon: "error",
                button: true
            })
            return false;
        }
        else if (user.password === "") {
            //window.alert("Please enter Password.");
            swal({
                title: "Error!",
                text: "Please enter Password.",
                icon: "error",
                button: true
            })
            return false;
        }
        localStorage.clear();
        document.querySelector('.loading').classList.remove('d-none');
        await axios.post(`${apiUrl}${PORT}/client/account/login`, { "email": user.email, "password": user.password, "deviceid": pushToken, "devicetype": "web" }, {
        }).then(function (response) {
            document.querySelector('.loading').classList.add('d-none');
            if (response.data.status === 1) {
                axios.defaults.headers.common['Authorization'] = response.data.result.token;
                localStorage.setItem('user', JSON.stringify(response.data.result.User));
                localStorage.setItem('usertype', 'client');
                localStorage.setItem('token', response.data.result.token);

                window.location.href = "/trainer";
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
            console.log(error);
        });
    }

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
                                    <h3>Welcome <br /> Back!</h3>
                                </div>
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="loading d-none">
                                    <div className="mainloader"></div>
                                </div>
                                <div className="loginbox">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item col-md-6 col-6 w-100">
                                            <a className="active nav-link text-center" data-toggle="tab" href="#MEMBER">MEMBER</a>
                                        </li>
                                        <li className="nav-item col-md-6 col-6 w-100">
                                            <a onClick={(e) => GotoTrainer()} className="nav-link text-center" data-toggle="tab" href="#TRAINER">TRAINER</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="MEMBER" className="container tab-pane active">
                                            <div className="row my-4">
                                                <div className="col-md-12">
                                                    <input onChange={(e) => handleInputs(e)} name="email" type="text" className="w-100  mb-3 input-box" placeholder="Email Address" />
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="position-relative">
                                                        <input onChange={(e) => handleInputs(e)} name="password" type={isHidden === true ? "password" : "text"} className="w-100  mb-3 input-box" placeholder="Password" />
                                                        <i className={`fa fa-eye${isHidden === false ? "" : "-slash"} icon`} onClick={() => setIsHidden(!isHidden)}></i>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 text-right">
                                                    <Link to='/client/forgotpassword'><span className="linktext">FORGOT PASSWORD ?</span></Link>
                                                </div>
                                                <div className="col-md-12">
                                                    <button onClick={(e) => PostLogin(e)} className="loginbtn mt-4">Login</button>
                                                </div>
                                                <div className="col-md-12 text-center mt-3">
                                                    <span className="text-login">Not registered yet?
                                                        <Link to='/clientsignup' className="linktext">  Sign Up</Link></span>
                                                </div>
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

export default Login;