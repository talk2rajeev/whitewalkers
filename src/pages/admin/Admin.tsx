import * as React from 'react';
import { Avatar, List, Popover, Tabs, Button, Row, Col, Input, Select, Card, Tooltip, Modal, message } from 'antd';
import { PlayerType} from '../../pages/playerList/PlayerList';
import Retained from '../../images/retained.png';
import {PlayerGridItem} from '../../components/player/gridItem/PlayerGridItem';
import TeamLogo from '../../components/teamLogo/TeamLogo';
import { imageMap } from '../../images';
import ConfettiExplosion from 'react-confetti-explosion';
import { Header } from '../../components/header/Header';
import {LoadingOutlined} from '@ant-design/icons';
import './admin.css';

/* Todo
    - same team can't bid twice
    - bid amount can't be same
    - playerlist (global) show players correctly (if a player has 0 bid amount it is showing as SOLD )    
    - show Team fund balance instead of total expenditure
    - use popHover to show amount used to buy players
*/

export interface IAdminProps {
}

type ReqFormType = {
    "id": number,
    "playerid" : number,
    "fname": string,
    "lname": string,
    "bidamount": number,
    "bidby": string,
    "isfinalbid": string,
};
type TeamType = 'GFC' | 'Old Monks' | 'Absolut Fighters';
type TeamFundBalanceType = {
    [key in TeamType]?: number;
};

type ReqForm = Omit<ReqFormType, "id">;

type TeamFundType = {
    [key in TeamType]: {total: number, expense: number}
};

const TeamFund: TeamFundType = {
    "Absolut Fighters": {total: 9500000, expense: 0},
    "Old Monks": {total: 9500000, expense: 0},
    "GFC": {total: 9500000, expense: 0},
}

const Description = (props: {p: PlayerType}) => {
    return <div>
        <div>
            {props.p.retained === 'yes' ? <img src={Retained} alt="" className='retained-icon' style={{marginRight: 10}}/> : null}
            {props.p.skill}
        </div>
        <div className='desc-txt-color'><span>Base:</span> &#8377; {props.p.baseprice}</div>
        <div className='desc-txt-color'><span>Sold:</span> &#8377; {props.p.soldprice || 'NA'}</div>
        {props.p.soldto && <div className='desc-txt-color'><span>Sold to:</span> {props.p.soldto}</div>}
    </div>
}

const { Option } = Select;
const { Meta } = Card;

