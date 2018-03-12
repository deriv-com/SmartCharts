import React from 'react';
import ReactDOM from 'react-dom';
import { createElement } from '../components/ui/utils';
import { MobxProvider } from '../store/Connect';

// Place the UITopWidgets under stx-holder to position it relative to the
// Active symbol chart. Note that this causes text input fields inside to
// be unresponsive to user mouse input
export function appendMarker(ReactComponent, mainStore) {
    const elem = createElement(`<div></div>`);
    const marker = mainStore.chart.stxx.panels.chart.holder.appendChild(elem);
    ReactDOM.render(
        <MobxProvider store={mainStore}>
            <ReactComponent />
        </MobxProvider>,
        marker
    );
}
