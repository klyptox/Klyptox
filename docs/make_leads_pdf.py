from fpdf import FPDF

# ---- Klyptox client leads data (50) ----
# (tier, name, niche, why, contact)
LEADS = [
 ("T1","The Diary of a CEO","Steven Bartlett - biz/life interviews","Multi-hour episodes = dozens of viral clips","team@thediaryofaceo.com"),
 ("T1","Huberman Lab","Andrew Huberman - science/health","Value bombs = endless educational clips","hubermanlab.com/contact"),
 ("T1","Modern Wisdom","Chris Williamson - interviews","High-value convo clips = strong Shorts","chriswilliamson.com/contact"),
 ("T1","The Shawn Ryan Show","Interview podcast","Military/true-story clips go viral","shawnryanshow.com/contact"),
 ("T1","The Mel Robbins Podcast","Motivational","Hooks = high-retention Reels/Shorts","melrobbins.com/contact"),
 ("T1","Rotten Mango","Stephanie Soo - true-crime","Story clips = massive TikTok reach","business@stephaniesoo.com"),
 ("T1","Jesse James West","Fitness entertainment","High-energy vlogs = viral Shorts","website form"),
 ("T1","Chloe Ting","Home workout fitness","Huge audience, tip clips = evergreen","website form"),
 ("T1","ATHLEAN-X","Jeff Cavaliere - science fitness","'Fix your X' clips = viral evergreen","athleanx.com/contact"),
 ("T1","Jeremy Ethier","Evidence-based fitness","Myth-bust clips perform great","website form"),
 ("T1","Jeff Nippard","Science fitness","Data clips = high save rate","jeffnippard.com/contact"),
 ("T1","Coin Bureau","Guy Turner - crypto education","Long-form = easy explainer clips","coinbureau.com/contact"),
 ("T1","Benjamin Cowen","Crypto cycles","Chart breakdowns = viral","intothecryptoverse.com"),
 ("T1","Altcoin Daily","Crypto news","Daily news = endless clip fodder","website form"),
 ("T1","Brian Jung","Crypto/finance","Market takes = high engagement","brianjung.com/contact"),
 ("T1","David Goggins","Motivation (via pods)","Hardest-worker clips = mega viral","N/A (agent)"),
 ("T1","Eric Thomas (ET)","Motivational speaker","Fire speech clips = viral Shorts","etinspires.com/contact"),
 ("T1","Coach Pain / Motiversity","Motivation compilations","Already clip-based = easy upsell","motiversity.com/contact"),
 ("T1","The Tim Ferriss Show","Long-form interviews","Deep-dive clips = high value","tim.blog/contact"),
 ("T1","Rich Roll","Health/wellness interviews","Story clips = shareable","richroll.com/contact"),
 ("T2","Lex Fridman","Tech/AI interviews","Intellectual clips = strong Shorts","lexfridman.com/contact"),
 ("T2","Theo Von","Comedy podcast","Funny clips = huge TikTok reach","team@theovon.com"),
 ("T2","Flagrant","Andrew Schulz + Akaash","Hot-take clips = viral","flagrantpod.com/contact"),
 ("T2","PBD Podcast","Patrick Bet-David","Business takes = LinkedIn/Shorts","patrickbetdavid.com/contact"),
 ("T2","The Ramsey Show","Dave Ramsey - finance","Money advice = evergreen Shorts","daveramsey.com/contact"),
 ("T2","The Rest Is History","Goalhanger - history","Story clips = shareable","goalhanger.com/contact"),
 ("T2","Chris Heria (ThenX)","Calisthenics","Skill clips = viral Reels","thenx.com/contact"),
 ("T2","Yoga With Adriene","Yoga/wellness","Beginner clips = broad reach","yogawithadriene.com"),
 ("T2","growwithjo","Walking workouts","Beginner fitness = viral Shorts","website form"),
 ("T2","Browney","Fitness challenges","Transformation clips = viral","website form"),
 ("T2","Crypto Banter","Ran Neuner - livestream","Live takeaways = clip gold","cryptobanter.com"),
 ("T2","Lark Davis","Crypto insights","Market clips = high engagement","larkdavis.com/contact"),
 ("T2","Bankless","Ryan Sean Adams - DeFi","Long interviews = clip fodder","bankless.com/contact"),
 ("T2","Unchained (Laura Shin)","Crypto journalism","Founder interviews = clips","laurashin.com/contact"),
 ("T2","Trent Shelton","Motivational podcast","Relatable clips = viral","trentshelton.com/contact"),
 ("T2","David Nurse","Motivational speaker","Mindset clips = shareable","davidnurse.com/contact"),
 ("T2","Ed Mylett Show","Business/motivation","Peak-performance clips","edmylett.com/contact"),
 ("T2","Lewis Howes","School of Greatness","Inspiration clips = broad","lewishowes.com/contact"),
 ("T2","Tom Bilyeu (Impact Theory)","Business/mindset","Mindset clips = viral","impacttheory.com/contact"),
 ("T2","The School of Life","Philosophy/self-help","Insight clips = evergreen","theschooloflife.com"),
 ("T3","Joe Rogan Experience","Longest-form interview","Endless clips, massive audience","N/A (agent)"),
 ("T3","Armchair Expert","Dax Shepard","Entertaining clips","N/A (network)"),
 ("T3","New Heights","Kelce brothers","Sports clips = viral TikTok","N/A (agent)"),
 ("T3","Call Her Daddy","Alex Cooper","Gen-Z clips","N/A (network)"),
 ("T3","SmartLess","Bateman/Arnett/Segal","Funny clips = broad","N/A (network)"),
 ("T3","Hbomberguy","Harry Brewis - video essays","Long essays = clip highlights","N/A (agent)"),
 ("T3","ContraPoints","Video essays","Discussion clips = viral","N/A (agent)"),
 ("T3","Folding Ideas","Dan Olson - video essays","Analysis clips","N/A (agent)"),
 ("T3","Jenny Nicholson","Long-form reviews","Story clips = shareable","N/A (agent)"),
 ("T3","Top streamers (archives)","Gaming/lifestyle","Stream highlights = clip gold","N/A (agency)"),
]

