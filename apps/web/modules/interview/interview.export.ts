interface AnswerItem {
  questionId: string;
  questionTitle: string;
  questionDescription: string;
  questionDepartment: string;
  questionTopic: string;
  answerContent: string;
  isCompleted: boolean;
}

interface FeedbackItem {
  id: string;
  content: string;
  createdAt: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const compactCss = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    background: #ffffff;
    color: #1e1e2f;
    line-height: 1.4;
  }
  .w { width: 750px; }
  .tc { text-align: center; }
  .bl {
    width: 80px; height: 4px; background: #1980e6;
    margin: 0 auto 28px; border-radius: 2px;
  }
  .ct { font-size: 32px; font-weight: 900; color: #111827; margin-bottom: 6px; }
  .cs { font-size: 17px; color: #637588; margin-bottom: 32px; }
  .cm { font-size: 12px; color: #9ca3af; }
  .st {
    font-size: 20px; font-weight: 800; color: #111827;
    padding-bottom: 8px; border-bottom: 3px solid #1980e6;
  }
  .c {
    border: 1px solid #e5e7eb; border-radius: 8px;
    background: #fafbfc; padding: 14px 16px;
  }
  .ch {
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
  }
  .cn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: #eef2ff; color: #4f46e5;
    font-weight: 800; font-size: 12px; flex-shrink: 0;
  }
  .b {
    font-size: 10px; padding: 2px 8px; border-radius: 4px;
    font-weight: 600; letter-spacing: 0.2px;
  }
  .bd { background: #f5f3ff; color: #7c3aed; }
  .bt { background: #eff6ff; color: #2563eb; }
  .cq { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .cd { font-size: 13px; color: #637588; margin-bottom: 10px; line-height: 1.4; }
  .ab {
    background: #f3f4f6; padding: 10px 14px;
    border-radius: 6px; border-left: 3px solid #1980e6;
  }
  .al {
    font-size: 10px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;
  }
  .at { font-size: 13px; color: #1e1e2f; white-space: pre-wrap; line-height: 1.6; }
  .fb {
    border: 1px solid #e5e7eb; border-radius: 8px;
    background: #fafbfc; padding: 18px 20px; margin-top: 14px;
  }
  .fc {
    font-size: 13px; color: #1e1e2f;
    white-space: pre-wrap; line-height: 1.7;
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
  .fh {
    display: flex; align-items: center; gap: 12px;
    margin-top: 14px; padding: 16px 20px;
    background: #fefce8; border: 1px solid #fde68a; border-radius: 8px;
  }
  .fi { font-size: 24px; }
  .fht h2 { font-size: 18px; font-weight: 800; color: #854d0e; margin-bottom: 1px; }
  .fht p { font-size: 12px; color: #a16207; }
`;

function w(html: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${compactCss}</style></head><body><div class="w">${html}</div></body></html>`;
}

function buildCoverHtml(): string {
  return w(`<div class="tc" style="padding:80px 40px 0;">
    <div class="bl"></div>
    <div class="ct">Biblia Corporativa</div>
    <div class="cs">Reporte de Entrevista Estratégica</div>
    <div class="cm">Generado el ${escapeHtml(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))}</div>
  </div>`);
}

function buildSectionTitleHtml(title: string): string {
  return w(`<div class="st">${escapeHtml(title)}</div>`);
}

function buildCardHtml(r: AnswerItem, i: number): string {
  return w(`<div class="c">
    <div class="ch">
      <span class="cn">${i + 1}</span>
      <span class="b bd">${escapeHtml(r.questionDepartment)}</span>
      <span class="b bt">${escapeHtml(r.questionTopic)}</span>
    </div>
    <div class="cq">${escapeHtml(r.questionTitle)}</div>
    <div class="cd">${escapeHtml(r.questionDescription)}</div>
    <div class="ab">
      <div class="al">Tu Respuesta</div>
      <div class="at">${escapeHtml(r.answerContent)}</div>
    </div>
  </div>`);
}

function buildSectionTitleHtmlCentered(title: string): string {
  return w(`<div class="st tc">${escapeHtml(title)}</div>`);
}

function buildFeedbackHtml(f: FeedbackItem): string {
  const d = new Date(f.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return w(`<div>
    <div class="st tc">Feedback de la IA</div>
    <div class="fh">
      <span class="fi">✨</span>
      <div class="fht"><h2>Análisis Generado por IA</h2><p>Generado el ${escapeHtml(d)}</p></div>
    </div>
    <div class="fb"><div class="fc">${escapeHtml(f.content)}</div></div>
  </div>`);
}

function buildMarkdownContent(responses: AnswerItem[], feedback: FeedbackItem | null): string {
  const now = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  let md = `# Biblia Corporativa\n\n**Resultados de Entrevista** — Generado el ${now}\n\n---\n\n## Preguntas y Respuestas\n\n`;
  responses.forEach((r, i) => {
    md += `### ${i + 1}. ${r.questionTitle}\n\n**Departamento:** ${r.questionDepartment} | **Tópico:** ${r.questionTopic}\n\n${r.questionDescription}\n\n**Tu Respuesta:**\n> ${r.answerContent.replace(/\n/g, '\n> ')}\n\n---\n\n`;
  });
  if (feedback) md += `## Feedback de la IA\n\n${feedback.content}\n\n`;
  return md;
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function render(html: string): Promise<{ data: string; hMm: number; wMm: number }> {
  const m = await import('html2canvas');
  const h2c = m.default;
  const el = document.createElement('div');
  el.innerHTML = html;
  el.style.cssText = 'position:fixed;top:0;left:0;z-index:-9999;background:#fff';
  document.body.appendChild(el);
  try {
    const cv = await h2c(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', allowTaint: false, logging: false });
    const wMm = 190;
    return { data: cv.toDataURL('image/jpeg', 0.95), hMm: cv.height * (wMm / cv.width), wMm };
  } finally { document.body.removeChild(el); }
}

function addMultiPage(pdf: import('jspdf').jsPDF, data: string, hMm: number, wMm: number, top: number) {
  const pH = pdf.internal.pageSize.getHeight();
  let remaining = hMm;
  let offset = 0;
  let first = true;

  while (remaining > 0) {
    const yPos = first ? top : 0;
    pdf.addImage(data, 'JPEG', 10, offset + yPos, wMm, hMm);
    const consumed = first ? (pH - top) : pH;
    remaining -= consumed;
    if (remaining > 0) { pdf.addPage(); offset -= consumed; }
    first = false;
  }
}

export const exportToPdf = async (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pH = pdf.internal.pageSize.getHeight();

  // 1. Cover (own page)
  const cv = await render(buildCoverHtml());
  pdf.addImage(cv.data, 'JPEG', 10, 0, cv.wMm, cv.hMm);
  pdf.addPage();

  // 2. Section title "Preguntas y Respuestas"
  const st = await render(buildSectionTitleHtml('Preguntas y Respuestas'));
  pdf.addImage(st.data, 'JPEG', 10, 10, st.wMm, st.hMm);
  let y = 10 + st.hMm + 4;

  // 3. Each answer card (atomic, compact)
  for (let i = 0; i < responses.length; i++) {
    const cd = await render(buildCardHtml(responses[i], i));
    if (y + cd.hMm > pH - 10) { pdf.addPage(); y = 10; }
    pdf.addImage(cd.data, 'JPEG', 10, y, cd.wMm, cd.hMm);
    y += cd.hMm + 3;
  }

  // 4. Feedback (multi-page, new page)
  if (feedback) {
    pdf.addPage();
    const fb = await render(buildFeedbackHtml(feedback));
    addMultiPage(pdf, fb.data, fb.hMm, fb.wMm, 10);
  }

  pdf.save(`biblia-corporativa-${Date.now()}.pdf`);
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  downloadBlob(buildMarkdownContent(responses, feedback), `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
