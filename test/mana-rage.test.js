const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// 从单文件 index.html 抽出 <script> 在无 DOM 环境下执行 CORE（boot 被 HAS_DOM 守卫跳过）
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new Function(code)();
const API = globalThis.ManaRage;

test('内联 CORE 自测全绿', () => {
  const r = API.runSelfTest(12345);
  const failed = r.results.filter(x => !x.ok);
  assert.strictEqual(r.failed, 0, JSON.stringify(failed));
  assert.ok(r.passed >= 20, '至少 20 项，实测 ' + r.passed);
});

test('穿戴输入模块已导出（戒指/手杖）', () => {
  assert.strictEqual(typeof API.createWearableInput, 'function');
  assert.ok(API.WEARABLE_DEFAULTS.RING_SHAKE > 0 && API.WEARABLE_DEFAULTS.CANE_TAP > 0);
  // createWearableInput 本身不触碰 window，可安全构造并 start 空跑
  const wi = API.createWearableInput({});
  assert.strictEqual(typeof wi.start, 'function');
  assert.strictEqual(typeof wi.requestPermission, 'function');
});

test('彩蛋格斗模型：组合技与必杀', () => {
  const a = API.createArena(9, { emoji: '🐷', name: '测试怪' });
  for (let i = 0; i < API.EGG.MINIONS; i++) a.strike('punch');
  assert.strictEqual(a.strike('punch').move, 'punch');
  assert.strictEqual(a.strike('punch').move, 'punch');
  assert.strictEqual(a.strike('punch').move, 'upper');
  a.meter = 100;
  assert.strictEqual(a.special().type, 'special');
});

test('女凝模式老板转性', () => {
  const g = API.createEngine(3, { gaze: true });
  const n = API.createEngine(3, {});
  assert.strictEqual(g.state.boss.id, n.state.boss.id);
  assert.ok(g.state.boss.gazeOn === true && g.state.boss.taunts.join('|') !== n.state.boss.taunts.join('|'));
  // 默认反派也应全部为男性形象（无 👩/👵）
  for (const boss of API.BOSSES) assert.ok(!/👩|👵/.test(boss.face), boss.name + ' 仍为女性');
});
