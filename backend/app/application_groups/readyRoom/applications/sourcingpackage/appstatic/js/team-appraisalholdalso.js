console.log('team-appraisal.js loaded successfully');

export const program = {
    launch: function(section, container) {
        console.log('Launch function called in team-appraisal.js');
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>Woohoo! It Works!</h1>
                <p>Successfully loaded team-appraisal.js and rendered content.</p>
            </div>
        `;
    }
};

console.log('team-appraisal.js export completed');