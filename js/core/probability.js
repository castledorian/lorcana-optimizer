/**
 * Probabilité hypergéométrique d'obtenir au moins k succès
 * @param {number} N - taille de la population (deck)
 * @param {number} K - nombre de succès dans la population
 * @param {number} n - nombre de tirages
 * @param {number} k - nombre minimum de succès souhaités
 * @returns {number} probabilité (0-1)
 */
export function hypergeometricAtLeast(N, K, n, k) {
    if (K <= 0 || n <= 0 || k <= 0) return 1; // cas trivial
    if (k > n || k > K) return 0;
    let prob = 0;
    // Calcul de la somme pour i allant de k à min(K, n)
    const maxI = Math.min(K, n);
    for (let i = k; i <= maxI; i++) {
        prob += combination(K, i) * combination(N - K, n - i) / combination(N, n);
    }
    return prob;
}

function combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    // Optimisation pour symétrie
    if (k > n - k) k = n - k;
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - k + i) / i;
    }
    return result;
}

/**
 * Probabilité d'avoir au moins une carte d'un groupe donné en main de départ (7 cartes)
 * @param {number} deckSize - nombre total de cartes dans le deck (60 ou plus)
 * @param {number} groupSize - nombre de cartes appartenant au groupe
 * @returns {number}
 */
export function startingHandProbability(deckSize, groupSize) {
    return hypergeometricAtLeast(deckSize, groupSize, 7, 1);
}
