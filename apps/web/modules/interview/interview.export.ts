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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const PDF_SCOPE = '_p';

const pdfCss = `
.${PDF_SCOPE} * { margin: 0; padding: 0; box-sizing: border-box; }
.${PDF_SCOPE} { font-family: 'Helvetica', 'Arial', sans-serif; background: #ffffff; color: #1e1e2f; line-height: 1.4; width: 750px; }
.${PDF_SCOPE} .tc { text-align: center; }
.${PDF_SCOPE} .bl { width: 80px; height: 4px; background: #1980e6; margin: 0 auto 28px; border-radius: 2px; }
.${PDF_SCOPE} .ct { font-size: 32px; font-weight: 900; color: #111827; margin-bottom: 6px; }
.${PDF_SCOPE} .cs { font-size: 17px; color: #637588; margin-bottom: 32px; }
.${PDF_SCOPE} .cm { font-size: 12px; color: #9ca3af; }
.${PDF_SCOPE} .st { font-size: 20px; font-weight: 800; color: #111827; padding-bottom: 8px; border-bottom: 3px solid #1980e6; }
.${PDF_SCOPE} .c { border: 1px solid #e5e7eb; border-radius: 8px; background: #fafbfc; padding: 14px 16px; }
.${PDF_SCOPE} .ch { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.${PDF_SCOPE} .cn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #eef2ff; color: #4f46e5; font-weight: 800; font-size: 12px; flex-shrink: 0; }
.${PDF_SCOPE} .b { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600; letter-spacing: 0.2px; }
.${PDF_SCOPE} .bd { background: #f5f3ff; color: #7c3aed; }
.${PDF_SCOPE} .bt { background: #eff6ff; color: #2563eb; }
.${PDF_SCOPE} .cq { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.${PDF_SCOPE} .cd { font-size: 13px; color: #637588; margin-bottom: 10px; line-height: 1.4; }
.${PDF_SCOPE} .ab { background: #f3f4f6; padding: 10px 14px; border-radius: 6px; border-left: 3px solid #1980e6; }
.${PDF_SCOPE} .al { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
.${PDF_SCOPE} .at { font-size: 13px; color: #1e1e2f; white-space: pre-wrap; line-height: 1.6; }
.${PDF_SCOPE} .fh { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding: 16px 20px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; }
.${PDF_SCOPE} .fi { font-size: 24px; }
.${PDF_SCOPE} .fht h2 { font-size: 18px; font-weight: 800; color: #854d0e; margin-bottom: 1px; }
.${PDF_SCOPE} .fht p { font-size: 12px; color: #a16207; }
`;

function buildCoverHtml(): string {
  const d = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  return `<div class="tc" style="padding:60px 40px 20px">
    <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#1980e6,#1a1a2e);margin:0 auto 24px;display:flex;align-items:center;justify-content:center">
      <span style="color:#fff;font-size:34px;font-weight:900">B</span>
    </div>
    <div class="bl"></div>
    <div class="ct">Biblia Corporativa</div>
    <div class="cs">Reporte de Entrevista Estratégica</div>
    <div style="width:200px;height:1px;background:#e5e7eb;margin:0 auto 24px"></div>
    <div class="cm">Generado el ${escapeHtml(d)}</div>
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af">Cubículo Digital · Business Architecture</div>
  </div>`;
}

function buildSectionTitleHtml(title: string): string {
  return `<div class="st">${escapeHtml(title)}</div>`;
}

function buildCardHtml(r: AnswerItem, i: number): string {
  return `<div class="c">
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
  </div>`;
}

