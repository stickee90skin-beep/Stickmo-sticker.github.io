/* ================= DATA (Supabase tables in production) ================= */
const palettes=[
 ['#0f2027','#203a43','#2c5364'],['#1a1a2e','#16213e','#0f3460'],
 ['#232526','#414345','#5a5c5e'],['#2b1055','#4b2075','#6b3095'],
 ['#0b3d2e','#14594a','#1e7a66'],['#3a2618','#5c3d2a','#7e553c'],
 ['#101820','#25333f','#3a4e5e'],['#2d132c','#511e42','#752f58'],
 ['#1f2833','#2e4057','#3f5e7a'],['#33202a','#5c3a4d','#7a4d66'],
 ['#12262e','#1e4450','#2a6272'],['#2a2118','#4a3b2a','#6a553c']
];
function art(i,label,ratio,anim){
  const p=palettes[i%palettes.length];
  return `<div class="art${anim?' anim':''}" style="${ratio?`aspect-ratio:${ratio};`:''}background:
    radial-gradient(circle at 20% 20%, ${p[2]}55, transparent 50%),
    linear-gradient(135deg, ${p[1]}, ${p[0]})"><span>${label||''}</span></div>`;
}

const tools=[
 {n:'Figma',d:'Interface design, prototyping, systems',c:'#A259FF',ic:'F'},
 {n:'Photoshop',d:'Image editing & compositing',c:'#31A8FF',ic:'Ps'},
 {n:'Illustrator',d:'Vector craft & logo design',c:'#FF9A00',ic:'Ai'},
 {n:'InDesign',d:'Editorial & print layouts',c:'#FF3366',ic:'Id'},
 {n:'After Effects',d:'Motion design & animation',c:'#9999FF',ic:'Ae'},
 {n:'Adobe XD',d:'Rapid UX prototypes',c:'#FF61F6',ic:'Xd'},
 {n:'Canva',d:'Fast social templates',c:'#00C4CC',ic:'C'},
 {n:'CorelDRAW',d:'Vector & print production',c:'#00A651',ic:'Cd'},
 {n:'ChatGPT',d:'Copy, ideation & research',c:'#74AA9C',ic:'G'},
 {n:'Midjourney',d:'AI concept imagery',c:'#E8E8E8',ic:'M'},
 {n:'Google AI Studio',d:'Gemini-powered workflows',c:'#4285F4',ic:'AI'},
 {n:'Cursor AI',d:'AI pair-programming',c:'#C8C8C8',ic:'Cu'},
 {n:'VS Code',d:'Front-end handoff & builds',c:'#007ACC',ic:'VS'}
];

/* ===== media engine: type → viewer family. Add a new type here, the right viewer is picked automatically — the same map drives the production CMS. ===== */
const MEDIA={
 single:{family:'image',ratio:'4/3'},
 poster:{family:'image',ratio:'3/4'},
 flyer:{family:'image',ratio:'3/4'},
 'packaging mockup':{family:'image',ratio:'4/3'},
 'social post':{family:'image',ratio:'1/1'},
 'vertical banner':{family:'image',ratio:'9/16'},
 banner:{family:'zoom',ratio:'21/9'},
 carousel:{family:'carousel',ratio:'1/1',label:'Image'},
 'listing images':{family:'carousel',ratio:'1/1',label:'Image'},
 pdf:{family:'paged',ratio:'3/4',label:'Page'},
 brochure:{family:'paged',ratio:'3/4',label:'Page'},
 catalog:{family:'paged',ratio:'3/4',label:'Page'},
 presentation:{family:'paged',ratio:'16/9',label:'Slide'},
 aplus:{family:'aplus'},
 video:{family:'video'},
 'ad video':{family:'video'},
 gif:{family:'gif',ratio:'1/1'},
 reel:{family:'reel'},
 'motion poster':{family:'reel'}
};
const typeLabel=t=>t==='aplus'?'Amazon A+':t;

