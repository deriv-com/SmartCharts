    // scrollChartToLeft = (leftTick, force) => {
    //     const scrollToEpoch = this.scrollToEpoch || (leftTick && getUTCEpoch(leftTick.DT));
    //     this.stxx.chart.entryTick = null;

    //     console.log('scrollChartToLeft');

    //     if (scrollToEpoch) {
    //         let startEntry = this.stxx.chart.dataSet
    //             .find(entry =>  entry.DT.valueOf() === CIQ.strToDateTime(getUTCDate(scrollToEpoch)).valueOf());

    //         if (!startEntry) {
    //             startEntry = {
    //                 DT: CIQ.strToDateTime(getUTCDate(scrollToEpoch)),
    //                 Close: null,
    //             };

    //             /**
    //              * Adding an invisible bar if the bar
    //              * does not exist on the masterData
    //              */
    //             this.stxx.updateChartData(
    //                 startEntry,
    //                 null,
    //                 { fillGaps: true },
    //             );
    //             this.stxx.createDataSet();
    //         }
    //         this.stxx.maxMasterDataSize = 0;
    //         this.stxx.micropixels = 0;
    //         this.stxx.draw();

    //         this.stxx.chart.entryTick = this.stxx.tickFromDate(startEntry.DT); // the calculation of entry tick should be done after draw
    //         const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick;

    //         if (this.stxx.animations.liveScroll && this.stxx.animations.liveScroll.running) {
    //             this.stxx.animations.liveScroll.stop();
    //         }

    //         if (!force && !this.startEpoch) {
    //             this.stxx.scrollTo(this.stxx.chart, scrollToTarget, () => {
    //                 this.stxx.setMaxTicks(5);
    //                 this.stxx.micropixels = 0;
    //                 this.stxx.chart.lockAutoScroll = true;
    //                 this.stxx.chart.isScrollLocationChanged = true; // set to true to draw markers
    //                 this.stxx.draw();
    //             });
    //         } else {
    //             this.stxx.chart.lockScroll = true;
    //             this.stxx.chart.lockAutoScroll = true;
    //             this.stxx.chart.isScrollLocationChanged = true; // set to true to draw markers

    //             if (!this.endEpoch) {
    //                 this.stxx.setMaxTicks(scrollToTarget + 3);
    //                 this.stxx.chart.scroll = scrollToTarget + 1;
    //                 console.log('1');
    //             } else {
    //                 this.stxx.setMaxTicks(scrollToTarget + (Math.floor(scrollToTarget / 5) || 2));
    //                 this.stxx.chart.scroll = scrollToTarget + (Math.floor(scrollToTarget / 10) || 1);
    //                 console.log('2');
    //             }
    //             this.stxx.micropixels = 0;
    //             this.stxx.draw();
    //         }
    //     } else if (this.startEpoch) {
    //         this.stxx.chart.lockAutoScroll = true;
    //         this.stxx.chart.isScrollLocationChanged = true;
    //     } else {
    //         this.stxx.chart.lockAutoScroll = false;
    //         this.stxx.chart.isScrollLocationChanged = false;
    //         this.stxx.home();
    //         this.stxx.draw();
    //     }
    //     this.mainStore.chart.feed.offMasterDataReinitialize(this.scrollChartToLeft);
    //     this.mainStore.chart.feed.offMasterDataUpdate(this.scrollChartToLeft);

    //     //     this.stxx.chart.entryTick = this.stxx.tickFromDate(startEntry.DT);

    //     //     if (!force && !this.startEpoch) {
    //     //         this.stxx.maxMasterDataSize = 0;
    //     //         this.stxx.micropixels = 0;
    //     //         this.stxx.draw();

    //     //         const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick;

    //     //         if (this.stxx.animations.liveScroll && this.stxx.animations.liveScroll.running) {
    //     //             this.stxx.animations.liveScroll.stop();
    //     //         }

    //     //         this.stxx.scrollTo(this.stxx.chart, scrollToTarget, () => {
    //     //             this.stxx.setMaxTicks(5);
    //     //             this.stxx.micropixels = 0;
    //     //             this.stxx.chart.lockAutoScroll = true;
    //     //             this.stxx.chart.isScrollLocationChanged = true; // set to true to draw markers
    //     //             this.stxx.draw();
    //     //             console.log('4');
    //     //         });
    //     //         console.log('3');
    //     //     } else {
    //     //         this.stxx.chart.lockAutoScroll = true;
    //     //         const tick = this.stxx.tickFromDate(startEntry.DT);
    //     //         const leftTickDistance = this.stxx.chart.dataSet.length - tick;
    //     //         this.stxx.chart.isScrollLocationChanged = true; // set to true to draw markers
    //     //         this.stxx.chart.lockScroll = true;
    //     //         this.stxx.micropixels = 0;
    //     //         this.stxx.draw();

    //     //         if (!this.endEpoch) {
    //     //             this.stxx.setMaxTicks(leftTickDistance + 3);
    //     //             this.stxx.chart.scroll = leftTickDistance + 1;
    //     //             console.log('1');
    //     //         } else {
    //     //             this.stxx.setMaxTicks(leftTickDistance + (Math.floor(leftTickDistance / 5) || 2));
    //     //             this.stxx.chart.scroll = leftTickDistance + (Math.floor(leftTickDistance / 10) || 1);
    //     //             console.log('2');
    //     //         }
    //     //         this.stxx.draw();
    //     //     }
    //     // } else if (this.startEpoch) {
    //     //     this.stxx.chart.lockAutoScroll = true;
    //     //     this.stxx.chart.isScrollLocationChanged = true;
    //     // } else {
    //     //     this.stxx.chart.lockAutoScroll = false;
    //     //     this.stxx.chart.isScrollLocationChanged = false;
    //     //     this.stxx.home();
    //     //     this.stxx.draw();
    //     // }
    //     // this.mainStore.chart.feed.offMasterDataReinitialize(this.scrollChartToLeft);
    //     // this.mainStore.chart.feed.offMasterDataUpdate(this.scrollChartToLeft);
    // }