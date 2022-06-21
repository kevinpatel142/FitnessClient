function SessionPaymentDetail() {
    return (
        <>
            <div className="topimg session_detail">
                {/* <img src="/img/Chooseplan.png" className="w-100" alt="Plan" /> */}
                <img className="logo-img" src="/img/KNKTLogo.png" alt="logo" />
                <h3 className="sessiontext">Session Payment Details</h3>
            </div>
            <div className="container mob-view">
                <div className="row mt-lg-5">
                    <div className="col-xl-8 col-md-12 col-12 mx-lg-auto">
                        <div className="payment-detail">
                            <div className="row">
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Plan Name <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p># Standard or Elite</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Session <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p># Single or 12 Sessions or 36 Sessions</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>No of session(s) <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p># 1</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Purchased Date <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p># 15 Jun 2022</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Amount <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p># $ 60</p>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-4 col-12 position-relative">
                                    <label>Status <span className="titlecolon">:</span></label>
                                </div>
                                <div className="col-xl-9 col-md-9 col-sm-8 col-12">
                                    <p><span class="btn-success p-status m-0 text-center">Paid</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SessionPaymentDetail;