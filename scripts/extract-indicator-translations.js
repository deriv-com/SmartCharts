
// Execute this inside StudyLegendStore.js and place the console output to
// indicator-strings.txt. Though not a pretty solution, bear in mind that
// indicators rarely change.
export function printIndicatorStrings(stx) {
    let indicatorStrings = '';
    for (const name in CIQ.Studies.studyLibrary) {
        const study = new CIQ.Studies.DialogHelper({
            stx,
            name
        });
        indicatorStrings += study.title + '\n';
        for (const key of ['inputs', 'outputs', 'parameters']) {
            for (const entry of study[key]) {
                indicatorStrings += entry.heading + '\n';
            }
        }
    }
    console.log(indicatorStrings);
}

