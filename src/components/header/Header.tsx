import * as React from 'react';
import { Popover, Row, Col, Tooltip } from 'antd';
import TeamLogo from '../../components/teamLogo/TeamLogo';
import Retained from '../../images/retained.png';
import { PlayerType } from '../../pages/playerList/PlayerList';
import './header.css';

type TeamType = 'GFC' | 'Old Monks' | 'Absolut Fighters';
type TeamFundType = {
    [key in TeamType]: { total: number, expense: number }
};
const TeamFund: TeamFundType = {
    "Absolut Fighters": { total: 9500000, expense: 0 },
    "Old Monks": { total: 9500000, expense: 0 },
    "GFC": { total: 9500000, expense: 0 },
}

export interface IHeaderProps {
    players: Array<PlayerType>
}

export function Header(props: IHeaderProps) {
    const [teamFundBalance, setTeamFundBalance] = React.useState<TeamFundType>(TeamFund);

    React.useEffect(() => {
        getTeamFundBalance();
    }, [props.players]);

    const getTeamFundBalance = () => {
        console.log('props.players ', props.players );
        const players = props.players;
        players.forEach((currentPlayer: PlayerType) => {
            debugger;
            if (currentPlayer.soldprice && currentPlayer.soldto) {
                TeamFund[currentPlayer.soldto] = { ...TeamFund[currentPlayer.soldto], expense: Number(TeamFund[currentPlayer.soldto].expense) + Number(currentPlayer.soldprice) };
            }
        });
        setTeamFundBalance(TeamFund);
    }

    const getContent = (teamName: TeamType) => {
        return props.players.filter(p => p.soldto === teamName).map(t => <div key={t.id}>{t.fname} {t.retained !== 'yes' ? <span>(&#8377; {t.soldprice})</span> : <img src={Retained} alt="" className='retained-icon xs' style={{ marginRight: 10 }} />}</div>)
    }

    return (
        <Row justify='space-between' align='middle' className='header'>
            <Col xs={24} sm={24} md={2} lg={2} xl={2} >
                <img className='app-logo' src='logo192.png' />
            </Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10} >
                <div className='team-fund-bal'>
                    <Popover content={getContent('Absolut Fighters')} title="Absolut Fighters" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='Absolut Fighters' onclick={() => { }} />
                            <div className='balance'>
                                <div>Used: &#8377; {teamFundBalance['Absolut Fighters'].expense / 100000}L</div>
                                <div>Bal: &#8377; {teamFundBalance['Absolut Fighters'].total / 100000}L</div>
                            </div>
                        </div>
                    </Popover>
                    <Popover content={getContent('Old Monks')} title="Old Monks" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='Old Monks' onclick={() => { }} />
                            <div className='balance'>
                                <div>Used: &#8377; {teamFundBalance['Old Monks'].expense / 100000}L</div>
                                <div>Bal: &#8377; {teamFundBalance['Old Monks'].total / 100000}L</div>
                            </div>
                        </div>
                    </Popover>
                    <Popover content={getContent('GFC')} title="GFC" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='GFC' onclick={() => { }} />
                            <div className='balance'>
                                <div>Used: &#8377; {teamFundBalance.GFC.expense / 100000}L</div>
                                <div>Bal: &#8377; {teamFundBalance.GFC.total / 100000}L</div>
                            </div>
                        </div>
                    </Popover>
                </div>
            </Col>
        </Row>
    );
}
