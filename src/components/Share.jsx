import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {
    ShareIcon,
    CopyIcon,
} from './Icons.jsx';
import '../../sass/_ciq-share.scss';


const Share = ({
    Menu,
    menuOpen,
}) => {
    return (
        <Menu className="cq-share">
            <Menu.Title>
                <ShareIcon
                    className = {menuOpen ? 'active' : ''}
                    tooltip-title="Share"
                />
            </Menu.Title>
            <Menu.Body>
                <div className='title'> Share / Download Chart </div>
                <div className='body'>
                    <div className='caption1'>Share link</div>
                    <div className='content'>
                        <input />
                        <CopyIcon />
                    </div>

                    <div className='caption2'>Download chart</div>
                    <div className='content'>
                        <div
                            className='download-btn'
                        > PNG </div>
                        <div
                            className='download-btn'
                        > CSV </div>
                    </div>
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default connect(({share: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
}))(Share);
