import axios from 'axios';
import Moment from 'react-moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';


const PendingWorkout = () => {
    const [srlist, setSessionRequestList] = useState([]);
    useEffect(() => {
        GetList();
    }, [])
    // let srlist = [];
    async function GetList() {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        console.log("userData", userData._id);
        document.querySelector('.loading').classList.remove('d-none');
        // setTrainerId(id);


        const userParam = {
            "user_id": userData._id,
        }
        await axios.post(`${apiUrl}${PORT}/client/session/getAllworkout`, { userParam })
            .then(function (response) {
                console.log("response", response.data.result);
                document.querySelector('.loading').classList.add('d-none');
                // srlist = response.data.result;
                setSessionRequestList(response.data.result);
                // setSessionRequestList(...srlist, response.data.result);
                // console.log("srlist",srlist);

                /* renderArr(response.data.result); */
            }).catch(function (error) {
                //document.querySelector('.loading').classList.add('d-none');
                console.log(error);
            });

        console.log("srlist-1", srlist);
        //  console.log("test-1", test);
    };
    return (
        <>
            <div className="loading d-none">
                <div className="mainloader"></div>
            </div>
            <div className="container-fluid">
                <div className="col-md-12 col-12 p-0">
                    <div className="row">
                        <div className="col-md-12 col-12 mb-4">
                            <h1 className="main_title">Pending Workout Forms</h1>
                        </div>
                        <div className="col-md-12 col-12">
                            <div className="history-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th><strong>Clients</strong></th>
                                            <th><strong>Workout Date</strong></th>
                                            <th><strong>Status</strong></th>
                                            {/* <th><strong>Action</strong></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            srlist.length > 0 ? srlist.map((elem) => {
                                                return (<><tr>
                                                    <td>
                                                        <div className="">
                                                            <img className="history-img" src={elem.client_data.profile.length > 0 ? `${apiUrl}${PORT}${elem.client_data.profile}` : '/img/Small-no-img.png'} alt="img" />
                                                            <span className="history-name">{elem.client_data.firstname} {elem.client_data.lastname}</span>
                                                        </div>
                                                    </td>
                                                    <td><span><Moment format="YYYY/MM/DD, hh:m A" date={elem.date} /></span></td>

                                                    <td>{elem.sessionworkout ? <span className="btn-success p-status">Completed</span> : <Link title='Go Workout Form' to={`/sessiondetails?Id=${elem._id}`}><span className="btn-warning p-status">Pending</span></Link>}</td>
                                                </tr></>)
                                            }) : <><tr><td colspan="10">No Records Found</td></tr></>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <div className="col-md-12 col-12 text-center mt-5">
                            <button className="training_btn w-25 mx-auto">Export Report</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PendingWorkout;