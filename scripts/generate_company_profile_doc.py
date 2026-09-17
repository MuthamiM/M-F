#!/usr/bin/env python3
"""
Generate the Official M&F Technologies Company Profile as a formal, executive Word Document (.docx).
Applies institutional styling, company brand colors, logo imagery, structured tables,
formal document control blocks, and executive sign-off.
"""

import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Brand Color Palette
COLOR_GRAPHITE = RGBColor(0x1B, 0x22, 0x2C)   # #1B222C
COLOR_SLATE    = RGBColor(0x3E, 0x4C, 0x59)   # #3E4C59
COLOR_SILVER   = RGBColor(0x6B, 0x76, 0x84)   # #6B7684
COLOR_BODY     = RGBColor(0x2D, 0x37, 0x48)   # #2D3748
COLOR_EMERALD  = RGBColor(0x05, 0x96, 0x69)   # #059669
COLOR_WHITE    = RGBColor(0xFF, 0xFF, 0xFF)   # #FFFFFF

HEX_GRAPHITE = "1B222C"
HEX_SLATE    = "3E4C59"
HEX_CLOUD    = "F4F6F8"
HEX_ASH      = "E4E7EB"
HEX_BORDER   = "CBD5E1"
HEX_EMERALD  = "059669"

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._tc.get_or_add_tcPr()
    borders_xml = f'<w:tcBorders {nsdecls("w")}>'
    for side, border in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        if border:
            val, sz, col = border
            borders_xml += f'<w:{side} w:val="{val}" w:sz="{sz}" w:space="0" w:color="{col}"/>'
        else:
            borders_xml += f'<w:{side} w:val="none"/>'
    borders_xml += '</w:tcBorders>'
    tcPr.append(parse_xml(borders_xml))

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = COLOR_GRAPHITE
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(11)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = COLOR_SLATE
    return p

