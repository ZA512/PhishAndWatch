const { test } = require('node:test');
const assert = require('node:assert/strict');
const { GameEngine, MODES } = require('../src/engine.js');

function game() { const engine = new GameEngine(123456); engine.start(); engine.state.nextSpawn = Infinity; engine.takeEvents(); return engine; }
function arriving(engine, type, lane) { engine.state.mails = [{ id:1, type, lane, step:4 }]; engine.tick(); }

test('catching phishing scores, passing a legitimate mail is safe', () => {
  const engine = game(); arriving(engine,'phishing',1);
  assert.equal(engine.state.score,1); assert.equal(engine.state.misses,0);
  assert.deepEqual(engine.takeEvents(),['catch']);
  arriving(engine,'legit',0); assert.equal(engine.state.misses,0); assert.equal(engine.state.score,1);
});
test('both error types count a MISS; the third ends the game after fixed feedback frames', () => {
  const engine = game();
  for (const [i,type,lane] of [[1,'phishing',0],[2,'legit',1],[3,'phishing',3]]) {
    arriving(engine,type,lane); assert.equal(engine.state.misses,i); assert.equal(engine.state.status,'MISS_ANIMATION');
    const tick = engine.state.tick; engine.tick(); assert.equal(engine.state.tick,tick); engine.tick();
    assert.equal(engine.state.status,i === 3 ? 'GAME_OVER' : 'PLAYING');
  }
  const score = engine.state.score; engine.tick(); assert.equal(engine.state.score,score);
  engine.start('B'); assert.equal(engine.state.misses,0); assert.equal(engine.state.status,'PLAYING');
});
test('each mail occupies all five fixed positions before automatic resolution', () => {
  const engine = game(); engine.state.mails = [{ id:1,type:'phishing',lane:1,step:0 }];
  for (let step = 1; step <= 4; step++) { engine.tick(); assert.equal(engine.state.mails[0].step,step); assert.equal(engine.state.score,0); }
  engine.tick(); assert.equal(engine.state.mails.length,0); assert.equal(engine.state.score,1);
});
test('pause freezes game state, and a paused error resumes its feedback', () => {
  const engine = game(); engine.pause(); const frozen = JSON.stringify(engine.state); engine.tick(); engine.move(1);
  assert.equal(JSON.stringify(engine.state),frozen); engine.resume(); assert.equal(engine.state.status,'PLAYING');
  arriving(engine,'phishing',0); engine.pause(); engine.resume(); assert.equal(engine.state.status,'MISS_ANIMATION');
});
test('movement has four bounded positions, and the score exceeds 999 internally', () => {
  const engine = game(); for (let i=0;i<8;i++) engine.move(-1); assert.equal(engine.state.player,0);
  for (let i=0;i<8;i++) engine.move(1); assert.equal(engine.state.player,3);
  engine.state.score = 999; arriving(engine,'phishing',3); assert.equal(engine.state.score,1000);
});
test('difficulty increases speed and capacity within their limits, B starts faster', () => {
  const engine = game(); engine.state.score = 24; engine.difficulty();
  assert.ok(engine.state.tickMs < MODES.A.initialTickMs); assert.ok(engine.state.maxObjects > 1);
  engine.state.score = 10000; engine.difficulty(); assert.equal(engine.state.tickMs,MODES.A.minTickMs); assert.equal(engine.state.maxObjects,MODES.A.maxObjects);
  engine.start('B'); assert.ok(engine.state.tickMs < MODES.A.initialTickMs); assert.equal(engine.state.maxObjects,3);
});
test('seed reproduces a sequence exactly', () => {
  const one = new GameEngine(481); const two = new GameEngine(481); one.start('B'); two.start('B');
  for (let i=0;i<500;i++) { one.tick(); two.tick(); assert.deepEqual(one.state,two.state); }
});
test('the generator refuses simultaneous arrivals and tightly spaced opposite phishing targets', () => {
  const engine = game(); engine.state.maxObjects = 6;
  engine.state.mails = [{ id:1,type:'phishing',lane:0,step:0 }]; assert.equal(engine.canSpawn({ type:'legit',lane:2 }),false);
  engine.state.mails[0].step = 1; assert.equal(engine.canSpawn({ type:'phishing',lane:3 }),false);
  assert.equal(engine.canSpawn({ type:'phishing',lane:1 }),true);
  engine.state.mails[0].step = 2; assert.equal(engine.canSpawn({ type:'phishing',lane:3 }),true);
});
test('many seeds in both modes remain playable as speed rises, with one arrival per tick', () => {
  for (const mode of ['A','B']) for (let seed=1;seed<=80;seed++) {
    const engine = new GameEngine(seed); engine.start(mode); let previousTarget = null, peakObjects = 0;
    for (let i=0;i<900;i++) {
      const s = engine.state, arriving = s.mails.filter(mail => mail.step === 4);
      assert.ok(arriving.length <= 1,`simultaneous arrival in seed ${seed}`);
      if (arriving.length) {
        const mail = arriving[0];
        if (mail.type === 'phishing') {
          if (previousTarget) assert.ok((s.tick+1-previousTarget.tick)*MODES[mode].minTickMs >= Math.abs(mail.lane-previousTarget.lane)*90+100);
          previousTarget = { tick:s.tick+1,lane:mail.lane }; s.player = mail.lane;
        } else if (s.player === mail.lane) s.player = (mail.lane+1)%4;
      }
      engine.tick(); peakObjects = Math.max(peakObjects,s.mails.length);
      assert.equal(s.misses,0,`safe strategy lost in seed ${seed}`); assert.ok(s.mails.length <= s.maxObjects);
    }
    assert.ok(peakObjects > 1); assert.ok(engine.state.score > 30); assert.equal(engine.state.tickMs,MODES[mode].minTickMs);
  }
});
