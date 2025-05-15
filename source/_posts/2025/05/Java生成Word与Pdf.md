---
title: Java生成Word与Pdf
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-15 23:38:47
updated: 2025-05-15 23:38:47
topic:
banner:
references:
---

# Java生成Word和PDF文件及定制格式完整教学

下面我将详细介绍如何使用Java生成Word和PDF文件，并实现格式定制，最后提供完整的案例代码。

## 一、Word文件生成教学

### 1. 使用Apache POI库

Apache POI是Java操作Microsoft Office文档的主流库，其中XWPF组件专门用于处理Word文档(.docx)。

#### 基础使用

```java
// 创建空白文档
XWPFDocument doc = new XWPFDocument();

// 添加段落
XWPFParagraph para = doc.createParagraph();
para.setAlignment(ParagraphAlignment.CENTER); // 居中

// 添加文本运行
XWPFRun run = para.createRun();
run.setText("标题");
run.setBold(true);
run.setFontSize(20);
run.setColor("FF0000"); // 红色

// 添加表格
XWPFTable table = doc.createTable(3, 4); // 3行4列
table.getRow(0).getCell(0).setText("姓名");
table.getRow(0).getCell(1).setText("年龄");

// 保存文档
FileOutputStream out = new FileOutputStream("demo.docx");
doc.write(out);
out.close();
```

#### 高级格式定制

```java
// 设置段落缩进
para.setIndentationFirstLine(600); // 首行缩进

// 设置行间距
para.setSpacingBetween(1.5, LineSpacingRule.AUTO);

// 设置边框
CTP ctp = para.getCTP();
CTPPr pPr = ctp.getPPr();
if (pPr == null) pPr = ctp.addNewPPr();
CTBorder border = pPr.addNewBdr();
border.setTop(STBorder.BASIC_THIN_LINES);
border.setBottom(STBorder.BASIC_THIN_LINES);

// 设置表格样式
CTTblPr tblPr = table.getCTTbl().getTblPr();
CTBorder tblBorder = tblPr.addNewTblBorders();
tblBorder.addNewBottom().setVal(STBorder.DOUBLE);
tblBorder.addNewTop().setVal(STBorder.DOUBLE);
```

### 2. 使用POI-TL（模板引擎）

POI-TL是基于Apache POI的Word模板引擎，适合复杂文档生成。

```java
// 模板文件内容：{{title}}, {{table}}
Configure config = Configure.builder().build();
XWPFTemplate template = XWPFTemplate.compile("template.docx", config)
    .render(new HashMap<String, Object>(){{
        put("title", "测试报告");
        put("table", Tables.of(new String[][]{
            {"姓名", "年龄"},
            {"张三", "25"}
        }).border(BorderStyle.DEFAULT).create());
    }});

template.writeToFile("output.docx");
```

## 二、PDF文件生成教学

### 1. 使用iText库

iText是Java生成PDF最流行的库，功能强大。

#### 基础使用

```java
Document document = new Document();
PdfWriter.getInstance(document, new FileOutputStream("demo.pdf"));
document.open();

// 添加内容
document.add(new Paragraph("标题").setFont(new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD)));
document.add(new Paragraph("正文内容"));

// 添加表格
PdfPTable table = new PdfPTable(3);
table.addCell("姓名");
table.addCell("年龄");
table.addCell("性别");
table.addCell("张三");
table.addCell("25");
table.addCell("男");

document.add(table);
document.close();
```

#### 高级格式定制

```java
// 自定义字体（支持中文）
BaseFont bfChinese = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
Font chineseFont = new Font(bfChinese, 12, Font.NORMAL);

// 设置页面属性
document.setPageSize(PageSize.A4.rotate()); // 横向
document.setMargins(50, 50, 50, 50); // 页边距

// 复杂表格样式
PdfPCell cell = new PdfPCell(new Phrase("表头"));
cell.setBackgroundColor(new BaseColor(200, 200, 255));
cell.setHorizontalAlignment(Element.ALIGN_CENTER);
cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
cell.setBorderWidth(1.5f);
cell.setPadding(10f);

// 添加图片
Image image = Image.getInstance("logo.png");
image.scaleAbsolute(100, 100);
image.setAbsolutePosition(500, 700);
document.add(image);
```

### 2. 使用Flying Saucer（基于HTML转PDF）

适合已有HTML模板的场景。

