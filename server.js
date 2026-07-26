const express = require("express");
const fs = require("fs");
const app = express();
let chatHistory = [];
let userMemory = {};

if (fs.existsSync("memory.json")) {
    userMemory = JSON.parse(fs.readFileSync("memory.json"));
}



app.use(express.json());
app.use(express.static("."));

let username = ""

if (fs.existsSync("memory.json")) {
    let memory = JSON.parse(fs.readFileSync("memory.json"));
    username = memory.username || "";
} else {
    fs.writeFileSync("memory.json", JSON.stringify({
        username: ""
    }));
}

const capitals = {

   "afghanistan": "Kabul",
"albania": "Tirana",
"algeria": "Algiers",
"andorra": "Andorra la Vella",
"angola": "Luanda",
"antigua and barbuda": "St. John's",
"argentina": "Buenos Aires",
"armenia": "Yerevan",
"australia": "Canberra",
"austria": "Vienna",
"azerbaijan": "Baku",
"bahamas": "Nassau",
"bahrain": "Manama",
"bangladesh": "Dhaka",
"barbados": "Bridgetown",
"belarus": "Minsk",
"belgium": "Brussels",
"belize": "Belmopan",
"benin": "Porto-Novo",
"bhutan": "Thimphu",
"bolivia": "Sucre",
"bosnia and herzegovina": "Sarajevo",
"botswana": "Gaborone",
"brazil": "Brasília",
"brunei": "Bandar Seri Begawan",
"bulgaria": "Sofia",
"burkina faso": "Ouagadougou",
"burundi": "Gitega",
"cambodia": "Phnom Penh",
"cameroon": "Yaoundé",
"canada": "Ottawa",
"cape verde": "Praia",
"central african republic": "Bangui",
"chad": "N'Djamena",
"chile": "Santiago",
"china": "Beijing",
"colombia": "Bogotá",
"comoros": "Moroni",
"costa rica": "San José",
"croatia": "Zagreb",
"cuba": "Havana",
"cyprus": "Nicosia",
"czech republic": "Prague",
 "democratic republic of the congo": "Kinshasa",
"denmark": "Copenhagen",
"djibouti": "Djibouti",
"dominica": "Roseau",
"dominican republic": "Santo Domingo",
"ecuador": "Quito",
"egypt": "Cairo",
"el salvador": "San Salvador",
"equatorial guinea": "Malabo",
"eritrea": "Asmara",
"estonia": "Tallinn",
"eswatini": "Mbabane",
"ethiopia": "Addis Ababa",
"fiji": "Suva",
"finland": "Helsinki",
"france": "Paris",
"gabon": "Libreville",
"gambia": "Banjul",
"georgia": "Tbilisi",
"germany": "Berlin",
"ghana": "Accra",
"greece": "Athens",
"grenada": "St. George's",
"guatemala": "Guatemala City",
"guinea": "Conakry",
"guinea-bissau": "Bissau",
"guyana": "Georgetown",
"haiti": "Port-au-Prince",
"honduras": "Tegucigalpa",
"hungary": "Budapest",
"iceland": "Reykjavik",
"india": "New Delhi",
"indonesia": "Jakarta",
"iran": "Tehran",
"iraq": "Baghdad",
"ireland": "Dublin",
"israel": "Jerusalem",
"italy": "Rome",
"jamaica": "Kingston",
"japan": "Tokyo",
"jordan": "Amman",
"kazakhstan": "Astana",
"kenya": "Nairobi",
"kiribati": "South Tarawa",
"kuwait": "Kuwait City",
"kyrgyzstan": "Bishkek",
"laos": "Vientiane",
"latvia": "Riga",
"lebanon": "Beirut",
"lesotho": "Maseru",
"liberia": "Monrovia",
"libya": "Tripoli",
"liechtenstein": "Vaduz",
"lithuania": "Vilnius",
"luxembourg": "Luxembourg",
"madagascar": "Antananarivo",
"malawi": "Lilongwe",
"malaysia": "Kuala Lumpur",
"maldives": "Malé",
"mali": "Bamako",
"malta": "Valletta",
"marshall islands": "Majuro",
"mauritania": "Nouakchott",
"mauritius": "Port Louis",
"mexico": "Mexico City",
"micronesia": "Palikir",
"moldova": "Chișinău",
"monaco": "Monaco",
"mongolia": "Ulaanbaatar",
"montenegro": "Podgorica",
"morocco": "Rabat",
"mozambique": "Maputo",
"myanmar": "Naypyidaw",
"namibia": "Windhoek",
"nauru": "Yaren",
"nepal": "Kathmandu",
"netherlands": "Amsterdam",
"new zealand": "Wellington",
"nicaragua": "Managua",
"niger": "Niamey",
"nigeria": "Abuja",
"north korea": "Pyongyang",
"north macedonia": "Skopje",
"norway": "Oslo",
"oman": "Muscat",
"pakistan": "Islamabad",
"palau": "Ngerulmud",
"panama": "Panama City",
"papua new guinea": "Port Moresby",
"paraguay": "Asunción",
"peru": "Lima",
"philippines": "Manila",
"poland": "Warsaw",
"portugal": "Lisbon",
"qatar": "Doha",
"romania": "Bucharest",
"russia": "Moscow",
"rwanda": "Kigali",
"saint kitts and nevis": "Basseterre",
"saint lucia": "Castries",
"saint vincent and the grenadines": "Kingstown",
"samoa": "Apia",
"san marino": "San Marino",
"sao tome and principe": "São Tomé",
"saudi arabia": "Riyadh",
"senegal": "Dakar",
"serbia": "Belgrade",
"seychelles": "Victoria",
"sierra leone": "Freetown",
"singapore": "Singapore",
"slovakia": "Bratislava",
"slovenia": "Ljubljana",
"solomon islands": "Honiara",
"somalia": "Mogadishu",
"south africa": "Pretoria",
"south korea": "Seoul",
"south sudan": "Juba",
"spain": "Madrid",
"sri lanka": "Sri Jayawardenepura Kotte",
"sudan": "Khartoum",
"suriname": "Paramaribo",
"sweden": "Stockholm",
"switzerland": "Bern",
"syria": "Damascus",
"taiwan": "Taipei",
"tajikistan": "Dushanbe",
"tanzania": "Dodoma",
"thailand": "Bangkok",
"timor-leste": "Dili",
"togo": "Lomé",
"tonga": "Nuku'alofa",
"trinidad and tobago": "Port of Spain",
"tunisia": "Tunis",
"turkey": "Ankara",
"turkmenistan": "Ashgabat",
"tuvalu": "Funafuti"
};

