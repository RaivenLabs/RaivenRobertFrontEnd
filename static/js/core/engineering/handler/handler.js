if (e.target.closest('.menu-item[data-section="engineering"]')) {
    const { handler } = await import('../engineering/handler/handler.js');
    handler.initialize();
    return;
}