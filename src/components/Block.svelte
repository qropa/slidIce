<script>
    let { x = 0, y = 0, size = 48 } = $props();
</script>

<g transform="translate({x}, {y})">
    <rect
        x={-size/2}
        y={-size/2}
        width={size}
        height={size}
        rx="8"
        fill="#2196f3"
        stroke="#1976d2"
        stroke-width="2"
    />
    <rect
        x={-size/2 + 4}
        y={-size/2 + 4}
        width={size - 8}
        height={size - 8}
        rx="6"
        fill="#64b5f6"
        opacity="0.5"
    />
</g>