import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, NavLink, Route, useHistory } from 'react-router-dom';
import CancellationPolicy from "./components/CancellationPolicy";
import BookSessionsDetail from "./components/Client/BookSessionsDetail";
import ClientPayment from './components/Client/ClientPayment';
import FeedBackRating from './components/Client/FeedBackRating';
import ForgotPasswordClient from "./components/Client/ForgotPassword";
import LoginClient from "./components/Client/Login";
import MySession from "./components/Client/MySession";
import MyWorkout from './components/Client/MyWorkout';
import PaymentHistory from "./components/Client/PaymentHistory";
import PurchaseSession from './components/Client/PuchaseSession';
import SavedTrainer from './components/Client/SavedTrainer';
import ClientSignUp from "./components/Client/SignUp";
import Trainer from "./components/Client/Trainer";
import WorkOutForm from './components/Client/WorkOutForm';
import FAQ from "./components/FAQ";
import LogOutUser from "./components/LogOut";
import Calling from "./components/Others/Calling";
import Incoming from "./components/Others/Incoming";
import VideoSession from "./components/Others/VedioSession";
import Videosessionhistory from './components/Others/vediosessionhistory';
import ClientProfile from './components/Profile/ClientProfile';
import EditProfile from './components/Profile/EditProfile';
import MyProfile from './components/Profile/MyProfile';
import Notifications from './components/Profile/Notifications';
import TrainerInformation from './components/Profile/TrainerInformation';
import ViewPhoto from './components/Profile/ViewPhoto';
import ResetPassword from "./components/ResetPassword";
import SignupSuccess from "./components/SignupSuccess";
import TermsAndCondition from "./components/TermsAndCondition";
import TrainerAccountInfo from './components/Trainer/AccounntInfo';
import ForgotPasswordTrainer from "./components/Trainer/ForgotPassword";
import LoginTrainer from "./components/Trainer/Login";
import MyRatings from "./components/Trainer/MyRating";
import ScheduleRequest from "./components/Trainer/ScheduleRequest";
import SessionDetails from "./components/Trainer/SessionDetails";
import TrainerSignUp from "./components/Trainer/SignUp";
import TrainerSchedule from './components/Trainer/TrainerSchedule';
import { apiUrl, PORT } from './environment/environment';
//import Fader from "./components/Notifications/Fader";
//import BankLink from "./components/Others/BankLink";
////import { onMessageListener } from "./firebaseInit";
//import { BankLink } from "./components/Others/BankLink";
import ReactNotificationComponent from "./components/Notifications/ReactNotification";
import "./app.css";
import MobileVedioSession from "./components/Others/MobileVedioSession";


