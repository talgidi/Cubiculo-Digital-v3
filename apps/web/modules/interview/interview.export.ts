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

const PDF_STYLES = `
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    max-width: 750px;
    margin: 0 auto;
    padding: 48px 40px;
    color: #1e1e2f;
    background: #ffffff;
    line-height: 1.5;
  }
  .cover {
    text-align: center;
    padding: 100px 40px;
    page-break-after: always;
  }
  .cover .brand-line {
    width: 80px;
    height: 4px;
    background: #1980e6;
    margin: 0 auto 32px;
    border-radius: 2px;
  }
  .cover h1 {
    font-size: 36px;
    font-weight: 900;
    color: #111827;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }
  .cover .subtitle {
    font-size: 18px;
    color: #637588;
    margin: 0 0 40px;
  }
  .cover .meta {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }
  .section-title {
    font-size: 24px;
    font-weight: 800;
    color: #111827;
    margin: 0 0 24px;
    padding-bottom: 12px;
    border-bottom: 3px solid #1980e6;
  }
  .answer-card {
    margin-bottom: 28px;
    padding: 24px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fafbfc;
  }
  .answer-card:hover {
    border-color: #1980e6;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .card-number {
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
  .badge-dept {
    background: #f5f3ff;
    color: #7c3aed;
  }
  .badge-topic {
    background: #eff6ff;
    color: #2563eb;
  }
  .card-question {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 6px;
  }
  .card-description {
    font-size: 14px;
    color: #637588;
    margin: 0 0 16px;
    line-height: 1.5;
  }
  .answer-box {
    background: #f3f4f6;
    padding: 18px 20px;
    border-radius: 8px;
    border-left: 4px solid #1980e6;
  }
  .answer-label {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .answer-text {
    font-size: 14px;
    color: #1e1e2f;
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.7;
  }
  .feedback-section {
    page-break-before: always;
  }
  .feedback-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    padding: 24px;
    background: #fefce8;
    border: 1px solid #fde68a;
    border-radius: 12px;
  }
  .feedback-icon {
    font-size: 28px;
  }
  .feedback-header-text h2 {
    font-size: 22px;
    font-weight: 800;
    color: #854d0e;
    margin: 0 0 2px;
  }
  .feedback-header-text p {
    font-size: 13px;
    color: #a16207;
    margin: 0;
  }
  .feedback-content {
    padding: 28px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fafbfc;
  }
  .feedback-content pre {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 14px;
    color: #1e1e2f;
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.8;
  }
`;

function buildAnswersHtml(responses: AnswerItem[]): string {
  let html = '';
  responses.forEach((r, i) => {
    html += `
      <div class="answer-card">
        <div class="card-header">
          <span class="card-number">${i + 1}</span>
          <span class="badge badge-dept">${escapeHtml(r.questionDepartment)}</span>
          <span class="badge badge-topic">${escapeHtml(r.questionTopic)}</span>
        </div>
        <h3 class="card-question">${escapeHtml(r.questionTitle)}</h3>
        <p class="card-description">${escapeHtml(r.questionDescription)}</p>
        <div class="answer-box">
          <p class="answer-label">Tu Respuesta</p>
          <p class="answer-text">${escapeHtml(r.answerContent)}</p>
        </div>
      </div>
    `;
  });
  return html;
}

function buildFeedbackHtml(feedback: FeedbackItem): string {
  const date = new Date(feedback.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return `
    <div class="feedback-section">
      <div class="section-title">Feedback de la IA</div>
      <div class="feedback-header">
        <div class="feedback-icon">✨</div>
        <div class="feedback-header-text">
          <h2>Análisis Generado por IA</h2>
          <p>Generado el ${escapeHtml(date)}</p>
        </div>
      </div>
      <div class="feedback-content">
        <pre>${escapeHtml(feedback.content)}</pre>
      </div>
    </div>
  `;
}

function buildAnswersPage(responses: AnswerItem[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><style>${PDF_STYLES}</style></head>
    <body>
      <div class="cover">
        <div class="brand-line"></div>
        <h1>Biblia Corporativa</h1>
        <p class="subtitle">Reporte de Entrevista Estratégica</p>
        <p class="meta">Generado el ${escapeHtml(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))}</p>
      </div>
      <div class="section-title">Preguntas y Respuestas</div>
      ${buildAnswersHtml(responses)}
    </body>
    </html>
  `;
}

function buildFeedbackPage(feedback: FeedbackItem): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><style>${PDF_STYLES}</style></head>
    <body>${buildFeedbackHtml(feedback)}</body>
    </html>
  `;
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

async function renderToCanvas(html: string): Promise<HTMLCanvasElement> {
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
    return canvas;
  } finally {
    document.body.removeChild(container);
  }
}

function addCanvasToPdf(pdf: import('jspdf').jsPDF, canvas: HTMLCanvasElement): void {
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const ratio = pageWidth / canvas.width;
  const scaledHeight = canvas.height * ratio;
  const pagesNeeded = Math.ceil(scaledHeight / pageHeight);

  for (let i = 0; i < pagesNeeded; i++) {
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, -i * pageHeight, pageWidth, scaledHeight);
  }
}

export const exportToPdf = async (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const answersCanvas = await renderToCanvas(buildAnswersPage(responses));
  addCanvasToPdf(pdf, answersCanvas);

  if (feedback) {
    const feedbackCanvas = await renderToCanvas(buildFeedbackPage(feedback));
    pdf.addPage();
    addCanvasToPdf(pdf, feedbackCanvas);
  }

  pdf.save(`biblia-corporativa-${Date.now()}.pdf`);
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const md = buildMarkdownContent(responses, feedback);
  downloadBlob(md, `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
