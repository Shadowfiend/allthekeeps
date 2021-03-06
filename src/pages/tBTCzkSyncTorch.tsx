import {gql, useQuery} from "@apollo/client";
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router';
import {css} from "emotion";
import { Paper } from "../design-system/Paper";
import {Helmet} from "react-helmet";

import { Box } from "../components/Box";
import {FormattedTime, TimeToNow} from "../components/FormattedTime";
import {getSatoshisAsBitcoin} from "../utils/getSatoshisAsBitcoin";

export function ZksyncTorch() {
  return <div className={css`
      padding: 1em;
    `}>
    <Helmet>
      <title>#tBTCzksynctorch</title>
    </Helmet>
    <Content />
  </div>
}

export function Content() {
  const [chain, setChain] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://tbtc-torch.srvpool.de/torch').then(async (r) => {
      const data = await r.json()
      setChain(data.reverse());
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    })
  }, [])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <div className={css`
      display: flex;
      flex-direction: column;
      align-items: center;
  `}>
    <div className={css`
      display: flex;
      flex-direction: row;
      font-size: 30px;
      margin-top: 20px;
      margin-bottom: 45px;
  `}>
      <a href={"https://twitter.com/search?q=%23tBTCzksynctorch&src=typed_query"}>#tBTCzksynctorch</a>
    </div>


    <div className={css`
      display: flex;
      flex-direction: column;
      & > * {
        margin-right: 20px;
        }
    `}>
      {
        chain!.map((item: any) => {
          return <div className={css`
            margin-bottom: 10px;
          `}>
            <Step from={item.from} amount={item.amount} time={item.timestamp} />
            <div style={{
              textAlign: 'center',
              margin: 20
            }}>
              ↑
            </div>
          </div>
        })
      }
      <Step from={chain[chain.length - 1].to} amount={0} />
    </div>
  </div>
}

function Step(props: {
  from: any,
  amount: any,
  time?: any
}) {
  const {from, amount, time} = props;

  return <Paper padding>
    <div style={{color: 'gray', fontSize: '0.9em'}}><TimeToNow time={time} /></div>
    <div>
      <a href={`https://zkscan.io/explorer/accounts/${from}`}>{from}</a>
    </div>
    {props.amount ? <div>
      <strong>{amount / 1000000000000000000} tBTC</strong>
    </div> : null}
  </Paper>;
}