const graphicProjects=[
 {t:'Verve Foods',client:'Verve Foods',cat:'Brand Identity',type:'carousel',ratio:'1/1',date:'Mar 2025',tags:['branding','fmcg'],tools:['Illustrator','Figma'],d:'Snack brand identity built on bold type and appetite-first color.',imgs:4},
 {t:'Kaya Skincare',client:'Kaya',cat:'Packaging',type:'packaging mockup',ratio:'4/3',date:'Jan 2025',tags:['packaging','beauty'],tools:['Illustrator','Dimension'],d:'Minimal packaging system for a clean-beauty line.'},
 {t:'Pulse Fest Poster',client:'Pulse Fest',cat:'Print',type:'poster',ratio:'3/4',date:'Nov 2024',tags:['poster','music'],tools:['Photoshop'],d:'Main event poster for a 3-day music festival.'},
 {t:'Drift Launch Reel',client:'Drift Apparel',cat:'Motion Graphics',type:'reel',ratio:'4/5',date:'May 2025',tags:['reel','fashion'],tools:['After Effects','Premiere'],d:'Vertical launch reel for a streetwear drop.'},
 {t:'Metro Bank OOH',client:'Metro Bank',cat:'Advertising',type:'banner',ratio:'21/9',date:'Aug 2023',tags:['ooh','advertising'],tools:['Photoshop','Illustrator'],d:'Out-of-home campaign across 3 cities.'},
 {t:'Nova Ident Film',client:'Nova',cat:'Motion Graphics',type:'video',ratio:'16/9',date:'Jun 2024',tags:['motion','logo-reveal'],tools:['After Effects','Rive'],d:'Logo reveal and brand motion toolkit.'},
 {t:'Aurel Home A+',client:'Aurel Home',cat:'Amazon',type:'aplus',ratio:'3/4',date:'Apr 2025',tags:['amazon','a-plus'],tools:['Photoshop','Illustrator'],d:'Full A+ content module set for a home-decor listing.',imgs:5},
 {t:'Aurel Listing Set',client:'Aurel Home',cat:'Amazon',type:'listing images',ratio:'1/1',date:'Apr 2025',tags:['amazon','listing'],tools:['Photoshop'],d:'7-image product listing set — main, infographics, lifestyle.',imgs:7},
 {t:'Argo Pitch Deck',client:'Argo',cat:'Presentation',type:'presentation',ratio:'16/9',date:'Feb 2025',tags:['deck','fundraise'],tools:['Figma','Keynote'],d:'Investor deck system for a Series A raise.',imgs:5},
 {t:'Meridian Report',client:'Meridian Capital',cat:'Print',type:'pdf',ratio:'3/4',date:'Dec 2024',tags:['print','annual-report'],tools:['InDesign'],d:'64-page annual report with editorial data design.',imgs:6},
 {t:'Loop Stickers',client:'Loop Chat',cat:'Social Media',type:'gif',ratio:'1/1',date:'Jul 2025',tags:['gif','stickers'],tools:['After Effects'],d:'Animated GIF sticker pack for a messaging app.'},
 {t:'Terra Coffee',client:'Terra',cat:'Brand Identity',type:'single',ratio:'4/3',date:'Sep 2023',tags:['branding','f&b'],tools:['Illustrator','Procreate'],d:'Identity and cup system for a specialty roaster.'},
 {t:'Aster Catalog',client:'Aster Living',cat:'Print',type:'catalog',ratio:'3/4',date:'Oct 2024',tags:['catalog','furniture'],tools:['InDesign','Photoshop'],d:'32-page seasonal furniture catalog.',imgs:6}
];

