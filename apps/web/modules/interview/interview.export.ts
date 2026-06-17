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

function buildHtmlContent(responses: AnswerItem[], feedback: FeedbackItem | null): string {
  const now = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  let answersHtml = '';

  responses.forEach((r, i) => {
    answersHtml += `
      <div style="margin-bottom: 28px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; font-weight: 700; font-size: 14px;">${i + 1}</span>
          <span style="font-size: 12px; padding: 2px 10px; border-radius: 6px; background: #f3e8ff; color: #9333ea;">${escapeHtml(r.questionDepartment)}</span>
          <span style="font-size: 12px; padding: 2px 10px; border-radius: 6px; background: #dbeafe; color: #2563eb;">${escapeHtml(r.questionTopic)}</span>
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px 0;">${escapeHtml(r.questionTitle)}</h3>
        <p style="font-size: 14px; color: #637588; margin: 0 0 12px 0;">${escapeHtml(r.questionDescription)}</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
          <p style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 0 0 6px 0; text-transform: uppercase;">Tu Respuesta</p>
          <p style="font-size: 14px; color: #1a1a2e; margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(r.answerContent)}</p>
        </div>
      </div>
    `;
  });

  let feedbackHtml = '';
  if (feedback) {
    feedbackHtml = `
      <hr style="border: none; border-top: 2px solid #1980e6; margin: 40px 0 32px;" />
      <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px;">Feedback de la IA</h2>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
        <p style="font-size: 14px; color: #1a1a2e; margin: 0; white-space: pre-wrap; line-height: 1.7;">${escapeHtml(feedback.content)}</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: #1a1a2e;
          background: white;
        }
        h1 { font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
        hr { border: none; border-top: 2px solid #1980e6; margin-bottom: 32px; }
      </style>
    </head>
    <body>
      <h1>Biblia Corporativa</h1>
      <p style="color: #637588; font-size: 14px; margin-bottom: 24px;">Resultados de Entrevista — Generado el ${escapeHtml(now)}</p>
      <hr />
      <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px;">Preguntas y Respuestas</h2>
      ${answersHtml}
      ${feedbackHtml}
    </body>
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

export const exportToPdf = async (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const [html2canvasModule, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const html2canvas = html2canvasModule.default;

  const container = document.createElement('div');
  container.innerHTML = buildHtmlContent(responses, feedback);
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-9999';
  container.style.background = 'white';
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: false,
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pageWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    let position = 0;
    let remainingHeight = scaledHeight;

    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, scaledHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, scaledHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save(`biblia-corporativa-${Date.now()}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const md = buildMarkdownContent(responses, feedback);
  downloadBlob(md, `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
