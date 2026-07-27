export const translations = {
    fr: {
        loading: "Chargement des cartes...",
        allSets: "Toutes",
        filterSetLabel: "Extension",
        allColors: "Toutes",
        allCosts: "Tous",
        filterTypeAll: "Toutes",
        filterTypeMono: "Monocolore",
        filterTypeBi: "Bicolore",
        sortNameAsc: "Nom A-Z",
        sortNameDesc: "Nom Z-A",
        sortCostAsc: "Coût ↑",
        sortCostDesc: "Coût ↓",
        prevBtn: "← Précédent",
        nextBtn: "Suivant →",
        page: "Page",
        of: "sur",
        modalTitle: "Détails de la carte",
        prevVariantText: "← Variante précédente",
        nextVariantText: "Variante suivante →",
        colorNames: {
            Amber: "Ambre", Amethyst: "Améthyste", Emerald: "Émeraude",
            Ruby: "Rubis", Sapphire: "Saphir", Steel: "Acier"
        },
        types: { Character: "Personnage", Action: "Action", Item: "Objet", Location: "Lieu" },
        rarities: { Common: "Commune", Uncommon: "Inhabituelle", Rare: "Rare", "Super Rare": "Super Rare", Legendary: "Légendaire", Enchanted: "Enchantée", Special: "Spéciale" }
    },
    en: {
        loading: "Loading cards...",
        allSets: "All",
        filterSetLabel: "Set",
        allColors: "All",
        allCosts: "All",
        filterTypeAll: "All",
        filterTypeMono: "Monocolor",
        filterTypeBi: "Bicolor",
        sortNameAsc: "Name A-Z",
        sortNameDesc: "Name Z-A",
        sortCostAsc: "Cost ↑",
        sortCostDesc: "Cost ↓",
        prevBtn: "← Previous",
        nextBtn: "Next →",
        page: "Page",
        of: "of",
        modalTitle: "Card Details",
        prevVariantText: "← Previous Variant",
        nextVariantText: "Next Variant →",
        colorNames: {
            Amber: "Amber", Amethyst: "Amethyst", Emerald: "Emerald",
            Ruby: "Ruby", Sapphire: "Sapphire", Steel: "Steel"
        },
        types: { Character: "Character", Action: "Action", Item: "Item", Location: "Location" },
        rarities: { Common: "Common", Uncommon: "Uncommon", Rare: "Rare", "Super Rare": "Super Rare", Legendary: "Legendary", Enchanted: "Enchanted", Special: "Special" }
    },
    de: {
        loading: "Karten werden geladen...",
        allSets: "Alle",
        filterSetLabel: "Edition",
        allColors: "Alle",
        allCosts: "Alle",
        filterTypeAll: "Alle",
        filterTypeMono: "Monofarbig",
        filterTypeBi: "Zweifarbig",
        sortNameAsc: "Name A-Z",
        sortNameDesc: "Name Z-A",
        sortCostAsc: "Kosten ↑",
        sortCostDesc: "Kosten ↓",
        prevBtn: "← Zurück",
        nextBtn: "Weiter →",
        page: "Seite",
        of: "von",
        modalTitle: "Kartendetails",
        prevVariantText: "← Vorherige Variante",
        nextVariantText: "Nächste Variante →",
        colorNames: {
            Amber: "Bernstein", Amethyst: "Amethyst", Emerald: "Smaragd",
            Ruby: "Rubin", Sapphire: "Saphir", Steel: "Stahl"
        },
        types: { Character: "Charakter", Action: "Aktion", Item: "Gegenstand", Location: "Ort" },
        rarities: { Common: "Gewöhnlich", Uncommon: "Ungewöhnlich", Rare: "Selten", "Super Rare": "Super Selten", Legendary: "Legendär", Enchanted: "Episch", Special: "Spezial" }
    },
    it: {
        loading: "Caricamento carte...",
        allSets: "Tutte",
        filterSetLabel: "Espansione",
        allColors: "Tutti",
        allCosts: "Tutti",
        filterTypeAll: "Tutte",
        filterTypeMono: "Monocolore",
        filterTypeBi: "Bicolore",
        sortNameAsc: "Nome A-Z",
        sortNameDesc: "Nome Z-A",
        sortCostAsc: "Costo ↑",
        sortCostDesc: "Costo ↓",
        prevBtn: "← Precedente",
        nextBtn: "Successivo →",
        page: "Pagina",
        of: "di",
        modalTitle: "Dettagli Carta",
        prevVariantText: "← Variante precedente",
        nextVariantText: "Variante successiva →",
        colorNames: {
            Amber: "Ambra", Amethyst: "Ametista", Emerald: "Smeraldo",
            Ruby: "Rubino", Sapphire: "Zaffiro", Steel: "Acciaio"
        },
        types: { Character: "Personaggio", Action: "Azione", Item: "Oggetto", Location: "Luogo" },
        rarities: { Common: "Comune", Uncommon: "Non Comune", Rare: "Rara", "Super Rare": "Super Rara", Legendary: "Leggendaria", Enchanted: "Incantata", Special: "Speciale" }
    }
};

