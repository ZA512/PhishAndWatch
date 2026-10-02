/* The engine only handles positions and ticks. It never knows SVG coordinates. */
(function (root) {
  'use strict';
  const MODES = Object.freeze({
    A: { initialTickMs: 700, minTickMs: 280, speedIncreaseEvery: 8, speedIncreaseMs: 30, initialMaxObjects: 1, maxObjects: 5, spawnTicks: 2.8, phishingProbability: .58 },
    B: { initialTickMs: 490, minTickMs: 280, speedIncreaseEvery: 6, speedIncreaseMs: 25, initialMaxObjects: 3, maxObjects: 6, spawnTicks: 1.45, phishingProbability: .62 }
  });
  function randomWithSeed(seed) {
    let value = seed >>> 0;
    return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  class GameEngine {
    constructor(seed = Date.now()) { this.seed = seed >>> 0; this.state = this.newState('A', 'IDLE'); this.random = randomWithSeed(this.seed); this.events = []; }
    newState(mode, status) { return { status, mode, score: 0, misses: 0, player: 1, tick: 0, mails: [], effects: [], tickMs: MODES[mode].initialTickMs, maxObjects: MODES[mode].initialMaxObjects, nextSpawn: 1, nextId: 1, missFrames: 0, pauseFrom: null }; }
    start(mode = 'A') { this.state = this.newState(mode, 'PLAYING'); this.random = randomWithSeed(this.seed); this.events = ['start']; }
    move(direction) {
      const s = this.state;
      if (s.status === 'GAME_OVER' || s.status === 'PAUSED' || s.status === 'MISS_ANIMATION') return false;
      const next = Math.max(0, Math.min(3, s.player + direction));
      if (next === s.player) return false;
      s.player = next; this.events.push('move'); return true;
    }
    pause() { const s = this.state; if (s.status === 'PLAYING' || s.status === 'MISS_ANIMATION') { s.pauseFrom = s.status; s.status = 'PAUSED'; return true; } return false; }
    resume() { const s = this.state; if (s.status === 'PAUSED') { s.status = s.pauseFrom; s.pauseFrom = null; return true; } return false; }
    togglePause() { return this.state.status === 'PAUSED' ? this.resume() : this.pause(); }
    difficulty() {
      const s = this.state, cfg = MODES[s.mode], level = Math.floor(s.score / cfg.speedIncreaseEvery);
      s.tickMs = Math.max(cfg.minTickMs, cfg.initialTickMs - level * cfg.speedIncreaseMs);
      s.maxObjects = Math.min(cfg.maxObjects, cfg.initialMaxObjects + Math.floor(s.score / 6));
    }
    /* One spawn per tick means one arrival per tick. Also reserve enough time
       between phishing targets to cross up to three positions at 90ms/step,
       plus a 100ms response margin, even at the fastest future tick rate. */
    canSpawn(candidate) {
      const s = this.state, cfg = MODES[s.mode];
      if (s.mails.length >= s.maxObjects) return false;
      const arrival = s.tick + 5;
      return s.mails.every(mail => {
        const otherArrival = s.tick + 5 - mail.step;
        const gap = Math.abs(arrival - otherArrival);
        if (gap === 0) return false;
        if (candidate.type === 'phishing' && mail.type === 'phishing') {
          return gap * cfg.minTickMs >= Math.abs(candidate.lane - mail.lane) * 90 + 100;
        }
        return true;
      });
    }
    spawn() {
      const s = this.state, cfg = MODES[s.mode];
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = { id: s.nextId, lane: Math.floor(this.random() * 4), type: this.random() < cfg.phishingProbability ? 'phishing' : 'legit', step: 0 };
        if (!this.canSpawn(candidate)) continue;
        s.mails.push(candidate); s.nextId++;
        const level = Math.floor(s.score / cfg.speedIncreaseEvery);
        s.nextSpawn = s.tick + Math.max(1, Math.round(cfg.spawnTicks * Math.max(.5, 1 - level * .06) * (.75 + this.random() * .5)));
        return true;
      }
      s.nextSpawn = s.tick + 1;
      return false;
    }
    tick() {
      const s = this.state;
      if (!['PLAYING', 'MISS_ANIMATION'].includes(s.status)) return;
      s.effects = s.effects.filter(effect => ++effect.age < 3);
      if (s.status === 'MISS_ANIMATION') {
        s.missFrames--;
        if (s.missFrames <= 0) { s.status = s.misses >= 3 ? 'GAME_OVER' : 'PLAYING'; if (s.status === 'GAME_OVER') this.events.push('over'); }
        return;
      }
      s.tick++;
      // A mail at step 4 is visible in the catch zone for a full tick.
      for (const mail of s.mails) mail.step++;
      const arrived = s.mails.filter(mail => mail.step >= 5);
      s.mails = s.mails.filter(mail => mail.step < 5);
      for (const mail of arrived) {
        const caught = mail.lane === s.player;
        if (mail.type === 'phishing' && caught) {
          s.score++; s.effects.push({ lane: mail.lane, kind: 'catch', age: 0 }); this.events.push('catch');
        } else if ((mail.type === 'phishing' && !caught) || (mail.type === 'legit' && caught)) {
          s.misses = Math.min(3, s.misses + 1); s.effects.push({ lane: mail.lane, kind: 'miss', age: 0 }); this.events.push('miss');
          s.status = 'MISS_ANIMATION'; s.missFrames = 2;
        }
      }
      this.difficulty();
      if (s.status === 'PLAYING' && s.tick >= s.nextSpawn) this.spawn();
    }
    takeEvents() { const events = this.events; this.events = []; return events; }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { GameEngine, MODES, randomWithSeed };
  else root.PhishGame = { GameEngine, MODES };
})(typeof window !== 'undefined' ? window : globalThis);
