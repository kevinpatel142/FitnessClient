function PaymentHistory() {
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
                                            <th>Clients</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="">
                                                    <img className="history-img" src="/img/sessionprofile.png" alt="img" />
                                                    <span className="history-name">Aileen Presley</span>
                                                </div>
                                            </td>
                                            <td><span>04 August 2021</span></td>
                                            <td><span className="btn-success p-status">Paid</span></td>
                                            <td><span>$ 80.79</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="">
                                                    <img className="history-img" src="/img/payment-pro.png" alt="img" />
                                                    <span className="history-name">Bernard Gill</span>
                                                </div>
                                            </td>
                                            <td><span>04 August 2021</span></td>
                                            <td><span className="btn-primary p-status">Processing</span></td>
                                            <td><span className="text-gray">$ 80.79</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="">
                                                    <img className="history-img" src="/img/profile2.png" alt="img" />
                                                    <span className="history-name">Sibley Hall</span>
                                                </div>
                                            </td>
                                            <td><span>04 August 2021</span></td>
                                            <td><span className="btn-success p-status">Paid</span></td>
                                            <td><span>$ 80.79</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="">
                                                    <img className="history-img" src="/img/payment-pro1.png" alt="img" />
                                                    <span className="history-name">Stephan Cohen</span>
                                                </div>
                                            </td>
                                            <td><span>04 August 2021</span></td>
                                            <td><span className="btn-success p-status">Paid</span></td>
                                            <td><span>$ 80.79</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-12 col-12 text-center mt-5">
                            <button className="training_btn w-25 mx-auto">Export Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaymentHistory;