```java
String html = "<html><body><h1>标题</h1><p>HTML内容</p></body></html>";
OutputStream os = new FileOutputStream("output.pdf");

ITextRenderer renderer = new ITextRenderer();
renderer.setDocumentFromString(html);
renderer.layout();
renderer.createPDF(os);
os.close();
```

## 三、完整案例代码

### 1. 综合导出服务类

```java
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.*;
import java.util.List;
import java.util.Map;

public class ExportService {
    
    /**
     * 生成专业Word报告
     */
    public byte[] generateWordReport(List<Map<String, Object>> data) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XWPFDocument doc = new XWPFDocument();
            
            // 封面页
            addCoverPage(doc);
            
            // 目录
            addTableOfContents(doc);
            
            // 正文
            addContentPages(doc, data);
            
            // 页眉页脚
            addHeaderFooter(doc);
            
            doc.write(out);
            return out.toByteArray();
        }
    }
    
    private void addCoverPage(XWPFDocument doc) {
        XWPFParagraph para = doc.createParagraph();
        para.setAlignment(ParagraphAlignment.CENTER);
        para.setVerticalAlignment(TextAlignment.CENTER);
        
        XWPFRun run = para.createRun();
        run.setText("公司机密报告");
        run.setBold(true);
        run.setFontSize(28);
        run.setColor("000080");
        run.addBreak();
        
        run = para.createRun();
        run.setText("生成日期: " + new java.util.Date());
        run.setFontSize(14);
        run.addBreak(BreakType.PAGE);
    }
    
    private void addTableOfContents(XWPFDocument doc) {
        XWPFParagraph para = doc.createParagraph();
        XWPFRun run = para.createRun();
        run.setText("目录");
        run.setBold(true);
        run.setFontSize(16);
        
        // 实际项目中应动态生成目录
        para = doc.createParagraph();
        run = para.createRun();
        run.setText("1. 数据概览 ...................... 2");
        run.addBreak();
        run.setText("2. 详细数据 ...................... 3");
        run.addBreak(BreakType.PAGE);
    }
    
    private void addContentPages(XWPFDocument doc, List<Map<String, Object>> data) {
        // 添加数据表格
        XWPFTable table = doc.createTable();
        
        // 设置表格宽度
        CTTblWidth width = table.getCTTbl().addNewTblPr().addNewTblW();
        width.setType(STTblWidth.DXA);
        width.setW(9000);
        
        // 创建表头
        XWPFTableRow headerRow = table.getRow(0);
        String[] headers = {"ID", "姓名", "部门", "薪资"};
        for (int i = 0; i < headers.length; i++) {
            if (i == 0) {
                setCellStyle(headerRow.getCell(0), headers[i], true);
            } else {
                setCellStyle(headerRow.addNewTableCell(), headers[i], true);
            }
        }
        
        // 填充数据
        for (Map<String, Object> row : data) {
            XWPFTableRow dataRow = table.createRow();
            setCellStyle(dataRow.getCell(0), row.get("id").toString(), false);
            setCellStyle(dataRow.getCell(1), row.get("name").toString(), false);
            setCellStyle(dataRow.getCell(2), row.get("department").toString(), false);
            setCellStyle(dataRow.getCell(3), row.get("salary").toString(), false);
        }
    }
    
    private void setCellStyle(XWPFTableCell cell, String text, boolean isHeader) {
        cell.removeParagraph(0);
        XWPFParagraph para = cell.addParagraph();
        para.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run = para.createRun();
        run.setText(text);
        
        if (isHeader) {
            run.setBold(true);
            cell.setColor("D3D3D3"); // 灰色背景
        }
    }
    
    private void addHeaderFooter(XWPFDocument doc) {
        // 为所有页添加页眉
        XWPFHeader header = doc.createHeader(HeaderFooterType.DEFAULT);
        XWPFParagraph hp = header.createParagraph();
        hp.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun hr = hp.createRun();
        hr.setText("公司机密 - 禁止外传");
        hr.setItalic(true);
        hr.setFontSize(10);
        
        // 添加页脚
        XWPFFooter footer = doc.createFooter(HeaderFooterType.DEFAULT);
        XWPFParagraph fp = footer.createParagraph();
        fp.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun fr = fp.createRun();
        fr.setText("页码: ");
        fr.getCTR().addNewFldChar().setFldCharType(STFldCharType.BEGIN);
        fr.getCTR().addNewInstrText().setStringValue("PAGE");
        fr.getCTR().addNewFldChar().setFldCharType(STFldCharType.END);
        fr.getCTR().addNewInstrText().setStringValue(" / ");
        fr.getCTR().addNewFldChar().setFldCharType(STFldCharType.BEGIN);
        fr.getCTR().addNewInstrText().setStringValue("NUMPAGES");
        fr.getCTR().addNewFldChar().setFldCharType(STFldCharType.END);
    }
    
    /**
     * 生成专业PDF报告
     */
    public byte[] generatePdfReport(List<Map<String, Object>> data) throws DocumentException, IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 50, 50, 70, 50); // 设置页边距
        
        PdfWriter writer = PdfWriter.getInstance(document, out);
        
        // 添加文档属性
        document.addTitle("公司数据报告");
        document.addAuthor("系统自动生成");
        document.addCreator("企业报表系统");
        
        document.open();
        
        // 添加封面
        addPdfCoverPage(document);
        
        // 添加目录
        document.newPage();
        addPdfTableOfContents(document);
        
        // 添加内容
        document.newPage();
        addPdfContent(document, data);
        
        // 添加页眉页脚
        writer.setPageEvent(new PdfPageEvent());
        
        document.close();
        return out.toByteArray();
    }
    
    private void addPdfCoverPage(Document document) throws DocumentException {
        // 封面图片
        try {
            Image cover = Image.getInstance("company-logo.png");
            cover.scaleToFit(300, 300);
            cover.setAbsolutePosition(
                (PageSize.A4.getWidth() - cover.getScaledWidth()) / 2,
                (PageSize.A4.getHeight() - cover.getScaledHeight()) / 2 + 100
            );
            document.add(cover);
        } catch (IOException e) {
            // 忽略图片错误
        }
        
        // 封面文字
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph title = new Paragraph("年度数据报告\n\n", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);
        
        Font dateFont = new Font(Font.FontFamily.HELVETICA, 14, Font.ITALIC);
        Paragraph date = new Paragraph("生成日期: " + new java.util.Date() + "\n\n\n\n\n", dateFont);
        date.setAlignment(Element.ALIGN_CENTER);
        document.add(date);
    }
    
    private void addPdfTableOfContents(Document document) throws DocumentException {
        Font chapterFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Paragraph toc = new Paragraph("目录\n\n", chapterFont);
        toc.setAlignment(Element.ALIGN_CENTER);
        document.add(toc);
        
        // 实际项目中应动态生成目录
        Font itemFont = new Font(Font.FontFamily.HELVETICA, 12);
        Paragraph item1 = new Paragraph("1. 数据概览 ...................... 2", itemFont);
        document.add(item1);
        
        Paragraph item2 = new Paragraph("2. 详细数据 ...................... 3", itemFont);
        document.add(item2);
    }
    
    private void addPdfContent(Document document, List<Map<String, Object>> data) throws DocumentException {
        // 添加章节
        Font chapterFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLUE);
        Chapter chapter = new Chapter(new Paragraph("详细数据", chapterFont), 1);
        chapter.setNumberDepth(0);
        document.add(chapter);
        
        // 添加表格
        PdfPTable table = new PdfPTable(4); // 4列
        table.setWidthPercentage(100);
        table.setSpacingBefore(20f);
        table.setSpacingAfter(30f);
        
        // 表头
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
        String[] headers = {"ID", "姓名", "部门", "薪资"};
        
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(BaseColor.DARK_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(8);
            table.addCell(cell);
        }
        
        // 表格数据
        Font dataFont = new Font(Font.FontFamily.HELVETICA, 10);
        for (Map<String, Object> row : data) {
            addTableRow(table, row.get("id").toString(), dataFont);
            addTableRow(table, row.get("name").toString(), dataFont);
            addTableRow(table, row.get("department").toString(), dataFont);
            
            // 薪资特殊格式
            PdfPCell salaryCell = new PdfPCell(new Phrase(row.get("salary").toString(), dataFont));
            salaryCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            salaryCell.setPadding(5);
            table.addCell(salaryCell);
        }
        
        document.add(table);
        
        // 添加图表
        try {
            Image chart = createPdfChart(data);
            chart.scaleToFit(400, 300);
            chart.setAlignment(Image.MIDDLE);
            document.add(chart);
        } catch (IOException e) {
            // 忽略图表错误
        }
    }
    
    private void addTableRow(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5);
        table.addCell(cell);
    }
    
    private Image createPdfChart(List<Map<String, Object>> data) throws IOException, DocumentException {
        // 实际项目中应使用JFreeChart等库生成图表图片
        // 这里简化为创建一个示例图片
        int width = 400;
        int height = 300;
        java.awt.Image awtImage = new java.awt.image.BufferedImage(width, height, java.awt.image.BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g2d = (java.awt.Graphics2D) awtImage.getGraphics();
        
        g2d.setColor(java.awt.Color.WHITE);
        g2d.fillRect(0, 0, width, height);
        g2d.setColor(java.awt.Color.BLUE);
        
        // 绘制简单柱状图
        int barWidth = 30;
        int x = 50;
        for (Map<String, Object> row : data) {
            int salary = Integer.parseInt(row.get("salary").toString());
            int barHeight = salary / 1000;
            g2d.fillRect(x, height - barHeight - 50, barWidth, barHeight);
            g2d.drawString(row.get("name").toString(), x, height - 30);
            x += barWidth + 20;
        }
        
        g2d.dispose();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write((java.awt.image.BufferedImage) awtImage, "png", baos);
        return Image.getInstance(baos.toByteArray());
    }
    
    /**
     * PDF页眉页脚处理类
     */
    class PdfPageEvent extends PdfPageEventHelper {
        public void onEndPage(PdfWriter writer, Document document) {
            try {
                // 页眉
                PdfContentByte head = writer.getDirectContent();
                head.beginText();
                head.setFontAndSize(BaseFont.createFont(), 10);
                head.setTextMatrix(document.left(), document.top() + 20);
                head.showTextAligned(Element.ALIGN_RIGHT, "机密文档 - 第" + writer.getPageNumber() + "页", 
                    document.right(), document.top() + 20, 0);
                head.endText();
                
                // 页脚
                PdfContentByte foot = writer.getDirectContent();
                foot.beginText();
                foot.setFontAndSize(BaseFont.createFont(), 10);
                foot.setTextMatrix(document.left(), document.bottom() - 20);
                foot.showTextAligned(Element.ALIGN_CENTER, "© 2023 公司名称. 保留所有权利.", 
                    (document.right() + document.left()) / 2, document.bottom() - 20, 0);
                foot.endText();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
```

