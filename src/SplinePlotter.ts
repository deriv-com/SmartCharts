/* eslint-disable no-restricted-globals,no-restricted-properties */

export default function plotSpline(
    points: number[],
    tension: number,
    context: CanvasRenderingContext2D,
    colorPatternChanges: {
        width: number;
        pattern: number[];
        color: string;
        coord: number[];
    }[]
) {
    function getControlPoints(i: number) {
        const x0 = points[i];
        const y0 = points[i + 1];
        const x1 = points[i + 2];
        const y1 = points[i + 3];
        const x2 = points[i + 4];
        const y2 = points[i + 5];

        if (isNaN(x0) || isNaN(x1) || isNaN(x2) || isNaN(y0) || isNaN(y1) || isNaN(y2)) {
            return [];
        }
        // x0,y0,x1,y1 are the coordinates of the end (knot) points of this segment
        // x2,y2 is the next knot -- not connected here but needed to calculate p2
        // p1 is the control point calculated here, from x1 back toward x0.
        // p2 is the next control point, calculated here and returned to become the
        // next segment's p1.
        // tension controls how far the control points spread.

        // Scaling factors: distances from this knot to the previous and following knots.
        const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        const d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        const fa = (tension * d01) / (d01 + d12);
        const fb = tension - fa;

        const p1x = x1 + fa * (x0 - x2);
        const p1y = y1 + fa * (y0 - y2);

        const p2x = x1 - fb * (x0 - x2);
        const p2y = y1 - fb * (y0 - y2);

        return [p1x, p1y, p2x, p2y];
    }

    if (!tension || tension < 0) {
        tension = 0;
    }
    let cp: number[] = []; // array of control points, as x0,y0,x1,y1,...
    const n = points.length;
    // Draw an open curve, not connected at the ends
    for (let i = 0; i < n - 4; i += 2) {
        cp = cp.concat(getControlPoints(i));
    }
    if (cp === null) {
        return;
    }
    if (!colorPatternChanges) {
        colorPatternChanges = [];
    }
    let colorPatternIndex = 0;

    function seeIfStrokeNeeded(i: number) {
        if (colorPatternIndex === colorPatternChanges.length) {
            return;
        }
        const colorPatternChange = colorPatternChanges[colorPatternIndex];
        if (colorPatternChange.coord[0] === points[i] && colorPatternChange.coord[1] === points[i + 1]) {
            context.stroke();
            context.strokeStyle = colorPatternChange.color;
            context.setLineDash(colorPatternChange.pattern);
            context.lineDashOffset = 0;
            context.lineWidth = colorPatternChange.width;
            context.beginPath();
            context.moveTo(points[i], points[i + 1]); // reset back to last point
            colorPatternIndex++;
        }
    }

    // plot the first segment
    context.moveTo(points[0], points[1]);
    seeIfStrokeNeeded(0);
    context.quadraticCurveTo(cp[0], cp[1], points[2], points[3]);

    for (let i = 2; i < n - 5; i += 2) {
        seeIfStrokeNeeded(i);
        context.bezierCurveTo(cp[2 * i - 2], cp[2 * i - 1], cp[2 * i], cp[2 * i + 1], points[i + 2], points[i + 3]);
    }

    // plot the last segment
    seeIfStrokeNeeded(n - 4);
    context.quadraticCurveTo(cp[2 * n - 10], cp[2 * n - 9], points[n - 2], points[n - 1]);
}