function buildFeedbackHeaderHtml(f: FeedbackItem): string {
  const d = new Date(f.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return `<div>
    <div class="st tc">Feedback de la IA</div>
    <div class="fh">
      <span class="fi">✨</span>
      <div class="fht"><h2>Análisis Generado por IA</h2><p>Generado el ${escapeHtml(d)}</p></div>
    </div>
  </div>`;
}

function buildMarkdownContent(responses: AnswerItem[], feedback: FeedbackItem | null): string {
  const now = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  let md = `# Biblia Corporativa\n\n**Resultados de Entrevista** — Generado el ${now}\n\n---\n\n## Preguntas y Respuestas\n\n`;
  responses.forEach((r, i) => {
    md += `### ${i + 1}. ${r.questionTitle}\n\n**Departamento:** ${r.questionDepartment} | **Tópico:** ${r.questionTopic}\n\n${r.questionDescription}\n\n**Tu Respuesta:**\n> ${r.answerContent.replace(/\n/g, '\n> ')}\n\n---\n\n`;
  });
  if (feedback) md += `## Feedback de la IA\n\n${feedback.content}\n\n`;
  return md;
}

function downloadBlob(c: string, f: string, m: string) {
  const b = new Blob([c], { type: m });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = f;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(u);
}

async function render(html: string): Promise<{ data: string; hMm: number; wMm: number }> {
  const mod = await import('html2canvas');
  const h2c = mod.default;

  const styleEl = document.createElement('style');
  styleEl.textContent = pdfCss;
  document.head.appendChild(styleEl);

  const el = document.createElement('div');
  el.className = PDF_SCOPE;
  el.innerHTML = html;
  el.style.cssText = 'position:fixed;top:0;left:0;z-index:-9999;overflow:hidden';
  document.body.appendChild(el);

  try {
    const cv = await h2c(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', allowTaint: false, logging: false });
    const wMm = 190;
    return { data: cv.toDataURL('image/jpeg', 0.95), hMm: cv.height * (wMm / cv.width), wMm };
  } finally {
    document.body.removeChild(el);
    document.head.removeChild(styleEl);
  }
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s/gm, '• ')
    .replace(/^>\s/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .trim();
}

function addFeedbackContent(pdf: import('jspdf').jsPDF, text: string, startY: number) {
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const ml = 15;
  const tw = pw - ml * 2;
  const fh = 4.5;
  let y = startY;

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);

  const paragraphs = text.split(/\n\n+/);

  for (const para of paragraphs) {
    const cleaned = cleanMarkdown(para);
    if (!cleaned) continue;

    const lines = pdf.splitTextToSize(cleaned, tw);

    for (const line of lines) {
      if (y + fh > ph - ml) {
        pdf.addPage();
        y = ml;
      }
      pdf.text(line, ml, y);
      y += fh;
    }

    y += 2;
  }
}

export const exportToPdf = async (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const ph = pdf.internal.pageSize.getHeight();

  // 1. Cover (own page)
  const cv = await render(buildCoverHtml());
  pdf.addImage(cv.data, 'JPEG', 10, 15, cv.wMm, cv.hMm);
  pdf.addPage();

  // 2. Section title
  const st = await render(buildSectionTitleHtml('Preguntas y Respuestas'));
  pdf.addImage(st.data, 'JPEG', 10, 10, st.wMm, st.hMm);
  let y = 10 + st.hMm + 4;

  // 3. Answer cards (atomic, compact)
  for (let i = 0; i < responses.length; i++) {
    const cd = await render(buildCardHtml(responses[i], i));
    if (y + cd.hMm > ph - 10) { pdf.addPage(); y = 10; }
    pdf.addImage(cd.data, 'JPEG', 10, y, cd.wMm, cd.hMm);
    y += cd.hMm + 3;
  }

  // 4. Feedback: header as image + content as real text
  if (feedback) {
    pdf.addPage();
    const fh = await render(buildFeedbackHeaderHtml(feedback));
    pdf.addImage(fh.data, 'JPEG', 10, 10, fh.wMm, fh.hMm);
    addFeedbackContent(pdf, feedback.content, 10 + fh.hMm + 10);
  }

  pdf.save(`biblia-corporativa-${Date.now()}.pdf`);
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  downloadBlob(buildMarkdownContent(responses, feedback), `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