const uiProjects=[
 {t:'Ledgerly — Finance App',cat:'Mobile App',tag:'Fintech',dur:'8 weeks',role:'Product Designer (end-to-end)',tools:'Figma · Maze',d:'Personal finance app that makes saving feel like progress, not punishment.',
  ov:'A ground-up personal finance app for young earners, designed from research to shipped prototype.',ps:'Young earners abandon budgeting apps within 2 weeks because they feel like homework.',flow:'Onboarding → auto-categorization → weekly "wins" digest → goal rooms.',wf:'Low-fi flows for onboarding and goal creation tested with 6 users before hi-fi.',screens:['Onboarding','Dashboard','Goal Room','Insights','Weekly Wins'],fig:'https://figma.com'},
 {t:'Shipmint — Logistics SaaS',cat:'Web App',tag:'B2B SaaS',dur:'12 weeks',role:'Lead UX Designer',tools:'Figma · FigJam',d:'Dashboard redesign for a freight platform drowning in tables.',
  ov:'Redesign of the ops dashboard for a freight platform, focused on exception resolution speed.',ps:'Ops teams took 40+ clicks to resolve a single delayed shipment.',flow:'Exception inbox → context panel → one-click actions → audit trail.',wf:'Mapped the current 40-click journey, then wireframed a 6-click target flow.',screens:['Exception Inbox','Shipment Detail','Bulk Actions','Analytics'],fig:'https://figma.com'},
 {t:'Habitat — Smart Home',cat:'Mobile App',tag:'IoT',dur:'6 weeks',role:'UI Designer',tools:'Figma · Protopie',d:'Control interface for a smart home hub — calm by default.',
  ov:'A calm-by-default control app that surfaces only what each household actually uses.',ps:'Existing apps front-load every device; users only touch 4 controls daily.',flow:'Adaptive home screen → scene builder → automation timeline.',wf:'Card-sort study drove the adaptive home screen wireframes.',screens:['Adaptive Home','Scenes','Automations','Device Detail'],fig:'https://figma.com'},
 {t:'Coursa — Learning Platform',cat:'Web App',tag:'EdTech',dur:'10 weeks',role:'Product Designer',tools:'Figma · Hotjar',d:'Course platform redesign focused on completion, not enrollment.',
  ov:'Redesign targeting the 9% completion rate — rebuilt navigation around momentum.',ps:'Completion rate was 9% — students got lost between lessons.',flow:'Course map → focused lesson view → checkpoint recaps → streaks.',wf:'Funnel analysis pinpointed module transitions; wireframes rebuilt that seam first.',screens:['Course Map','Lesson View','Checkpoint','Profile','Certificates'],fig:'https://figma.com'}
];

const services=[
 {n:'Brand Identity',cat:'Branding',p:'₹75,000',d:'Logo, system, guidelines, launch assets.',feat:true},
 {n:'Packaging Design',cat:'Branding',p:'₹45,000',d:'Dielines, mockups, print-ready files.'},
 {n:'Social Media Design',cat:'Marketing',p:'₹25,000/mo',d:'Monthly creative kit — posts, stories, reels covers.'},
 {n:'Amazon Listing Design',cat:'E-commerce',p:'₹18,000/SKU',d:'Main images, infographics, A+ content modules.',feat:true},
 {n:'UI Design',cat:'Product',p:'₹1,20,000',d:'Flows, wireframes, hi-fi screens, prototype.',feat:true},
 {n:'Website Design',cat:'Product',p:'₹60,000',d:'Landing or full marketing site, dev-ready in Figma.'},
 {n:'Presentation Design',cat:'Business',p:'₹30,000',d:'Investor decks and sales presentations.'},
 {n:'Motion Graphics',cat:'Motion',p:'₹40,000',d:'Logo reveals, brand motion, animated creatives.'},
 {n:'Video Editing',cat:'Motion',p:'₹20,000',d:'Short-form edits for social and ads.'},
 {n:'Advertising Creatives',cat:'Marketing',p:'₹35,000',d:'Performance ad sets — statics and motion.'}
];

/* ================= reveal observer ================= */
let io;
function observeRv(){
  if(io)io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1});
  document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el));
}

