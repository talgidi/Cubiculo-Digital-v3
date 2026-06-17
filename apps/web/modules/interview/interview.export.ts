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

function buildHtmlContent(responses: AnswerItem[], feedback: FeedbackItem | null): string {
  const now = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  let html = `
    <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e;">
      <h1 style="font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px;">Biblia Corporativa</h1>
      <p style="color: #637588; font-size: 14px; margin-bottom: 24px;">Resultados de Entrevista — Generado el ${now}</p>
      <hr style="border: none; border-top: 2px solid #1980e6; margin-bottom: 32px;" />

      <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px;">Preguntas y Respuestas</h2>
  `;

  responses.forEach((r, i) => {
    html += `
      <div style="margin-bottom: 28px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; font-weight: 700; font-size: 14px;">${i + 1}</span>
          <span style="font-size: 12px; padding: 2px 10px; border-radius: 6px; background: #f3e8ff; color: #9333ea;">${r.questionDepartment}</span>
          <span style="font-size: 12px; padding: 2px 10px; border-radius: 6px; background: #dbeafe; color: #2563eb;">${r.questionTopic}</span>
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px 0;">${r.questionTitle}</h3>
        <p style="font-size: 14px; color: #637588; margin: 0 0 12px 0;">${r.questionDescription}</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
          <p style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 0 0 6px 0; text-transform: uppercase;">Tu Respuesta</p>
          <p style="font-size: 14px; color: #1a1a2e; margin: 0; white-space: pre-wrap; line-height: 1.6;">${r.answerContent}</p>
        </div>
      </div>
    `;
  });

  if (feedback) {
    html += `
      <hr style="border: none; border-top: 2px solid #1980e6; margin: 40px 0 32px;" />
      <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px;">Feedback de la IA</h2>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
        <p style="font-size: 14px; color: #1a1a2e; margin: 0; white-space: pre-wrap; line-height: 1.7;">${feedback.content}</p>
      </div>
    `;
  }

  html += `</div>`;
  return html;
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
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  const element = document.createElement('div');
  element.innerHTML = buildHtmlContent(responses, feedback);
  element.style.position = 'fixed';
  element.style.top = '0';
  element.style.left = '0';
  element.style.width = '800px';
  element.style.opacity = '0.01';
  element.style.zIndex = '-9999';
  element.style.pointerEvents = 'none';
  document.body.appendChild(element);

  try {
    await html2pdf(element, {
      margin: [10, 10],
      filename: `biblia-corporativa-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  } finally {
    document.body.removeChild(element);
  }
};

export const exportToMarkdown = (responses: AnswerItem[], feedback: FeedbackItem | null) => {
  const md = buildMarkdownContent(responses, feedback);
  downloadBlob(md, `biblia-corporativa-${Date.now()}.md`, 'text/markdown;charset=utf-8');
};