TIER_LABEL = {"T1":"TIER 1 - HOT (easy to clip, high virality)","T2":"TIER 2 - WARM","T3":"TIER 3 - NURTURE (agent/network route)"}
TIER_RGB = {"T1":(255,138,107),"T2":(255,209,102),"T3":(47,208,191)}

class PDF(FPDF):
    def add_page(self, *args, **kwargs):
        super().add_page(*args, **kwargs)
        # paint dark background on EVERY page (called on each page break)
        self.set_fill_color(11,17,18)
        self.rect(0,0,210,297,'DF')
    def header(self):
        # also paint in case header runs first
        self.set_fill_color(11,17,18)
        self.rect(0,0,210,297,'DF')
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica","",8)
        self.set_text_color(120,140,138)
        self.cell(0,8,"KLYPTOX clipping agency - internal lead list - not for public sharing",0,0,"C")

pdf = PDF(format="A4")
pdf.set_auto_page_break(auto=True, margin=16)
pdf.add_page()
EPW = pdf.epw

# ---- Title block ----
pdf.set_fill_color(11,17,18)
pdf.rect(0,0,210,297,'DF')
pdf.set_xy(0,18)
pdf.set_font("Helvetica","B",26)
pdf.set_text_color(47,208,191)
pdf.cell(0,12,"KLYPTOX | Client Leads",0,1,"C")
pdf.set_font("Helvetica","",11)
pdf.set_text_color(155,176,174)
pdf.cell(0,7,"50 potential clipping clients - international only (no PH)",0,1,"C")
pdf.set_font("Helvetica","",9)
pdf.cell(0,6,"Best & easiest to clip, high virality  |  Compiled 2026-09-04  |  Source: web research",0,1,"C")
pdf.ln(4)

def tier_block(tier):
    rgb = TIER_RGB[tier]
    # tier header bar
    pdf.set_fill_color(rgb[0],rgb[1],rgb[2])
    pdf.set_text_color(11,17,18)
    pdf.set_font("Helvetica","B",12)
    pdf.cell(0,8,"  "+TIER_LABEL[tier],0,1,"L",fill=True)
    pdf.ln(2)
    n=0
    for t,name,niche,why,contact in LEADS:
        if t!=tier: continue
        n+=1
        # card background
        pdf.set_fill_color(18,27,29)
        x0=pdf.get_x(); y0=pdf.get_y()
        pdf.set_font("Helvetica","B",10)
        pdf.set_text_color(rgb[0],rgb[1],rgb[2])
        pdf.cell(8,6,str(n),0,0,"L")
        pdf.set_text_color(232,239,239)
        pdf.cell(0,6,name,0,1,"L")
        pdf.set_x(x0)
        pdf.set_font("Helvetica","",8.5)
        pdf.set_text_color(155,176,174)
        pdf.set_x(x0+8)
        pdf.cell(0,5,niche,0,1,"L")
        pdf.set_x(x0+8)
        pdf.set_text_color(200,215,213)
        pdf.multi_cell(EPW-8,4.5,"Why: "+why)
        pdf.set_x(x0+8)
        pdf.set_text_color(120,200,190)
        pdf.set_font("Helvetica","I",8.5)
        pdf.multi_cell(EPW-8,4.5,"Contact: "+contact)
        # draw card border
        y1=pdf.get_y()+1.5
        pdf.set_draw_color(47,208,191); pdf.set_line_width(0.2)
        pdf.rect(x0,y0-0.5,EPW,y1-y0)
        pdf.ln(3)

for tier in ["T1","T2","T3"]:
    # page break guard
    if pdf.get_y()>240: pdf.add_page()
    tier_block(tier)

# ---- Whop note ----
if pdf.get_y()>225: pdf.add_page()
pdf.ln(2)
pdf.set_fill_color(40,30,12)
pdf.set_draw_color(255,180,84); pdf.set_line_width(0.4)
y0=pdf.get_y()
pdf.set_font("Helvetica","B",10)
pdf.set_text_color(255,180,84)
pdf.multi_cell(EPW,5.5,"  WHOP UNLIST CHECK",border=0)
pdf.set_font("Helvetica","",8.5)
pdf.set_text_color(220,225,224)
pdf.multi_cell(EPW,4.5,"Whop has 6,800+ clipping products. Before outreach, cross-check. If a lead already SELLS clipping on Whop, mark UNLIST and skip (competitor, not buyer).")
pdf.set_x(pdf.l_margin)
pdf.multi_cell(EPW,4.5,"Confirmed Whop sellers: flux-edits, SAINT CUT, short-form-clipping-program.")
pdf.multi_cell(EPW,4.5,"All 50 above are BUYERS (long-form creators needing clips), not Whop sellers - safe to pursue.")

out=r"C:\Users\Jerald\Documents\Klyptox_Website\docs\Klyptox_Client_Leads.pdf"
pdf.output(out)
print("SAVED",out)
