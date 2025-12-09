package org.unibl.etf.efikas.handlers;

import com.itextpdf.commons.actions.IEvent;
import com.itextpdf.commons.actions.IEventHandler;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.event.AbstractPdfDocumentEvent;
import com.itextpdf.kernel.pdf.event.AbstractPdfDocumentEventHandler;
import com.itextpdf.kernel.pdf.event.PdfDocumentEvent;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

/**
 * Handler for handling PDF events, such as creation of the header of the document.
 * */
public class HeaderEventHandler extends AbstractPdfDocumentEventHandler {

    private final Image logo;
    private final PdfFont font;

    public HeaderEventHandler(Image logo, PdfFont font) {
        this.logo = logo;
        this.font = font;
    }


    @Override
    protected void onAcceptedEvent(AbstractPdfDocumentEvent abstractPdfDocumentEvent) {
        PdfDocumentEvent docEvent = (PdfDocumentEvent) abstractPdfDocumentEvent;
        PdfPage page = docEvent.getPage();
        Rectangle pageSize = page.getPageSize();

        PdfCanvas pdfCanvas = new PdfCanvas(page.newContentStreamBefore(), page.getResources(), docEvent.getDocument());
        Canvas canvas = new Canvas(pdfCanvas, pageSize, false);

        // ---- LOGO TOP LEFT ----
        logo.setHeight(40);
        logo.setFixedPosition(pageSize.getLeft() + 40, pageSize.getTop() - 60);
        canvas.add(logo);

        // ---- TITLE TOP CENTER ----
        Paragraph title = new Paragraph("eFIKAS КЊИГА ПРИХОДА")
                .setFont(font)
                .setFontSize(14)
                .simulateBold()
                .setTextAlignment(TextAlignment.CENTER);

        canvas.showTextAligned(
                title,
                pageSize.getWidth() / 2,
                pageSize.getTop() - 40,
                TextAlignment.CENTER
        );

        canvas.close();
    }
}
