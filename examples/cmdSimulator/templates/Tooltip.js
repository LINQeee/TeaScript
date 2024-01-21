new Template("Tooltip", (tooltipList) => {
    const tooltip = TS.q("#tooltip");
    if(tooltip) tooltip.remove();
    return `<ul class="tooltip" id="tooltip">
            ${tooltipList.map(tp => `<li>${tp[0]}</li>`).join("")}
            </ul>`;
});