/* ================= backend API integration ================= */
const API_BASE = window.PORTFOLIO_API_BASE || '';
async function loadProjectsFromBackend(){
  if(!API_BASE)return null;
  try{
    const r=await fetch(`${API_BASE}/api/projects`);
    if(!r.ok)return null;
    const data=await r.json();
    return Array.isArray(data)?data:null;
  }catch(e){return null;}
}
async function hydratePortfolioFromBackend(){
  const data=await loadProjectsFromBackend();
  if(!data)return;
  const graphic=data.filter(p=>p.section==='graphic');
  const ui=data.filter(p=>p.section==='uiux');
  if(graphic.length){
    graphicProjects.splice(0,graphicProjects.length,...graphic);
    renderGraphicProjects();
    document.getElementById('featuredGrid').innerHTML=graphicProjects.slice(0,3).map((p,i)=>`
      <article class="tile rv zoom" data-i="${i}" tabindex="0" style="margin-bottom:0;transition-delay:${i*140}ms">
        <div class="tile-media"><span class="type-badge">${typeLabel(p.type||'single')}</span>${p.image?`<img class="art" src="${p.image}" alt="${p.t||'Project'}">`:art(i,p.t?.split(' ')[0],'16/10')}</div>
        <div class="tile-cap"><b>${p.t}</b><span>${p.cat||''}</span></div>
      </article>`).join('');
  }
  if(ui.length){
    uiProjects.splice(0,uiProjects.length,...ui);
    document.getElementById('uiGrid').innerHTML=uiProjects.map((p,i)=>`
      <article class="ui-card rv" onclick="openUI(${i})" tabindex="0" onkeydown="if(event.key==='Enter')openUI(${i})">
        <div class="thumb">${p.image?`<img class="art" src="${p.image}" alt="${p.t||'Project'}">`:art(i+3,p.t?.split(' ')[0])}</div>
        <span class="ui-tag">${p.tag||''}</span><h3>${p.t}</h3>
        <div class="sub"><i>${p.cat||''}</i><i>${p.dur||''}</i><i>${p.tools||''}</i></div>
        <p class="grey" style="font-size:14px;margin-top:8px">${p.d||''}</p>
      </article>`).join('');
  }
  observeRv();
}

/* ================= render ================= */
document.getElementById('toolGrid').innerHTML=tools.map(t=>`
  <div class="tool rv"><div class="tool-ic" style="background:${t.c}">${t.ic}</div>
  <div><b>${t.n}</b><span>${t.d}</span></div></div>`).join('');

function renderGraphicProjects(filter='all'){
  const grid=document.getElementById('gMasonry');
  grid.innerHTML=graphicProjects.map((p,i)=>{
    const filterKeys=[
      p.type==='reel'?'reel':'',
      ['carousel','social post'].includes(p.type)?'post':'',
      p.cat==='Brand Identity'?'branding':'',
      p.cat==='Packaging'?'packaging':'',
      p.cat==='Print'?'print':'',
      p.cat==='Motion Graphics'||['video','gif','reel','motion poster'].includes(p.type)?'motion':'',
      p.cat==='Amazon'||['aplus','listing images'].includes(p.type)?'amazon':'',
      p.cat==='Advertising'?'advertising':'',
      p.cat==='Presentation'?'presentation':'',
      p.type==='gif'?'gif':''
    ].filter(Boolean);
    const visible=filter==='all'||filterKeys.includes(filter);
    return `<article class="tile rv${visible?'':' filter-hidden'}" data-i="${i}" tabindex="0" data-filters="${filterKeys.join(' ')}">
      <div class="tile-media"><span class="type-badge">${typeLabel(p.type)}</span>${art(i,p.t.split(' ')[0],p.ratio,p.type==='gif')}</div>
      <div class="tile-cap"><b>${p.t}</b><span>${p.cat}</span></div>
    </article>`;
  }).join('');
  const count=grid.querySelectorAll('.tile:not(.filter-hidden)').length;
  document.getElementById('filterStatus').textContent=filter==='all'?`${count} projects`:`${count} ${filter} project${count===1?'':'s'}`;
  observeRv();
}
renderGraphicProjects();

document.getElementById('graphicFilters').addEventListener('click',e=>{
  const btn=e.target.closest('.filter-btn'); if(!btn)return;
  const filter=btn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b===btn));
  renderGraphicProjects(filter);
});

/* featured: one-by-one zoom+fade stagger */
document.getElementById('featuredGrid').innerHTML=graphicProjects.slice(0,3).map((p,i)=>`
  <article class="tile rv zoom" data-i="${i}" tabindex="0" style="margin-bottom:0;transition-delay:${i*140}ms">
    <div class="tile-media"><span class="type-badge">${typeLabel(p.type)}</span>${art(i,p.t.split(' ')[0],'16/10')}</div>
    <div class="tile-cap"><b>${p.t}</b><span>${p.cat}</span></div>
  </article>`).join('');