export function Admin (props: IAdminProps) {
    
    const [activeTab, setActiveTab] = React.useState<string>('1');
    const [isExploding, setIsExploding] = React.useState<boolean>(false);
    const [bidAmount, setBidAmount] = React.useState<number>(0);
    const [openAuctionPopUp, setOpenAuctionPopUp] = React.useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<PlayerType | null>(null);
    const [playerList, setPlayerList] = React.useState<Array<PlayerType>>([]);
    const [teamFundBalance, setTeamFundBalance] = React.useState<TeamFundType>(TeamFund);
    const [transientPlayerList, setTransientPlayerList] = React.useState<Array<PlayerType>>([]);
    const [reqForm, setReqForm] = React.useState<ReqForm>({"playerid" : 0, "fname": '', "lname": '', "bidamount": 0, "bidby": '', "isfinalbid": ''});
    

    const [messageApi, contextHolder] = message.useMessage();

    const showMsg = (msg: string, type: 'info' | 'success' | 'warning' | 'error') => {
        if(type === 'warning') {
            messageApi.warning(msg);
        } else if(type === 'error') {
            messageApi.error(msg);
        }  else if(type === 'success') {
            messageApi.success(msg);
        } else if(type === 'info') {
            messageApi.info(msg);
        } 
    };
    const alertMsg = (msg: string) => {
        alert(msg);
    };
  
    const getPlayersAsync = () => {
      fetch(`https://wtcfinal.online/api/readplayer.php`)
      .then(resp => resp.json())
      .then(result => {
          if(result.body) { 
              setPlayerList(result.body);
              setTransientPlayerList(result.body);
              getTeamFundBalance(result.body);
          }
      })
      .catch((err) => { });
    }
    React.useEffect(()=>{
      getPlayersAsync();
    }, []); 

    const getTeamFundBalance = (players: Array<PlayerType>) => {
        players.forEach((currentPlayer: PlayerType) => {
            if(currentPlayer.soldprice && currentPlayer.soldto) {
                TeamFund[currentPlayer.soldto] = {...TeamFund[currentPlayer.soldto], expense: TeamFund[currentPlayer.soldto].expense + currentPlayer.soldprice};
            }
        });
        setTeamFundBalance(TeamFund);
    }
    
    const openAuctionPopup = (id: number) => {
        setOpenAuctionPopUp(true);
        const player = playerList.find(p => p.id === id);
        if(player){
          setSelectedPlayer(player);
        }
    }

    const closeAuctionPopup = () => {
        setOpenAuctionPopUp(false);
        setSelectedPlayer(null);
        const newReqForm = {
            ...reqForm,
            bidamount: 0,
        };
        setReqForm(newReqForm);
    }

    const selectTeam = (value: string) => {
        const newReqForm = {
            ...reqForm,
            bidby: value,
        };
        setReqForm(newReqForm);
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bidamount = Number(e.target.value);
        setBidAmount(Number(bidamount));
        const newReqForm = {
            ...reqForm,
            bidamount,
        };
        setReqForm(newReqForm);
    }

    const setBidtoZero = () => {
        setBidAmount(0);
        const newReqForm = {
            ...reqForm,
            bidamount: 0,
        };
        setReqForm(newReqForm);
    }

    const sellPlayer = () => {
        if(!reqForm.bidby) {
            showMsg('Please select team', 'warning');
            return;
        } else if(!reqForm.bidamount) {
            showMsg('Please enter Bid amount.', 'warning');
            return;
        } else if(reqForm.bidamount < 200000) {
            showMsg('Bid amount should not be less than Base price.', 'warning');
            setBidtoZero();
            return;
        } 
        const newReqForm = {
            ...reqForm,
            id: selectedPlayer?.id, 
            soldprice: reqForm.bidamount, 
            soldto: reqForm.bidby,
        };
        const reqBody = JSON.stringify(newReqForm);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: reqBody,
        };

        fetch('https://wtcfinal.online/api/sellplayer.php', {...requestOptions, body: JSON.stringify({ id: selectedPlayer?.id, soldprice: reqForm.bidamount, soldto: reqForm.bidby }) })
        .then(resp => resp.json())
        .then(result => {
            if(result === "Success") {
                setOpenAuctionPopUp(false);
                getPlayersAsync();
                setTimeout(()=>{setIsExploding(true)}, 200)
            }
        })
        .catch(err => {});
        setBidtoZero();
    }

    

    const onTabChange = (key: string) => {
        setActiveTab(key);
        setTransientPlayerList(playerList);
    };

    const getPlayerImg = (pName: string) => imageMap[pName] || imageMap['NoImg'];

    const getContent = (teamName: TeamType) => {
        return playerList.filter(p => p.soldto === teamName).map(t => <div key={t.id}>{t.fname} {t.retained !== 'yes' ? <span>(&#8377; {t.soldprice})</span> : <img src={Retained} alt="" className='retained-icon xs' style={{marginRight: 10}}/>}</div>)
    }

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if(activeTab === '1') {
            const list = playerList.filter(p => (p.fname.toLowerCase().includes(val.toLowerCase()) || p.lname.toLowerCase().includes(val.toLowerCase())));
            setTransientPlayerList(list);
        } else if(activeTab === '2') {
            const list = playerList.filter(p => ( (p.fname.toLowerCase().includes(val.toLowerCase()) || p.lname.toLowerCase().includes(val.toLowerCase())) && (p.soldto && p.soldprice) ) );
            setTransientPlayerList(list);
        } else if(activeTab === '3') {
            const list = playerList.filter(p => ( (p.fname.toLowerCase().includes(val.toLowerCase()) || p.lname.toLowerCase().includes(val.toLowerCase())) && (p.retained) ) );
            setTransientPlayerList(list);
        }
    }

    const getPlayersList = (index: number) => {
        if(index===0) {
            return <div>
                <Row>
                    <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                        <Input placeholder="Search Player" allowClear onChange={onSearch} />
                    </Col>
                </Row>
                <List
                    itemLayout="horizontal"
                    dataSource={transientPlayerList.filter((p: PlayerType)=>(p.retained !== 'yes' && !p.soldto))}
                    renderItem={(item, index) => (
                        <List.Item actions={[<a key="list-loadmore-edit" onClick={()=>openAuctionPopup(item.id)}>Auction</a>]}>
                            <List.Item.Meta
                                avatar={<Avatar src={getPlayerImg(item.fname)} />}
                                title={<span>{item.fname+ ' '+item.lname}</span>}
                                description={<Description p={item} />}
                            />
                        </List.Item>
                    )}
                />
            </div>
        } else if(index === 1) {
            return <div>
                <Row>
                    <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                        <Input placeholder="Search Player" allowClear onChange={onSearch} />
                    </Col>
                </Row>
                <List
                    itemLayout="horizontal"
                    dataSource={transientPlayerList.filter((p: PlayerType)=>(p.soldprice && p.soldto))}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={getPlayerImg(item.fname)} />}
                                title={<span>{item.fname+ ' '+item.lname}</span>}
                                description={<Description p={item} />}
                            />
                        </List.Item>
                    )}
                />
            </div>
        }
        return  <div>
            <Row>
                <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <Input placeholder="Search Player" allowClear onChange={onSearch} />
                </Col>
            </Row>
            <List
                itemLayout="horizontal"
                dataSource={transientPlayerList.filter((p: PlayerType)=>(p.retained === 'yes'))}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={getPlayerImg(item.fname)} />}
                            title={<span>{item.fname+ ' '+item.lname}</span>}
                            description={<Description p={item} />}
                        />
                    </List.Item>
                )}
            />
        </div>
    }

    


    return (
      <div>
        {contextHolder}
        {/* <Row  justify='space-between' align='middle' className='header'>
            <Col xs={24} sm={24} md={2} lg={2} xl={2} >
                <img className='app-logo' src='logo192.png'/>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10} >    
                <div className='team-fund-bal'>
                    <Popover content={getContent('Absolut Fighters')} title="Absolut Fighters" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='Absolut Fighters' onclick={()=>{}} />
                            <div className='balance'>
                                <div>&#8377; {teamFundBalance['Absolut Fighters'].expense/100000}L</div>
                                <div>&#8377; {teamFundBalance['Absolut Fighters'].total/100000}L</div>
                            </div>
                        </div>
                    </Popover>
                    <Popover content={getContent('Old Monks')} title="Old Monks" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='Old Monks' onclick={()=>{}} />
                            <div className='balance'>
                                <div>&#8377; {teamFundBalance['Old Monks'].expense/100000}L</div>
                                <div>&#8377; {teamFundBalance['Old Monks'].total/100000}L</div>
                            </div>
                        </div>
                    </Popover>
                    <Popover content={getContent('GFC')} title="GFC" trigger="hover">
                        <div className='team-fund-card'>
                            <TeamLogo size='sm' TeamName='GFC' onclick={()=>{}} />
                            <div className='balance'>
                                <div>&#8377; {teamFundBalance.GFC.expense/100000}L</div>
                                <div>&#8377; {teamFundBalance.GFC.total/100000}L</div>
                            </div>
                        </div>
                    </Popover>
                </div>
            </Col>
        </Row> */}
        <Header players={playerList} />
        <div style={{padding: '10px 20px'}}>
            {isExploding && <ConfettiExplosion particleCount={200} onComplete={()=> setIsExploding(false)}/>}
            <Tabs
                onChange={onTabChange}
                items={["Available Players", "Sold Players",  "Retained"].map((title: string, i: number) => {
                const id = String(i + 1);
                    return {
                        label: title,
                        key: id,
                        children: getPlayersList(i),
                    };
                })}
                className='tab-mt'
            />
            <Modal title="Sell Player" open={openAuctionPopUp} onOk={closeAuctionPopup} onCancel={closeAuctionPopup} footer={null}>
                <div>
                    <Row gutter={8} className='player-info-card'>
                        <Col flex="100px"><img alt="example" src={getPlayerImg(selectedPlayer?.fname || 'NoImg')} style={{width: 100}} /></Col>
                        <Col flex="auto">
                            <div className='player-name'>{selectedPlayer?.fname} {selectedPlayer?.lname}</div>
                            <div>{selectedPlayer?.skill}</div>
                            <div className='font-bold'>Base: &#8377; {selectedPlayer?.baseprice}</div>
                        </Col>
                    </Row>

                    <h4>Enter Bid Detail:</h4>
                    <Row gutter={8}>
                        <Col span={11}>
                            <Select placeholder="Please select an owner" style={{display: 'block'}} onChange={selectTeam}>
                                <Option value="Old Monks">Old Monks</Option>
                                <Option value="Absolut Fighters">Absolut Fighters</Option>
                                <Option value="GFC">GFC</Option>
                            </Select>
                        </Col>
                        <Col span={7}>
                            <Input type='number' placeholder='Bid amount' onChange={onInputChange} />
                        </Col>
                        <Col span={4}>
                            <Button type="primary" onClick={sellPlayer}>Sell Player</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
        
      </div>
    );
}

