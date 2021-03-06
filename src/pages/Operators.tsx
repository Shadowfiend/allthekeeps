import {gql, useQuery} from "@apollo/client";
import React from "react";
import {Paper} from "../design-system/Paper";
import {css} from "emotion";
import { Address } from "../components/Address";
import {ExternalLinkIcon} from "../components/ExternalLinkIcon";
import {InfoTooltip} from "../components/InfoTooltip";
import {Helmet} from "react-helmet";
import { Table } from "../components/Table";

const OPERATOR_QUERY = gql`
    query GetOperators {
        keepMembers(first: 100) {
            id,
            address,
            bonded,
            unboundAvailable,
            totalKeepCount,
            activeKeepCount
        }
    }
`;


export function Operators() {
  return  <div style={{padding: '20px'}}>
    <Helmet>
      <title>Operators</title>
    </Helmet>
    <h1 style={{marginTop: 0}}>Operators</h1>
    <Paper padding>
      <OperatorsTable />
    </Paper>
  </div>
}


const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2
});

const formatterSimple = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});


export function OperatorsTable() {
  const { loading, error, data } = useQuery(OPERATOR_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {""+ error}</p>;

  return <Table
      style={{width: '100%'}}>
    <thead>
    <tr>
      <th>Address</th>
      <th>
        # Keeps <InfoTooltip>Number of keeps/deposits this operator is securing.</InfoTooltip>
      </th>
      <th>
        Amount Bonded <InfoTooltip>Total amount bounded, and percentage of available bonds provided for bonding.</InfoTooltip>
      </th>
    </tr>
    </thead>
    <tbody>
    {data.keepMembers.map((member: any) => {
      const total = (parseFloat(member.unboundAvailable) + parseFloat(member.bonded));
      const bonded = parseFloat(member.bonded);

      return  <tr key={member.id}>
        <td>
          <Address address={member.address} to={`/operator/${member.address}`} />
          <a title={"Open on Etherscan"} href={`https://etherscan.io/address/${member.address}`} className={css`
                font-size: 0.8em;
                padding-left: 0.2em;
               `}>
            <ExternalLinkIcon />
          </a>
        </td>
        <td>{member.activeKeepCount} / {member.totalKeepCount}</td>
        <td>
          <span style={{color: 'gray', fontSize: '0.8em'}}>ETH</span> {formatter.format(bonded)}
          {" "}
          <span title={`Total: ${formatter.format(member.unboundAvailable)}`} style={{color: 'gray', fontSize: '0.8em'}}>
            ({formatterSimple.format(bonded / total * 100)}%)
          </span>
        </td>
      </tr>
    })}
    </tbody>
  </Table>
}