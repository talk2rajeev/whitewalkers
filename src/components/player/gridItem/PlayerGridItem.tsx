import * as React from 'react';
import {PlayerType} from '../../../pages/playerList/PlayerList';
import { imageMap } from '../../../images';
import Retained from '../../../images/retained.png';
import transparentBall from '../../../pages/playerList/transparentBall.svg';

export interface IPlayerGridItemProps {
    p: PlayerType;
}

export function PlayerGridItem (props: IPlayerGridItemProps) {
  const p = props.p;  
  const getPlayerImg = (pName: string) => imageMap[pName] || imageMap['NoImg'];
  return (
    <div key={p.fname} className='grid-item' style={{opacity: (p.retained === 'yes' || p.soldprice!== 0) ? 1 : .5, backgroundImage: `url(${transparentBall})`}}>
            <div className='grid-item-inner'>
                <div className='name-pic-grid'>
                    <div>
                        <div className='p-name'>{p.fname}</div>
                        <div className='p-skill'>{p.skill}</div>
                        <div className='p-baseprice'><span className='font-bold'>Base Price</span> - &#8377; {p.baseprice}</div>
                        <div className='p-soldto'><span className='font-bold'>Sold to</span> - {p.soldto}</div>
                        <div className='p-soldto'><span className='font-bold'>Sold Price</span> - &#8377; {p.soldprice || 'NA'}</div>
                    </div>
                    <img src={getPlayerImg(p.fname)} alt={p.fname} className='p-img'/>
                </div>
            </div>
            {p.retained === 'yes' ? <img src={Retained} alt="" className='retained-icn'/> : null}
        </div>
  );
}
