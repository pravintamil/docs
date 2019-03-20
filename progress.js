function youtube(context, theme, frame, frameCount = 1.5) {
    const percentage = ++frame / frameCount;
    const width = theme.progressRight - theme.progressLeft;
    const height = theme.progressBottom - theme.progressTop;
    const radius = height * 0.5;
    const barHeight = radius * 0.5;
    const barCenter = theme.progressTop + radius;
    const barTop = barCenter - barHeight * 0.5;
    const barPlayed = width * percentage;
    context.fillStyle = 'red';
    context.fillRect(theme.progressLeft, barTop, barPlayed, barHeight);
    context.fillStyle = 'gray';
    context.fillRect(theme.progressLeft + barPlayed, barTop, width - barPlayed, barHeight);
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(theme.progressLeft + barPlayed, barCenter, radius, 0, 2 * Math.PI);
    context.fill();
}
function basicFill(context, theme, frame, frameCount = 1.5) {
    const percentage = ++frame / frameCount;
    const width = theme.progressRight - theme.progressLeft;
    const height = theme.progressBottom - theme.progressTop;
    const barTop = theme.progressTop;
    const barPlayed = width * percentage;
    context.fillStyle = 'red';
    context.fillRect(theme.progressLeft, barTop, barPlayed, height);
    context.fillStyle = 'gray';
    return context.fillRect(theme.progressLeft + barPlayed, barTop, width - barPlayed, height);
}
function circleFill(context, theme, frame, frameCount = 1.5) {
    const percentage = ++frame / frameCount;
    const width = theme.progressRight - theme.progressLeft;
    const height = theme.progressBottom - theme.progressTop;
    const lineWidth = height * 0.05;
    const radius = (height-lineWidth) * 0.5;
    const centerX = theme.progressLeft + width/2;
    const centerY = theme.progressTop + height/2;
    const circleStart = 1.5 * Math.PI;
    const circleEnd = circleStart + percentage * Math.PI * 2;
    context.lineCap = 'round';
    context.beginPath();
    context.strokeStyle = '#b1b1b1';
    context.lineWidth = lineWidth;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'red';
    context.lineWidth = lineWidth;
    context.arc(centerX, centerY, radius, circleStart, circleEnd, false);
    context.stroke();
}
function pieFill(context, theme, frame, frameCount = 1.5) {
    const percentage = ++frame / frameCount;
    const width = theme.progressRight - theme.progressLeft;
    const height = theme.progressBottom - theme.progressTop;
    const radius = height * 0.5;
    const centerX = theme.progressLeft + width/2;
    const centerY = theme.progressTop + height/2;
    const circleStart = 1.5 * Math.PI;
    const circleEnd = circleStart + percentage * Math.PI * 2;

    context.beginPath();
    context.fillStyle = '#b1b1b1';
    context.moveTo(centerX, centerY)
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.fillStyle = 'red';
    context.moveTo(centerX, centerY)
    context.arc(centerX, centerY, radius, circleStart, circleEnd, false);
    context.fill();
}

module.exports = {
    basicFill: basicFill,
    circleFill: circleFill,
    pieFill: pieFill,
    youtube: youtube
};

