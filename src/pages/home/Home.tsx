import * as React from 'react';
import { Col, Divider, Row } from 'antd';
import { Link } from "react-router-dom";
import './home.css';

export interface IHomeProps {
}

export function Home (props: IHomeProps) {
  return (
    <div>
      <Row className='app-header' justify='space-between' align='middle'>
        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
            <img className='logo-img' src='logo192.png'/>
        </Col>
        <Col xs={20} sm={20} md={20} lg={20} xl={20} className='appheader-links'>
            <Link to="players">About</Link>  
            <Link to="players">WPL2023-Auction</Link>  
        </Col>
      </Row>
      
      <div className='content'>
        <div className='banner'>
            <img src='wpl.png' className='banner-img'/>
            <div className="team-logo-on-banner">
                <div className="team-logo-grid">
                    <img src='AbsolutFighters.png' className='banner-img'/>
                    <img src='OldMonks.png' className='banner-img'/>
                    <img src='gfc.png' className='banner-img'/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
