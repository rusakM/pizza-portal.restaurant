import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faInstagram,
    faTwitterSquare,
} from '@fortawesome/free-brands-svg-icons';

import './footer.styles.scss';

const Footer = () => (
    <footer>
        <p>
            Pizza Portal Inc.&nbsp;
            <FontAwesomeIcon icon={faFacebook} />
            &nbsp;
            <FontAwesomeIcon icon={faInstagram} />
            &nbsp;
            <FontAwesomeIcon icon={faTwitterSquare} />
        </p>
    </footer>
);

export default Footer;
