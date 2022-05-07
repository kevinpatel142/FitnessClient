import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';
import { verifytokenCall } from '../Others/Utils.js';
function MyWorkout() {
    const [showModel, setShowModel] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [list, setList] = useState([]);
    const [getlist, setGetlist] = useState();
    const handleClose = () => setShowModel(false);
    useEffect(() => {
        callToken();
        GetList();
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }
    async function GetList() {
        setIsLoader(true);
        await axios.get(`${apiUrl}${PORT}/client/session/getworkoutlist`, {}, {})
            .then(function (response) {
                setIsLoader(false);
                if (response.data.status === 1)
                    setList(response.data.result);
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
                setIsLoader(false);
                window.alert(error);
            });
    };
    const isEdit = (obj) => {
        setIsLoader(true);
        setGetlist(obj);
        setShowModel(true);
        setIsLoader(false);
    }
    return (
        <>
            {isLoader &&
                <div className="loading">
                    <div className="mainloader"></div>
                </div>
            }
            <div className="container-fluid">
                <div className="col-md-12 col-sm-12 col-12 p-0">
                    <div className="row mb-3">
                        <div className="col-md-12 col-12">
                            <h1 className="main_title">My Workout History</h1>
                        </div>
                    </div>
                    <div className="box-card">
                        <div className="row">
                            <div className="col-md-12 col-12 record_table mt-2">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Trainer Name</th>
                                                <th>Basic Movements</th>
                                                <th>Fitness Goals </th>
                                                <th>Injuries </th>
                                                <th>Date</th>
                                                <th className="text-center w130">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list.length > 0 ?
                                                list.map((ele, index) => {
                                                    return (
                                                        <tr key={'index' + index}>
                                                            <td>{index + 1}</td>
                                                            <td>{ele?.client_data?.firstname}</td>
                                                            <td>{ele?.sessionworkout?.basicMovements.map((rs,ind) => {
                                                                return (<p key={'ind' + ind}>{rs.movementName}</p>)
                                                            })}</td>
                                                            <td>{ele?.sessionworkout?.fitnessGoals}</td>
                                                            <td>{ele?.client_data?.injuriesorhelthissues ? ele?.client_data?.injuriesorhelthissues : 'N/A'}</td>
                                                            <td>{new Date(ele.date).toDateString()}</td>
                                                            <td className="text-center">
                                                                <button className="btn btn-info mr-2" onClick={(e) => { isEdit(ele) }}><i className="ace-icon fa fa-eye"></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <> {!isLoader &&
                                                    <td className="text-center" colSpan="9">
                                                        No Record Found
                                                    </td>
                                                }</>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {/* <paging ng-if="List.length > 0" pagenumber="PageNumber" pagesize="PageSize" totalrecords="TotalRecords" getlist="GetList"></paging> */}
                                {/* <paging pagenumber="PageNumber" pagesize="PageSize" totalrecords="TotalRecords" getlist="GetList" className="">
                                    <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                        <div className="pagination">
                                            <a>«</a>
                                            <a className="active">1</a><a className="">2</a><a className="">3</a>
                                            <a>»</a>
                                        </div>
                                    </div>
                                </paging> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/*---------- workform view Detail Modal--------------*/}

            <Modal show={showModel} onHide={handleClose} size="lg" scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Workout Form Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12 pb-3 Workform">
                        <div className="row">
                            <div className="col-lg-12 col-md-6 col-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <tr>
                                            <th>Name</th>
                                            <td>{getlist?.client_data?.firstname}</td>
                                        </tr>
                                        <tr>
                                            <th>Age</th>
                                            <td>{getlist?.client_data?.age}</td>
                                        </tr>
                                        <tr>
                                            <th>Injuries</th>
                                            <td>{getlist?.client_data?.injuriesorhelthissues}</td>
                                        </tr>
                                        <tr>
                                            <th>Fitness Goals</th>
                                            <td>{getlist?.sessionworkout?.fitnessGoals}</td>
                                        </tr>
                                        <tr>
                                            <th>Additional Notes</th>
                                            <td>{getlist?.sessionworkout?.additionalNotes}</td>
                                        </tr>
                                        <tr>
                                            <th>Format</th>
                                            <td>{getlist?.sessionworkout?.format}</td>
                                        </tr>
                                    </table>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 col-12">
                                        <label className="w-100">Q. What did you focus on today to achieve. Your client's desired fitness goals?</label>
                                        <p>A.{getlist?.sessionworkout?.desiredOne ? getlist?.sessionworkout?.desiredOne?.join(',') : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-12">
                                        <label className="w-100">Q. What did you focus on today to achieve your client's desired fitness goals?</label>
                                        <p>A.{getlist?.sessionworkout?.desiredTwo ? getlist?.sessionworkout?.desiredTwo?.join(',') : "N/A"}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-12">
                                        <label className="w-100">Q. Which of the 7 basic movements did you work on today? (Check all that apply) </label>
                                        <p>A.{getlist?.sessionworkout?.basicMovements.length > 0 && getlist?.sessionworkout?.basicMovements.map(x => x.movementName).join(',')}</p>
                                    </div>
                                </div>
                                {getlist?.sessionworkout?.basicMovements.length > 0 && getlist?.sessionworkout?.basicMovements.map((ele,i) => {
                                    return (
                                        <div key={'i_' + i} className="row">
                                            <div className="col-md-12 col-12">
                                                <h4 className="work-name">{ele.movementName}</h4>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered table-hover">
                                                        <tr>
                                                            <th>Specify Movement</th>
                                                            <td>{ele.specifyMovement ? ele.specifyMovement : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Weight</th>
                                                            <td>{ele.weight ? ele.weight : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Rest Duration</th>
                                                            <td>{ele.restDuration ? ele.restDuration : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Sets</th>
                                                            <td>{ele.sets ? ele.sets : "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Reps</th>
                                                            <td>{ele.reps ? ele.reps : "N/A"}</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/*---------- workform view Detail Modal End--------------*/}
        </>
    );
}
export default MyWorkout;