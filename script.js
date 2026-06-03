const form = document.getElementById('workout-form');
const tableBody = document.querySelector('#workout-table tbody');
const summaryText = document.getElementById('summary-text');

const pools = {
  warmup: [
    { name: 'Arm circles', duration: '90 sec', notes: 'Keep shoulders relaxed' },
    { name: 'Hip openers', duration: '90 sec', notes: 'Move smoothly' },
    { name: 'Jumping jacks', duration: '60 sec', notes: 'Light pace' },
    { name: 'High knees', duration: '60 sec', notes: 'Drive knees forward' },
    { name: 'Leg swings', duration: '60 sec', notes: 'Switch legs halfway' }
  ],
  cooldown: [
    { name: 'Hamstring stretch', duration: '90 sec', notes: 'Ease into the stretch' },
    { name: 'Quad stretch', duration: '90 sec', notes: 'Keep hips level' },
    { name: 'Chest opener', duration: '60 sec', notes: 'Breathe deeply' },
    { name: 'Child pose', duration: '90 sec', notes: 'Relax shoulders' },
    { name: 'Deep breathing', duration: '60 sec', notes: 'Inhale through nose, exhale through mouth' }
  ],
  strength: {
    beginner: [
      { name: 'Bodyweight squat', load: 'Bodyweight', notes: 'Sit back into your hips' },
      { name: 'Incline push-up', load: 'Bodyweight', notes: 'Keep a straight line' },
      { name: 'Glute bridge', load: 'Bodyweight', notes: 'Squeeze your glutes' },
      { name: 'Plank hold', load: 'Bodyweight', notes: 'Hips neutral' },
      { name: 'Walking lunge', load: 'Bodyweight', notes: 'Step controlled' }
    ],
    intermediate: [
      { name: 'Reverse lunge', load: 'Bodyweight', notes: 'Keep the front knee stable' },
      { name: 'Knee push-up', load: 'Bodyweight', notes: 'Lower gently' },
      { name: 'Single-leg deadlift', load: 'Bodyweight', notes: 'Balance each side' },
      { name: 'Plank shoulder taps', load: 'Bodyweight', notes: 'Minimize hip movement' },
      { name: 'Bulgarian split squat', load: 'Bodyweight', notes: 'Use a chair for support' }
    ],
    advanced: [
      { name: 'Pistol squat', load: 'Bodyweight', notes: 'Use a small box if needed' },
      { name: 'Decline push-up', load: 'Bodyweight', notes: 'Control the descent' },
      { name: 'Single-leg glute bridge', load: 'Bodyweight', notes: 'Keep hips level' },
      { name: 'Push-up to side plank', load: 'Bodyweight', notes: 'Engage core' },
      { name: 'Jump squat', load: 'Bodyweight', notes: 'Land softly' }
    ]
  },
  cardio: {
    beginner: [
      { name: 'March in place', load: 'Bodyweight', notes: 'Keep a steady pace' },
      { name: 'Step touch', load: 'Bodyweight', notes: 'Move laterally with control' },
      { name: 'Low-impact jumping jacks', load: 'Bodyweight', notes: 'Avoid jarring' },
      { name: 'Standing mountain climbers', load: 'Bodyweight', notes: 'Drive knees gently' },
      { name: 'Toe taps', load: 'Bodyweight', notes: 'Keep core engaged' }
    ],
    intermediate: [
      { name: 'High knees', load: 'Bodyweight', notes: 'Use arm drive' },
      { name: 'Butt kicks', load: 'Bodyweight', notes: 'Stay light on your feet' },
      { name: 'Burpees', load: 'Bodyweight', notes: 'Modify with step back if needed' },
      { name: 'Skaters', load: 'Bodyweight', notes: 'Push off sideways' },
      { name: 'Plank jacks', load: 'Bodyweight', notes: 'Keep core stable' }
    ],
    advanced: [
      { name: 'Squat jumps', load: 'Bodyweight', notes: 'Explode upward' },
      { name: 'Tuck jumps', load: 'Bodyweight', notes: 'Land softly' },
      { name: 'Burpee tuck jump', load: 'Bodyweight', notes: 'Keep a strong core' },
      { name: 'Mountain climbers', load: 'Bodyweight', notes: 'Drive knees fast' },
      { name: 'Jump lunges', load: 'Bodyweight', notes: 'Switch legs explosively' }
    ]
  }
};

const difficultyRules = {
  beginner: { strength: { sets: 2, reps: 8, rest: '60 sec' }, cardio: { work: 30, rest: 30 } },
  intermediate: { strength: { sets: 3, reps: 10, rest: '45 sec' }, cardio: { work: 40, rest: 20 } },
  advanced: { strength: { sets: 4, reps: 12, rest: '30 sec' }, cardio: { work: 50, rest: 15 } }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const duration = Number(form.duration.value);
  const goal = form.goal.value;
  const difficulty = form.difficulty.value;
  const mixedMode = form['mixedMode'].value;

  const plan = generateWorkoutPlan({ duration, goal, difficulty, mixedMode });
  renderWorkoutTable(plan);
});

