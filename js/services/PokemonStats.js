const PokemonStats = (stats, boost = false) => {
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

    if (boost) {
        statsData.datasets.push({
            label: 'Boosted Stats',
            data: [
                stats.hp * (1 + (stats.hp % 7) / 10),
                stats.atk * (1 + (stats.atk % 7) / 10),
                stats.def * (1 + (stats.def % 7) / 10),
                stats.spe_atk * (1 + (stats.spe_atk % 7) / 10),
                stats.spe_def * (1 + (stats.spe_def % 7) / 10),
                stats.vit * (1 + (stats.vit % 7) / 10)
            ],
            backgroundColor: 'rgba(144, 238, 144, 0.2)', 
            borderColor: 'rgba(144, 238, 144, 1)',
            borderWidth: 1
        });
    }

    const statsOptions = {
        scales: {
            r: {
                min: 0,
                max: 200, 
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
