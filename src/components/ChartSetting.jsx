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
    hasActiveView,
    clearView,
    onViewLanguage,
    isViewLanguage,
    setLanguage
}) => {
    const renderMain = () => {
        return <div>
            <div className='title'> {t.translate('Settings')} </div>
            <div className='body'>
                <div className="ciq-list ciq-list-setting">
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Position')}</span>
                        <div className="ciq-action">
                            <PositionLeftIcon 
                            />
                            <PositionBottomIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-list-item">
                        <span className="ciq-icon-text">{t.translate('Theme')}</span>
                        <div className="ciq-action">
                            <ThemeDarkIcon 
                            />
                            <ThemeLightIcon 
                            />
                        </div>
                    </div>
                    <div className="ciq-list-item ciq-list-item-lng">
                        <span className="ciq-icon-text">{t.translate('Language')}</span>
                        <div className="ciq-action">
                            <span></span>
                            <ChevronRightIcon 
                                onClick={ () => onViewLanguage() }
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    const renderView = () => {
        if ( isViewLanguage ) {
            return <div>{renderLanguage()}</div>;
        }

        return <div>Empty</div>
    }
    const renderLanguage = () =>{
        let languages = [
            {
                key: 'en',
                name: 'English',
                icon: <FlagIcons.USD />
            },{
                key: 'pt',
                name: 'Português',
                icon: <FlagIcons.Portugal />
            },{
                key: 'de',
                name: 'Deutsch',
                icon: <FlagIcons.German />
            },{
                key: 'ru',
                name: 'Русский',
                icon: <FlagIcons.Russia />
            },{
                key: 'fr',
                name: 'French',
                icon: <FlagIcons.French />
            },{
                key: 'th',
                name: 'Thai',
                icon: <FlagIcons.Thailand />
            },{
                key: 'id',
                name: 'Indonesia',
                icon: <FlagIcons.Indonesia />
            },{
                key: 'vi',
                name: 'Tiếng Việt',
                icon: <FlagIcons.Vietnam />
            },{
                key: 'it',
                name: 'Italiano',
                icon: <FlagIcons.Italy />
            },{
                key: 'zh_cn',
                name: '简体中文',
                icon: <FlagIcons.Chinese />
            },{
                key: 'ja',
                name: '日本語',
                icon: <FlagIcons.Japan />
            },{
                key: 'zh_tw',
                name: '繁體中文',
                icon: <FlagIcons.ChineseTraditional />
            },{
                key: 'pl',
                name: 'Polish',
                icon: <FlagIcons.Poland />
            }
        ];
        return <div>
            <div className='title'>
                <BackIcon
                    onClick={() => clearView() }
                    />
                {t.translate('Language')}
            </div>
            <div className='body'>
                <div className="ciq-list ciq-list-language">
                    {languages.map( (language,index) => {
                        return <div className="ciq-list-item" key={index} onClick={()=> setLanguage(language.key) }>
                            {language.icon}
                            <span className="ciq-icon-text">{t.translate(language.name)}</span>
                        </div>
                    })}
                </div>
            </div>
        </div>

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
                {hasActiveView ? renderView() : renderMain()}                
            </Menu.Body>
        </Menu>
    );
};

export default connect(({chartSetting: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    hasActiveView: s.hasActiveView,
    clearView: s.clearView,
    onViewLanguage: s.onViewLanguage,
    isViewLanguage: s.isViewLanguage,
    setLanguage: s.setLanguage
}))(ChartSetting);