document.getElementById('uiGrid').innerHTML=uiProjects.map((p,i)=>`
  <article class="ui-card rv" onclick="openUI(${i})" tabindex="0" onkeydown="if(event.key==='Enter')openUI(${i})">
    <div class="thumb">${art(i+3,p.t.split(' ')[0])}</div>
    <span class="ui-tag">${p.tag}</span>
    <h3>${p.t}</h3>
    <div class="sub"><i>${p.cat}</i><i>${p.dur}</i><i>${p.tools}</i></div>
    <p class="grey" style="font-size:14px;margin-top:8px">${p.d}</p>
  </article>`).join('');

/* ================= scroll storytelling ================= */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* about pinned phrase morph */
const phrases=['I create…','Graphic Design','Brand Identity','Packaging','UI Design','UX Design','Digital Experiences'];
const morphStage=document.getElementById('morphStage'),morphProg=document.getElementById('morphProg');
morphStage.innerHTML=phrases.map((p,i)=>`<div class="morph${i===0?' on':''}" data-m="${i}">${i===phrases.length-1?`<span class="acc-word">${p}</span>`:p}</div>`).join('');
morphProg.innerHTML=phrases.map((_,i)=>`<i class="${i===0?'on':''}"></i>`).join('');
const aboutPin=document.getElementById('aboutPin');
aboutPin.style.height=(phrases.length*55+100)+'vh';
let curPhrase=0;
function setPhrase(n){
  if(n===curPhrase)return;
  morphStage.querySelectorAll('.morph').forEach(m=>{
    const i=+m.dataset.m;
    m.classList.toggle('on',i===n);
    m.classList.toggle('out',i<n);
  });
  morphProg.querySelectorAll('i').forEach((b,i)=>b.classList.toggle('on',i<=n));
  curPhrase=n;
}

/* skills pinned words */
const skillWords=[
 {w:'Branding',anim:'from-left'},
 {w:'Packaging',anim:'from-right'},
 {w:'UI Design',anim:'blur-in'},
 {w:'UX Research',anim:'chars'},
 {w:'Motion',anim:'scale-in'},
 {w:'Systems',anim:'from-left',u:true}
];
const wordsStage=document.getElementById('wordsStage');
wordsStage.innerHTML=skillWords.map((s,i)=>{
  const inner=s.anim==='chars'
    ? s.w.split('').map((c,ci)=>`<span style="transition-delay:${ci*45}ms">${c===' '?'&nbsp;':c}</span>`).join('')
    : (s.u?`<span class="u">${s.w}</span>`:s.w);
  return `<div class="wd ${s.anim}" data-w="${i}">${inner}</div>`;
}).join('');
const skillsPin=document.getElementById('skillsPin');
skillsPin.style.height=(skillWords.length*45+100)+'vh';
let curWord=-1;
function setWord(n){
  if(n===curWord)return;
  wordsStage.querySelectorAll('.wd').forEach(w=>{
    const i=+w.dataset.w;
    w.classList.toggle('on',i<=n);
    w.classList.toggle('dim',i<n);
  });
  curWord=n;
}

/* hero fade upward */
const heroInner=document.getElementById('heroInner');

function pinProgress(wrap){
  const r=wrap.getBoundingClientRect();
  const total=wrap.offsetHeight-innerHeight;
  return Math.min(1,Math.max(0,-r.top/total));
}
let ticking=false;
function onScroll(){
  if(reduceMotion)return;
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
    /* hero */
    if(document.getElementById('page-home').classList.contains('active')){
      const y=scrollY;
      const h=innerHeight*.9;
      const p=Math.min(1,y/h);
      heroInner.style.transform=`translateY(${-p*70}px)`;
      heroInner.style.opacity=1-p*.9;
      /* about morph */
      const ap=pinProgress(aboutPin);
      setPhrase(Math.min(phrases.length-1,Math.floor(ap*phrases.length)));
      /* skills words */
      const sp=pinProgress(skillsPin);
      setWord(Math.min(skillWords.length-1,Math.floor(sp*(skillWords.length+1))-0));
    }
    ticking=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});
