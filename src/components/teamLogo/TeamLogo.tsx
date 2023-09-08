import * as React from 'react';
import AbsolutFighters from './AbsolutFighters.png';
import OldMonks from './OldMonks.png';
import GFC from './gfc.png';
import './teamLogo.css';

export interface TeamLogoProps {
    TeamName: TeamType;
    onclick: (teamName: TeamType) => void;
    size: 'sm' | 'md' | 'lg'
}

export type TeamType = 'GFC' | 'Old Monks' | 'Absolut Fighters';

const Logo_Map: {[key in TeamType]: any} = {
    'Absolut Fighters': AbsolutFighters,
    'Old Monks': OldMonks,
    'GFC': GFC
}

export default function TeamLogo (props: TeamLogoProps) {
  return <img className={`team-logo logo-${props.size}`} src={Logo_Map[props.TeamName]} alt={props.TeamName} onClick={()=>props.onclick(props.TeamName)}/>;
}