function App() {
  const history = useHistory();
  const [filterPanel, setFilterPanel] = useState('');
  const [serachValue, setSerachValue] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [pathnameUrl, setPathnameUrl] = useState(window.location.pathname);
  const usertype = localStorage.getItem('usertype');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const serachText = useRef('');
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const loginuserdetail = localStorage.getItem('user');
  var loginUser = {};
  if (loginuserdetail && loginuserdetail !== "[Object Object]" && loginuserdetail !== "[object Object]")
    loginUser = JSON.parse(loginuserdetail);
  else
    history.push("/");

  // onMessageListener()
  //   .then((payload) => {
  //     setShow(true);
  //     setNotification({
  //       title: payload.notification.title,
  //       body: payload.notification.body,
  //     });
  //     // console.log(payload);
  //   })
  //   .catch((err) => console.log("failed: ", err));

  // if (window.location.pathname !== '/calling' && window.location.pathname !== '/Incoming' && window.location.pathname !== '/videosession') {
  //   setTimeout(() => {
  //     if (window.location.pathname !== '/calling' && window.location.pathname !== '/Incoming' && window.location.pathname !== '/videosession') {
  //       verifytokenCall();
  //       return history.listen((location) => {
  //         console.log(`You changed the page to: ${location.pathname}`)
  //       })
  //     }
  //   }, 3000);
  // }
  useEffect(() => {
    setPathnameUrl(window.location.pathname);
    if (window.location.pathname !== '/trainer' && window.location.pathname !== '/savedtrainer')
      document.body.classList.remove('scrollHide');
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      axios.get(`${apiUrl}${PORT}/account/verifytoken`, {}, {
      }).then(function (response) {
        if (response.data.status === 1) {
          if (usertype === "client")
            setIsLogin(true);
          else if (usertype === "trainer")
            setIsLogin(true);
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, [usertype, pathnameUrl]);


  const showclick = async (e) => {
    document.querySelector('.page-wrapper').classList.add('toggled');
  };

  const hideclick = async (e) => {
    document.querySelector('.page-wrapper').classList.remove('toggled');
  };

  const LogOut = async (e) => {
    e.preventDefault();

    if (usertype === "trainer") {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(`${apiUrl}${PORT}/trainer/account/logout`, {}, {
        }).then(function (response) {
          if (response.data.status === 1) {
            localStorage.clear();
            window.location.href = "/";
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    } else {
      localStorage.clear();
      window.location.href = "/";
    }
  }

  const callTrainer = async (e, _url) => {
    if (_url === '/trainer' || _url === '/savedtrainer')
      document.body.classList.add('scrollHide');

    setPathnameUrl(_url)
    if (_url === "/savedtrainer") {
      e.preventDefault();
      history.push(_url);
    }
  }

  return (
    <>
      <div className="App">
        {show ? (
          <ReactNotificationComponent
            title={notification.title}
            body={notification.body}
          />
        ) : (
          <></>
        )}
      </div>

      <Router>
        <Route exact path="/"><LoginClient></LoginClient></Route>
        <Route path="/trainer/login"><LoginTrainer></LoginTrainer></Route>
        <Route path="/client/login"><LoginClient></LoginClient></Route>
        <Route path="/logout"><LogOutUser></LogOutUser></Route>
        <Route path="/clientsignup"><ClientSignUp></ClientSignUp></Route>
        <Route path="/trainersignup"><TrainerSignUp></TrainerSignUp></Route>
        <Route path="/signupsuccess"><SignupSuccess></SignupSuccess></Route>
        <Route path="/client/forgotpassword"><ForgotPasswordClient></ForgotPasswordClient></Route>
        <Route path="/trainer/forgotpassword"><ForgotPasswordTrainer></ForgotPasswordTrainer></Route>
        <Route path="/:usertype?/account/resetpassword/:credentials?"><ResetPassword></ResetPassword></Route>
        <Route path="/trainerschedule"><TrainerSchedule></TrainerSchedule></Route>
        <Route path="/trainersaccountinfo"><TrainerAccountInfo></TrainerAccountInfo></Route>
        <Route path="/termsandcondition"><TermsAndCondition></TermsAndCondition></Route>
        <Route path="/mobilevideosession"><MobileVedioSession></MobileVedioSession></Route>
        {/* <Route path="/banklink"><BankLink></BankLink></Route> */}
        {
          (isLogin === true) ?
            <div className="page-wrapper chiller-theme toggled">
              <button id="show-sidebar" className="btn btn-sm btn-dark" onClick={showclick}>
                <i className="fas fa-bars"></i>
              </button>
              <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-content">
                  <div className="sidebar-brand" >
                    <div id="close-sidebar" onClick={hideclick}>
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                  <div className="sidebar-header">
                    {(usertype === "client") ?
                      <>
                        <NavLink to="/trainer?status=1" onClick={(e) => { callTrainer(e, '/trainer'); }} className={({ isActive }) => isActive ? 'active' : ''}><img src="/img/KNKTLogo.png" alt="logo" /></NavLink>
                      </>
                      :
                      <>
                        <NavLink to="/schedulerequest" onClick={(e) => { callTrainer(e, '/schedulerequest'); }} className={({ isActive }) => isActive ? 'active' : ''}><img src="/img/KNKTLogo.png" alt="logo" /></NavLink>
                      </>
                    }
                  </div>
                  <div className="sidebar-menu">
                    <ul className="pl-4 pt-4">
                      {(usertype === "client") ?
                        <>
                          <li className="sidebar-dropdown">
                            <NavLink to='/trainer?status=1' onClick={(e) => { callTrainer(e, '/trainer'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-home"></i>
                              <span>Trainers</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/savedtrainer' onClick={(e) => { document.body.classList.add('scrollHide'); setPathnameUrl("/savedtrainer") }} className={({ isActive }) => isActive ? 'active' : ''} >
                              <i className="far fa-bookmark"></i>
                              <span>Saved Trainers</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/mysession' className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="far fa-calendar"></i>
                              <span>My Sessions</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/myWorkoutHistory' onClick={(e) => { callTrainer(e, '/myWorkout'); setPathnameUrl("/mysession") }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-walking"></i>
                              <span>My Workout History</span>
                            </NavLink>
                          </li>
                          {/* <li className="sidebar-dropdown">
                            <NavLink to='/videosessionhistory' onClick={(e) => { callTrainer(e, '/videosessionhistory'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-wallet"></i>
                              <span>Video Session History</span>
                            </NavLink>
                          </li> */}
                          <li className="sidebar-dropdown">
                            <NavLink to='/purchasesession' onClick={(e) => { callTrainer(e, '/purchasesession'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-wallet"></i>
                              <span>Purchase Sessions</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/cancellationpolicy' onClick={(e) => { callTrainer(e, '/cancellationpolicy'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="far fa-times-circle"></i>
                              <span>Cancellation Policy</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/faq' onClick={(e) => { callTrainer(e, '/faq'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-headphones"></i>
                              <span>FAQ and Support</span>
                            </NavLink>
                          </li>
                        </>
                        :
                        <>
                          <li className="sidebar-dropdown">
                            <NavLink to='/schedulerequest' onClick={(e) => { callTrainer(e, '/schedulerequest'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-calendar"></i>
                              <span>Scheduling Requests</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/myratings' onClick={(e) => { callTrainer(e, '/myratings'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="far fa-heart"></i>
                              <span>My Ratings</span>
                            </NavLink>
                          </li>
                          <li className="sidebar-dropdown">
                            <NavLink to='/paymenthistory' onClick={(e) => { callTrainer(e, '/paymenthistory'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-wallet"></i>
                              <span>Payment History</span>
                            </NavLink>
                          </li>
                          {/* <li className="sidebar-dropdown">
                            <NavLink to='/videosessionhistory' onClick={(e) => { callTrainer(e, '/videosessionhistory'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="fas fa-wallet"></i>
                              <span>Video Session History</span>
                            </NavLink>
                          </li> */}
                          <li className="sidebar-dropdown">
                            <NavLink to='/termsncondition' onClick={(e) => { callTrainer(e, '/termsncondition'); }} className={({ isActive }) => isActive ? 'active' : ''}>
                              <i className="far fa-file-alt"></i>
                              <span>Terms & Conditions</span>
                            </NavLink>
                          </li>
                        </>}
                    </ul>
                  </div>
                  <div className="sidebar-footer">
                    <ul>
                      <li><button onClick={(e) => LogOut(e)}><i className="fas fa-sign-out-alt"></i>Log Out</button></li>
                    </ul>
                  </div>
                </div>
              </nav>

              <main className="page-content pb-3" role="main">
                <header>
                  <nav className="navbar navbar-expand-sm navbar-toggleable-sm bg-white nav-head">
                    <div className="container-fluid">
                      <div className="col-md-12 col-12 p-0">
                        <div className="row">
                          <div className="col-lg-5 col-12">
                            <h4 className="head-title"><span className="text-blue">Hello {loginUser.firstname}!</span> Let's get started</h4>
                            <button className="custom-toggler navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                              <i className="fas fa-bars"></i>
                            </button>
                          </div>
                          <div className="col-lg-7 col-12 text-right">
                            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse float-right`} id="navbarsExample09">
                              <ul className="head-icon list-inline mb-0">
                                {(pathnameUrl === "/trainer" || pathnameUrl === "/savedtrainer") && (usertype === "client") ?
                                  <>
                                    <li className="list-inline-item"><input className="input_box" placeholder="Search" ref={serachText} onKeyPress={(e) => {
                                      if (e.which === 13) {
                                        setSerachValue(e.target.value);
                                      }
                                    }} />
                                      <i className="fas fa-search search-i" onClick={(e) => { ; setSerachValue(serachText.current.value); }}></i></li>
                                  </>
                                  : <></>
                                }
                                {(pathnameUrl === "/trainer" || pathnameUrl === "/savedtrainer" || pathnameUrl === "/mysession") && (usertype === "client") ?
                                  <>
                                    <li className="list-inline-item" onClick={(e) => { e.preventDefault(); setFilterPanel(pathnameUrl === '/trainer' ? 'openFilter' : 'closeFilter'); }}>
                                      <NavLink to={pathnameUrl === '/savedtrainer' ? '/trainer' : '/savedtrainer'} onClick={(e) => { document.body.classList.add('scrollHide'); setPathnameUrl("/savedtrainer") }} className={({ isActive }) => isActive ? 'active' : ''} title="Saved">
                                        <i className={`${(pathnameUrl === '/savedtrainer') ? "fa" : "far"} fa-bookmark`}></i>
                                      </NavLink>
                                    </li>
                                    {(pathnameUrl === "/trainer") && (usertype === "client") ?
                                      <>
                                        <li className="list-inline-item">
                                          {
                                            filterPanel === 'openFilter' ?
                                              <button onClick={(e) => { e.preventDefault(); setFilterPanel('closeFilter') }} title="Filter"><i className="fas fa-sliders-h"></i></button>
                                              :
                                              <button onClick={(e) => { e.preventDefault(); setFilterPanel('openFilter') }} title="Filter"><i className="fas fa-sliders-h"></i></button>
                                          }
                                        </li>
                                      </> : <></>
                                    }
                                  </>
                                  : <></>
                                }
                                <li className="list-inline-item dropdown">
                                  <button className="dropdown-toggle" data-toggle="dropdown" title="Notification">
                                    <i className="far fa-bell"></i>
                                    <div className="qty">0</div>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li className="d-flex justify-content-between"><span className="noti-text">Notifications</span><span className="noti_subtext">Mark all as read</span></li>
                                    <li>
                                      <ul className="list-inline noti_submenu">
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>09:20</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="far fa-check-circle green-text"></i>
                                              <div className="noti_content">
                                                <h5>Session Confirmed </h5>
                                                <p className="mb-2">Your session with Ross at 9:15 on Jul 22</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>10:00</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="fas fa-redo"></i>
                                              <div className="noti_content">
                                                <h5>Get Ready !</h5>
                                                <p className="mb-2">Your session is starting in 1 hours Join</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>01:00</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="fas fa-redo"></i>
                                              <div className="noti_content">
                                                <h5>Get Ready !</h5>
                                                <p className="mb-2">Yor session is starting in 1 hours.Join</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>10:00</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="fas fa-redo"></i>
                                              <div className="noti_content">
                                                <h5>Session in 24 Hours !</h5>
                                                <p className="mb-2">Your session is starting in 24 hours.Join</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>12:11</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="far fa-envelope"></i>
                                              <div className="noti_content">
                                                <h5>Session Cancelled</h5>
                                                <p className="mb-2">Your session is cancelled.You can join</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>04:11</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="fas fa-credit-card"></i>
                                              <div className="noti_content">
                                                <h5>Payment Processing</h5>
                                                <p className="mb-2">Your Payment of $ 14.00 is in process.</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item">
                                            <div className="text-right">
                                              <span>12:11</span>
                                            </div>
                                            <div className="d-flex notification_i">
                                              <i className="fas fa-credit-card"></i>
                                              <div className="noti_content">
                                                <h5>Workout Summary Posted</h5>
                                                <p className="mb-2">Your last workout has been posted</p>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                      </ul>
                                    </li>
                                  </ul>
                                </li>
                                <li className="list-inline-item" title="My profile">
                                  <NavLink to="/myprofile" className={({ isActive }) => isActive ? 'active d-block text-decoration-none' : 'd-block text-decoration-none'}>
                                    <img className="user-img" src={`${apiUrl}${PORT}${loginUser.profile}`}
                                      onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt="img" />
                                    {/* {loginUser.profile !== "" && loginUser.profile ?
                                    <><img className="user-img" src={`${apiUrl}${PORT}${loginUser.profile}`} alt="img" /></>
                                    :
                                    <><div className="user-img">{loginUser.firstname.substring(0, 1).toUpperCase()}</div></>
                                  } */}
                                  </NavLink>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </header>

                {/* <Router>
                <Switch> */}
                <Route exact path="/trainer"
                  component={() => <Trainer type={filterPanel} flterValue={serachValue} />}
                />
                <Route path="/cancellationpolicy"><CancellationPolicy></CancellationPolicy></Route>
                <Route path="/faq"><FAQ></FAQ></Route>
                <Route path="/myratings"><MyRatings></MyRatings></Route>
                <Route path="/schedulerequest"><ScheduleRequest></ScheduleRequest></Route>
                <Route path="/sessiondetails"><SessionDetails></SessionDetails></Route>
                <Route path="/paymenthistory"><PaymentHistory></PaymentHistory></Route>
                <Route path="/mysession"><MySession></MySession></Route>
                <Route path="/booksessionsdetail"><BookSessionsDetail></BookSessionsDetail></Route>
                <Route exact path="/savedtrainer"
                  component={() => <SavedTrainer type={filterPanel} flterValue={serachValue} />}
                />
                <Route path="/purchasesession"><PurchaseSession></PurchaseSession></Route>
                <Route path="/clientpayment"><ClientPayment></ClientPayment></Route>
                <Route path="/myprofile"><MyProfile></MyProfile></Route>
                <Route path="/clientprofile"><ClientProfile></ClientProfile></Route>
                <Route path="/editprofile"><EditProfile></EditProfile></Route>
                <Route path="/notifications"><Notifications></Notifications></Route>
                <Route path="/viewphoto"><ViewPhoto></ViewPhoto></Route>
                <Route path="/trainerinformation"><TrainerInformation></TrainerInformation></Route>
                <Route path="/workoutform"><WorkOutForm></WorkOutForm></Route>
                <Route path="/termsncondition"><TermsAndCondition></TermsAndCondition></Route>
                <Route path="/rating"><FeedBackRating></FeedBackRating></Route>
                <Route path="/myWorkoutHistory"><MyWorkout></MyWorkout></Route>
                <Route path="/calling"><Calling></Calling></Route>
                <Route path="/incoming"><Incoming></Incoming></Route>
                <Route path="/videosession"><VideoSession></VideoSession></Route>
                <Route path="/videosessionhistory"><Videosessionhistory></Videosessionhistory></Route>
                {/* </Switch>
              </Router> */}
              </main>
            </div>
            :
            <>

              {/* <Route path="/termsandcondition"><TermsAndCondition></TermsAndCondition></Route>
            <Route path="/cancellationpolicy"><CancellationPolicy></CancellationPolicy></Route>
            <Route path="/faq"><FAQ></FAQ></Route> */}
            </>
        }
      </Router>
    </>
  );
}

export default App;