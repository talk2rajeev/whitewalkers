import * as React from 'react';
import { Tooltip } from 'antd';
import {TeamType} from '../teamLogo/TeamLogo';
import TeamLogo from '../teamLogo/TeamLogo';
import {SyncOutlined} from '@ant-design/icons';
import './filter.css';

export interface IFiltersProps {
    selectAuctionedPlayer: (value: string) => void;
    selectPlayerBySkill: (value: string) => void;
    sortPlayerByTeam: (value: TeamType) => void;
    loadAllPlayers: ()=>void;
}

export function Filters (props: IFiltersProps) {
  const onAuctionedPlayerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.selectAuctionedPlayer(e.target.value);
  }  
  const onSkillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.selectPlayerBySkill(e.target.value);
  } 

  return (
    <div className='filter-wrapper'>
      <select onChange={onAuctionedPlayerSelect}>
        <option value="All">All</option>
        <option value="Retained">Retained</option>
        <option value="Sold">Sold</option>
        <option value="Unsold">Unsold</option>
      </select>
      <select onChange={onSkillSelect}>
        <option value="All">All Skills</option>
        <option value="WK">Wicket Keeper</option>
        <option value="Bowler">Bowler</option>
        <option value="Batsman">Batsman</option>
        <option value="Batting Allrounder">Batting Allrounder</option>
        <option value="Bowling Allrounder">Bowling Allrounder</option>
      </select>
      <Tooltip title="Load All Players"><SyncOutlined className='sync-icon' onClick={props.loadAllPlayers}/></Tooltip>
      <div className='team-filter-wrapper'>
        <div className='team-filter'>
            <TeamLogo size='sm' TeamName='Absolut Fighters' onclick={props.sortPlayerByTeam} />
            <TeamLogo size='sm' TeamName='Old Monks' onclick={props.sortPlayerByTeam}/>
            <TeamLogo size='sm' TeamName='GFC' onclick={props.sortPlayerByTeam}/>
        </div>
      </div>
    </div>
  );
}
