const PokemonStats = (stats) => {
    const statsData = {
        labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'], 
        datasets: [{
            label: 'Stats',
            data: [
                stats.hp,
                stats.atk,
                stats.def,
                stats.spe_atk,
                stats.spe_def,
                stats.vit
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const statsOptions = {
        scales: {
            r: {
                min: 0,
                max: 200, // You can adjust the max value based on the range of stats
                ticks: {
                    stepSize: 20
                }
            }
        }
    };

    return (ctx) => {
        new Chart(ctx, {
            type: 'radar',
            data: statsData,
            options: statsOptions
        });
    };
};

export default PokemonStats;