if(reduceMotion){
  setPhrase(phrases.length-1);
  wordsStage.querySelectorAll('.wd').forEach(w=>w.classList.add('on'));
  aboutPin.style.height='auto';skillsPin.style.height='auto';
}

/* ================= single vs double click on tiles ================= */
let clickTimer=null;
document.addEventListener('click',e=>{
  const tile=e.target.closest('.tile');if(!tile)return;
  const i=+tile.dataset.i;
  clearTimeout(clickTimer);
  clickTimer=setTimeout(()=>openDrawer(i),260);
});
document.addEventListener('dblclick',e=>{
  const tile=e.target.closest('.tile');if(!tile)return;
  clearTimeout(clickTimer);
  openFsv(+tile.dataset.i);
});
document.addEventListener('keydown',e=>{
  const tile=e.target.closest?.('.tile');
  if(tile&&e.key==='Enter')openDrawer(+tile.dataset.i);
});

/* ================= drawer ================= */
const drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim');
function openDrawer(i){
  const p=graphicProjects[i];
  document.getElementById('drawerBody').innerHTML=`
    <div class="d-cover">${p.image?`<img class="art" src="${p.image}" alt="${p.t}">`:art(i,p.t,'16/10')}</div>
    <div class="case-cat">${p.cat}</div><h3>${p.t}</h3>
    <p class="grey" style="font-size:14px;margin:10px 0 20px">${p.d}</p>
    <div class="d-row"><span class="k">Client</span><span class="v">${p.client}</span></div>
    <div class="d-row"><span class="k">Category</span><span class="v">${p.cat}</span></div>
    <div class="d-row"><span class="k">Media Type</span><span class="v">${typeLabel(p.type)}</span></div>
    <div class="d-row"><span class="k">Date</span><span class="v">${p.date}</span></div>
    <div class="d-row"><span class="k">Tools</span><span class="v">${p.tools.join(', ')}</span></div>
    <div class="d-tags">${p.tags.map(t=>`<span>#${t}</span>`).join('')}</div>
    <div style="margin-top:28px"><button class="btn solid magnetic" onclick="closeDrawer();openFsv(${i})" style="width:100%;justify-content:center">Open Full Preview</button></div>`;
  drawer.classList.add('open');scrim.classList.add('on');
}
function closeDrawer(){drawer.classList.remove('open');scrim.classList.remove('on');}

/* ================= fullscreen viewer — driven by MEDIA map ================= */
const fsv=document.getElementById('fsv'),fsvStage=document.getElementById('fsvStage');
let carIdx=0,carN=0,carBase=0,vidTimer=null;
function openFsv(i){
  const p=graphicProjects[i];
  const m=MEDIA[p.type]||MEDIA.single;
  document.getElementById('fsvTitle').textContent=p.t;
  document.getElementById('fsvType').textContent=typeLabel(p.type);
  fsvStage.className='fsv-stage';fsvStage.innerHTML='';clearInterval(vidTimer);

  if(m.family==='image'){
    const w=m.ratio==='3/4'||m.ratio==='9/16'?'480px':'900px';
    fsvStage.innerHTML=`<div class="fsv-frame zoomable" id="zoomFrame" style="width:min(${w},92vw)" title="Click to zoom">${p.image?`<img class="art" src="${p.image}" alt="${p.t}" style="aspect-ratio:${m.ratio};object-fit:contain">`:art(i,p.t,m.ratio)}</div>`;
    document.getElementById('zoomFrame').onclick=function(){this.classList.toggle('zoomed');};
  }
  else if(m.family==='zoom'){
    fsvStage.innerHTML=`<div class="fsv-frame zoomable" id="zoomFrame" style="width:min(1100px,94vw)" title="Click to zoom">${art(i,p.t,m.ratio)}</div>`;
    document.getElementById('zoomFrame').onclick=function(){this.classList.toggle('zoomed');};
  }
  else if(m.family==='carousel'||m.family==='paged'){
    carIdx=0;carN=p.imgs||4;carBase=i;
    fsvStage.innerHTML=`
      <div class="fsv-frame" id="carFrame" style="width:min(${m.ratio==='3/4'?'560px':'860px'},92vw)"></div>
      <button class="fsv-nav prev" onclick="carMove(-1)" aria-label="Previous">‹</button>
      <button class="fsv-nav next" onclick="carMove(1)" aria-label="Next">›</button>
      <div class="fsv-count" id="carCount"></div>`;
    fsvStage.dataset.ratio=m.ratio;fsvStage.dataset.label=m.label||'Image';
    renderCar();
    let sx=null;
    fsvStage.ontouchstart=e=>sx=e.touches[0].clientX;
    fsvStage.ontouchend=e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)carMove(dx<0?1:-1);sx=null;};
  }
  else if(m.family==='aplus'){
    fsvStage.className='fsv-stage scrolly';
    fsvStage.innerHTML=`<div class="aplus-stack">${Array.from({length:p.imgs||5},(_,n)=>`<div class="ap">${art(i+n,`Module ${n+1}`,n%2?'16/9':'4/3')}</div>`).join('')}</div>`;
  }
  else if(m.family==='video'){
    fsvStage.innerHTML=videoSim('wide','Video preview — real file streams from CMS storage',false);
    wireVideo(false);
  }
  else if(m.family==='reel'){
    fsvStage.innerHTML=videoSim('reel','Reel preview — autoplays muted in production',true);
    wireVideo(true); /* autoplay muted */
  }
  else if(m.family==='gif'){
    fsvStage.innerHTML=`<div class="fsv-frame" style="width:min(560px,92vw)">${art(i,p.t,m.ratio,true)}</div>`;
  }
  fsv.classList.add('open');document.body.style.overflow='hidden';
}
function videoSim(kind,note,muted){
  return `<div class="video-sim ${kind}"><div class="vs-bg"></div>
    ${muted?'<div class="mute-chip">Muted</div>':''}
    <div class="vs-play"><button class="vs-btn" id="vsBtn" aria-label="Play"></button><span class="vs-note">${note}</span></div>
    <div class="vs-bar"><i id="vsBar"></i></div></div>`;
}
function wireVideo(autoplay){
  const btn=document.getElementById('vsBtn'),bar=document.getElementById('vsBar');
  let playing=false,prog=0;
  const toggle=()=>{
    playing=!playing;btn.classList.toggle('playing',playing);
    clearInterval(vidTimer);
    if(playing)vidTimer=setInterval(()=>{prog=(prog+1)%101;bar.style.width=prog+'%';},80);
  };
  btn.onclick=toggle;
  if(autoplay&&!reduceMotion)toggle();
}
function renderCar(){
  document.getElementById('carFrame').innerHTML=art(carBase+carIdx,'',fsvStage.dataset.ratio);
  document.getElementById('carCount').textContent=`${fsvStage.dataset.label} ${carIdx+1} / ${carN}`;
}
function carMove(d){carIdx=(carIdx+d+carN)%carN;renderCar();}
function closeFsv(){fsv.classList.remove('open');document.body.style.overflow='';clearInterval(vidTimer);}
document.addEventListener('keydown',e=>{
  if(!fsv.classList.contains('open'))return;
  if(e.key==='Escape')closeFsv();
  if(e.key==='ArrowRight'&&document.getElementById('carFrame'))carMove(1);
  if(e.key==='ArrowLeft'&&document.getElementById('carFrame'))carMove(-1);
});

/* ================= UI details ================= */
const overlay=document.getElementById('overlay'),caseBox=document.getElementById('caseBox');
function openUI(i){
  const p=uiProjects[i];
  caseBox.innerHTML=`
    <div class="case-hero">${art(i+3,p.t)}</div>
    <div class="case-body">
      <div class="case-cat">${p.cat} · ${p.tag}</div><h2>${p.t}</h2>
      <div class="case-sec"><h4>Overview</h4><p>${p.ov}</p></div>
      <div class="case-sec"><h4>Problem Statement</h4><p>${p.ps}</p></div>
      <div class="case-sec"><h4>My Role</h4><p>${p.role}</p></div>
      <div class="case-sec"><h4>Tools Used</h4><div class="tools">${p.tools.split(' · ').map(t=>`<span>${t}</span>`).join('')}</div></div>
      <div class="case-sec"><h4>Duration</h4><p>${p.dur}</p></div>
      <div class="case-sec"><h4>User Flow</h4><p>${p.flow}</p></div>
      <div class="case-sec"><h4>Wireframes</h4><p>${p.wf}</p></div>
      <div class="case-sec"><h4>Final Screens</h4><div class="gallery">${p.screens.map((s,n)=>`<div class="g-item">${art(i+n,s)}</div>`).join('')}</div></div>
      <div class="figma-btn"><a class="btn solid magnetic" href="${p.fig}" target="_blank" rel="noopener" style="font-size:16px;padding:18px 40px">Open Full Prototype in Figma ↗</a></div>
    </div>`;
  overlay.classList.add('open');document.body.style.overflow='hidden';
}

/* ================= pricing ================= */
function openPricing(){
  caseBox.innerHTML=`
    <div class="case-body">
      <div class="case-cat">Freelance</div><h2>Services & Pricing</h2>
      <p class="grey" style="margin-top:12px;max-width:560px">Every project is unique. Pricing below is a transparent starting point — final quotes depend on scope. Managed entirely from the admin dashboard in production.</p>
      <div class="price-list" style="margin-top:36px">
        ${services.map(s=>`
          <div class="price-row">
            <div><div class="pcat">${s.cat}</div><b>${s.n}${s.feat?'<span class="feat-badge">Featured</span>':''}</b><p>${s.d}</p></div>
            <div class="pr">From ${s.p}</div>
          </div>`).join('')}
      </div>
      <div class="figma-btn"><a class="btn solid magnetic" href="#/contact" onclick="closeOverlay()" style="font-size:16px;padding:18px 40px">Let's Build Your Project</a></div>
    </div>`;
  overlay.classList.add('open');document.body.style.overflow='hidden';
}
function closeOverlay(){overlay.classList.remove('open');document.body.style.overflow='';}
overlay.addEventListener('click',e=>{if(e.target===overlay)closeOverlay();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeOverlay();closeDrawer();}});

/* ================= routing ================= */
const routes={'':'home','#/':'home','#/graphic':'graphic','#/uiux':'uiux','#/freelance':'freelance','#/contact':'contact'};
function route(){
  const r=routes[location.hash]||'home';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+r).classList.add('active');
  document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===r));
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0,behavior:'instant'});
  heroInner.style.transform='';heroInner.style.opacity='';
  observeRv();
}
window.addEventListener('hashchange',route);route();

/* ================= cursor / magnetic / parallax ================= */
const cur=document.getElementById('cursor');
let cx=0,cy=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;cur.classList.add('on');});
(function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform=`translate(${cx-5}px,${cy-5}px)`;requestAnimationFrame(loop);})();
document.addEventListener('mouseover',e=>{cur.classList.toggle('big',!!e.target.closest('a,button,.tile,.ui-card,.tool,.price-row'));});
document.addEventListener('mousemove',e=>{
  document.querySelectorAll('.magnetic').forEach(b=>{
    const r=b.getBoundingClientRect(),mx=e.clientX-(r.left+r.width/2),my=e.clientY-(r.top+r.height/2);
    b.style.transform=Math.hypot(mx,my)<110?`translate(${mx*.18}px,${my*.18}px)`:'';
  });
  const dx=(e.clientX/innerWidth-.5),dy=(e.clientY/innerHeight-.5);
  document.querySelectorAll('.parallax').forEach(el=>{
    const d=+el.dataset.depth;el.style.marginLeft=dx*d+'px';el.style.marginTop=dy*d+'px';
  });
});

/* ================= toast / forms ================= */
function toast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}
function sendInquiry(e){
  e.preventDefault();
  toast('Inquiry sent — stored securely in the database in production');
  e.target.reset();
}
observeRv();
hydratePortfolioFromBackend();
