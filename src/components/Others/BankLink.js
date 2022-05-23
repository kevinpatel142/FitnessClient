import { apiUrl, PORT } from '../../environment/environment';
import axios from 'axios';
import React, { useEffect, useCallback, useState, FunctionComponent } from "react";
import { PlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";

const BankLink: FunctionComponent = () => {
  const [token, setToken] = useState(null);
  const [accesstoken, setAccessToken] = useState(null);
  const stripeUid = "acct_1KnsVtBI5VuvGZzp";
  // generate a link_token
  useEffect(() => {
    // async function createLinkToken() {
    //   let response = await fetch("/api/create_link_token");
    //   const { link_token } = await response.json();
    //   setToken(link_token);
    // }
    // createLinkToken();
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

  // const onSuccess = useCallback<PlaidLinkOnSuccess>(
  //   (public_token, metadata) => {
  //     // send public_token to server
  //     console.log("public_token");
  //     console.log(public_token);
  //   },
  //   []
  // );
  const onSuccess = useCallback(
    (publicToken, metadata) => {
      console.log(publicToken);
      console.log(metadata);
      const { account_id } = metadata;

      console.log("metadata");
      console.log(metadata);
      // Exchange a public token for an access one.
      async function exchangeTokens() {
        var obj = {
          public_token: publicToken,
          account_id: metadata.account_id,
          stripeUid,
        };
        axios.post(`${apiUrl}${PORT}/exchange/receivePublicToken`, obj, {
        }).then(function (response) {
          if (response.data.status === 1) {
            setAccessToken(response.data.public_token.access_token);
            console.log(response.data.public_token);
            console.log(accesstoken);
          }
          return true;
        }).catch(function (error) {
          console.log(error);
        });
      }

      exchangeTokens();
    }, [stripeUid]
  );

  // The pre-built PlaidLink component uses the usePlaidLink hook under the hood.
  // It renders a styled button element and accepts a `className` and/or `style` prop
  // to override the default styles. It accepts any Link config option as a prop such
  // as receivedRedirectUri, onEvent, onExit, onLoad, etc.
  return token === null ? (
    // insert your loading animation here
    <div className="loader"></div>
  ) : (
    <PlaidLink
      token={token}
      onSuccess={onSuccess}
    // onExit={...}
    // onEvent={...}
    >
      Connect a bank account
    </PlaidLink>
  );
};

export default BankLink;