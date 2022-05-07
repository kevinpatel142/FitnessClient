import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl, PORT } from '../../environment/environment';
import swal from 'sweetalert';
import { verifytokenCall } from '../Others/Utils.js';
import Pagination from '../Pagination/Pagination';
function Videosessionhistory() {
    const [isLoader, setIsLoader] = useState(false);
    const [list, setList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [noOfRecords, setNoOfRecords] = useState(0);
    const limitValue = 10;
    useEffect(() => {
        callToken();
        GetList(1);
    }, [])
    const callToken = () => {
        verifytokenCall();
        setTimeout(() => {
            callToken();
        }, 3000);
    }

    async function GetList(val) {
        setIsLoader(true);
        var obj = {
            limitValue: limitValue,
            pageNumber: (val || pageNum)
        };

        await axios.post(`${apiUrl}${PORT}/meeting/getvideosessionlist`, obj)
            .then(function (response) {
                setIsLoader(false);
                if (response.data.status === 1) {
                    setNoOfRecords(response.data?.result?.count || 0);
                    setList(response.data?.result?.list);
                } else {
                    swal({
                        title: "Error!",
                        text: response.data.message,
                        icon: "error",
                        button: true
                    });
                }
            }).catch(function (error) {
                setIsLoader(false);
                window.alert(error);
            });
    };
    const curPage = (pageNum) => {
        setPageNum(pageNum);
        GetList(pageNum);
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
                            <h1 className="main_title">Video Session History</h1>
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
                                                <th>Meeting Id</th>
                                                <th>Date time</th>
                                                <th>Sender</th>
                                                <th>Receiver</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list.length > 0 ?
                                                list.map((ele, index) => {
                                                    return (
                                                        <tr key={'index' + index}>
                                                            <td>{(index + 1) + ((pageNum - 1) * limitValue)}</td>
                                                            <td>{ele?.meetingid}</td>
                                                            <td>{new Date(ele?.starttime).toDateString()}</td>
                                                            <td>{(ele?.fromid === ele?.user_data?._id) ? ele?.user_data?.firstname : ele?.trainer_data?.firstname}</td>
                                                            <td>{(ele?.toid === ele?.user_data?._id) ? ele?.user_data?.firstname : ele?.trainer_data?.firstname}</td>
                                                            <td>
                                                                {(ele?.statusid === 3) ? "Disconnect meeting" : ((ele?.statusid === 2) ? "Close meeting" : ((ele?.statusid === 1) ? "Join meeting" : "Start meeting"))}
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
                                <div className="col-md-12 col-sm-12 col-12 pagi_bg">
                                    <Pagination className="pagination-bar" currentPage={pageNum} totalCount={noOfRecords}
                                        pageSize={limitValue} onPageChange={page => curPage(page)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Videosessionhistory;