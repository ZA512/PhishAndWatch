(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const seedParam = Number(params.get('seed'));
  const engine = new PhishGame.GameEngine(params.has('seed') && Number.isFinite(seedParam) ? seedParam : Date.now());
  const renderer = new PhishGame.LcdRenderer($('lcd'));
  const storage = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* Private or file mode may disable storage. */ } }
  };
  const records = { A: Number(storage.get('highScoreGameA', 0)) || 0, B: Number(storage.get('highScoreGameB', 0)) || 0 };
  let soundEnabled = storage.get('soundEnabled', 'true') === 'true';
  let audio = null, timer = null, allSegments = false, lastStatus = '', pauseRecord = false;
  const debug = params.get('debug') === '1';

  function activateAudio() {
    if (!soundEnabled) return;
    try { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume().catch(() => {}); } catch { audio = null; }
  }
  function tone(frequency, duration, delay = 0) {
    if (!audio || !soundEnabled || audio.state !== 'running') return;
    const now = audio.currentTime + delay, oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'square'; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.025, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(now); oscillator.stop(now + duration);
  }
  function handleEvents() {
    for (const event of engine.takeEvents()) {
      if (event === 'move') tone(950,.025);
      if (event === 'catch') { tone(1400,.05); tone(1850,.07,.06); }
      if (event === 'miss') { tone(170,.2); $('status').textContent = `Erreur ${engine.state.misses} sur 3. Score ${engine.state.score}.`; }
      if (event === 'over') { [440,330,220].forEach((frequency,i) => tone(frequency,.16,i*.18)); }
      if (event === 'start') { tone(660,.07); tone(990,.09,.09); }
    }
  }
  function updateRecord() {
    const { score, mode } = engine.state;
    if (score > records[mode]) { records[mode] = score; storage.set(`highScoreGame${mode}`,score); }
    $('record').innerHTML = `RECORD A <b>${String(records.A).padStart(3,'0')}</b> <span class="record-divider">/</span> RECORD B <b>${String(records.B).padStart(3,'0')}</b>`;
  }
  function render() {
    const s = engine.state;
    renderer.render(s, allSegments);
    handleEvents(); updateRecord();
    $('game-a').setAttribute('aria-pressed', String(s.mode === 'A'));
    $('game-b').setAttribute('aria-pressed', String(s.mode === 'B'));
    $('pause-button').disabled = !['PLAYING','MISS_ANIMATION','PAUSED'].includes(s.status);
    $('pause-button').innerHTML = s.status === 'PAUSED' ? '▶ REPRENDRE <span>P</span>' : 'Ⅱ PAUSE <span>P</span>';
    if (s.status !== lastStatus) {
      $('screen-overlay').hidden = !['IDLE','PAUSED','GAME_OVER'].includes(s.status);
      if (s.status === 'PAUSED') {
        $('overlay-eyebrow').textContent = `GAME ${s.mode} · SCORE ${String(s.score).padStart(3,'0')}`;
        $('overlay-title').textContent = 'Un petit répit.';
        $('overlay-text').innerHTML = 'Le courrier peut attendre.<br>Votre partie est en pause.';
        $('start-button').innerHTML = 'REPRENDRE <span>↵</span>';
        $('overlay-hint').textContent = 'P ou Espace pour reprendre';
      } else if (s.status === 'GAME_OVER') {
        $('overlay-eyebrow').textContent = `GAME ${s.mode} · 3 MISS`;
        $('overlay-title').textContent = 'Game over.';
        $('overlay-text').innerHTML = `SCORE ${String(s.score).padStart(3,'0')} · RECORD ${String(records[s.mode]).padStart(3,'0')}<br>Encore une petite partie ?`;
        $('start-button').innerHTML = `REJOUER · GAME ${s.mode} <span>↵</span>`;
        $('overlay-hint').textContent = 'GAME A · EASY / GAME B · HARD';
        $('status').textContent = `Partie terminée. Score ${s.score}. Meilleur score ${records[s.mode]}. Entrée pour rejouer.`;
      }
      lastStatus = s.status;
    }
    if (debug) $('debug-output').textContent = JSON.stringify({ status:s.status, tick:s.tick, score:s.score, speed:s.tickMs, activeObjects:s.mails.length, currentSeed:engine.seed, playerPosition:s.player+1, nextSpawn:s.nextSpawn, maxObjects:s.maxObjects, mails:s.mails },null,2);
  }
  function schedule() {
    clearTimeout(timer); timer = null;
    if (!['PLAYING','MISS_ANIMATION'].includes(engine.state.status)) return;
    timer = setTimeout(() => { engine.tick(); render(); schedule(); }, engine.state.status === 'MISS_ANIMATION' ? 240 : engine.state.tickMs);
  }
  function start(mode) { activateAudio(); allSegments = false; engine.start(mode); $('status').textContent = `Game ${mode}. Flèches gauche et droite pour attraper les phishing et laisser passer les emails légitimes.`; render(); schedule(); }
  function resume() { activateAudio(); engine.resume(); render(); schedule(); }
  function move(direction) { activateAudio(); engine.move(direction); render(); }
  function pause() { activateAudio(); if (engine.togglePause()) { render(); schedule(); } }
  function playOrResume() { if (engine.state.status === 'PAUSED') resume(); else if (['IDLE','GAME_OVER'].includes(engine.state.status)) start(engine.state.mode); }
  $('start-button').addEventListener('click',playOrResume);
  $('game-a').addEventListener('click',() => start('A'));
  $('game-b').addEventListener('click',() => start('B'));
  $('pause-button').addEventListener('click',pause);
  function updateSound() { $('sound-button').textContent = soundEnabled ? '♪ SON ACTIVÉ' : '♪ SON COUPÉ'; $('sound-button').setAttribute('aria-pressed',String(soundEnabled)); }
  $('sound-button').addEventListener('click',() => { soundEnabled = !soundEnabled; storage.set('soundEnabled',soundEnabled); activateAudio(); updateSound(); });

  // Pointer capture keeps held touch controls reliable when a finger leaves a button.
  function directionButton(button,direction) {
    let repeat = null, delay = null;
    function release() { clearTimeout(delay); clearInterval(repeat); button.classList.remove('pressed'); }
    button.addEventListener('pointerdown',event => {
      if (event.button !== 0) return;
      event.preventDefault(); button.focus({ preventScroll:true }); button.setPointerCapture(event.pointerId); release(); button.classList.add('pressed'); move(direction);
      delay = setTimeout(() => { repeat = setInterval(() => move(direction),90); },240);
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(name,release);
    button.addEventListener('click',event => { if (event.detail === 0) move(direction); });
    window.addEventListener('blur',release);
  }
  directionButton($('left-button'),-1); directionButton($('right-button'),1);
  const keys = new Map();
  function clearKeys() { for (const held of keys.values()) { clearTimeout(held.delay); clearInterval(held.repeat); } keys.clear(); $('left-button').classList.remove('pressed'); $('right-button').classList.remove('pressed'); }
  window.addEventListener('keydown',event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const key = event.key.toLowerCase();
    const direction = key === 'arrowleft' || key === 'a' ? -1 : key === 'arrowright' || key === 'd' ? 1 : 0;
    if (direction) {
      event.preventDefault(); if (keys.has(key) || event.repeat) return;
      const button = $(direction === -1 ? 'left-button' : 'right-button'); button.classList.add('pressed'); move(direction);
      const held = { delay:null,repeat:null }; held.delay = setTimeout(() => { held.repeat = setInterval(() => move(direction),90); },240); keys.set(key,held);
    } else if (!event.repeat && (key === 'p' || key === ' ' || key === 'escape')) {
      // Preserve native Space activation when a button has keyboard focus.
      if (key === ' ' && event.target.tagName === 'BUTTON') return;
      event.preventDefault(); pause();
    } else if (!event.repeat && key === 'enter' && event.target.tagName !== 'BUTTON') { event.preventDefault(); playOrResume(); }
    else if (debug && key === 'l' && !event.repeat) toggleSegments();
  });
  window.addEventListener('keyup',event => {
    const key = event.key.toLowerCase(), held = keys.get(key);
    if (!held) return; clearTimeout(held.delay); clearInterval(held.repeat); keys.delete(key);
    $(key === 'arrowleft' || key === 'a' ? 'left-button' : 'right-button').classList.remove('pressed');
  });
  window.addEventListener('blur',() => { clearKeys(); if (engine.pause()) { render(); schedule(); } });
  document.addEventListener('visibilitychange',() => { if (document.hidden) { clearKeys(); if (engine.pause()) { render(); schedule(); } } });
  function toggleSegments() {
    if (!allSegments) { pauseRecord = engine.pause(); allSegments = true; }
    else { allSegments = false; if (pauseRecord) engine.resume(); pauseRecord = false; }
    $('segments-button').textContent = allSegments ? 'Revenir au jeu (L)' : 'Afficher tous les segments (L)';
    render(); if (allSegments) { $('screen-overlay').hidden = true; clearTimeout(timer); } else { lastStatus = ''; render(); schedule(); }
  }
  if (debug) { $('debug-panel').hidden = false; $('segments-button').addEventListener('click',toggleSegments); }
  updateSound(); render();
})();
