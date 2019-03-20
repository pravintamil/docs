const d3 = require("d3");

module.exports = {
    wave: filledPath(d3.curveCardinal.tension(0.1)),
    pixel: filledPath(d3.curveStep),
    roundBars: bars(true),
    bars: bars(),
    bricks: bricks(),
    equalizer: bricks(true),
    line: strokedPath(),
    curve: strokedPath(d3.curveCardinal.tension(0.1)),
    visualizer: visualizer(),
    colorbar: colorbar(),
    frameLooper: frameLooper()
};

function filledPath(interpolator) {

    return function drawCurve(context, data, options) {

        context.fillStyle = options.waveColor;
        context.strokeStyle = options.waveColor;
        context.lineWidth = 3;

        const line = d3.line()
            .context(context);

        if (interpolator) {
            line.curve(interpolator);
        }

        const waveHeight = options.waveBottom - options.waveTop;

        const baseline = options.waveTop + waveHeight / 2;

        const x = d3.scalePoint()
            .padding(0.1)
            .domain(d3.range(data.length))
            .rangeRound([options.waveLeft, options.waveRight]);

        const height = d3.scaleLinear()
            .domain([0, 1])
            .range([0, waveHeight / 2]);

        const top = data.map(function (d, i) {

            return [x(i), baseline - height(d[0])];

        });

        const bottom = data.map(function (d, i) {

            return [x(i), baseline + height(d[0])];

        }).reverse();


        top.unshift([options.waveLeft, baseline]);
        top.push([options.waveRight, baseline]);

        // Fill waveform
        context.beginPath();
        line(top.concat(bottom));
        context.fill();

        // Stroke waveform edges / ensure baseline
        [top, bottom].forEach(function (path) {

            context.beginPath();
            line(path);
            context.stroke();

        });
    }

}

function bars(round) {

    return function (context, data, options) {

        context.fillStyle = options.waveColor;

        const waveHeight = options.waveBottom - options.waveTop;

        const baseline = options.waveTop + waveHeight / 2;

        const barX = d3.scaleBand()
            .paddingInner(0.5)
            .paddingOuter(0.01)
            .domain(d3.range(data.length))
            .rangeRound([options.waveLeft, options.waveRight]);

        const height = d3.scaleLinear()
            .domain([0, 1])
            .range([0, waveHeight / 2]);

        const barWidth = barX.bandwidth();

        data.forEach(function (val, i) {

            const h = height(val[0]) * 2,
                x = barX(i),
                y = baseline - height(val[0]);

            context.fillRect(x, y, barWidth, h);

            if (round) {
                context.beginPath();
                context.arc(x + barWidth / 2, y, barWidth / 2, 0, 2 * Math.PI);
                context.moveTo(x + barWidth / 2, y + h);
                context.arc(x + barWidth / 2, y + h, barWidth / 2, 0, 2 * Math.PI);
                context.fill();
            }

        });
    }

}

function bricks(rainbow) {
    return function (context, data, options) {

        context.fillStyle = options.waveColor;

        const waveHeight = options.waveBottom - options.waveTop;

        const barX = d3.scaleBand()
            .paddingInner(0.1)
            .paddingOuter(0.01)
            .domain(d3.range(data.length))
            .rangeRound([options.waveLeft, options.waveRight]);

        const height = d3.scaleLinear()
            .domain([0, 1])
            .range([0, waveHeight]);

        const barWidth = barX.bandwidth(),
            brickHeight = 10,
            brickGap = 3,
            maxBricks = Math.max(1, Math.floor(waveHeight / (brickHeight + brickGap)));

        data.forEach(function (val, i) {

            const bricks = Math.max(1, Math.floor(height(val[0]) / (brickHeight + brickGap))),
                x = barX(i);

            d3.range(bricks).forEach(function (b) {
                if (rainbow) {
                    context.fillStyle = d3.interpolateWarm(1 - (b + 1) / maxBricks);
                }
                context.fillRect(x, options.waveBottom - (brickHeight * (b + 1)) - brickGap * b, barWidth, brickHeight);
            });

        });

    };
}

