const cache = {}; // Stores autocomplete results

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cardName").addEventListener("input", handleAutocomplete);
    document.getElementById("searchBtn").addEventListener("click", fetchCardData);
});

// Autocomplete function
async function handleAutocomplete(event) {
    const query = event.target.value.trim();
    if (!query) return;

    if (cache[query]) return displaySuggestions(cache[query], query); // Use cache if available

    const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    cache[query] = data.data; // Store in cache
    displaySuggestions(data.data, query);
}

// Displays suggestions with highlights
function displaySuggestions(suggestions, query) {
    const suggestionBox = document.getElementById("suggestions");
    suggestionBox.innerHTML = "";

    suggestions.forEach(name => {
        const item = document.createElement("li");
        item.innerHTML = name.replace(new RegExp(`(${query})`, "gi"), "<strong>$1</strong>");
        item.addEventListener("click", () => {
            document.getElementById("cardName").value = name;
            suggestionBox.innerHTML = ""; // Clear suggestions
        });
        suggestionBox.appendChild(item);
    });
}

// Fetches card details
async function fetchCardData() {
    const cardName = document.getElementById("cardName").value.trim();
    if (!cardName) return alert("Please enter a card name.");

    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`);
    const cardData = await response.json();
    
    if (cardData.object === "error") return document.getElementById("cardDetails").innerHTML = "<p>Card not found.</p>";

    document.getElementById("cardDetails").innerHTML = `
        <h2>${cardData.name}</h2>
        <img src="${cardData.image_uris?.normal}" alt="${cardData.name}">
        <p><strong>Mana Cost:</strong> ${cardData.mana_cost}</p>
        <p><strong>Type:</strong> ${cardData.type_line}</p>
        <p><strong>Oracle Text:</strong> ${cardData.oracle_text}</p>
    `;
}
