import React from 'react';
import { connect } from '../store/Connect';
import { DeleteIcon, EditIcon } from './Icons.jsx';
import '../../sass/components/_sc-studies-list.scss';

const StudyLegendListItem = ({
    item,
    onDelete,
    onEdit,
}) => (
    <div className="stx-panel-control iconsTemplate stx-show">
        <div className="stx-panel-title">
            {item.name}
            <span className="bars">({item.bars})</span>
        </div>
        <div className="stx-btn-panel">
            <EditIcon
                className="stx-ico-edit"
                onClick={() => onEdit(item.dataObject)}
            />
        </div>
        <div className="stx-btn-panel stx-show">
            <DeleteIcon
                className="stx-ico-close"
                onClick={() => onDelete(item.dataObject.sd)}
            />
        </div>
    </div>
);

const StudyLegendList = ({
    chartActiveStudies,
    deleteStudy,
    editStudy,
}) => (
    <div className="sc-studies-list">
        {chartActiveStudies.map(item => (
            <StudyLegendListItem
                key={item.id}
                item={item}
                onDelete={deleteStudy}
                onEdit={editStudy}
            />
        ))}
    </div>
);

export default connect(({ studies: st }) => ({
    chartActiveStudies: st.chartActiveStudies,
    deleteStudy: st.deleteStudy,
    editStudy: st.editStudy,
}))(StudyLegendList);
