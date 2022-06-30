import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Moment from 'react-moment';
import { Link, useHistory } from 'react-router-dom';
import { apiUrl, PORT } from '../../environment/environment';
// import ReactExport from 'react-data-export';

/* const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
 */
function TrainerPaymentHistory() {

    const [trainerPayment, setTrainerPayment] = useState([]);
    useEffect(() => {
        document.querySelector('.loading').classList.remove('d-none');
        axios.get(`${apiUrl}${PORT}/payment/gettrainerpayment`)
            .then((response) => {
                document.querySelector('.loading').classList.add('d-none');
                // console.log("response", response);
                if (response.status == 200) {
                    setTrainerPayment(response.data.result);
                }
            })
            .catch((err) => {
                console.log("err", err);
            })
    }, []);
    return (
        <>
            <div className="loading d-none">
                <div className="mainloader"></div>
            </div>
            <div className="container-fluid">
                <div className="col-md-12 col-12 p-0">
                    <div className="row">
                        <div className="col-md-12 col-12 mb-4">
                            <h1 className="main_title">Payment Histroy</h1>
                        </div>
                        <div className="col-md-12 col-12">
                            <div className="history-table table-responsive">

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Clients</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trainerPayment.length > 0 ? trainerPayment.map((element) => {
                                            return (<>
                                                <tr key={element}>
                                                    <td>
                                                        <div className="">
                                                            <img className="history-img" src={`${apiUrl}${PORT}${element.client_data.profile}`} onError={(e) => { e.target.src = "/img/Small-no-img.png" }} alt="img" />
                                                            <span className="history-name">{element.client_data.firstname}</span>
                                                        </div>
                                                    </td>
                                                    <td><span><Moment format="DD MMMM YYYY, hh:mm A" date={element.createdAt} /></span></td>
                                                    <td><span className={`${element.status == 0 ? "btn-primary" : "btn-success"} p-status`}>
                                                        {element.status == 0 ? "Processing" : "Paid"}
                                                    </span></td>
                                                    <td><span>$ {element.amount.toString(2)}</span></td>
                                                </tr>
                                            </>);
                                        }): <tr><td>No Records Found</td></tr>}
                                        {/* {!trainerPayment ? <tr><td>No Records Found</td></tr> : <></>} */}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        {/* {trainerPayment ? <div className="col-md-12 col-12 text-center mt-5">
                            <button className="training_btn w-25 mx-auto">Export Report</button>
                        </div> :
                            <></>
                        } */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrainerPaymentHistory;
