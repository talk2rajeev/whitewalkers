import * as React from 'react';
import { Link } from "react-router-dom";
import { Filters } from '../../components/filters/Filters';
import { PlayerGrid } from '../../components/player/grid/PlayerGrid';
import { PlayerGridItem } from '../../components/player/gridItem/PlayerGridItem';
import {TeamType} from '../../components/teamLogo/TeamLogo';
import {Row, Col, Input} from 'antd';
import { Header } from '../../components/header/Header';
import transparentBall from './transparentBall.svg';
import { imageMap } from '../../images';
import Retained from '../../images/retained.png';

export interface IPlayerListProps {
}

export interface PlayerType {
    id: number;
    fname: string;
    lname: string;
    skill: string;
    baseprice: number;
    soldprice: number;
    soldto: TeamType;
    retained: string;
};

export function PlayerList (props: IPlayerListProps) {
  const players = [{name: 'Kamesh', skill: 'RA Pace Bowler, RH Batsman', base: 50, soldTo: 'Old Monk'}, {name: 'Abhishek', skill: 'RA Pace Bowler, RH Batsman', base: 50, soldTo: 'GCF'}, {name: 'Sachin', skill: 'LA spinner, RH Batsman', base: 50, soldTo: null}];  
  const [loading, setLoading] = React.useState<boolean>(false);
  const [playerList, setPlayerList] = React.useState<Array<PlayerType>>([]);
  const [transientPlayerList, setTransientPlayerList] = React.useState<Array<PlayerType>>([]);


  const getPlayersAsync = () => {
    setLoading(true);
    fetch('https://wtcfinal.online/api/readplayer.php')
    .then(resp => resp.json())
    .then(result => {
        setLoading(false);
        if(result.body) {
            setPlayerList(result.body);
            setTransientPlayerList(result.body);
        }
    })
    .catch((err) => {
        setLoading(false);
    });
  }
  React.useEffect(()=>{
    getPlayersAsync();
  }, []);

  const selectAuctionedPlayer = (value: string) => {
    console.log('selectAuctionedPlayer ', value);
    if(value === 'All') {
        setTransientPlayerList(playerList);
    } else if(value === 'Retained') {
        const list =playerList.filter(p => p.retained);
        setTransientPlayerList(list);
    } else if(value === 'Sold') {
        debugger;
        const list =playerList.filter(p => (p.soldto === 'Absolut Fighters' || p.soldto === 'Old Monks' || p.soldto === 'GFC'));
        setTransientPlayerList(list);
    } else if(value === 'Unsold') {
        const list =playerList.filter(p => (p.soldto !== 'Absolut Fighters' && p.soldto !== 'Old Monks' && p.soldto !== 'GFC'));
        setTransientPlayerList(list);
    }
  }

  const selectPlayerBySkill = (value: string) => {
        <option value="Bowling Allrounder">Bowling Allrounder</option>
    if(value === 'All') {
        setTransientPlayerList(playerList);
    } else if(value === 'WK') {
        const list =playerList.filter(p => p.skill.includes('WK'));
        setTransientPlayerList(list);
    } else if (value === 'Bowler') {
        const list =playerList.filter(p => p.skill.includes('Bowler'));
        setTransientPlayerList(list);
    } else if (value === 'Batsman') {
        const list =playerList.filter(p => p.skill.includes('Batsman'));
        setTransientPlayerList(list);
    } else if (value === 'Batting Allrounder') {
        const list =playerList.filter(p => p.skill.includes('Batting Allrounder'));
        setTransientPlayerList(list);
    } else if (value === 'Bowling Allrounder') {
        const list =playerList.filter(p => p.skill.includes('Bowling Allrounder'));
        setTransientPlayerList(list);
    } 

  }

  const sortPlayerByTeam = (value: TeamType) => {
    console.log('sortPlayerByTeam ', value);
    const list =playerList.filter(p => (p.soldto === value));
    setTransientPlayerList(list);
  }

  const loadAllPlayers = () => {
    window.location.reload();
  }

  console.log(loading ? 'true' : 'false', playerList);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const list = playerList.filter( p => ( p.fname.toLowerCase().includes(val.toLowerCase()) ||  p.lname.toLowerCase().includes(val.toLowerCase())) ) 
    setTransientPlayerList(list);  
  }

  return (
    <div>
      { loading ?? <h1>Loading...</h1> }
      <Header players={playerList} />
      <div style={{padding: 20}}>
        <div>
            <Filters selectAuctionedPlayer={selectAuctionedPlayer} selectPlayerBySkill={selectPlayerBySkill} sortPlayerByTeam={sortPlayerByTeam} loadAllPlayers={loadAllPlayers}/>
        </div>
        <Row style={{marginBottom: 14}}>
            <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                <Input placeholder="Search Player" allowClear onChange={onSearch} />
            </Col>
        </Row>
        <PlayerGrid>
        {
            transientPlayerList && transientPlayerList.map(p => {
                return <PlayerGridItem p={p} />
            })
        }
        </PlayerGrid>
      </div>
    </div>
  );
}
