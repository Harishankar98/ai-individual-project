import { jsPDF } from 'jspdf';
import { DocumentSummary, DocumentInsights } from '../types';

export const exportSummaryToPDF = (title: string, summary: DocumentSummary) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Research Paper Summary', margin, y);
    y += 10;

    // Paper Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const splitTitle = doc.splitTextToSize(title, maxWidth);
    doc.text(splitTitle, margin, y);
    y += (splitTitle.length * lineHeight) + 5;

    // Abstract
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Abstract', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitAbstract = doc.splitTextToSize(summary.abstract, maxWidth);
    doc.text(splitAbstract, margin, y);
    y += (splitAbstract.length * lineHeight) + 5;

    // Check if we need a new page
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    // Key Findings
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Findings', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    summary.findings.forEach((finding, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitFinding = doc.splitTextToSize(`${index + 1}. ${finding}`, maxWidth - 5);
        doc.text(splitFinding, margin + 5, y);
        y += (splitFinding.length * lineHeight) + 2;
    });
    y += 5;

    // Methodology
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Methodology', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitMethodology = doc.splitTextToSize(summary.methodology, maxWidth);
    doc.text(splitMethodology, margin, y);
    y += (splitMethodology.length * lineHeight) + 5;

    // Limitations
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Limitations', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitLimitations = doc.splitTextToSize(summary.limitations, maxWidth);
    doc.text(splitLimitations, margin, y);

    // Save PDF
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}_summary.pdf`);
};

export const exportInsightsToPDF = (title: string, insights: DocumentInsights) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Technical Insights', margin, y);
    y += 10;

    // Paper Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const splitTitle = doc.splitTextToSize(title, maxWidth);
    doc.text(splitTitle, margin, y);
    y += (splitTitle.length * lineHeight) + 5;

    // Objectives
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Objectives', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    insights.objectives.forEach((obj, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitObj = doc.splitTextToSize(`${index + 1}. ${obj}`, maxWidth - 5);
        doc.text(splitObj, margin + 5, y);
        y += (splitObj.length * lineHeight) + 2;
    });
    y += 5;

    // Key Concepts
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Concepts', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const conceptsText = insights.keyConcepts.join(', ');
    const splitConcepts = doc.splitTextToSize(conceptsText, maxWidth);
    doc.text(splitConcepts, margin, y);
    y += (splitConcepts.length * lineHeight) + 5;

    // Results
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Results & Empirical Findings', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    insights.results.forEach((result, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitResult = doc.splitTextToSize(`• ${result}`, maxWidth - 5);
        doc.text(splitResult, margin + 5, y);
        y += (splitResult.length * lineHeight) + 3;
    });
    y += 5;

    // Conclusions
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Critical Conclusions', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    insights.conclusions.forEach((conclusion, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitConclusion = doc.splitTextToSize(`${index + 1}. ${conclusion}`, maxWidth - 5);
        doc.text(splitConclusion, margin + 5, y);
        y += (splitConclusion.length * lineHeight) + 3;
    });

    // Save PDF
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}_insights.pdf`);
};

export const exportReadinessToPDF = (title: string, result: any) => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Research Readiness Evaluation', margin, y);
    y += 10;

    // Paper Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const splitTitle = doc.splitTextToSize(title, maxWidth);
    doc.text(splitTitle, margin, y);
    y += (splitTitle.length * lineHeight) + 5;

    // Final Verdict
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Verdict:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.final_verdict, margin + 35, y);
    y += 10;

    // Scores
    doc.setFont('helvetica', 'bold');
    doc.text('Scores', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Novelty: ${result.novelty_score}/100`, margin + 5, y);
    y += lineHeight;
    doc.text(`Technical Depth: ${result.technical_depth_score}/100`, margin + 5, y);
    y += lineHeight;
    doc.text(`Experimental Rigor: ${result.experimental_rigor_score}/100`, margin + 5, y);
    y += lineHeight;
    doc.text(`Literature Coverage: ${result.literature_coverage_score}/100`, margin + 5, y);
    y += lineHeight;
    doc.text(`Publication Readiness: ${result.publication_readiness_score}/100`, margin + 5, y);
    y += 10;

    // Strengths
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Strengths', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    result.strengths.forEach((strength: string) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitStrength = doc.splitTextToSize(`• ${strength}`, maxWidth - 5);
        doc.text(splitStrength, margin + 5, y);
        y += (splitStrength.length * lineHeight) + 2;
    });
    y += 5;

    // Weaknesses
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Weaknesses', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    result.weaknesses.forEach((weakness: string) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitWeakness = doc.splitTextToSize(`• ${weakness}`, maxWidth - 5);
        doc.text(splitWeakness, margin + 5, y);
        y += (splitWeakness.length * lineHeight) + 2;
    });
    y += 5;

    // Suggestions
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Improvement Suggestions', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    result.suggestions.forEach((suggestion: string) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitSuggestion = doc.splitTextToSize(`• ${suggestion}`, maxWidth - 5);
        doc.text(splitSuggestion, margin + 5, y);
        y += (splitSuggestion.length * lineHeight) + 2;
    });
    y += 5;

    // Suitable Venues
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Suitable Publication Venues', margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const venuesText = result.suitable_venues.join(', ');
    const splitVenues = doc.splitTextToSize(venuesText, maxWidth);
    doc.text(splitVenues, margin, y);

    // Save PDF
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}_readiness.pdf`);
};