export const colorHexMap = {
    Amber: '#ffaa00', Amethyst: '#a855f7', Emerald: '#10b981',
    Ruby: '#ef4444', Sapphire: '#3b82f6', Steel: '#94a3b8'
};

export const colorOrder = ['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'];

export const colorSVGDataURIs = {
    Amber: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#f4b223}.st1{fill:#c9b78d;fill-rule:evenodd}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st1" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st0" d="M8.3,21.9c.1.3.2.6.3.8.7-.9,1.3-1.7,1.9-2.4-.6-1.8-1.1-3.4-1.4-4.8l1.1-.7c-.2-1-.4-1.9-.5-2.8-.7.4-2.8,1.6-3.6,2.1.4,2.5,1,5,2.1,7.7Z"/><path class="st0" d="M9.8,27.3c.2-.3.4-.6.6-.9.6-.8,1.2-1.6,1.7-2.3.4-.5.8-1,1.1-1.4-.5-.8-.9-1.7-1.3-2.6-1.2,1.4-2.2,2.7-3.5,4.4-.8,1.1-1.5,2.1-2.3,3.2,1.9,1.7,4.1,3.1,6.5,3.8-1.1-1.3-2.1-2.7-3-4.3Z"/><path class="st0" d="M20.3,15.6c-.8-.7-1.5-1.3-2-1.8-.7.6-2,1.7-2.8,2.5.3.9.7,1.8,1.1,2.6.6-.6,1.2-1.2,1.7-1.7.5.5,1.1,1,1.7,1.7.4-.9.8-1.8,1.1-2.6-.3-.3-.5-.5-.8-.8Z"/><path class="st0" d="M26.1,20.3c.6.7,1.2,1.5,1.9,2.4,1.2-2.9,2-5.8,2.4-8.5-.8-.4-2.8-1.6-3.6-2.1-.1.9-.3,1.8-.5,2.8l1.1.7c-.3,1.4-.7,3-1.4,4.8Z"/><path class="st0" d="M21.4,32.7c.3-.2.5-.5.7-.7,1.3-1.4,2.5-3,3.5-4.7-.6-.8-1.2-1.6-1.7-2.3-.5.9-1.1,1.9-1.7,2.7-.8-.6-1.5-1.3-2.2-2-.6-.6-1.2-1.3-1.8-2-1.5-2-2.8-4.3-3.6-6.6-.2-.6-.4-1.2-.6-1.8-.2-.8-.4-1.6-.6-2.4l4.7-2.7,4.7,2.7c-.2,1.2-.6,2.5-1,3.9,0,.1,0,.2-.1.3-.4,1.2-1,2.4-1.6,3.5-.4.8-.9,1.5-1.4,2.2.5.7,1.1,1.4,1.8,2.1,2.1-2.9,3.7-6.4,4.6-9.8.3-1.3.5-2.5.7-3.6-2.3-1.3-5.4-3.1-7.6-4.4-2.3,1.3-5.4,3.1-7.6,4.4.1,1.3.4,2.7.8,4.2,0,.3.2.6.3,1,1.4,4.5,3.9,8.6,7.3,11.8.5.4,1,.9,1.5,1.2-.7.8-1.5,1.5-2.3,2.2-.8-.7-1.6-1.4-2.3-2.2.5-.4,1.1-.9,1.6-1.3-.6-.6-1.2-1.3-1.8-2-.5.4-1,.9-1.5,1.3-.6-.8-1.2-1.7-1.7-2.7-.6.7-1.1,1.5-1.7,2.3.2.3.4.6.6.9.9,1.4,1.9,2.6,3,3.8,1.2,1.2,2.4,2.2,3.8,3.2,1.1-.8,2.1-1.5,3.1-2.4Z"/><path class="st0" d="M26.9,27.3c-.2-.3-.4-.6-.6-.9-.6-.8-1.2-1.6-1.7-2.3-.4-.5-.8-1-1.1-1.4.5-.8.9-1.7,1.3-2.6,1.2,1.4,2.2,2.7,3.5,4.4.8,1.1,1.5,2.1,2.3,3.2-1.9,1.7-4.1,3.1-6.5,3.8,1.1-1.3,2.1-2.7,3-4.3Z"/></svg>`),
    Amethyst: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#c9b78d;fill-rule:evenodd}.st1{fill:#7c4182}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st0" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st1" d="M27.9,29.7c1.7-1.9,2.5-4.3,2.5-6.6,0-3.3-1.2-5.8-1.5-6.5-.2-.7.3-1,.9-.4.2.2.4.4.5.6-.3-1-.8-2.2-2-3.1-2.8-2-6.1-1.9-6.5-1.9-.4,0-1-.2,0-.6.4-.1.8-.2,1.1-.1-1-.6-2.8-.9-4.9,0-2.3.9-3.3,2.9-3.6,3.5-.3.6-.3,1-.5.8-.3-.2-.2-.8-.2-.8,0,0,0-.3.3-.8-.5.4-1.5,1.6-1.5,3.4s1.9,3.8,1.9,3.8c0,0,.6-.2,1.5,0-1,.1-1.5.8-1.7,1.2-.3.5-1.8,1.2-3-.7-.7-1.1-.3-2.4,0-3.1-.3.1-.6.3-.9.7,0-.9.2-3.3,1.6-5.3,1.9-2.5,4.4-3.7,4.4-3.7,1.5-.9,3.3-1.2,4.5-1.3-2.5-.5-5,0-7,1.1-2.8,1.6-4.4,4-4.9,4.5-.5.6-1,.3-.8-.6,0-.3.2-.6.3-.8-.7.7-1.5,1.8-1.6,3.3-.4,3.5,1.4,6.3,1.6,6.6.2.3.3,1-.5.3-.3-.3-.5-.6-.7-.9,0,1.2.7,2.9,2.5,4.3,2,1.5,4.2,1.4,4.8,1.3.7,0,1-.2,1,0,0,.3-.6.6-.6.6,0,0-.3.2-.9.2.6.2,2.1.5,3.7-.4,2.1-1.2,2.4-3.5,2.4-3.5,0,0-.5-.4-.8-1.3.6.8,1.4.9,1.9.9.5,0,2,1,.8,2.9-.6,1.1-1.9,1.5-2.7,1.6.2.2.6.4,1,.5-.8.4-2.9,1.5-5.4,1.2-3.1-.4-5.4-2-5.4-2-1.5-.9-2.7-2.3-3.4-3.3.8,2.4,2.5,4.3,4.5,5.5,2.8,1.6,5.7,1.9,6.4,2,.7.1.7.7-.1,1-.3.1-.6.1-.8.1,1,.3,2.3.4,3.6-.2,3.2-1.4,4.8-4.3,4.9-4.7.2-.3.7-.7.5.3,0,.4-.3.8-.4,1.1,1-.6,2.2-2,2.5-4.3.3-2.5-.8-4.3-1.3-4.9-.4-.6-.7-.7-.4-.9.3-.2.8.2.8.2,0,0,.3.1.6.7-.1-.6-.6-2.1-2.2-3-2.1-1.2-4.3-.3-4.3-.3,0,0,0,.6-.7,1.3.4-.9,0-1.7-.2-2.1-.3-.5-.1-2.2,2.1-2.2,1.3,0,2.2.9,2.7,1.5,0-.3,0-.7-.1-1.1.8.4,2.8,1.8,3.8,4.1,1.2,2.9,1,5.7,1,5.7,0,1.7-.6,3.4-1.1,4.5Z"/></svg>`),
    Emerald: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#329044}.st1{fill:#c9b78d;fill-rule:evenodd}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st1" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st0" d="M18.3,17.3h0c0,.1,0,0,0,0,.6-2.5,2.1-4.7,4.1-6h0s0,0,0,0c-1.8-.8-3.3-2.3-4.1-4.1h0c0,0,0,0,0,0-.8,1.8-2.3,3.3-4.1,4.1h0s0,0,0,0c2,1.3,3.5,3.4,4.1,6Z"/><path class="st0" d="M30.4,27.6v-4.2h0c-.7.4-1.7.6-2.8.6-2.4,0-5.3-1.5-6.9-2.3l.4.5c.2.2.4.5.6.8.6.8,1.4,1.7,1.9,2.3,1,1.1,3.1,2.9,6,2.8.1,0,.2,0,.3,0,.3-.1.5-.3.5-.4Z"/><path class="st0" d="M25.5,22.8c.8.2,1.6.3,2.3.3,1.1,0,2-.3,2.6-.7,0,0,0,0,0,0-.8-2.4-2.1-4.3-4-5.5-.6-.4-1.3-.7-1.8-.9,0,0,1.3,1.4,1.5,3.7.1,1.8-.7,3-.7,3Z"/><path class="st0" d="M16,19.5c1.5,2.1,2.5,4.8,2.8,7.6.4,3.7-.1,6.6-.5,8.1l10.6-6.1h-.2c-2.9-.2-4.9-2-5.9-3.2-.5-.6-1.2-1.5-1.9-2.3-.4-.5-.8-1-1.1-1.4-.9-1.2-2.2-2.3-2.8-2.8-1.4-1.2-2.5-1.8-3.2-2.1.8.6,1.5,1.4,2.1,2.3Z"/><path class="st0" d="M18,28.8h0c-1.8.5-3.8-.3-4.7-1.7-.9-1.4-.5-2.9-.4-3.4-1,.6-3.1,2-2.1,5.1h0c.1.4.4,1.3,1.2,2.2.4.5,1.3,1.3,4,2.9l1.3.7s0,0,.1,0c.3-1.2.7-3.3.5-5.9Z"/><path class="st0" d="M9.9,29h0c-.8-2.7.3-4.2,1.2-5.2.6-.6,1.2-1,1.6-1.3-1.1-.3-2.2-.3-3.2.2-2,.8-3.1,2.3-3.2,4.3,0,.3,0,.5,0,.7,0,0,0,.1,0,.1,0,.1.1.2.2.3,0,0,0,0,.1,0,0,0,3,1.7,4.3,2.5-.6-.8-.8-1.5-.9-1.8Z"/><path class="st0" d="M9.1,21.9c1.7-.7,3.6-.6,5.4.4.2.1.4.2.6.4.6.3,1,.7,1.2.9.6.5,1,1.1,1.2,1.3,0-.1,0-.2,0-.4-.2-.6-.4-1.2-.6-1.7-.2-.5-.5-1.1-.8-1.6-.3-.5-.6-.9-.9-1.4-.3-.4-.6-.8-1-1.2-.3-.3-.7-.6-1.1-.9-.4-.2-.7-.5-1.1-.6-.3-.1-.6-.2-1-.3-.3,0-.7,0-1,0,0,0-.2,0-.2,0-.4,0-.8.2-1.2.4-.3.2-.7.4-1,.6-.3.2-.5.4-.7.6-.2.1-.4.3-.5.5h0c-.1.1-.2.3-.2.4v4.6c.6-.9,1.5-1.7,2.9-2.3Z"/><path class="st0" d="M28.2,15.2c-1.3-1.6-2.9-2.9-4.3-3.4h0s0,0-.2,0c-1.6.7-2.7,2-3.2,2.8.2,0,.3,0,.3,0h0c.5,0,1,0,1.5,0,.2,0,.5,0,.9.1.5,0,1.9.4,3.4,1.3,1.1.7,2.6,2,3.7,4.1,0-1.4-.9-3.3-2.2-4.9Z"/></svg>`),
    Ruby: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#c9b78d;fill-rule:evenodd}.st1{fill:#d50037}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st0" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st1" d="M21.6,11.8c-3.6,8.1-13.5,14.9-16.7,17,3.4-1.8,14.3-6.9,23.1-6-2.3,5.2-5.7,9-9.8,12.3l12.1-7v-14l-12.1-7-12.1,7c4.9-1.9,9.9-3,15.6-2.4Z"/><path class="st1" d="M12.8,16.6c.6,1.1-2.8,5.4-7.5,8.4,2.4-1.2,6.1-3.8,8.9-6.2,2-1.6,3.2-3.3,4.4-5.2-4.4.1-8.3,1.5-11.6,3.1,3.2-1,5.4-.9,5.9-.2Z"/><path class="st1" d="M19.4,28c-.6-1.1-6.1-.3-11,2.3,2.2-1.5,6.4-3.3,9.8-4.6,2.4-.9,4.4-1.1,6.7-1.2-2.3,3.7-5.5,6.4-8.5,8.5,2.5-2.3,3.5-4.2,3.1-5Z"/></svg>`),
    Sapphire: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#c9b78d;fill-rule:evenodd}.st1{fill:#0093c9}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st0" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st1" d="M27.4,20.4c-2.5-2.8-5.5-4.5-6.8-5.2,5.1-1.9,6.8,0,6.8,0,1.2,1.1.4,2.7,0,3.5.6.6,1.1,1.1,1.4,1.6.6-.9,1.3-2.1,1.5-3.4.4-2.8-1.9-6.4-10.6-3.4-5.1,1.8-8.2,4.3-10,6.1-1.5-2.2-1.5-4,.3-4.9,1.1-.5,2.8-.4,4.4,0,.3-.2,1.2-.7,2.5-1.3-4-1.6-8.9-1.6-10.3.9-1.7,3,2.6,7.5,2.6,7.5,2.5,2.8,5.5,4.5,6.8,5.2-5.1,1.9-6.8,0-6.8,0-1.1-1.1-.4-2.7,0-3.5-.6-.6-1.1-1.1-1.4-1.6-.6.9-1.3,2.1-1.5,3.4-.4,2.8,1.9,6.4,10.6,3.4,5.1-1.8,8.2-4.3,10-6.1,1.5,2.2,1.6,4-.3,4.9-1.1.5-2.8.4-4.4,0-.3.2-1.2.7-2.5,1.3,4,1.6,8.9,1.6,10.3-.9,1.7-3-2.6-7.5-2.6-7.5ZM13.8,23.6c-1-.7-2-1.6-2.9-2.5,1-.9,2-1.8,2.9-2.5,1.3-.9,2.5-1.3,3.3-1.4,0,2.2-.9,3.4-2.2,3.9,1.3.5,2.1,1.7,2.2,3.9-.8-.1-2-.5-3.3-1.4ZM22.7,23.6c-1.3.9-2.5,1.3-3.3,1.4,0-2.2.9-3.4,2.2-3.9-1.3-.5-2.1-1.7-2.2-3.9.8.1,2,.5,3.3,1.4,1,.7,2,1.6,2.9,2.5-1,.9-2,1.8-2.9,2.5Z"/><path class="st1" d="M18.3,29.3c-.7.3-1.3.5-1.9.7-.7.2-1.4.4-1.9.6l3.8,4.5,3.8-4.5c-1.1-.2-2.4-.6-3.8-1.3Z"/><path class="st1" d="M18.2,13c.7-.3,1.3-.5,1.9-.7.7-.2,1.4-.4,1.9-.6l-3.8-4.5-3.8,4.5c1.1.2,2.4.6,3.8,1.3Z"/></svg>`),
    Steel: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.7 42.4"><defs><style>.st0{fill:#97a3ae}.st1{fill:#c9b78d;fill-rule:evenodd}.st2{fill:#292a47}</style></defs><path class="st2" d="M0,10.6v21.2l18.4,10.6,18.4-10.6V10.6L18.4,0,0,10.6Z"/><path class="st2" d="M1.8,11.6v19.1l16.5,9.5,16.5-9.5V11.6L18.3,2.1,1.8,11.6Z"/><path class="st1" d="M3,30l15.3,8.8,15.3-8.8V12.3L18.3,3.5,3,12.3v17.7ZM18.3,2.1l16.5,9.5v19.1l-16.5,9.5L1.8,30.7V11.6L18.3,2.1Z"/><path class="st0" d="M30.5,24.2l-1.5-.8v-4.2l1-1.2v-3.6l-4.7-2.7v9.6l-1.5-.9v-10.2l-4.7-2.7v20.1l4.5-4.4-2.4,5.2,6.3-1.3-9.1,5-9.1-5,6.3,1.3-2.4-5.2,4.5,4.4V7.5l-4.7,2.7v10.2l-1.5.9v-9.6l-4.7,2.7v3.6l1,1.2v4.2l-1.5.8v3.9l12.1,7,12.1-7v-3.9Z"/></svg>`)
};

