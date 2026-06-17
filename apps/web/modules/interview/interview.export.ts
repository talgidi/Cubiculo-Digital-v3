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

const PDF_PAGE_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    background: #ffffff;
    line-height: 1.5;
  }
  .wrap {
    width: 750px;
    padding: 48px 40px;
    color: #1e1e2f;
  }
  .center {
    text-align: center;
  }
  .brand-line {
    width: 80px;
    height: 4px;
    background: #1980e6;
    margin: 0 auto 32px;
    border-radius: 2px;
  }
  .cover-title {
    font-size: 36px;
    font-weight: 900;
    color: #111827;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .cover-sub {
    font-size: 18px;
    color: #637588;
    margin-bottom: 40px;
  }
  .cover-meta {
    font-size: 13px;
    color: #9ca3af;
  }
  .section-title {
    font-size: 24px;
    font-weight: 800;
    color: #111827;
    padding-bottom: 12px;
    border-bottom: 3px solid #1980e6;
    width: 100%;
  }
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fafbfc;
    padding: 24px;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .card-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #eef2ff;
    color: #4f46e5;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
  }
  .badge {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 6px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  .badge-dept { background: #f5f3ff; color: #7c3aed; }
  .badge-topic { background: #eff6ff; color: #2563eb; }
  .card-q {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 6px;
  }
  .card-desc {
    font-size: 14px;
    color: #637588;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  .ans-box {
    background: #f3f4f6;
    padding: 18px 20px;
    border-radius: 8px;
    border-left: 4px solid #1980e6;
  }
  .ans-label {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .ans-text {
    font-size: 14px;
    color: #1e1e2f;
    white-space: pre-wrap;
    line-height: 1.7;
  }
  .fb-box {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fafbfc;
    padding: 28px;
    margin-top: 24px;
  }
  .fb-content {
    font-size: 14px;
    color: #1e1e2f;
    white-space: pre-wrap;
    line-height: 1.8;
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
  .fb-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    padding: 24px;
    background: #fefce8;
    border: 1px solid #fde68a;
    border-radius: 12px;
  }
  .fb-icon { font-size: 28px; }
  .fb-header-text h2 {
    font-size: 22px;
    font-weight: 800;
    color: #854d0e;
    margin-bottom: 2px;
  }
  .fb-header-text p {
    font-size: 13px;
    color: #a16207;
  }
`;

function wrapHtml(bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PDF_PAGE_CSS}</style></head><body><div class="wrap">${bodyHtml}</div></body></html>`;
}

function buildCoverHtml(): string {
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  return wrapHtml(`
    <div class="center" style="padding-top: 100px;">
      <div class="brand-line"></div>
      <div class="cover-title">Biblia Corporativa</div>
      <div class="cover-sub">Reporte de Entrevista Estratégica</div>
      <div class="cover-meta">Generado el ${escapeHtml(date)}</div>
    </div>
  `);
}

function buildSectionTitleHtml(title: string): string {
  return wrapHtml(`<div class="section-title">${escapeHtml(title)}</div>`);
}

function buildCardHtml(response: AnswerItem, index: number): string {
  return wrapHtml(`
    <div class="card">
      <div class="card-header">
        <span class="card-num">${index + 1}</span>
        <span class="badge badge-dept">${escapeHtml(response.questionDepartment)}</span>
        <span class="badge badge-topic">${escapeHtml(response.questionTopic)}</span>
      </div>
      <div class="card-q">${escapeHtml(response.questionTitle)}</div>
      <div class="card-desc">${escapeHtml(response.questionDescription)}</div>
      <div class="ans-box">
        <div class="ans-label">Tu Respuesta</div>
        <div class="ans-text">${escapeHtml(response.answerContent)}</div>
      </div>
    </div>
  `);
}

function buildFeedbackSectionHtml(feedback: FeedbackItem): string {
  const date = new Date(feedback.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return wrapHtml(`
    <div class="section-title center">Feedback de la IA</div>
    <div class="fb-header">
      <span class="fb-icon">✨</span>
      <div class="fb-header-text">
        <h2>Análisis Generado por IA</h2>
        <p>Generado el ${escapeHtml(date)}</p>
      </div>
    </div>
    <div class="fb-box">
      <div class="fb-content">${escapeHtml(feedback.content)}</div>
    </div>
  `);
}

function buildMarkdownContent(responses: AnswerItem[], feedback: FeedbackItem | null): string {
  const now = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  let md = `# Biblia Corporativa\n\n`;
  md += `**Resultados de Entrevista** — Generado el ${now}\n\n`;
  md += `---\n\n`;
  md += `## Preguntas y Respuestas\n\n`;

  responses.forEach((r, i) => {
    md += `### ${i + 1}. ${r.questionTitle}\n\n`;
    md += `**Departamento:** ${r.questionDepartment} | **Tópico:** ${r.questionTopic}\n\n`;
    md += `${r.questionDescription}\n\n`;
    md += `**Tu Respuesta:**\n> ${r.answerContent.replace(/\n/g, '\n> ')}\n\n`;
    md += `---\n\n`;
  });

  if (feedback) {
    md += `## Feedback de la IA\n\n`;
    md += `${feedback.content}\n\n`;
  }

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

async function renderToCanvas(html: string): Promise<{ imgData: string; heightMm: number; widthMm: number }> {
  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default;

  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-9999';
  container.style.background = '#ffffff';
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: false,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pageWidthMm = 190; // A4 width in mm minus margins
    const ratio = pageWidthMm / canvas.width;
    return { imgData, heightMm: canvas.height * ratio, widthMm: pageWidthMm };
  } finally {
    document.body.removeChild(container);
  }
}

export const exportToPdf = async (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 1. Portada (página propia)
  const cover = await renderToCanvas(buildCoverHtml());
  pdf.addImage(cover.imgData, 'JPEG', 10, 0, cover.widthMm, cover.heightMm);
  pdf.addPage();

  // 2. Título de sección + cada card individual
  const title = await renderToCanvas(buildSectionTitleHtml('Preguntas y Respuestas'));
  pdf.addImage(title.imgData, 'JPEG', 10, 10, title.widthMm, title.heightMm);
  let y = 10 + title.heightMm + 4;

  for (let i = 0; i < responses.length; i++) {
    const card = await renderToCanvas(buildCardHtml(responses[i], i));

    if (y + card.heightMm > pageHeight - 10) {
      pdf.addPage();
      y = 10;
    }

    pdf.addImage(card.imgData, 'JPEG', 10, y, card.widthMm, card.heightMm);
    y += card.heightMm + 6;
  }

  // 3. Feedback (página nueva, mismo estilo)
  if (feedback) {
    pdf.addPage();
    const fb = await renderToCanvas(buildFeedbackSectionHtml(feedback));
    pdf.addImage(fb.imgData, 'JPEG', 10, 10, fb.widthMm, fb.heightMm);
  }

  pdf.save(`biblia-corporativa-${Date.now()}.pdf`);
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const md = buildMarkdownContent(responses, feedback);
  downloadBlob(md, `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
