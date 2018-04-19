import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import { 
    EditIcon,
    PositionLeftIcon,
    PositionBottomIcon,
    ThemeDarkIcon,
    ThemeLightIcon,
    ChevronRightIcon,
    BackIcon,
    FlagIcons
} from './Icons.jsx';
import '../../sass/_ciq-chart-setting.scss';


const ChartSetting = ({
    Menu,
    menuOpen,
    languages,
    setView,
    view,
    setLanguage
}) => {
    const renderMain = () => {
        let HiddenStyle = {
            display: 'none'
        }
        return <div>
            <div className='title'> {t.translate('Settings')} </div>
            <div className='body'>
                <div className="ciq-list-setting">
                    <div className="ciq-item" style={HiddenStyle}>
                        <span className="ciq-icon-text">{t.translate('Position')}</span>
                        <div className="ciq-action">
                            <PositionLeftIcon 
                            />
                            <PositionBottomIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-item" style={HiddenStyle}>
                        <span className="ciq-icon-text">{t.translate('Theme')}</span>
                        <div className="ciq-action">
                            <ThemeDarkIcon 
                            />
                            <ThemeLightIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-item ciq-list-item-lng">
                        <span className="ciq-icon-text">{t.translate('Language')}</span>
                        <div className="ciq-action">
                            <span></span>
                            <ChevronRightIcon 
                                onClick={ () => setView('language') }
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    const renderLanguage = () =>{
        return <div>
            <div className='title'>
                <BackIcon
                    onClick={() => setView() }
                    />
                {t.translate('Language')}
            </div>
            <div className='body'>
                <div className="ciq-list ciq-list-language">
                    {languages.map( (language,index) => {
                        return <div className="ciq-list-item" key={index} >
                            <span onClick={()=> setLanguage(language.key) }>
                                {language.icon}
                            </span>
                            <span className="ciq-icon-text">{t.translate(language.name)}</span>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
    const renderBody = () => {
        if ( view == '' ) {
            return renderMain();
        }

        if ( view == 'language' ) {
            return renderLanguage();
        }

        return <div>Empty</div>
    }
    return (
        <Menu className="cq-chart-setting">
            <Menu.Title>
                <EditIcon
                    className = {menuOpen ? 'active' : ''}
                    tooltip-title={t.translate('Settings')}
                />
            </Menu.Title>
            <Menu.Body>
                {/*renderBody()*/}

                <div className={`cq-menu-container ${ view == '' ? 'active': ''}`}>
                    {renderMain()}
                </div>
                <div className={`cq-menu-container ${ view == 'language' ? 'active': ''}`}>
                    {renderLanguage()}
                </div>

            </Menu.Body>
        </Menu>
    );
};

export default connect(({chartSetting: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    languages: s.languages,
    setView: s.setView,
    view: s.view,
    setLanguage: s.setLanguage
}))(ChartSetting);
