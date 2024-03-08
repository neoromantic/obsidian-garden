export default function handler(request, response) {
    const d = request.query.d;
    if (d) {
        const values = d.split(',').map(Number);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const svgWidth = 200;
        const svgHeight = 20;
        const padding = 2;
        const adjustedHeight = svgHeight - 2 * padding;
        const xScale = svgWidth / (values.length - 1);
        const yScale = adjustedHeight / (max - min || 1);
        const meanLineY = padding + adjustedHeight - (mean - min) * yScale;

        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth + 20}" height="${svgHeight}" style="font-family: Arial;">`;

        // Mean line
        svg += `<line x1="0" y1="${meanLineY}" x2="${svgWidth}" y2="${meanLineY}" stroke="#BBB" stroke-dasharray="2,2" stroke-width="1" />`;

        // Path construction with color change at the mean line crossing
        let currentPath = "";
        let lastY = null;

        values.forEach((value, i) => {
            const x = i * xScale;
            const y = padding + adjustedHeight - (value - min) * yScale;

            if (i === 0) {
                currentPath = `M${x},${y}`;
                lastY = y;
            } else {
                // Check if segment crosses the mean line
                if ((lastY < meanLineY && y > meanLineY) || (lastY > meanLineY && y < meanLineY)) {
                    // Find the crossing point
                    const ratio = (meanLineY - lastY) / (y - lastY);
                    const meanX = x - xScale + xScale * ratio;
                    // Draw up to the crossing point in the current color
                    currentPath += ` L${meanX},${meanLineY}`;
                    // Finish the current path
                    svg += `<path d="${currentPath}" stroke="${lastY < meanLineY ? '#4CAF50' : '#F44336'}" fill="none" stroke-width="1.5"/>`;
                    // Start a new path from the crossing point in the new color
                    currentPath = `M${meanX},${meanLineY} L${x},${y}`;
                } else {
                    // Continue the path
                    currentPath += ` L${x},${y}`;
                }
                lastY = y;
            }
        });

        // Finish the last path
        svg += `<path d="${currentPath}" stroke="${lastY < meanLineY ? '#4CAF50' : '#F44336'}" fill="none" stroke-width="1.5"/>`;

        // Labels for min, max, and mean values
        svg += `<rect x="0" y="${svgHeight - 14}" width="20" height="12" fill="#FFF"></rect>`; // Background for min value
        svg += `<text x="5" y="${svgHeight - 1}" font-size="10" fill="#000">${min}</text>`; // Low value at bottom left
        svg += `<rect x="0" y="0" width="20" height="12" fill="#FFF"></rect>`; // Background for max value
        svg += `<text x="5" y="10" font-size="10" fill="#000">${max}</text>`; // High value at top left
        svg += `<rect x="${svgWidth + 5}" y="${meanLineY}" width="20" height="12" fill="#FFF"></rect>`; // Background for mean value
        svg += `<text x="${svgWidth + 5}" y="${meanLineY + 3}" font-size="10" fill="#000" text-anchor="end">${mean.toFixed(2)}</text>`; // Mean label
        svg += `</svg>`;
        response.setHeader('content-type', 'image/svg+xml');
        return response.status(200).send(svg);
    } else {
        return response.status(400).send('Missing data parameter');
    }
}