function pickRandomItems(items, count) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatTime(minutes) {
  return `${minutes} min`;
}

function generateWorkoutPlan({ duration, goal, difficulty, mixedMode }) {
  const warmupDuration = Math.max(3, Math.round(duration * 0.12));
  const cooldownDuration = Math.max(3, Math.round(duration * 0.1));
  const mainDuration = Math.max(5, duration - warmupDuration - cooldownDuration);

  const summary = `Duration: ${duration} min • Goal: ${goal} • Difficulty: ${difficulty}`;

  const warmupItems = pickRandomItems(pools.warmup, 3);
  const cooldownItems = pickRandomItems(pools.cooldown, 3);
  const mainItems = buildMainWorkout({ goal, difficulty, mixedMode, mainDuration });

  return {
    summary,
    warmupDuration,
    cooldownDuration,
    mainDuration,
    warmupItems,
    mainItems,
    cooldownItems
  };
}

function buildMainWorkout({ goal, difficulty, mixedMode, mainDuration }) {
  if (goal === 'cardio') {
    return buildCardioBlock(difficulty, mainDuration, 4);
  }

  if (goal === 'strength') {
    return buildStrengthBlock(difficulty, mainDuration, 4);
  }

  if (goal === 'mixed') {
    if (mixedMode === 'blocks') {
      return [
        ...buildStrengthBlock(difficulty, mainDuration * 0.5, 2),
        ...buildCardioBlock(difficulty, mainDuration * 0.5, 2)
      ];
    }
    return buildMixedCircuit(difficulty, mainDuration, 4);
  }

  return [];
}

function buildStrengthBlock(difficulty, mainDuration, count) {
  const choices = pools.strength[difficulty];
  const selected = pickRandomItems(choices, count);
  const rule = difficultyRules[difficulty].strength;

  return selected.map((exercise) => ({
    section: 'Main',
    exercise: exercise.name,
    load: exercise.load,
    repsDuration: `${rule.sets} × ${rule.reps}`,
    rest: rule.rest,
    notes: exercise.notes
  }));
}

function buildCardioBlock(difficulty, mainDuration, count) {
  const choices = pools.cardio[difficulty];
  const selected = pickRandomItems(choices, count);
  const rule = difficultyRules[difficulty].cardio;

  return selected.map((exercise) => ({
    section: 'Main',
    exercise: exercise.name,
    load: exercise.load,
    repsDuration: `${rule.work} sec`,
    rest: `${rule.rest} sec`,
    notes: exercise.notes
  }));
}

function buildMixedCircuit(difficulty, mainDuration, count) {
  const strengthChoices = pools.strength[difficulty];
  const cardioChoices = pools.cardio[difficulty];
  const strengthItems = pickRandomItems(strengthChoices, Math.ceil(count / 2));
  const cardioItems = pickRandomItems(cardioChoices, Math.floor(count / 2));
  const strengthRule = difficultyRules[difficulty].strength;
  const cardioRule = difficultyRules[difficulty].cardio;

  const circuit = [];
  for (let i = 0; i < Math.max(strengthItems.length, cardioItems.length); i++) {
    if (strengthItems[i]) {
      circuit.push({
        section: 'Main',
        exercise: strengthItems[i].name,
        load: strengthItems[i].load,
        repsDuration: `${strengthRule.sets} × ${strengthRule.reps}`,
        rest: strengthRule.rest,
        notes: strengthItems[i].notes
      });
    }
    if (cardioItems[i]) {
      circuit.push({
        section: 'Main',
        exercise: cardioItems[i].name,
        load: cardioItems[i].load,
        repsDuration: `${cardioRule.work} sec`,
        rest: `${cardioRule.rest} sec`,
        notes: cardioItems[i].notes
      });
    }
  }

  return circuit;
}

function renderWorkoutTable(plan) {
  tableBody.innerHTML = '';
  summaryText.textContent = `${plan.summary} • Warm-up ${plan.warmupDuration} min • Main ${plan.mainDuration} min • Cooldown ${plan.cooldownDuration} min`;

  plan.warmupItems.forEach((item) => {
    const row = createRow('Warm-up', item.name, '--', item.duration, '--', item.notes);
    tableBody.appendChild(row);
  });

  plan.mainItems.forEach((item) => {
    const row = createRow(item.section, item.exercise, item.load, item.repsDuration, item.rest, item.notes);
    tableBody.appendChild(row);
  });

  plan.cooldownItems.forEach((item) => {
    const row = createRow('Cooldown', item.name, '--', item.duration, '--', item.notes);
    tableBody.appendChild(row);
  });
}

function createRow(section, exercise, load, repsDuration, rest, notes) {
  const tr = document.createElement('tr');
  tr.appendChild(createCell(section));
  tr.appendChild(createCell(exercise));
  tr.appendChild(createCell(load));
  tr.appendChild(createCell(repsDuration));
  tr.appendChild(createCell(rest));
  tr.appendChild(createCell(notes));
  return tr;
}

function createCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

// Generate the first workout when the page loads
form.requestSubmit();
