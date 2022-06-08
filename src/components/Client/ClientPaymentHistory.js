import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl, PORT } from "../../environment/environment";
import Moment from "react-moment";

function ClientPaymentHistory() {
    const [paymentList, setPaymentList] = useState([]);
    useEffect(() => {
        axios.get(`${apiUrl}${PORT}/payment/clientpaymenthistory`)
            .then(response => {
                if (response.status == 200) {
                    setPaymentList(response.data.result);
                }

            }).catch(function (error) {
                console.log(error);
            });
    }, []);
    return (
        <>
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
                                            {/* <th>Clients</th> */}
                                            <th>Date</th>
                                            <th>Plan type</th>
                                            <th>No of session(s)</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentList.map((element) => {
                                            return (
                                                <>
                                                    <tr key={`payment_${element}`}>
                                                        <td><Moment format="YYYY/MM/DD, hh:m A" date={element.createdAt} /></td>
                                                        <td>{element.plantype}</td>
                                                        <td>{element.noofsession}</td>
                                                        <td><span className="btn-success p-status">Paid</span></td>
                                                        <td>$ {element.amount.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            )

                                        })}
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

export default ClientPaymentHistory;