function strokedPath(interpolator) {
    return function (context, data, options) {

        context.fillStyle = options.waveColor;
        context.strokeStyle = options.waveColor;
        context.lineWidth = 5;

        const line = d3.line()
            .context(context);

        if (interpolator) {
            line.curve(interpolator);
        }

        const x = d3.scalePoint()
            .padding(0.1)
            .domain(d3.range(data.length))
            .range([options.waveLeft, options.waveRight]);

        const y = d3.scaleLinear()
            .domain([-1, 1])
            .range([options.waveBottom, options.waveTop]);

        const points = data.map(function (d, i) {
            return [x(i), y(d[1])];
        });

        // Fill waveform
        context.beginPath();
        line(points);
        context.stroke();

    }
}

function visualizer() {
    const barNum = 100;
    return function (context, data, options) {
        context.fillStyle = options.waveColor;
        const gradient = context.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#cafdff');
        context.fillStyle = gradient;
        context.shadowBlur = 20;
        context.shadowColor = '#ffffff';

        const width = options.waveRight - options.waveLeft;
        const height = options.waveBottom - options.waveTop;
        const cx = options.waveLeft + width * 0.5;
        const cy = options.waveTop + height * 0.5;
        const barHeight = cy * 0.15;
        const radius = (width - barHeight) * 0.5;
        const calc1 = radius * 2 * Math.PI / barNum;
        const barWidth = calc1 * 0.25;
        const freqJump = Math.max(1, Math.floor(data.length / barNum));

        let max = 0, i = 0;
        for (; i < barNum; i++) {
            if (data[i * freqJump] && data[i * freqJump][0] > max) {
                max = data[i * freqJump][0];
            }
        }
        const heightScale = d3.scaleLinear().domain([0, max]).range([0, barHeight]);
        i = 0;
        const x = 0;
        const w = barWidth;
        const beta = (3 * 45 - barWidth) * Math.PI / 180;
        let value;
        for (; i < barNum && (value = data[i * freqJump]); i++) {
            const alpha = (i * 2 * Math.PI ) / barNum;
            const h = Math.max(1, heightScale(value[0]));
            const y = radius;
            context.save();
            context.translate(cx, cy);
            context.rotate(alpha - beta);
            context.fillRect(x, y, w, h);
            context.restore();
        }
    };
}
function frameLooper() {
    const barNum = 100;
    return function (context, data, options) {
        context.fillStyle = options.waveColor;
        context.save();

        const width = options.waveRight - options.waveLeft;
        const height = options.waveBottom - options.waveTop;
        const barHeight = height * 0.95;
        const calc1 = width / barNum;
        const barWidth = calc1 * 0.25;
        const barSpace = calc1 * 0.75;
        const freqJump = Math.max(1, Math.floor(data.length / barNum));
        context.translate(options.waveLeft, options.waveTop);

        const heightScale = d3.scaleLinear().domain([0, 1]).range([0, barHeight]);

        let i = 0;
        const w = barWidth;
        let value;
        for (; i < barNum && (value = data[i * freqJump]); i++) {
            const x = i * (barWidth + barSpace);
            const h = Math.max(1, heightScale(value[0]));
            context.fillRect(x, height, w, -h);
        }
        context.restore();
    };
}
function colorbar() {
    return function (context, data, options) {
        const waveHeight = options.waveBottom - options.waveTop;
        const barNum = 75;
        const gradient = context.createLinearGradient(options.waveLeft, options.waveTop, options.waveRight, options.waveBottom);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "#ff0");
        context.fillStyle = gradient;

        const barX = d3.scaleBand()
            .paddingInner(0.2)
            .paddingOuter(0.01)
            .domain(d3.range(barNum))
            .rangeRound([options.waveLeft, options.waveRight]);

        const height = d3.scaleLinear()
            .domain([0, 1])
            .range([0, waveHeight]);

        const barWidth = barX.bandwidth();
        const freqJump = Math.max(1, Math.floor(data.length / barNum));
        let i = 0, val;
        for (; i < barNum && (val = data[i * freqJump]); i++) {
            const barHeight = height(val[0]);
            context.fillRect(barX(i), options.waveBottom, barWidth, -barHeight);

        }
    };
}