const facts = {
    "who is the prime minister of india": "The Prime Minister of India is Narendra Modi.",
    "largest planet": "Jupiter is the largest planet in our Solar System.",
    "fastest animal": "The peregrine falcon is the fastest animal.",
    "largest ocean": "The Pacific Ocean is the largest ocean on Earth.",
    "highest mountain": "Mount Everest is the highest mountain above sea level."
};

app.post("/chat", (req, res) => {

    let userMessage = req.body.message;

let reply = "Iam Nebula AI, your futuristic assistant.";
    
chatHistory.push("User: " + userMessage);

if (userMessage.includes("my favorite game is")) {
    userMemory.favoriteGame = userMessage.replace("my favorite game is", "").trim();
    fs.writeFileSync("memory.json", JSON.stringify(userMemory));
    reply = "I will remember your favorite game.";
}

else if (userMessage.includes("my favorite food is")) {
    userMemory.favoriteFood = userMessage.replace("my favorite food is", "").trim();
    fs.writeFileSync("memory.json", JSON.stringify(userMemory));
    reply = "I will remember your favorite food.";
}

else if (userMessage.includes("my favorite color is")) {
    userMemory.favoriteColor = userMessage.replace("my favorite color is", "").trim();
    fs.writeFileSync("memory.json", JSON.stringify(userMemory));
    reply = "I will remember your favorite color.";
}

else if (userMessage.includes("my hobby is")) {
    userMemory.hobby = userMessage.replace("my hobby is", "").trim();
    fs.writeFileSync("memory.json", JSON.stringify(userMemory));
    reply = "I will remember your hobby.";
}

else if (userMessage.includes("my favorite food is")) {
    userMemory.favoriteFood = userMessage.replace("my favorite food is", "").trim();
    reply = "I will remember your favorite food.";
}

else if (userMessage.includes("my favorite color is")) {
    userMemory.favoriteColor = userMessage.replace("my favorite color is", "").trim();
    reply = "I will remember your favorite color.";
}

else if (userMessage.includes("my hobby is")) {
    userMemory.hobby = userMessage.replace("my hobby is", "").trim();
    reply = "I will remember your hobby.";
}
    else if (userMessage.toLowerCase().includes("what is my favorite game")) {
    reply = "Your favorite game is " + (userMemory.favoriteGame || "not saved yet.");
}

else if (userMessage.toLowerCase().includes("what is my favorite food")) {
    reply = "Your favorite food is " + (userMemory.favoriteFood || "not saved yet.");
}

    else if (userMessage.toLowerCase().includes("time")) {

    let now = new Date();

    reply = "Current time is " + now.toLocaleTimeString();

}

else if (userMessage.toLowerCase().includes("date") || userMessage.toLowerCase().includes("today")) {

    let today = new Date();

    reply = "Today's date is " + today.toDateString();

}

else if (userMessage.toLowerCase().includes("what is my favorite color")) {
    reply = "Your favorite color is " + (userMemory.favoriteColor || "not saved yet.");
}

else if (userMessage.toLowerCase().includes("what is my hobby")) {
    reply = "Your hobby is " + (userMemory.hobby || "not saved yet.");
}

else if (userMessage.includes("what is my favorite food")) {
    reply = "Your favorite food is " + (userMemory.favoriteFood || "not saved yet.");
}

else if (userMessage.includes("what is my favorite color")) {
    reply = "Your favorite color is " + (userMemory.favoriteColor || "not saved yet.");
}

else if (userMessage.includes("what is my hobby")) {
    reply = "Your hobby is " + (userMemory.hobby || "not saved yet.");
}

    else if (userMessage.toLowerCase().includes("forget my memory")) {

    userMemory = {
        favoriteGame: "",
        favoriteFood: "",
        favoriteColor: "",
        hobby: ""
    };

    fs.writeFileSync("memory.json", JSON.stringify(userMemory));

    reply = "I have forgotten your saved memories.";
}

// Calculator
if (/^[0-9+\-*/().\s]+$/.test(userMessage)) {
    try {
        let answer = eval(userMessage);
        reply = "The answer is " + answer;
    } catch {
        reply = "I couldn't calculate that.";
    }
}


    if (userMessage.toLowerCase().includes("my name is")) {
    username = userMessage.split("my name is")[1].trim();

fs.writeFileSync("memory.json", JSON.stringify({
    username: username
}));

reply = "Nice to meet you " + username + "!";
}

if (userMessage.toLowerCase().includes("what is my name")) {
    if (username !== "") {
        reply = "Your name is " + username + ".";
    
    }else

        reply = "I don't know your name yet.";
    }

    if (userMessage.toLowerCase().includes("test")) {
    reply = "TEST WORKING";
}

if (userMessage.toLowerCase().includes("hi") || userMessage.toLowerCase().includes("hello")) {
    reply = "Hello! I am Nebula AI. How can I help you?";
}

if (userMessage.toLowerCase().includes("name")) {
    reply = "My name is Nebula AI, your futuristic assistant.";
}
if (userMessage.toLowerCase().includes("purpose")) {
    reply = "My purpose is to help users with information, ideas, and problem solving.";
}

if (userMessage.toLowerCase().includes("creator")) {
    reply = "I was created as the Nebula AI project, a futuristic assistant concept.";
}

if (userMessage.toLowerCase().includes("what can you do")) {
    reply = "I can answer questions, help with ideas, and assist you with tasks.";
}

if (userMessage.toLowerCase().includes("joke")) {
    reply = "Why did the computer go to the doctor? Because it had a virus!";
}
if (userMessage.toLowerCase().includes("space")) {
    reply = "Space is the huge area beyond Earth containing stars, planets and galaxies.";
}

if (userMessage.toLowerCase().includes("ai")) {
    reply = "AI means Artificial Intelligence. It helps computers perform tasks that usually need human intelligence.";
}
  
if (userMessage.toLowerCase().includes("how are you")) {
    reply = "I am running perfectly and ready to help you!";
}

if (userMessage.toLowerCase().includes("thank")) {
    reply = "You're welcome! I am always here to assist.";
}

if (userMessage.toLowerCase().includes("help")) {
    reply = "I can answer questions, explain topics, and help you with ideas.";
}

if (userMessage.toLowerCase().includes("good morning")) {
    reply = "Good morning! I hope you have a great day.";
}

if (userMessage.toLowerCase().includes("who are you")) {
    reply = "I am Nebula AI, a futuristic assistant created to help users.";
}

if (userMessage.toLowerCase().includes("what can you do")) {
    reply = "I can answer questions, explain topics, and help you with ideas.";
}

if (userMessage.toLowerCase().includes("how are you")) {
    reply = "I am running perfectly and ready to help you!";
}

if (userMessage.toLowerCase().includes("my name is")) {
    username = userMessage.split("my name is")[1].trim();
    reply = "Nice to meet you " + username;
}

else if (userMessage.toLowerCase().includes("what is my name")) {
    reply = "Your name is " + username;
}

if (userMessage.toLowerCase().includes("how are you")) {
    reply = "I am doing great! Thanks for asking. I am always ready to help.";
}

else if (userMessage.toLowerCase().includes("what can you do")) {
    reply = "I can answer questions, remember your name, and chat with you.";
}

if (userMessage.toLowerCase().includes("who made you")) {
    reply = "I was created as Nebula AI, a learning project.";
}

if (reply === "I am Nebula AI, your futuristic assistant.") {
    reply = "I am still learning this topic, I will try...";
}

if (userMessage.toLowerCase().includes("time")) {
    reply = "The current time is " + new Date().toLocaleTimeString();
}

if (userMessage.toLowerCase().includes("date") || userMessage.toLowerCase().includes("today")) {
    reply = "Today's date is " + new Date().toLocaleDateString();
}

for (let question in facts) {
    if (userMessage.toLowerCase().includes(question)) {
        reply = facts[question];
        break;
    }
}

if (userMessage.toLowerCase().includes("good morning")) {
    reply = "Good morning! ☀️ I hope you have a great day.";
}

if (userMessage.toLowerCase().includes("good night")) {
    reply = "Good night! 🌙 Rest well.";
}

if (userMessage.toLowerCase().includes("how old are you")) {
    reply = "I don't have an age like humans, but Nebula AI is a growing project.";
}

if (userMessage.toLowerCase().includes("who are you")) {
    reply = "I am Nebula AI, a futuristic assistant project designed to help and learn.";
}

else if (userMessage.includes("km") && userMessage.includes("meter")) {
    let number = parseFloat(userMessage);
    reply = number + " km = " + (number * 1000) + " meters";
}

else if (userMessage.includes("meter") && userMessage.includes("km")) {
    let number = parseFloat(userMessage);
    reply = number + " meters = " + (number / 1000) + " km";
}

else if (userMessage.includes("tell me a fact")) {
    let facts = [
        "A day on Venus is longer than its year.",
        "Honey never spoils if stored properly.",
        "Octopuses have three hearts."
    ];

    reply = facts[Math.floor(Math.random() * facts.length)];
}

else if (userMessage.includes("gravity")) {
    reply = "Gravity is the force that attracts objects toward each other. Earth's gravity keeps us on the ground.";
}

else if (userMessage.includes("ai")) {
    reply = "AI means Artificial Intelligence. It allows computers to perform tasks that normally need human intelligence.";
}

else if (userMessage.includes("ram")) {
    reply = "RAM is temporary memory in a computer that stores data currently being used by programs.";
}

else if (userMessage.includes("capital of india")) {
    reply = "The capital of India is New Delhi.";
}

else if (userMessage.includes("change my favorite game to")) {
    userMemory.favoriteGame = userMessage.replace("change my favorite game to", "").trim();
    fs.writeFileSync("memory.json", JSON.stringify(userMemory));
    reply = "I updated your favorite game.";
}

else if (userMessage.includes("minecraft")) {
    reply = "Minecraft was created by Markus Persson (Notch) and developed by Mojang.";
}

else if (userMessage.includes("help") || userMessage.includes("what do you know")) {
    reply = "I can help with:\n- Time and date\n- Memory\n- Calculations\n- Unit conversion\n- Facts\n- Jokes\n- General knowledge questions";
}
    
else if (
    userMessage.includes("hello") ||
    userMessage.includes("hi") ||
    userMessage.includes("hey") ||
    userMessage.includes("good morning") ||
    userMessage.includes("good evening")
) {
    reply = "Hello! I am Nebula AI. How can I help you today?";
}

else if (userMessage.includes("what is my favorite game")) {
    reply = "Your favorite game is " + (userMemory.favoriteGame || "not saved yet.");
}

for (let country in capitals) {
    if (userMessage.toLowerCase().includes("capital of " + country)) {
        reply = "The capital of " + country + " is " + capitals[country] + ".";
        break;
    }
 
    if (userMessage.toLowerCase().includes("calculate")) 

    {
        
    let expression = userMessage.replace(/calculate/i, "").trim();

    try {
        reply = "The answer is " + eval(expression);
    } catch {
        reply = "I couldn't solve that calculation.";
    }

}
         else if (userMessage.toLowerCase().includes("thank")) 
    {
    reply = "You're welcome! I am always ready to help.";
}
             
    else if (userMessage.toLowerCase().includes("bye")) {
    reply = "Goodbye! See you again.";
}

    else {
    reply = "I am still learning, but I will try my best to help you.";
}
    
chatHistory.push("Nebula: " + reply);

res.json({
    reply: reply
});

});

app.listen(3000, () => {
    console.log("Nebula AI server running on port 3000");
});
