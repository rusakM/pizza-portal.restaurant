import React from 'react';
import { ReactComponent as Pizza } from '../../svg/pizza.svg';

import './loading-screen.styles.scss';

const LoadingScreen = ({ children }) => (
    <div className="loading-screen">
        <div className="loading-screen-wrapper">
            <Pizza className="loading-screen-icon" />
            {children && <p>{children}</p>}
        </div>
    </div>
);

export default LoadingScreen;
