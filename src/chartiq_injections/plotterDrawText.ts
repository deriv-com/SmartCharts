export const plotterDrawText = () => {
    // Plotter.drawTex duty is to write y-axis labels,which located in the Plotter
    // as there isn't any option to make y-axis text align center, and also there
    // isn't any injection for drawText, we have to do a monkey patching for handling
    // this issue
    CIQ.Plotter.prototype.drawText = function (
        context: CanvasRenderingContext2D,
        series: {
            text: {
                width: number;
                height: number;
                text: string;
                bg: string;
                x: number;
                y: number;
            }[];
        }
    ) {
        for (let i = 0; i < series.text.length; i++) {
            const textObj = series.text[i];
            const w = textObj.width ? textObj.width : context.measureText(textObj.text).width;
            const offset = this.getYAxisWidth() ? (this.getYAxisWidth() - w) / 2 : 0;
            if (textObj.bg) {
                const h = textObj.height ? textObj.height : 12;
                const prev = context.fillStyle;
                context.fillStyle = textObj.bg;
                if (context.textAlign === 'right') {
                    context.fillRect(textObj.x, textObj.y - h / 2, -w, -h);
                } else {
                    context.fillRect(textObj.x, textObj.y - h / 2, w, h);
                }
                context.fillStyle = prev;
            }
            context.fillText(textObj.text, textObj.x + offset, textObj.y);
        }
    };
};
