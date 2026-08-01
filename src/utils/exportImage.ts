import { MoodLog, JournalEntry } from '../types';
import { GODS_DATA, GOD_LIST } from '../data/godsData';

export const exportTabletAsPNG = (logs: MoodLog[], journalEntries: JournalEntry[]) => {
  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1500;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background Fill with Deep Dark Emerald & Gold Atmospheric Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0a0a0a');
  bgGrad.addColorStop(0.3, '#08170f');
  bgGrad.addColorStop(0.7, '#0d2818');
  bgGrad.addColorStop(1, '#050a07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Outer Double Gold Border
  ctx.strokeStyle = '#c9a35d';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(201, 163, 93, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Corner Ornaments
  const corners = [
    { x: 35, y: 35 },
    { x: width - 35, y: 35 },
    { x: 35, y: height - 35 },
    { x: width - 35, y: height - 35 },
  ];
  ctx.fillStyle = '#c9a35d';
  corners.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Header Title Section
  let curY = 80;

  // Laurel Wreath Symbol
  ctx.fillStyle = '#dfb76c';
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ TEMPLE OF MIND & SOUL ✦', width / 2, curY);

  curY += 50;
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 52px "Cinzel Decorative", Georgia, serif';
  ctx.fillText('driftedAway', width / 2, curY);

  curY += 35;
  ctx.fillStyle = '#dfb76c';
  ctx.font = '18px "Cinzel", Georgia, serif';
  ctx.fillText('A MYTHOLOGICAL SANCTUARY FOR MIND • ARCHIVAL TABLET', width / 2, curY);

  curY += 25;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  const nowStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillText(`Exported on ${nowStr}`, width / 2, curY);

  // Divider Line
  curY += 30;
  ctx.strokeStyle = 'rgba(201, 163, 93, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, curY);
  ctx.lineTo(width - 100, curY);
  ctx.stroke();

  // 3. Stats Overview Cards Section
  curY += 40;
  const cardWidth = 320;
  const cardHeight = 110;
  const gap = 40;
  const startX = (width - (cardWidth * 3 + gap * 2)) / 2;

  // Compute stats
  const totalOfferings = logs.length;
  const totalEntries = journalEntries.length;

  const godCounts: Record<string, number> = {};
  logs.forEach((l) => {
    godCounts[l.godId] = (godCounts[l.godId] || 0) + 1;
  });

  let topGod = 'athena';
  let maxC = 0;
  Object.entries(godCounts).forEach(([gid, cnt]) => {
    if (cnt > maxC) {
      maxC = cnt;
      topGod = gid;
    }
  });

  const avgIntensity =
    totalOfferings > 0
      ? (logs.reduce((acc, l) => acc + (l.intensity || 3), 0) / totalOfferings).toFixed(1)
      : '0';

  const stats = [
    {
      label: 'TOTAL OFFERINGS RECORDED',
      value: `${totalOfferings}`,
      sub: `${totalEntries} Journal Reflections`,
      color: '#fef08a',
    },
    {
      label: 'DOMINANT EMOTIONAL DEITY',
      value: maxC > 0 ? GODS_DATA[topGod as keyof typeof GODS_DATA]?.name || 'Athena' : 'None',
      sub: maxC > 0 ? `${GODS_DATA[topGod as keyof typeof GODS_DATA]?.emotion} (${maxC}x)` : 'No logs yet',
      color: '#34d399',
    },
    {
      label: 'AVG EMOTION INTENSITY',
      value: `${avgIntensity} / 5`,
      sub: 'Emotional Equilibrium',
      color: '#fde047',
    },
  ];

  stats.forEach((st, idx) => {
    const cx = startX + idx * (cardWidth + gap);

    // Card background
    ctx.fillStyle = 'rgba(14, 28, 20, 0.85)';
    ctx.strokeStyle = 'rgba(201, 163, 93, 0.4)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(cx, curY, cardWidth, cardHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Card text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c9a35d';
    ctx.font = 'bold 11px "Cinzel", Georgia, serif';
    ctx.fillText(st.label, cx + cardWidth / 2, curY + 28);

    ctx.fillStyle = st.color;
    ctx.font = 'bold 26px "Cinzel", Georgia, serif';
    ctx.fillText(st.value, cx + cardWidth / 2, curY + 62);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(st.sub, cx + cardWidth / 2, curY + 88);
  });

  // 4. Heatmap Constellation Section
  curY += cardHeight + 50;

  ctx.fillStyle = '#dfb76c';
  ctx.font = 'bold 18px "Cinzel", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('RECENT 28-DAY TEMPLE CONSTELLATION (HEATMAP)', 80, curY);

  curY += 25;
  const gridColumns = 7;
  const gridRows = 4;
  const tileW = 140;
  const tileH = 65;
  const tileGapX = 12;
  const tileGapY = 12;
  const gridStartX = (width - (gridColumns * tileW + (gridColumns - 1) * tileGapX)) / 2;

  // Generate 28 days
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 86400000;
    const dayLogs = logs.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
    days.push({ date: d, dayLogs });
  }

  days.forEach((day, index) => {
    const col = index % gridColumns;
    const row = Math.floor(index / gridColumns);
    const tx = gridStartX + col * (tileW + tileGapX);
    const ty = curY + row * (tileH + tileGapY);

    const latestLog = day.dayLogs[day.dayLogs.length - 1];
    const god = latestLog ? GODS_DATA[latestLog.godId as keyof typeof GODS_DATA] : null;

    ctx.fillStyle = god ? 'rgba(26, 61, 46, 0.9)' : 'rgba(10, 10, 10, 0.6)';
    ctx.strokeStyle = god ? '#c9a35d' : 'rgba(201, 163, 93, 0.15)';
    ctx.lineWidth = god ? 1.5 : 1;

    ctx.beginPath();
    ctx.roundRect(tx, ty, tileW, tileH, 8);
    ctx.fill();
    ctx.stroke();

    // Date Label
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    const dStr = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    ctx.fillText(dStr, tx + tileW / 2, ty + 20);

    // Deity Label
    if (god) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px "Cinzel", Georgia, serif';
      ctx.fillText(god.name, tx + tileW / 2, ty + 40);

      ctx.fillStyle = '#34d399';
      ctx.font = '10px sans-serif';
      ctx.fillText(god.emotion, tx + tileW / 2, ty + 54);
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = '14px serif';
      ctx.fillText('•', tx + tileW / 2, ty + 42);
    }
  });

  curY += gridRows * (tileH + tileGapY) + 40;

  // 5. Deity Frequency Breakdown Bars
  ctx.fillStyle = '#dfb76c';
  ctx.font = 'bold 18px "Cinzel", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('DEITY FREQUENCY DISTRIBUTION', 80, curY);

  curY += 25;
  const barBoxW = width - 160;
  const barHeight = 22;

  GOD_LIST.slice(0, 5).forEach((god) => {
    const count = godCounts[god.id] || 0;
    const percentage = totalOfferings > 0 ? Math.round((count / totalOfferings) * 100) : 0;

    // Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '13px "Cinzel", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${god.name} (${god.emotion})`, 80, curY + 16);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`${count} times (${percentage}%)`, width - 80, curY + 16);

    // Track
    curY += 24;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(201, 163, 93, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(80, curY, barBoxW, barHeight, 6);
    ctx.fill();
    ctx.stroke();

    // Progress
    if (percentage > 0) {
      const fillW = Math.max(12, (barBoxW * percentage) / 100);
      ctx.fillStyle = god.color || '#10b981';
      ctx.beginPath();
      ctx.roundRect(80, curY, fillW, barHeight, 6);
      ctx.fill();
    }

    curY += barHeight + 16;
  });

  // 6. Footer Seal
  curY = height - 70;
  ctx.strokeStyle = 'rgba(201, 163, 93, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, curY);
  ctx.lineTo(width - 100, curY);
  ctx.stroke();

  curY += 35;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c9a35d';
  ctx.font = '12px "Cinzel", Georgia, serif';
  ctx.fillText('driftedAway • SACRED TEMPLE ARCHIVE • CONFIDENTIAL & SERENE', width / 2, curY);

  // Trigger Download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `driftedAway_Archival_Tablet_${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