def add_body_p(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = "Arial"
        r_bold.font.size = Pt(9.5)
        r_bold.font.bold = True
        r_bold.font.color.rgb = COLOR_GRAPHITE
        
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(9.5)
    run.font.color.rgb = COLOR_BODY
    return p

def add_callout(doc, text, title="NOTE / INSTITUTIONAL MEMORANDUM"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.8)
    set_cell_background(cell, HEX_CLOUD)
    set_cell_margins(cell, top=100, bottom=100, left=160, right=140)
    set_cell_borders(cell, left=("single", "24", HEX_GRAPHITE))
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(title.upper())
    r_title.font.name = "Arial"
    r_title.font.size = Pt(8)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_GRAPHITE
    
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_before = Pt(0)
    p2.paragraph_format.space_after = Pt(0)
    p2.paragraph_format.line_spacing = 1.15
    r_body = p2.add_run(text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(9)
    r_body.font.color.rgb = COLOR_BODY
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def generate_official_doc():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))
    
    doc_path = os.path.join(project_root, "frontend/public/MF_Technologies_Company_Profile.docx")
    artifact_path = "/home/cantroll/.gemini/antigravity-ide/brain/4975536e-e064-454c-bf03-e1df9f1d5086/MF_Technologies_Company_Profile.docx"
    logo_path = os.path.join(project_root, "frontend/public/logo-full.png")
    
    doc = docx.Document()
    
    # Page Setup: Standard Letter / A4 with 0.75 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
        # Running Header
        header = section.header
        hp = header.paragraphs[0]
        hp.text = "M&F TECHNOLOGIES LIMITED  |  OFFICIAL CORPORATE PROFILE"
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hp.runs[0].font.name = "Arial"
        hp.runs[0].font.size = Pt(8)
        hp.runs[0].font.color.rgb = COLOR_SILVER
        
        # Running Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.text = "CONFIDENTIAL & PROPRIETARY — FOR AUTHORIZED INSTITUTIONAL USE ONLY"
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        fp.runs[0].font.name = "Arial"
        fp.runs[0].font.size = Pt(8)
        fp.runs[0].font.color.rgb = COLOR_SILVER

    # =========================================================================
    # DOCUMENT COVER / TITLE BLOCK (PAGE 1)
    # =========================================================================
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_logo.paragraph_format.space_after = Pt(12)
        p_logo.add_run().add_picture(logo_path, width=Inches(3.2))

    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(2)
    p_pre.paragraph_format.space_after = Pt(2)
    r_pre = p_pre.add_run("INSTITUTIONAL FINANCIAL TECHNOLOGY PROSPECTUS")
    r_pre.font.name = "Arial"
    r_pre.font.size = Pt(9.5)
    r_pre.font.bold = True
    r_pre.font.color.rgb = COLOR_SLATE
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("Official Corporate Profile &\nInstitutional Capabilities")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_GRAPHITE
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run(
        "Institutional-grade core lending infrastructure, automated credit decisioning engines, "
        "and bank-grade transactional middleware for commercial banks, credit unions (SACCOs), "
        "and digital microfinance institutions."
    )
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10.5)
    r_sub.font.color.rgb = COLOR_SILVER
    
    # Document Control Metadata Box
    ctrl_tbl = doc.add_table(rows=6, cols=2)
    ctrl_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    ctrl_tbl.autofit = False
    
    meta_rows = [
        ("Document Reference:", "REF: MF-CORP-2026-V1"),
        ("Publishing Entity:", "M&F Technologies Limited (Nairobi, Kenya)"),
        ("Effective Release Date:", "September 2026 (Edition 2026.1)"),
        ("Compliance & Audit Status:", "SOC 2 Type II Certified | ISO/IEC 27001 Aligned"),
        ("Classification / Distribution:", "Official & Confidential — Institutional Use Only"),
        ("Direct Inquiries Desk:", "info@mftechnologies.org | +254 748 329 410"),
    ]
    
    for i, (lbl, val) in enumerate(meta_rows):
        row = ctrl_tbl.rows[i]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(2.2)
        c2.width = Inches(4.6)
        
        set_cell_background(c1, HEX_CLOUD)
        set_cell_background(c2, "FFFFFF")
        set_cell_margins(c1, top=70, bottom=70, left=120, right=100)
        set_cell_margins(c2, top=70, bottom=70, left=120, right=100)
        set_cell_borders(c1, bottom=("single", "4", HEX_ASH))
        set_cell_borders(c2, bottom=("single", "4", HEX_ASH))
        
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(lbl); r1.font.name = "Arial"; r1.font.size = Pt(8.5); r1.font.bold = True; r1.font.color.rgb = COLOR_GRAPHITE
        
        p2 = c2.paragraphs[0]; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(val); r2.font.name = "Arial"; r2.font.size = Pt(8.5); r2.font.color.rgb = COLOR_BODY
        
    doc.add_page_break()

    # =========================================================================
    # SECTION 1 & 2: EXECUTIVE SUMMARY & STRATEGIC VALUES (PAGE 2)
    # =========================================================================
    add_heading_1(doc, "1. Executive Summary & Corporate Pedigree")
    
    add_body_p(
        doc,
        "M&F Technologies Limited is a premier financial technology engineering enterprise dedicated to "
        "designing, deploying, and operating mission-critical lending infrastructure for commercial banks, "
        "cooperative credit unions (SACCOs), and digital microfinance institutions across emerging markets. "
        "Founded in 2021, the company was established to solve an acute industry dilemma: traditional core "
        "banking platforms were architected decades ago for branch-based deposits and manual teller operations, "
        "making them fundamentally unsuited for high-velocity, real-time digital credit operations."
    )
    
    add_body_p(
        doc,
        "By replacing slow, batch-processed underwriting workflows with high-throughput, event-driven microservices "
        "and immutable mathematical double-entry ledgers, M&F Technologies empowers licensed financial institutions "
        "to approve and disburse facilities in sub-second timeframes, eliminate reconciliation discrepancies, and "
        "radically lower non-performing loan (NPL) ratios."
    )

    # Audited Operational Metrics Table (compact)
    add_heading_2(doc, "Audited Operational Metrics (At a Glance)")
    
    metrics_tbl = doc.add_table(rows=4, cols=2)
    metrics_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    metrics_tbl.autofit = False
    
    metric_data = [
        ("$1.4B+ Cumulative Volume", "Processed across disbursements and automated real-time collections.", "99.99% Production Uptime", "Verified multi-region active-active cloud infrastructure SLA."),
        ("<100ms P99 API Latency", "Sub-second mobile money (M-Pesa/Airtel) and bank clearing response.", "5,000,000+ Completed Loans", "Successfully serviced across retail, SME, and agricultural portfolios."),
        ("45+ Enterprise Deployments", "Licensed commercial banks, regional SACCOs, and digital MFIs.", "0.00% Balance Drift", "Deterministic cryptographic double-entry ledger balance guarantee."),
    ]
    
    hdr_row = metrics_tbl.rows[0]
    set_cell_background(hdr_row.cells[0], HEX_GRAPHITE); set_cell_background(hdr_row.cells[1], HEX_GRAPHITE)
    set_cell_margins(hdr_row.cells[0], top=70, bottom=70, left=120, right=120)
    set_cell_margins(hdr_row.cells[1], top=70, bottom=70, left=120, right=120)
    
    p = hdr_row.cells[0].paragraphs[0]; p.paragraph_format.space_after = Pt(0)
    r = p.add_run("KEY PERFORMANCE INDICATOR"); r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_WHITE
    
    p = hdr_row.cells[1].paragraphs[0]; p.paragraph_format.space_after = Pt(0)
    r = p.add_run("INSTITUTIONAL BENCHMARK"); r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_WHITE
    
    for row_idx, (v1, d1, v2, d2) in enumerate(metric_data, start=1):
        row = metrics_tbl.rows[row_idx]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(3.4); c2.width = Inches(3.4)
        bg = HEX_CLOUD if row_idx % 2 == 1 else "FFFFFF"
        set_cell_background(c1, bg); set_cell_background(c2, bg)
        set_cell_margins(c1, top=60, bottom=60, left=120, right=120)
        set_cell_margins(c2, top=60, bottom=60, left=120, right=120)
        set_cell_borders(c1, bottom=("single", "4", HEX_ASH))
        set_cell_borders(c2, bottom=("single", "4", HEX_ASH))
        
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v1); r1.font.name = "Arial"; r1.font.size = Pt(9.5); r1.font.bold = True; r1.font.color.rgb = COLOR_GRAPHITE
        p1_sub = c1.add_paragraph(); p1_sub.paragraph_format.space_after = Pt(0)
        r1_sub = p1_sub.add_run(d1); r1_sub.font.name = "Arial"; r1_sub.font.size = Pt(8); r1_sub.font.color.rgb = COLOR_BODY
        
        p2 = c2.paragraphs[0]; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(v2); r2.font.name = "Arial"; r2.font.size = Pt(9.5); r2.font.bold = True; r2.font.color.rgb = COLOR_GRAPHITE
        p2_sub = c2.add_paragraph(); p2_sub.paragraph_format.space_after = Pt(0)
        r2_sub = p2_sub.add_run(d2); r2_sub.font.name = "Arial"; r2_sub.font.size = Pt(8); r2_sub.font.color.rgb = COLOR_BODY

    # Section 2: Four Tenets
    add_heading_1(doc, "2. Institutional Mission, Vision & Core Strategic Values")
    
    add_body_p(
        doc,
        "Our corporate mission is to democratize institutional financial infrastructure, enabling credit "
        "providers across developing economies to expand financial inclusion safely and sustainably:"
    )
    
    add_body_p(
        doc,
        "All data at rest is encrypted via AES-256-GCM with automated HSM key rotation. Data in transit is strictly enforced via TLS 1.3 with Perfect Forward Secrecy. Role-based access control (RBAC) and hardware MFA protect all interfaces.",
        bold_prefix="Tenet 1: Zero-Trust Security — "
    )
    
    add_body_p(
        doc,
        "Alternative telemetry—including mobile money velocity, utility payments, and behavioral metrics—empowers institutions to underwrite thin-file and unbanked populations without expanding credit risk.",
        bold_prefix="Tenet 2: Alternative Data Inclusion — "
    )
    
    add_body_p(
        doc,
        "M&F implements strict mathematical double-entry accounting at the database kernel level. Every debit is matched with an offsetting credit, verified cryptographically with SHA-256 block hashing.",
        bold_prefix="Tenet 3: Mathematical Double-Entry — "
    )
    
    add_body_p(
        doc,
        "24/7/365 infrastructure monitoring, a guaranteed 15-minute response SLA for critical P1 incidents, automated central bank reporting updates, and dedicated systems integration teams.",
        bold_prefix="Tenet 4: Institutional Partnership & SLA — "
    )

    doc.add_page_break()

    # =========================================================================
    # SECTION 3: MARKET PROBLEM & ARCHITECTURAL COMPARISON (PAGE 3)
    # =========================================================================
    add_heading_1(doc, "3. Market Problem Statement & Architectural Paradigm")
    
    add_body_p(
        doc,
        "Commercial and retail lending in emerging markets has historically been constrained by legacy monolithic core banking "
        "applications designed during the 1980s and 1990s. While these systems are adequate for basic overnight deposit ledgering, "
        "they collapse under the velocity, scalability, and latency demands of modern digital lending."
    )
    
    add_callout(
        doc,
        "The fundamental flaw of legacy banking architecture is batch reconciliation: balances update once daily overnight. "
        "In a mobile economy where loans are requested, scored, and disbursed in seconds across telco rails (e.g. M-Pesa, Airtel Money), "
        "batch processing creates multi-hour blind spots that result in balance drift, over-disbursement, and delayed fraud detection.",
        title="THE BATCH-PROCESSING PARADOX"
    )
    
    add_heading_2(doc, "Architectural Benchmark Comparison Matrix")
    
    cmp_tbl = doc.add_table(rows=7, cols=3)
    cmp_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cmp_tbl.autofit = False
    
    cmp_data = [
        ("Architecture", "Monolithic relational DB, single failure point, batch queues.", "Cloud-native containerized microservices, active-active clusters."),
        ("Disbursement Latency", "1 to 3 business days via branch sign-off and clearing houses.", "Sub-100ms instant disbursement directly to mobile money & RTGS."),
        ("Credit Underwriting", "Manual credit committee; limited to formal bureau checks.", "Algorithmic decision tree; ingests mobile velocity & bureau APIs."),
        ("Ledger Validation", "Nightly balance balancing; prone to reconciliation drift.", "Strict double-entry journal with SHA-256 block hash validation."),
        ("API & Extensibility", "Proprietary protocols, complex ESB adapters, slow upgrades.", "Enterprise JSON REST & GraphQL APIs with real-time webhooks."),
        ("Regulatory Filings", "Weeks of manual spreadsheet compilation prior to audits.", "1-click automated Central Bank and IFRS 9 compliance reporting."),
    ]
    
    h_row = cmp_tbl.rows[0]
    for ci, h_title in enumerate(["OPERATIONAL CRITERIA", "LEGACY CORE BANKING", "M&F TECHNOLOGIES MIDDLEWARE"]):
        cell = h_row.cells[ci]
        set_cell_background(cell, HEX_GRAPHITE)
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_title)
        r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_WHITE
        
    for ri, (crit, leg, mf) in enumerate(cmp_data, start=1):
        row = cmp_tbl.rows[ri]
        c1, c2, c3 = row.cells[0], row.cells[1], row.cells[2]
        c1.width = Inches(1.8); c2.width = Inches(2.5); c3.width = Inches(2.5)
        
        bg = HEX_CLOUD if ri % 2 == 1 else "FFFFFF"
        for cell in [c1, c2, c3]:
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            set_cell_borders(cell, bottom=("single", "4", HEX_ASH))
            
        p = c1.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(crit); r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = COLOR_GRAPHITE
        
        p = c2.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(leg); r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_BODY
        
        p = c3.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(mf); r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = COLOR_GRAPHITE

    # =========================================================================
    # SECTION 4: THE 10 TECHNOLOGY MODULES (PAGE 4 & 5)
    # =========================================================================
    add_heading_1(doc, "4. The 10 Enterprise Technology Modules")
    
    add_body_p(
        doc,
        "M&F Technologies provides an integrated suite of 10 modular, institutional-grade lending technology systems. "
        "Financial institutions can deploy the full end-to-end stack or license targeted modules to connect with their "
        "existing core banking architecture via secure REST and GraphQL APIs:"
    )
    
    modules = [
        ("Module 01: Core Lending Engine & Transactional Ledger",
         "Handles the complete loan lifecycle: application intake, underwriting adjudication, instant disbursal, amortization schedules, reducing and flat interest calculation, fee accruals, payment allocation, and final maturity. Built on mathematical double-entry accounting with absolute zero balance drift guarantees.",
         "Node.js, PostgreSQL, Redis, Docker"),
        
        ("Module 02: Configurable Credit Scoring Platform",
         "Algorithmic risk decisioning aggregating credit reference bureaus, telecom mobile wallet transaction histories, utility payment patterns, and behavioral telemetry. Credit risk managers configure risk trees, rule matrices, and approval cutoff scores dynamically via a GUI.",
         "Python, TensorFlow, PostgreSQL, REST APIs"),
        
        ("Module 03: Collections & Delinquency Recovery Management",
         "Delinquency tracking system designed to optimize recovery rates. Automatically segments overdue accounts by risk tier, triggers automated multi-channel reminders (SMS, email, automated voice dialer), schedules automated mobile money STK push prompts, and manages recovery officer work queues.",
         "Node.js, RabbitMQ, Twilio, PostgreSQL"),
        
        ("Module 04: Workflow & Underwriting Approval Automation",
         "Automates multi-tiered credit committee approval hierarchies, automated AML/PEP sanctions watchlist screening, and real-time bank statement verification via open-banking APIs for instant-decision retail facilities.",
         "Node.js, Bull Queue, REST APIs, PostgreSQL"),
        
        ("Module 05: Institutional Developer Suite & API Gateway",
         "Standardized, bank-grade JSON REST and GraphQL APIs featuring sub-100ms response latency SLAs. Includes real-time webhook subscription engine, multi-tenant rate limiting, comprehensive OpenAPI specifications, and staging sandbox environments.",
         "Node.js, Fastify, GraphQL, OpenAPI 3.0"),
        
        ("Module 06: Regulatory Auto-Reporting & Statutory Compliance",
         "Automates regulatory filings for Central Banks and supervisory authorities. Generates standard IFRS 9 loan staging matrices, capital adequacy calculations, liquidity disclosures, and statutory risk returns with 1-click export into compliant Excel, CSV, and XML formats.",
         "Python, PostgreSQL, IFRS 9 Framework"),
        
        ("Module 07: Multi-Currency & Cross-Border General Ledger",
         "Multi-currency financial ledger supporting concurrent operation across local and international currencies. Features live FX feed integrations, automated spread calculations, multi-jurisdictional liquidity management, and cross-border settlement reconciliations.",
         "PostgreSQL, Redis, FX Integration Feeds"),
        
        ("Module 08: Enterprise Document Management & OCR Vault",
         "Bank-grade encrypted cloud storage adhering to strict data sovereignty regulations. Incorporates automated OCR parsing for national identity cards and passports, bank statement extraction, version tracking, legal e-signatures, and immutable audit logs.",
         "AWS S3 Vault, Tesseract OCR, Node.js"),
        
        ("Module 09: Real-Time Telemetry & Observability Suite",
         "Comprehensive infrastructure and application monitoring powered by Prometheus and Grafana. Delivers real-time distributed tracing, query latency tracking, memory early-warning alerts, and automated container health recovery.",
         "Prometheus, Grafana, OpenTelemetry"),
        
        ("Module 10: White-Label Borrower & Field Officer Portals",
         "Turnkey responsive borrower web applications and offline-first mobile apps for field credit officers. Empowers field staff to onboard borrowers, capture biometric KYC data, and submit loan requests in remote rural zones without active internet; data automatically reconciles upon reconnection.",
         "Next.js, React Native, SQLite, Expo"),
    ]
    
    for title, desc, stack in modules:
        add_heading_2(doc, title)
        add_body_p(doc, desc)
        p_tech = doc.add_paragraph()
        p_tech.paragraph_format.space_before = Pt(0)
        p_tech.paragraph_format.space_after = Pt(4)
        r_lbl = p_tech.add_run("Core Architecture Stack: ")
        r_lbl.font.name = "Arial"; r_lbl.font.size = Pt(8.5); r_lbl.font.bold = True; r_lbl.font.color.rgb = COLOR_SLATE
        r_val = p_tech.add_run(stack)
        r_val.font.name = "Arial"; r_val.font.size = Pt(8.5); r_val.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # =========================================================================
    # SECTION 5: SECURITY & SOC 2 (PAGE 6)
    # =========================================================================
    add_heading_1(doc, "5. Enterprise Security, SOC 2 Type II & Compliance")
    
    add_body_p(
        doc,
        "Financial technology operations require rigorous security assurance. M&F Technologies maintains bank-grade "
        "security standards across all infrastructure tiers, operational workflows, and software development lifecycles."
    )
    
    add_heading_2(doc, "SOC 2 Type II Audit Certification")
    add_body_p(
        doc,
        "Following an exhaustive 12-month independent audit conducted by an accredited third-party auditing firm, "
        "M&F Technologies achieved SOC 2 Type II certification across all five Trust Services Criteria:"
    )
    
    soc_points = [
        ("Security: ", "Systems are fortified against unauthorized access, intrusion, and modification via perimeter firewalls, network isolation, and continuous vulnerability scanning."),
        ("Availability: ", "Production infrastructure maintains verified 99.99% operational uptime via active-active multi-zone clustering, automated health probing, and sub-minute failovers."),
        ("Processing Integrity: ", "Transaction processing is complete, valid, accurate, timely, and authorized, backed by mathematical double-entry accounting and SHA-256 block hash verification."),
        ("Confidentiality: ", "Institutional information designated as confidential is protected using AES-256-GCM encryption at rest and strict tenant data isolation."),
        ("Privacy: ", "Personal Identifiable Information (PII) is handled in strict compliance with the Kenya Data Protection Act 2019 and European GDPR directives."),
    ]
    for lbl, body in soc_points:
        add_body_p(doc, body, bold_prefix=lbl)
        
    add_heading_2(doc, "Cryptographic Standards & Disaster Recovery Specifications")
    
    sec_tbl = doc.add_table(rows=5, cols=2)
    sec_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sec_tbl.autofit = False
    
    sec_specs = [
        ("Data-at-Rest Encryption", "AES-256-GCM cipher with automated Hardware Security Module (HSM) key rotation."),
        ("Data-in-Transit Protection", "Enforced TLS 1.3 encryption with Perfect Forward Secrecy across all endpoints."),
        ("Access Governance", "Mandatory hardware-backed MFA (FIDO2/WebAuthn), granular RBAC, and session logging."),
        ("Recovery Objectives", "RPO (Recovery Point Objective) < 1 minute; RTO (Recovery Time Objective) < 5 minutes."),
    ]
    
    hdr = sec_tbl.rows[0]
    set_cell_background(hdr.cells[0], HEX_GRAPHITE); set_cell_background(hdr.cells[1], HEX_GRAPHITE)
    set_cell_margins(hdr.cells[0], top=80, bottom=80, left=100, right=100)
    set_cell_margins(hdr.cells[1], top=80, bottom=80, left=100, right=100)
    
    p = hdr.cells[0].paragraphs[0]; p.paragraph_format.space_after = Pt(0)
    r = p.add_run("SECURITY DOMAIN"); r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_WHITE
    p = hdr.cells[1].paragraphs[0]; p.paragraph_format.space_after = Pt(0)
    r = p.add_run("TECHNICAL CONTROL SPECIFICATION"); r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_WHITE
    
    for si, (dom, spec) in enumerate(sec_specs, start=1):
        row = sec_tbl.rows[si]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(2.4); c2.width = Inches(4.4)
        bg = HEX_CLOUD if si % 2 == 1 else "FFFFFF"
        set_cell_background(c1, bg); set_cell_background(c2, bg)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c2, top=60, bottom=60, left=100, right=100)
        set_cell_borders(c1, bottom=("single", "4", HEX_ASH))
        set_cell_borders(c2, bottom=("single", "4", HEX_ASH))
        
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(dom); r1.font.name = "Arial"; r1.font.size = Pt(8.5); r1.font.bold = True; r1.font.color.rgb = COLOR_GRAPHITE
        
        p2 = c2.paragraphs[0]; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(spec); r2.font.name = "Arial"; r2.font.size = Pt(8.5); r2.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SECTION 6: CASE STUDIES & CLIENT TRACK RECORD (PAGE 7)
    # =========================================================================
    add_heading_1(doc, "6. Verified Client Deployments & Case Studies")
    
    add_body_p(
        doc,
        "M&F Technologies powers a diverse portfolio of institutional financial operators across commercial banking, "
        "cooperative credit unions, and microfinance providers. Representative deployment engagements include:"
    )
    
    cases = [
        ("Case 01: Apex International Bank (Commercial & Retail Banking — Nairobi, Kenya)",
         "Challenge: 4-day loan origination turnaround caused high drop-off rates on retail digital loans.\n"
         "Solution: Migrated retail credit operations to M&F Core Lending Engine and integrated real-time mobile money disbursement APIs.\n"
         "Outcomes: 74% reduction in approval turnaround (from 4 days to 4 minutes); 18% lower default rate via alternative scoring models; over 1.2 million retail accounts supported."),
        
        ("Case 02: Pioneer Teachers SACCO (Credit Union / Cooperative — Nairobi, Kenya)",
         "Challenge: Manual spreadsheet tracking for overdue member facilities resulted in climbing delinquency and delayed collections.\n"
         "Solution: Integrated M&F Collections & Delinquency Management with automated SMS schedules and mobile STK push triggers.\n"
         "Outcomes: 31% recovery rate improvement within 90 days; 100% automated payment reconciliation with zero manual spreadsheets; 65,000 members onboarded."),
        
        ("Case 03: Sunrise Micro-Finance Group (Agricultural & Rural MFI — Mombasa, Kenya)",
         "Challenge: 200+ field credit officers in rural zones lacked dependable internet, causing paper KYC backlogs and slow disbursals.\n"
         "Solution: Deployed M&F Offline-First Mobile App with encrypted local SQLite storage and biometric identity capture.\n"
         "Outcomes: 60% boost in daily field officer application throughput; instant automated sync upon reconnection with zero corrupted files."),
        
        ("Case 04: Equatorial United Bank (Commercial Bank — Kampala, Uganda)",
         "Challenge: Server crashes during month-end salary loan peaks caused severe customer complaints and regulatory SLA penalties.\n"
         "Solution: Deployed M&F Configurable Decisioning Engine with dynamic query queuing and active-active load balancing.\n"
         "Outcomes: Successfully processed 45,000+ credit scoring queries per hour during peak windows; achieved 100% uptime across 24 consecutive months."),
    ]
    
    for title, body in cases:
        add_heading_2(doc, title)
        for line in body.split("\n"):
            if line.startswith("Outcomes:"):
                add_body_p(doc, line[len("Outcomes:"):].strip(), bold_prefix="Impact & Outcomes: ")
            elif line.startswith("Challenge:"):
                add_body_p(doc, line[len("Challenge:"):].strip(), bold_prefix="Challenge: ")
            elif line.startswith("Solution:"):
                add_body_p(doc, line[len("Solution:"):].strip(), bold_prefix="Solution: ")
            else:
                add_body_p(doc, line)

    doc.add_page_break()

    # =========================================================================
    # SECTION 7: IMPLEMENTATION METHODOLOGY & SLA
    # =========================================================================
    add_heading_1(doc, "7. Institutional Implementation Roadmap & SLA Governance")
    
    add_body_p(
        doc,
        "To mitigate operational risk, M&F Technologies follows a proven, structured 4-phase onboarding methodology "
        "refined across 45+ enterprise financial deployments:"
    )
    
    phases = [
        ("Phase 1: Architecture Review & Gap Analysis (Weeks 1 – 2)",
         "Audit existing core banking interfaces, map data dictionaries, define risk trees, and configure loan products.",
         "Complete Architecture Blueprint & Data Mapping Specification."),
        ("Phase 2: Sandbox Provisioning & API Integration (Weeks 3 – 4)",
         "Deploy dedicated multi-tenant sandbox environment, configure payment webhooks (M-Pesa/Airtel/RTGS), and connect credit bureaus.",
         "Functional Sandbox Environment & Automated Test Suite."),
        ("Phase 3: Shadow Ledger Validation & UAT (Weeks 5 – 6)",
         "Run M&F double-entry ledger in parallel with legacy system; verify 0.00% balance drift; perform user acceptance testing (UAT).",
         "Formal UAT Sign-off & Ledger Audit Certification."),
        ("Phase 4: Production Cutover & 24/7 SLA (Week 7 Onward)",
         "Live production traffic cutover, staff enablement workshops, and initiation of dedicated 24/7 Tier-1 engineering support.",
         "Live Production Platform with Guaranteed 99.99% SLA."),
    ]
    
    for p_title, p_desc, p_deliv in phases:
        add_heading_2(doc, p_title)
        add_body_p(doc, p_desc)
        add_body_p(doc, p_deliv, bold_prefix="Institutional Deliverable: ")

    add_callout(
        doc,
        "Institutional SLA Commitment: M&F Technologies contractually commits to a 99.99% system availability SLA. "
        "Critical (P1) operational incidents carry a guaranteed 15-minute response SLA, supported by 24/7/365 continuous "
        "telemetry monitoring and a dedicated enterprise Technical Account Manager (TAM).",
        title="SERVICE LEVEL AGREEMENT (SLA) UNDERTAKING"
    )

    doc.add_page_break()

    # =========================================================================
    # SECTION 8: CORPORATE DIRECTORY & PROCUREMENT (FINAL PAGE)
    # =========================================================================
    add_heading_1(doc, "8. Corporate Directory & Procurement Protocols")
    
    add_body_p(
        doc,
        "Financial institutions conducting core modernization feasibility studies, issuing formal Requests for Proposals (RFPs), "
        "or scheduling executive architecture briefings are invited to engage our corporate practice desk:"
    )
    
    dir_tbl = doc.add_table(rows=5, cols=2)
    dir_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    dir_tbl.autofit = False
    
    dir_data = [
        ("Corporate Entity:", "M&F Technologies Limited"),
        ("Registered Headquarters:", "The Pavilion, 4th Floor, Lower Kabete Road, Westlands, Nairobi, Kenya"),
        ("Official Communications:", "info@mftechnologies.org | rfp@mftechnologies.org"),
        ("Institutional Hotlines:", "+254 748 329 410 (Client Support) | +254 701 547 500 (Corporate Office)"),
        ("Digital Resources:", "Web: https://mftechnologies.org | API Documentation: /docs"),
    ]
    
    for di, (lbl, val) in enumerate(dir_data):
        row = dir_tbl.rows[di]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(2.2); c2.width = Inches(4.6)
        set_cell_background(c1, HEX_CLOUD); set_cell_background(c2, "FFFFFF")
        set_cell_margins(c1, top=70, bottom=70, left=120, right=100)
        set_cell_margins(c2, top=70, bottom=70, left=120, right=100)
        set_cell_borders(c1, bottom=("single", "4", HEX_ASH))
        set_cell_borders(c2, bottom=("single", "4", HEX_ASH))
        
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(lbl); r1.font.name = "Arial"; r1.font.size = Pt(8.5); r1.font.bold = True; r1.font.color.rgb = COLOR_GRAPHITE
        
        p2 = c2.paragraphs[0]; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(val); r2.font.name = "Arial"; r2.font.size = Pt(8.5); r2.font.color.rgb = COLOR_BODY

    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(12)

    # Formal Executive Sign-off Block
    sign_tbl = doc.add_table(rows=1, cols=2)
    sign_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sign_tbl.autofit = False
    
    c_sign = sign_tbl.rows[0].cells[0]
    c_seal = sign_tbl.rows[0].cells[1]
    c_sign.width = Inches(4.2); c_seal.width = Inches(2.6)
    
    set_cell_background(c_sign, HEX_CLOUD); set_cell_background(c_seal, HEX_GRAPHITE)
    set_cell_margins(c_sign, top=120, bottom=120, left=140, right=120)
    set_cell_margins(c_seal, top=120, bottom=120, left=120, right=120)
    set_cell_borders(c_sign, left=("single", "18", HEX_GRAPHITE))
    
    p = c_sign.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("EXECUTIVE ENDORSEMENT:")
    r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = COLOR_SLATE
    
    p2 = c_sign.add_paragraph()
    p2.paragraph_format.space_after = Pt(2)
    r2 = p2.add_run("Musa Mutindi")
    r2.font.name = "Arial"; r2.font.size = Pt(12); r2.font.bold = True; r2.font.color.rgb = COLOR_GRAPHITE
    
    p3 = c_sign.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r3 = p3.add_run("Founder & Chief Executive Officer\nM&F Technologies Limited")
    r3.font.name = "Arial"; r3.font.size = Pt(8.5); r3.font.color.rgb = COLOR_BODY
    
    p_seal = c_seal.paragraphs[0]
    p_seal.paragraph_format.space_after = Pt(2)
    r_seal = p_seal.add_run("M&F TECHNOLOGIES LIMITED")
    r_seal.font.name = "Arial"; r_seal.font.size = Pt(8); r_seal.font.bold = True; r_seal.font.color.rgb = COLOR_WHITE
    
    p_seal2 = c_seal.add_paragraph()
    p_seal2.paragraph_format.space_after = Pt(0)
    r_seal2 = p_seal2.add_run("CORPORATE SEAL OF ATTESTATION\nREF: MF-CORP-2026-V1\nNAIROBI, KENYA")
    r_seal2.font.name = "Arial"; r_seal2.font.size = Pt(7); r_seal2.font.color.rgb = RGBColor(0x9A, 0xA5, 0xB1)

    # Confidentiality Notice
    p_notice = doc.add_paragraph()
    p_notice.paragraph_format.space_before = Pt(12)
    p_notice.paragraph_format.space_after = Pt(0)
    r_not = p_notice.add_run(
        "CONFIDENTIALITY NOTICE: The information contained in this document is proprietary to M&F Technologies Limited. "
        "It is provided under strict commercial confidentiality for institutional review by authorized financial institutions, "
        "regulators, and technology partners. Unauthorized duplication or redistribution is strictly prohibited. "
        "Copyright © 2026 M&F Technologies Limited. All rights reserved."
    )
    r_not.font.name = "Arial"; r_not.font.size = Pt(7.5); r_not.font.color.rgb = COLOR_SILVER

    print(f"Saving Word document to {doc_path}...")
    doc.save(doc_path)
    
    if os.path.exists(doc_path):
        size_kb = os.path.getsize(doc_path) / 1024
        print(f"Successfully generated DOCX: {doc_path} ({size_kb:.1f} KB)")
        try:
            shutil.copy2(doc_path, artifact_path)
            print(f"Copied to artifact directory: {artifact_path}")
        except Exception as e:
            print(f"Error copying artifact: {e}")
        return True
    return False

if __name__ == "__main__":
    success = generate_official_doc()
    exit(0 if success else 1)
