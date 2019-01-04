import React from 'react';
import '../../../sass/components/_categorical-display.scss';
import SimpleBar from 'simplebar-react';

class CategoricalDisplay extends React.Component {
    render() {
        const {
            onSelectItem,
            setScrollPanel,
            ResultsPanel,
            FilterPanel,
            SearchInput,

        } = this.props;

        return (
            <div className="cq-categorical-display">
                <div className="cq-lookup-filters">
                    <SearchInput />
                    <FilterPanel />
                </div>
                <SimpleBar
                    style={{ height:300 }}
                    className="cq-scroll-panel"
                    ref={setScrollPanel}
                >
                    <ResultsPanel
                        onSelectItem={onSelectItem}
                    />
                </SimpleBar>
            </div>
        );
    }
}

export default CategoricalDisplay;
