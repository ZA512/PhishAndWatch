(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const lanes = [210, 395, 575, 750];
  const steps = [[126, 171, 216, 261, 306], [126, 183, 240, 297, 354], [126, 183, 240, 297, 354], [126, 171, 216, 261, 306]];
  const defs = `
    <defs>
      <g id="skull" fill="currentColor" stroke="none">
        <path d="M0-12c-9 0-14 6-14 13 0 6 3 9 7 11v6h14v-6c4-2 7-5 7-11C14-6 9-12 0-12Z"/>
        <path d="m-9 0 6 1-1 5-5-1ZM9 0 3 1l1 5 5-1ZM0 5l-3 5h6Z" fill="#bdc2a0"/>
        <path d="M-4 14v4m4-4v4m4-4v4" stroke="#bdc2a0" stroke-width="1.5"/>
      </g>
      <g id="mail-legit" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linejoin="round">
        <rect x="-19" y="-12" width="38" height="25" rx=".6"/><path d="m-18-11 18 14 18-14M-18 12l12-11m24 11L6 1"/>
      </g>
      <g id="mail-phishing"><use href="#mail-legit"/><path d="M-9-8h18v19H-9Z" fill="#bdc2a0"/><use href="#skull" transform="translate(0,-1) scale(.64)"/></g>
      <g id="net" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="m-21 22 11-12" stroke-width="5"/><ellipse rx="16" ry="22" transform="rotate(40)"/>
        <path d="m-13-7 24 21m-19-32 23 19m-21-15-14 22m24-13-18 24m27-12-15 19" stroke-width="1.8"/>
      </g>
      <g id="head" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-14-4c0-12 9-17 20-12l7 9 13 1-2 4-38 2Z" stroke-width="2"/>
        <path d="M-9 2v10l6 6 11-1 6-9 8-2-10-3V0" fill="#bdc2a0" stroke-width="3"/>
        <circle cx="8" cy="5" r="1.6"/><path d="m3 13 6-1M-8 6l4 2" fill="none" stroke-width="2"/>
        <path d="M-10 0v7l5 2V0"/><circle cx="3" cy="-11" r="2" fill="#bdc2a0" stroke="none"/>
      </g>
      <g id="pose-0" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <use href="#head" transform="translate(29,24) rotate(-9)"/>
        <path d="M22 44 39 42 47 64 28 74 14 66Z" stroke-width="2"/>
        <path d="m21 48-12 8-3 15 10 2m21-24 11 5 15-15" fill="none" stroke-width="7"/>
        <path d="m25 72-4 14-15 12m30-27 12 14-6 13" fill="none" stroke-width="10"/>
        <path d="M4 99h13m24 0h15" fill="none" stroke-width="7"/>
        <path d="m22 45 7 20 12-4M18 66l14 5" fill="none" stroke="#bdc2a0" stroke-width="2"/>
        <use href="#net" transform="translate(76,9) rotate(5)"/>
      </g>
      <g id="pose-1" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <use href="#head" transform="translate(34,40) rotate(10)"/>
        <path d="m21 59 17-6 18 24-25 10-18-13Z" stroke-width="2"/>
        <path d="m24 63-12 8 1 14m28-22 15 8 10-13" fill="none" stroke-width="7"/>
        <path d="m28 84-14 5-8 13m34-22 17 8-13 13" fill="none" stroke-width="10"/>
        <path d="M3 103h16m24-1h17" fill="none" stroke-width="7"/>
        <path d="m24 62 10 16 13-8m-23 10 10 5" fill="none" stroke="#bdc2a0" stroke-width="2"/>
        <use href="#net" transform="translate(75,46) rotate(35)"/>
      </g>
      <g id="pose-2" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <use href="#head" transform="translate(66,41) scale(-1,1) rotate(3)"/>
        <path d="m53 54 19 6 10 20-25 7-14-17Z" stroke-width="2"/>
        <path d="m55 62-15 8-12-14m43 10 13 9-5 11" fill="none" stroke-width="7"/>
        <path d="m59 83-15 12 13 8m13-19 12 12 9 6" fill="none" stroke-width="10"/>
        <path d="M47 103h15m22 0h13" fill="none" stroke-width="7"/>
        <path d="m70 59-9 19-13-8m26 10-13 5" fill="none" stroke="#bdc2a0" stroke-width="2"/>
        <use href="#net" transform="translate(20,46) scale(-1,1) rotate(30)"/>
      </g>
      <g id="pose-3" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <use href="#head" transform="translate(63,23) scale(-1,1) rotate(-11)"/>
        <path d="m53 42 17 3 11 23-21 8-17-12Z" stroke-width="2"/>
        <path d="m54 47-11 6-14-16m42 16 11 10 5 14-9 2" fill="none" stroke-width="7"/>
        <path d="m59 73-15 14 8 13m20-26 7 15 14 10" fill="none" stroke-width="10"/>
        <path d="M44 101h14m28 0h13" fill="none" stroke-width="7"/>
        <path d="m67 45-7 21-12-5m28 7-16 6" fill="none" stroke="#bdc2a0" stroke-width="2"/>
        <use href="#net" transform="translate(20,9) scale(-1,1) rotate(5)"/>
      </g>
      <g id="impact" fill="none" stroke="currentColor" stroke-width="3"><path d="M0-22 5-9 19-16 13-3 25 3 11 7 14 21 2 14-8 25-9 10-23 9-14-2-22-14-8-11-5-25Z"/></g>
      <g id="burst" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><path d="M0-24v6m0 36v6m-24-24h6m36 0h6m-41-17 5 5m24 24 5 5m0-34-5 5m-24 24-5 5"/></g>
      <g id="server" stroke="#3c7880" stroke-width="3" fill="#799b8d"><path d="M0 0h49v143H0Z"/><path d="M7 10h35v24H7Zm0 34h35v24H7Zm0 34h35v24H7Zm0 34h35v24H7Z" fill="#497f80"/><path d="M12 18h13m-13 34h13m-13 34h13m-13 34h13" stroke="#a7b7a0" stroke-width="2"/><path d="M34 20h3m-3 34h3m-3 34h3m-3 34h3" stroke="#d1ae66"/></g>
      <g id="plant" stroke="#397477" stroke-width="2.8" stroke-linejoin="round"><path d="M0 0c-23-17-25-27-27-39C-11-39-6-17 0-8c-7-32-1-37 8-46C17-28 7-13 3-4c13-25 22-29 31-27C32-13 16-7 6 2c19-10 25-7 29-2-9 7-19 6-31 8" fill="#73a264"/><path d="M-15 8h34l-5 26H-10Z" fill="#b58c55"/><path d="M-17 7h39v6h-39Z" fill="#c6a068"/></g>
      <g id="monitor" stroke="#367783" stroke-width="3" fill="#558c8b"><rect width="51" height="33" rx="1"/><path d="M5 5h41v22H5Z" fill="#3c7782"/><path d="M23 34v9m-14 1h31" fill="none"/></g>
      <g id="bin" fill="none" stroke="#437d7d" stroke-width="3"><path d="M-18 0h36l-5 44h-26ZM-23-5h46v7h-46ZM-11 5l4 32m7-32v32m11-32-4 32M-16 16h32m-29 14h26"/></g>
      <g id="lamp" stroke="#357984" stroke-width="3" fill="#60939a"><path d="M0-15v15m-4-10h8v13h-8M-18 20C-18-4 18-4 18 20Z"/><path d="M-20 20h40"/></g>
    </defs>`;

  const decor = `
    <g class="printed" fill="none" stroke="#397b86" stroke-width="4" stroke-linejoin="round">
      <path d="M110 92h205l36-32h77m-318 42h214l36-32h69M531 60h77l34 32h203m-314-22h72l34 32h208"/>
      <path d="M210 102v17m185-17v17m180-17v17m175-17v17" stroke-width="3"/>
      <path d="M416 64c-29-36 7-71 43-58 16-26 51-21 65 0 36-10 62 23 37 52-8 18-32 22-51 14-27 12-52 10-68-3-10 1-18 0-26-5Z" transform="translate(0,29)" fill="#bdc2a0" stroke-width="5"/>
      <g transform="translate(487,57)" stroke-width="3"><circle r="26"/><ellipse rx="11" ry="26"/><path d="M-25-8h50m-50 16h50M0-26v52"/></g>
      <path d="m10 101 59 23v80l-59-22Zm67 11 34-14 23 13v83l-57 1Z" fill="#6c9790"/><path d="m19 115 41 16v58l-41-16Zm65 6 23-10v65H84Z" fill="#acc0a4" stroke-width="2"/>
      <path d="m32 120 0 58m14-52v58m-27-47 41 16m-41 2 41 16m25-40 17-4m-17 19 17-3m-17 20h18" stroke-width="2"/>
      <path d="m950 101-59 23v80l59-22Zm-67 11-34-14-23 13v83l57 1Z" fill="#6c9790"/><path d="m941 115-41 16v58l41-16Zm-65 6-23-10v65h23Z" fill="#acc0a4" stroke-width="2"/>
      <path d="m928 120 0 58m-14-52v58m27-47-41 16m41 2-41 16m-25-40-17-4m17 19-17-3m17 20h-18" stroke-width="2"/>
      <use href="#lamp" transform="translate(56,34)"/><use href="#lamp" transform="translate(907,34)"/>
      <use href="#lamp" transform="translate(274,114) scale(.8)"/><use href="#lamp" transform="translate(672,114) scale(.8)"/>
      <use href="#server" transform="translate(7,215) scale(.8,1.4)"/><use href="#server" transform="translate(900,287)"/>
      <use href="#plant" transform="translate(78,285) scale(.75)"/><path d="M48 316h80v7H48m10 0v85m57-85v76" stroke-width="3"/>
      <use href="#plant" transform="translate(122,360) scale(.7)"/><use href="#plant" transform="translate(33,409) scale(.8)"/>
      <path d="M279 389h109v9H279Zm8 10v44m93-44v44" fill="#c3a46c" stroke-width="3"/><use href="#monitor" transform="translate(296,348) scale(.85)"/>
      <path d="M350 369h13v18h-13m13-15h5v10h-5" stroke-width="2" fill="#c4b989"/>
      <path d="M461 385h107v10H461Zm7 12v46m92-46v46M477 397h36v46h-36m0-27h35m-26-9h11m-11 18h11" fill="#b5ab80" stroke-width="3"/><use href="#monitor" transform="translate(491,339)"/>
      <use href="#plant" transform="translate(453,365) scale(.65)"/><path d="M549 366h12v19h-12m3-19v-7h7v7" fill="#819e8d" stroke-width="2"/>
      <path d="M654 389h106v10H654m8 0v44m90-44v44" fill="#c3a46c" stroke-width="3"/><use href="#plant" transform="translate(706,361) scale(.72)"/>
      <use href="#plant" transform="translate(684,411) scale(.7)"/><use href="#plant" transform="translate(869,310) scale(.65)"/>
      <path d="M839 337h60v7h-60m10 0v77m39-77v77" stroke-width="3"/>
      <use href="#bin" transform="translate(421,397) scale(.75)"/><use href="#bin" transform="translate(721,397) scale(.75)"/>
      <path d="M844 232h33v44h-33Z" fill="#b8bba0" stroke-width="3"/><path d="M849 267h23m-20-4v-10m7 10v-15m7 15v-22m-15 9 7-5 5 2 7-9" stroke-width="2"/>
      <circle cx="862" cy="204" r="15" stroke-width="3"/><path d="M862 193v11l7 5m-7-20v3m0 24v3m-14-14h3m22 0h3" stroke-width="2"/>
      <path d="M117 219h27v19h-27Zm0 0 13 10 14-10" stroke-width="2"/>
      <path d="M73 420h65m112 10h33m294 0h50m147-2h83" stroke="#87a392" stroke-width="3"/>
    </g>
    <g stroke="#263526" stroke-width="2" stroke-dasharray="6 12" stroke-linecap="round" opacity=".20">
      ${lanes.map((x, i) => `<path d="M${x} 119V${steps[i][4] + 15}"/>`).join('')}
    </g>`;

  const digitPaths = [
    'M7 0h21l-4 5H10Z', 'm29 2-2 20-5-3 2-12Z', 'm27 25-2 20-5-5 2-12Z',
    'M3 47h21l-4-5H8Z', 'M1 25 6 28 4 40 0 45Z', 'M3 2 8 7 6 19 1 22Z', 'M6 21h18l3 3-5 3H5l-3-3Z'
  ];
  const digitMap = { 0:[0,1,2,3,4,5],1:[1,2],2:[0,1,6,4,3],3:[0,1,6,2,3],4:[5,6,1,2],5:[0,5,6,2,3],6:[0,5,6,4,2,3],7:[0,1,2],8:[0,1,2,3,4,5,6],9:[0,1,2,3,5,6] };
  class LcdRenderer {
    constructor(svg) {
      this.svg = svg;
      svg.innerHTML = defs + decor + `<g fill="#1a241a" font-family="Arial Narrow,Arial,sans-serif" font-weight="800"><text x="103" y="43" font-size="23">SCORE</text><text x="735" y="43" font-size="23">MISS</text></g>
        <text id="mode-label" x="487" y="110" text-anchor="middle" fill="#263526" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="2">GAME A</text>`;
      this.segments = new Map();
      for (let d = 0; d < 4; d++) for (let p = 0; p < 7; p++) this.add(`digit-${d}-${p}`, `<path d="${digitPaths[p]}"/>`, `translate(${189 + d * 37},12)`, d === 3 ? 'extra-digit' : '');
      for (let i = 0; i < 3; i++) this.add(`miss-${i}`, '<use href="#skull"/>', `translate(${827+i*43},31) scale(.85)`);
      for (let lane = 0; lane < 4; lane++) {
        for (let step = 0; step < 5; step++) for (const type of ['legit','phishing']) this.add(`mail-${lane}-${step}-${type}`, `<use href="#mail-${type}"/>`, `translate(${lanes[lane]},${steps[lane][step]})`);
        const x = [134,320,555,730][lane], y = [312,316,316,312][lane];
        this.add(`player-${lane}`, `<use href="#pose-${lane}"/>`, `translate(${x},${y})`);
        this.add(`impact-${lane}`, '<use href="#impact"/>', `translate(${lanes[lane]},${steps[lane][4]})`);
        this.add(`burst-${lane}`, '<use href="#burst"/>', `translate(${lanes[lane]},${steps[lane][4]})`);
      }
      this.modeLabel = svg.querySelector('#mode-label');
    }
    add(id, markup, transform, extra = '') {
      const group = document.createElementNS(NS, 'g');
      group.id = id; group.setAttribute('class', `lcd-segment ${extra}`); group.setAttribute('transform', transform);
      group.setAttribute('color', '#1a241a'); group.setAttribute('fill', 'currentColor'); group.innerHTML = markup;
      this.svg.append(group); this.segments.set(id, group);
    }
    render(state, all = false) {
      const active = new Set();
      const digits = String(state.score).padStart(3, '0').slice(-4);
      for (let d = 0; d < digits.length; d++) for (const part of digitMap[digits[d]]) active.add(`digit-${d}-${part}`);
      for (let m = 0; m < state.misses; m++) active.add(`miss-${m}`);
      if (state.status !== 'MISS_ANIMATION' || state.missFrames % 2 === 0) active.add(`player-${state.player}`);
      for (const mail of state.mails) active.add(`mail-${mail.lane}-${mail.step}-${mail.type}`);
      for (const effect of state.effects) if (effect.age < 2) active.add(`${effect.age === 0 ? 'impact' : 'burst'}-${effect.lane}`);
      for (const [id, group] of this.segments) { group.classList.toggle('active', all || active.has(id)); if (id.startsWith('digit-3')) group.style.display = all || digits.length > 3 ? '' : 'none'; }
      this.modeLabel.textContent = `GAME ${state.mode}`;
    }
  }
  window.PhishGame.LcdRenderer = LcdRenderer;
})();