### 2. Spring Boot控制器示例

```java
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    
    private final ExportService exportService;
    
    public ReportController(ExportService exportService) {
        this.exportService = exportService;
    }
    
    @GetMapping("/word")
    public ResponseEntity<ByteArrayResource> downloadWordReport() throws IOException {
        List<Map<String, Object>> data = getSampleData();
        byte[] report = exportService.generateWordReport(data);
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.docx")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(report.length)
            .body(new ByteArrayResource(report));
    }
    
    @GetMapping("/pdf")
    public ResponseEntity<ByteArrayResource> downloadPdfReport() throws Exception {
        List<Map<String, Object>> data = getSampleData();
        byte[] report = exportService.generatePdfReport(data);
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(report.length)
            .body(new ByteArrayResource(report));
    }
    
    private List<Map<String, Object>> getSampleData() {
        List<Map<String, Object>> data = new ArrayList<>();
        
        Map<String, Object> emp1 = new HashMap<>();
        emp1.put("id", "1001");
        emp1.put("name", "张三");
        emp1.put("department", "研发部");
        emp1.put("salary", "15000");
        data.add(emp1);
        
        Map<String, Object> emp2 = new HashMap<>();
        emp2.put("id", "1002");
        emp2.put("name", "李四");
        emp2.put("department", "市场部");
        emp2.put("salary", "12000");
        data.add(emp2);
        
        Map<String, Object> emp3 = new HashMap<>();
        emp3.put("id", "1003");
        emp3.put("name", "王五");
        emp3.put("department", "财务部");
        emp3.put("salary", "18000");
        data.add(emp3);
        
        return data;
    }
}
```

## 四、最佳实践建议

1. **模板分离**：将文档模板与代码分离，便于非开发人员维护
2. **样式统一**：创建样式工具类统一管理字体、颜色等样式
3. **性能优化**：
   - 对大文档使用分页生成
   - 考虑异步生成和缓存机制
4. **异常处理**：完善文件操作和资源释放的异常处理
5. **文档安全**：
   - 添加水印
   - 设置文档密码保护
   - 控制文档权限

## 五、扩展学习

1. **高级Word功能**：
   - 文档修订功能
   - 批注和注释
   - 多级列表和编号
   - 交叉引用

2. **高级PDF功能**：
   - 表单字段
   - 数字签名
   - 文档加密
   - PDF/A标准合规

3. **替代方案**：
   - JasperReports：专业报表工具
   - Docx4j：另一个Word操作库
   - Apache FOP：XSL-FO转PDF