export const costHexSVG = "data:image/svg+xml," + encodeURIComponent(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><polygon points="24,56 100,12 176,56 176,144 100,188 24,144" fill="#000000" stroke="#d4b889" stroke-width="12" /></svg>`);

export const inkwellSVG = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 112"><path fill="#000" d="M63.6 16.5l29.4 17v34L63.6 89.5l-29.3-17v-34l29.3-16.9z"/><path fill="#d4b889" d="M63.6 16.5l34 19.6v39.1l-34 19.6-33.9-19.6V36.1l34-19.6zm0 5.2l29.4 17v34L63.6 89.5l-29.3-17v-34l29.3-16.9zM66.4 96.5L97 78.8a.6.6 0 01.9.6c-.6 5.4-2.9 19.9-8.5 24.8-.9.7-1.7 1.6-2.8 2.1a55 55 0 01-23 5h-.3a55.7 55.7 0 01-50-32 1 1 0 011.4-1.3 82 82 0 0033.4 11.4c.7 0 1.3.2 1.8.5l11.6 7s1 3.5 1.9 4.6c0 0 .5-2.2 3-5zM100 52.2a.6.6 0 01-.3-.5V39.4a.6.6 0 011-.5c5 2.9 16 15 14.1 38 0 .5 0 .8-.2 1.2A55.9 55.9 0 0198 99.4a.8.8 0 01-1.2-1 54 54 0 003.6-22v-18a391 391 0 014.4-3.7c-.7-.2-3.2-1.4-4.8-2.5zM10 70.1c-.5-1.9-1-3.7-1.2-5.7-1.2-4-6.3-7.4-8.4-8.6a.5.5 0 010-1c5.5-2.3 7.7-6 8.1-6.7A76 76 0 0027 75.8v.5c0 .4.1.7.4.8l15 7.7V86h-.1A61 61 0 019.9 70.1zM27.6 60v11.3c0 .3-.1.5-.4.6s-1.2-.3-1.4-.5c-1.7-1.8-4.4-5.3-9-12.2a36.1 36.1 0 01-6.5-19.3 55.8 55.8 0 0140-38.3.5.5 0 01.5.9 50.6 50.6 0 00-18 29.6L28 34.4a1 1 0 00-.4.8V52a20 20 0 01-5.3 2.5s4 3.2 5.2 5.5zm72.8-25a1 1 0 00-.5-.8L79.8 22.5a.3.3 0 01.1-.6c20.6-1.1 30.1 5.8 33.5 9l.4.7c2.5 5 4.1 10.5 5 16.3 0 0 2 4.3 8.2 7a.5.5 0 010 .9c-2.1 1.2-7.2 4.5-8.4 8.6a1 1 0 01-1.9 0c0-1.8-.2-3.7-.4-5.8A36.9 36.9 0 00100.4 35zM61.6 14.7L36.4 29a.3.3 0 01-.4-.3C39 13.7 52.5 4.4 55.8 2L58.5.3l.6-.1 4.5-.2h.4a55.6 55.6 0 0146.6 25.8v.4a66.9 66.9 0 00-36.1-6.8l-8.2-4.7c-1.7-1.9-2.7-5.4-2.7-5.4-1.4 1.1-2 5.4-2 5.4z"/></svg>`);
