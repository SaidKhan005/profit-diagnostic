(function () {
    'use strict';

    // ── STATE ──────────────────────────────────────────
    var state = {
        currentQuestion: 0,
        answers: [],
        scores: { demand: 0, capacity: 0, experience: 0, behavior: 0, menu: 0, labor: 0 },
        started: false,
        completed: false
    };

    // ── QUESTIONS ──────────────────────────────────────
    var questions = [
        {
            text: "On a typical weeknight, how full is your dining room during your busiest hour?",
            options: [
                { text: "Less than half full. We struggle to get people in the door.", scores: { demand: 3 } },
                { text: "About half full. Some nights are decent, others are dead.", scores: { demand: 2 } },
                { text: "Mostly full. We could handle more but it\u2019s pretty good.", scores: { demand: 1 } },
                { text: "Packed. We turn people away or have long waits regularly.", scores: { capacity: 2 } }
            ]
        },
        {
            text: "Where do most of your new guests come from?",
            options: [
                { text: "Honestly, I\u2019m not sure. They just walk in.", scores: { demand: 2 } },
                { text: "Mostly word of mouth from regulars.", scores: { experience: 1 } },
                { text: "We run deals and promotions to bring people in.", scores: { behavior: 1, menu: 1 } },
                { text: "We have a strong local presence and reputation.", scores: {} }
            ]
        },
        {
            text: "During your busiest service, what happens to food quality and timing?",
            options: [
                { text: "Ticket times stretch, food sits in the window, mistakes go up.", scores: { capacity: 3 } },
                { text: "We hold it together but the team is visibly stressed.", scores: { capacity: 2, labor: 1 } },
                { text: "Consistent. The kitchen handles volume well.", scores: {} },
                { text: "We rarely get busy enough for this to be an issue.", scores: { demand: 2 } }
            ]
        },
        {
            text: "Think about first-time guests. What percentage would you estimate come back within 60 days?",
            options: [
                { text: "Very few. Most are one-and-done.", scores: { experience: 3 } },
                { text: "Maybe a quarter come back. Not great.", scores: { experience: 2 } },
                { text: "About half return. Decent but could be better.", scores: { experience: 1 } },
                { text: "Most come back. We have strong repeat business.", scores: {} }
            ]
        },
        {
            text: "How do you feel about your average check (spend per guest)?",
            options: [
                { text: "It\u2019s low. Guests order the minimum and leave.", scores: { behavior: 3 } },
                { text: "It\u2019s okay, but guests rarely order drinks, desserts, or extras.", scores: { behavior: 2 } },
                { text: "It\u2019s decent. Some servers get higher checks than others.", scores: { behavior: 1, labor: 1 } },
                { text: "It\u2019s strong. Guests explore the menu and add on naturally.", scores: {} }
            ]
        },
        {
            text: "When a guest sits down, how does your team handle the ordering process?",
            options: [
                { text: "They take the order. Not much guidance or recommendation.", scores: { behavior: 2, labor: 1 } },
                { text: "Some servers suggest things, but it\u2019s inconsistent.", scores: { behavior: 1, labor: 1 } },
                { text: "We have scripts or prompts but not everyone follows them.", scores: { labor: 2 } },
                { text: "The team actively guides guests through the menu. Recommendations are consistent.", scores: {} }
            ]
        },
        {
            text: "Do you know which menu items make you the most money and which ones lose money?",
            options: [
                { text: "Not really. I price based on gut feel or competitors.", scores: { menu: 3 } },
                { text: "I know my food cost percentages, but not profit per item.", scores: { menu: 2 } },
                { text: "I have a rough idea, but I haven\u2019t done a full menu analysis.", scores: { menu: 1 } },
                { text: "Yes. I\u2019ve engineered my menu and know my stars, plowhorses, and dogs.", scores: {} }
            ]
        },
        {
            text: "What do your bestsellers look like?",
            options: [
                { text: "Our most popular items are our cheapest items.", scores: { menu: 2, behavior: 1 } },
                { text: "Guests tend to cluster around the same 3\u20134 dishes. Not much variety.", scores: { menu: 2 } },
                { text: "There\u2019s a good spread, but I\u2019m not sure if the popular ones are profitable.", scores: { menu: 1 } },
                { text: "Our bestsellers are also our most profitable items.", scores: {} }
            ]
        },
        {
            text: "How would you describe your staffing on a typical busy night?",
            options: [
                { text: "Understaffed. The team is stretched thin and it shows.", scores: { labor: 3, experience: 1 } },
                { text: "We have enough people, but they\u2019re not in the right positions.", scores: { labor: 2 } },
                { text: "Overstaffed. Labor costs are high but I\u2019m afraid to cut.", scores: { labor: 2, menu: 1 } },
                { text: "Well-matched. The right people in the right roles for the volume.", scores: {} }
            ]
        },
        {
            text: "What keeps you up at night about your restaurant\u2019s finances?",
            options: [
                { text: "Revenue is too low. I need more guests.", scores: { demand: 2 } },
                { text: "Revenue is fine, but there\u2019s nothing left at the end of the month.", scores: { menu: 2, labor: 1 } },
                { text: "I\u2019m busy but it doesn\u2019t feel sustainable. My team is burning out.", scores: { capacity: 2, labor: 1 } },
                { text: "I feel like there\u2019s money being left on the table every shift but I can\u2019t pinpoint where.", scores: { behavior: 2, menu: 1 } }
            ]
        }
    ];

    // ── MAX SCORES (for percentage calc) ──────────────
    var maxScores = { demand: 11, capacity: 9, experience: 7, behavior: 11, menu: 11, labor: 10 };

    // ── CATEGORY LABELS ───────────────────────────────
    var categoryLabels = {
        demand: 'Demand',
        capacity: 'Capacity',
        experience: 'Guest Experience',
        behavior: 'Check Average',
        menu: 'Menu Economics',
        labor: 'Labor Efficiency'
    };

    // ── CATEGORY ICONS ────────────────────────────────
    var categoryIcons = {
        demand: '\uD83D\uDCCA',
        capacity: '\u26A1',
        experience: '\uD83D\uDD04',
        behavior: '\uD83D\uDCB0',
        menu: '\uD83C\uDF7D\uFE0F',
        labor: '\uD83D\uDC65',
        mixed: '\uD83D\uDD0D'
    };

    // ── RESULTS DATA ──────────────────────────────────
    var results = {
        demand: {
            headline: 'Your #1 Bottleneck: Demand',
            explanation: 'Your restaurant has the capacity to serve more guests than it\u2019s currently attracting. Before optimizing operations, menus, or staffing, the priority is filling the room. Empty seats are the most expensive problem in the restaurant business because your fixed costs run whether the tables are full or not.',
            steps: [
                '<strong>Build a named offer for your slowest daypart.</strong> Not a discount. A packaged experience with a clear name and reason to visit. Example: "Tuesday Supper Club" or "Weeknight Power Pair." Make it specific enough that a guest could tell a friend about it in one sentence.',
                '<strong>Audit your digital front door.</strong> Google your restaurant right now. Is the menu current? Are hours correct? Do photos look appealing? Are recent reviews responded to? Fix every friction point between "I\u2019m interested" and "I\u2019m walking in."',
                '<strong>Launch one local partnership this month.</strong> Reach out to a nearby hotel, office building, or community group. Offer a private tasting or group rate. One consistent source of 20 new covers per week changes the math entirely.'
            ],
            cta: 'Want a full breakdown of where your demand gaps are and a prioritized plan to fill them? The Peak Profit Audit gives you exactly that.'
        },
        capacity: {
            headline: 'Your #1 Bottleneck: Capacity',
            explanation: 'You have the guests. The demand is there. But your operation is struggling to serve the volume without quality breaking down. When capacity is the bottleneck, the fix is not "try harder." It\u2019s redesigning how the restaurant handles volume so that quality holds under pressure.',
            steps: [
                '<strong>Measure your Capacity Load Ratio.</strong> Take your peak-hour covers and divide by the maximum your kitchen and floor can handle at full quality. If that number is above 0.90, you\u2019re overloaded and guest experience is degrading even if you don\u2019t feel it yet.',
                '<strong>Stagger your seating.</strong> If your host seats 8 tables in 15 minutes and then nothing for 30, your kitchen gets slammed then idles. Spreading arrivals evenly across the service window smooths the pressure on every station.',
                '<strong>Identify your slowest station.</strong> Time each kitchen station during a busy service. The one with the longest ticket time is your constraint. Everything else waits for it. Fix that station first\u2014whether it means prep changes, equipment, or staffing.'
            ],
            cta: 'The Peak Profit Audit maps your exact capacity constraint and gives you a sequenced plan to increase throughput without sacrificing guest experience.'
        },
        experience: {
            headline: 'Your #1 Bottleneck: Guest Experience',
            explanation: 'Your guests are coming in, but not enough are coming back. Something in the visit itself isn\u2019t converting first-timers into regulars. The issue is rarely one catastrophic failure. It\u2019s usually a collection of small friction points that add up to a forgettable experience.',
            steps: [
                '<strong>Track your 60-day repeat rate.</strong> Pull data from your POS or reservation system. What percentage of first-time guests return within 60 days? Below 30% means the experience isn\u2019t earning trust. This is the single most important number you\u2019re probably not tracking.',
                '<strong>Secret-shop your own restaurant.</strong> Send someone in as a first-time guest on a busy Friday. Have them document everything: greeting time, drink speed, recommendations made, farewell quality. The report will reveal friction you\u2019ve normalized.',
                '<strong>Fix the first 90 seconds and the last 90 seconds.</strong> Guests remember the beginning and end most vividly. Nail the greeting (immediate acknowledgement, eye contact, warmth) and the farewell (genuine thank-you, invitation to return). The bookends determine whether they come back.'
            ],
            cta: 'The Peak Profit Audit identifies exactly where your guest experience breaks down and gives you the specific operational fixes in priority order.'
        },
        behavior: {
            headline: 'Your #1 Bottleneck: Check Average',
            explanation: 'Your guests are visiting, but spending less than they could. This isn\u2019t about raising prices. It\u2019s about framing, guiding, and creating opportunities for guests to explore more of what you offer. Restaurants that fix behavior constraints typically see 15\u201325% check average increases without changing a single menu price.',
            steps: [
                '<strong>Implement a "First 30 Seconds" drink prompt.</strong> The highest-impact behavior change is getting a drink order before the food order. Train every server to lead with a specific recommendation: "We just tapped a new local IPA\u2014can I start you with one?" A specific suggestion outperforms "can I get you something to drink?" significantly.',
                '<strong>Benchmark your top server\u2019s check average.</strong> Pull check averages by server. Your best server is likely 20\u201340% higher than your worst. Study what they do differently\u2014it\u2019s almost always recommendations, pacing, and enthusiasm. Build training around their approach.',
                '<strong>Add one guided pairing or bundle.</strong> Create a "chef\u2019s recommendation" pairing (entree + drink + side) at a price point 15\u201320% above your current average check. Position it as the easy choice, not the expensive choice. Guests who are unsure what to order gravitate toward curated options.'
            ],
            cta: 'The Peak Profit Audit breaks down your check average by server, daypart, and item mix to show you exactly where the missed revenue is hiding.'
        },
        menu: {
            headline: 'Your #1 Bottleneck: Menu Economics',
            explanation: 'Your menu may be popular, but it\u2019s not engineered for profit. You could be selling high volumes of items that barely contribute to your bottom line while your most profitable items sit ignored. Menu economics isn\u2019t about food cost percentage\u2014it\u2019s about profit dollars per item sold.',
            steps: [
                '<strong>Run a menu profitability matrix.</strong> For every item: selling price minus total food cost = gross profit. Multiply gross profit by weekly volume. Rank every item by total weekly profit contribution. You\u2019ll likely discover that 20% of your menu generates 80% of your profit.',
                '<strong>Reposition your top 3 profit items.</strong> Once identified, put your highest-profit items where eyes go first: top right of the menu, first item in each section, server verbal recommendations. Don\u2019t add new items. Move the winners to where they get noticed.',
                '<strong>Consider cutting your 3 lowest performers.</strong> Items that sell poorly AND have low margins are actively hurting you. They consume prep time, inventory space, and mental energy. Remove them. No guest will miss an item they weren\u2019t ordering anyway.'
            ],
            cta: 'The Peak Profit Audit includes a full menu P&L analysis showing you exactly which items to push, which to fix, and which to cut.'
        },
        labor: {
            headline: 'Your #1 Bottleneck: Labor Efficiency',
            explanation: 'Your staffing model is misaligned with your volume. This might mean understaffed (quality suffers, team burns out), overstaffed (margins evaporate), or misdeployed (right number, wrong configuration). Labor is typically a restaurant\u2019s largest controllable cost, but cutting labor is rarely the right first move.',
            steps: [
                '<strong>Calculate Covers per Labor Hour by daypart.</strong> Total covers divided by total scheduled labor hours for each shift. Compare Tuesday lunch to Friday dinner. If the ratio varies by more than 40%, your scheduling isn\u2019t matching your demand curve.',
                '<strong>Map your labor to your constraint.</strong> If the kitchen is the bottleneck, adding one prep cook may generate more profit than cutting a server. If the floor is the bottleneck, reducing section sizes may increase check averages enough to cover the extra labor cost. Match labor investment to your actual constraint.',
                '<strong>Build a flex schedule around your top 5 volume hours.</strong> Identify the 5 hours per week where you do the most revenue. Ensure those hours have your best team, fully staffed, every week. Then build the rest of the schedule around that anchor.'
            ],
            cta: 'The Peak Profit Audit includes a staffing analysis showing you exactly where labor is helping margins and where it\u2019s hurting them.'
        },
        mixed: {
            headline: 'Your Profile: Multiple Constraints',
            explanation: 'Your responses suggest several areas are contributing to margin pressure simultaneously. This is common in restaurants that have been operating reactively\u2014fixing whatever feels most urgent rather than following a diagnostic sequence. The challenge with multiple constraints is knowing which one to fix first.',
            steps: [
                '<strong>Start with the constraint furthest upstream.</strong> The profit chain flows: Demand \u2192 Capacity \u2192 Experience \u2192 Behavior \u2192 Menu Economics. Fix the highest one first, because downstream problems often resolve when the upstream constraint is removed.',
                '<strong>Pick one metric per week.</strong> Don\u2019t try to fix everything at once. Choose one number\u2014covers, check average, repeat rate, food cost, labor hours\u2014and focus on it for 7 days. Measure daily. Small, focused improvements compound faster than scattered efforts.',
                '<strong>Get an outside perspective.</strong> When you\u2019re inside the business every day, it\u2019s difficult to see the system clearly. A structured diagnostic from someone outside your operation can identify the sequence of fixes you can\u2019t see from the inside.'
            ],
            cta: 'This is exactly what the Peak Profit Audit is designed for. We identify your primary constraint, sequence the fixes, and give you a ranked action plan. No guesswork.'
        }
    };

    // ── DOM REFERENCES ────────────────────────────────
    var quizContainer = document.getElementById('quiz-container');
    var resultsContainer = document.getElementById('results-container');
    var heroSection = document.getElementById('hero');
    var howItWorks = document.getElementById('how-it-works');
    var faqSection = document.getElementById('faq');

    // ── DETERMINE BOTTLENECK ──────────────────────────
    function determineBottleneck(scores) {
        var entries = [];
        for (var cat in scores) {
            if (scores.hasOwnProperty(cat)) {
                entries.push([cat, scores[cat]]);
            }
        }
        entries.sort(function (a, b) { return b[1] - a[1]; });

        var highest = entries[0];
        var secondHighest = entries[1];

        // Mixed: tie at top and both >= 4
        if (highest[1] - secondHighest[1] <= 2 && secondHighest[1] >= 4) {
            if (highest[1] === secondHighest[1]) {
                return { primary: 'mixed', secondary: null, topTwo: [highest[0], secondHighest[0]] };
            }
            return { primary: highest[0], secondary: secondHighest[0] };
        }

        // Clear winner
        if (highest[1] >= 3) {
            return { primary: highest[0], secondary: secondHighest[1] >= 3 ? secondHighest[0] : null };
        }

        // Low signal
        return { primary: 'mixed', secondary: null };
    }

    // ── START QUIZ ────────────────────────────────────
    function startQuiz() {
        state.started = true;
        state.currentQuestion = 0;
        state.answers = [];
        state.scores = { demand: 0, capacity: 0, experience: 0, behavior: 0, menu: 0, labor: 0 };
        state.completed = false;

        heroSection.style.display = 'none';
        howItWorks.style.display = 'none';
        faqSection.style.display = 'none';
        resultsContainer.style.display = 'none';

        quizContainer.style.display = 'block';
        quizContainer.scrollIntoView({ behavior: 'smooth' });

        renderQuestion();
    }

    // ── RENDER QUESTION ───────────────────────────────
    function renderQuestion() {
        var q = questions[state.currentQuestion];
        var progress = ((state.currentQuestion) / questions.length) * 100;

        var html = '';
        html += '<div class="quiz-progress">';
        html += '  <div class="quiz-progress-bar" style="width:' + progress + '%"></div>';
        html += '</div>';
        html += '<div class="quiz-meta">Question ' + (state.currentQuestion + 1) + ' of ' + questions.length + '</div>';
        html += '<h2 class="quiz-question">' + q.text + '</h2>';
        html += '<div class="quiz-options">';

        for (var i = 0; i < q.options.length; i++) {
            html += '<button class="quiz-option" data-index="' + i + '">';
            html += '  <span class="quiz-option-letter">' + String.fromCharCode(65 + i) + '</span>';
            html += '  <span class="quiz-option-text">' + q.options[i].text + '</span>';
            html += '</button>';
        }

        html += '</div>';

        if (state.currentQuestion > 0) {
            html += '<button class="quiz-back">\u2190 Back</button>';
        }

        quizContainer.innerHTML = html;

        var options = quizContainer.querySelectorAll('.quiz-option');
        for (var j = 0; j < options.length; j++) {
            options[j].addEventListener('click', handleAnswer);
        }

        var backBtn = quizContainer.querySelector('.quiz-back');
        if (backBtn) {
            backBtn.addEventListener('click', goBack);
        }
    }

    // ── HANDLE ANSWER ─────────────────────────────────
    function handleAnswer(e) {
        var btn = e.currentTarget;
        var index = parseInt(btn.getAttribute('data-index'), 10);
        var q = questions[state.currentQuestion];
        var selectedScores = q.options[index].scores;

        for (var cat in selectedScores) {
            if (selectedScores.hasOwnProperty(cat)) {
                state.scores[cat] += selectedScores[cat];
            }
        }

        state.answers[state.currentQuestion] = index;
        btn.classList.add('quiz-option--selected');

        setTimeout(function () {
            state.currentQuestion++;
            if (state.currentQuestion >= questions.length) {
                showResults();
            } else {
                renderQuestion();
            }
        }, 300);
    }

    // ── GO BACK ───────────────────────────────────────
    function goBack() {
        if (state.currentQuestion <= 0) return;

        var prevIndex = state.answers[state.currentQuestion - 1];
        var prevQ = questions[state.currentQuestion - 1];
        var prevScores = prevQ.options[prevIndex].scores;

        for (var cat in prevScores) {
            if (prevScores.hasOwnProperty(cat)) {
                state.scores[cat] -= prevScores[cat];
            }
        }

        state.currentQuestion--;
        renderQuestion();
    }

    // ── SHOW RESULTS ──────────────────────────────────
    function showResults() {
        state.completed = true;
        var bottleneck = determineBottleneck(state.scores);
        var result = results[bottleneck.primary];

        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        var html = '';
        html += '<div class="result-card">';
        html += '  <div class="result-badge">' + (categoryIcons[bottleneck.primary] || '\uD83D\uDD0D') + '</div>';
        html += '  <h2 class="result-headline">' + result.headline + '</h2>';
        html += '  <p class="result-explanation">' + result.explanation + '</p>';

        // Score visualization
        html += '  <div class="result-scores">';
        html += '    <h3 class="result-scores-title">Your Full Profile</h3>';

        var categories = ['demand', 'capacity', 'experience', 'behavior', 'menu', 'labor'];
        for (var k = 0; k < categories.length; k++) {
            var cat = categories[k];
            var pct = Math.round((state.scores[cat] / maxScores[cat]) * 100);
            var isTop = (cat === bottleneck.primary);
            html += '<div class="score-row' + (isTop ? ' score-row--primary' : '') + '">';
            html += '  <span class="score-label">' + categoryLabels[cat] + '</span>';
            html += '  <div class="score-bar-track">';
            html += '    <div class="score-bar-fill' + (isTop ? ' score-bar-fill--primary' : '') + '" style="width:' + pct + '%"></div>';
            html += '  </div>';
            html += '  <span class="score-value">' + pct + '%</span>';
            html += '</div>';
        }

        html += '  </div>';

        // Next steps
        html += '  <div class="result-steps">';
        html += '    <h3>Your 3 Next Moves</h3>';
        for (var s = 0; s < result.steps.length; s++) {
            html += '<div class="result-step">';
            html += '  <div class="result-step-number">' + (s + 1) + '</div>';
            html += '  <div class="result-step-content">' + result.steps[s] + '</div>';
            html += '</div>';
        }
        html += '  </div>';

        // Soft CTA
        html += '  <div class="result-cta">';
        html += '    <h3>Want to Go Deeper?</h3>';
        html += '    <p>' + result.cta + '</p>';
        html += '    <a href="https://saidkhan005.github.io/peak-profit-audit/#book" class="cta-primary" target="_blank" rel="noopener">Request a Peak Profit Audit \u2192</a>';
        html += '  </div>';

        // Retake
        html += '  <div class="result-retake">';
        html += '    <button class="quiz-retake">Retake the Diagnostic</button>';
        html += '  </div>';

        html += '</div>';

        resultsContainer.innerHTML = html;
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // Animate score bars
        setTimeout(function () {
            var bars = resultsContainer.querySelectorAll('.score-bar-fill');
            for (var b = 0; b < bars.length; b++) {
                bars[b].classList.add('score-bar-fill--animated');
            }
        }, 100);

        // Retake listener
        var retakeBtn = resultsContainer.querySelector('.quiz-retake');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', function () {
                resultsContainer.style.display = 'none';
                resultsContainer.innerHTML = '';
                startQuiz();
            });
        }
    }

    // ── INIT ──────────────────────────────────────────
    var startButtons = document.querySelectorAll('[data-action="start-quiz"]');
    for (var i = 0; i < startButtons.length; i++) {
        startButtons[i].addEventListener('click', function (e) {
            e.preventDefault();
            startQuiz();
        });
    }

})();
