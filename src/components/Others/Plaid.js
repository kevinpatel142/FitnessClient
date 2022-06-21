import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlaidLink } from "react-plaid-link";
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { apiUrl, PORT } from '../../environment/environment';


const Plaid = () => {
    const [token, setToken] = useState(null);
    const stripeUid = "acct_1KnsVtBI5VuvGZzp";

    
    useEffect(() => {
        
        async function createLinkToken() {
            axios.post(`${apiUrl}${PORT}/exchange/getLinkToken`, {}, {
            }).then(function (response) {
                if (response.data.status === 1) {
                    setToken(response.data.link_token);
                }
                return true;
            }).catch(function (error) {
                console.log(error);
            });
        };
        createLinkToken();
    }, []);

    const onSuccess = useCallback(
        (publicToken, metadata) => {
            // document.querySelector('.loading').classList.remove('d-none');
            // Exchange a public token for an access one.
            async function exchangeTokens() {
                var obj = {
                    public_token: publicToken,
                    account_id: metadata.account_id
                };
                console.log("obj",obj);
                axios.post(`${apiUrl}${PORT}/exchange/receivePublicToken`, obj, {
                }).then(function (response) {
                    if (response.data.status === 1) {
                        console.log(response.data.result);
                        const trainerId = JSON.parse(localStorage.getItem('user'));
                        // Bank account update
                        var bankobj = {
                            id: trainerId._id,
                            stripebanktoken: response.data.result.stripebankaccountToken.stripe_bank_account_token,
                            accountInfo: response.data.result.accountResponse
                        };
                        console.log("bankobj",bankobj);
                        axios.post(`${apiUrl}${PORT}/trainer/accountinfo/saveaccountinfo`, bankobj, {
                        }).then(function (response) {
                            // document.querySelector('.loading').classList.add('d-none');
                            if (response.data.status === 1) {
                                console.log("response.data", response.data);
                                localStorage.setItem('user',JSON.stringify(response.data.result));
                                window.location.reload(false);
                                // history.push("/signupsuccess");
                            }
                            else {
                                swal({
                                    title: "Error!",
                                    text: response.data.message,
                                    icon: "error",
                                    button: true
                                })
                            }
                        }).catch(function (error) {
                            // document.querySelector('.loading').classList.add('d-none');
                        });
                    }
                    // document.querySelector('.loading').classList.add('d-none');
                    return true;
                }).catch(function (error) {
                    // document.querySelector('.loading').classList.add('d-none');
                    console.log(error);
                });
            }
            exchangeTokens();
        }, [stripeUid]
    );
    return (
        <>
        <div id="plaidbutton">
            <PlaidLink style={{float: "right", background:"#243881", color:"#fff", padding:"8px", fontSize: "15px"}}
                token={token}
                onSuccess={onSuccess}> 
                Add Bank Account
            </PlaidLink>
        </div>
        </>
    )
}

export default Plaid