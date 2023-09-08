import * as React from 'react';
import '../player.css';

export interface IPlayerGridProps {
    children: React.ReactNode
}

export function PlayerGrid (props: IPlayerGridProps) {
  return (
    <div className="player-grid">
      {props.children}
    </div>
  );
}
